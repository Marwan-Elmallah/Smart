const { Agent } = require('../database').models;
const TokenManager = require('../helper/jwt');

class CheckAuthrization {

    /**
     * Checks the authorization of a teacher.
     *
     * @param {Object} req - the request object
     * @param {Object} res - the response object
     * @param {Function} next - the next middleware function
     * @return {void}
     */
    static async checkAuthrizationAgent(req, res, next) {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                error: true,
                message: 'No Authorization Provided',
                code: 401,
            });
        }
        const decode = TokenManager.compareToken(authorization);
        if (decode.error) {
            return res.status(401).json({
                error: true,
                message: decode.message,
                code: 401,
            });
        }
        const agent = await Agent.findByPk(decode.agent.id);
        // console.log(decode);
        if (!agent) {
            return res.status(401).json({
                error: true,
                message: 'Agent not found',
                code: 401,
            });
        }
        // console.log(agent.status);
        if (agent.status !== true) {
            return res.status(401).json({
                error: true,
                message: 'Agent not Activated',
                code: 401,
            });
        }
        req.loginAuth = agent
        next();
    }

    static async checkAuthrizationRestaurant(req, res, next) {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                error: true,
                message: 'No Authorization Provided',
                code: 401,
            });
        }
        const decode = TokenManager.compareToken(authorization);
        if (decode.error) {
            return res.status(401).json({
                error: true,
                message: decode.message,
                code: 401,
            });
        }
        req.loginAuth = decode.record
        next();
    }

    static async checkAuthrizationCompany(req, res, next) {
        let { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json({
                error: true,
                message: 'No Authorization Provided',
                code: 401,
            });
        }
        const decode = TokenManager.compareToken(authorization);
        if (decode.error) {
            return res.status(401).json({
                error: true,
                message: decode.message,
                code: 401,
            });
        }
        req.loginAuth = decode
        next();
    }

    static async checkAuthrizationAi(req, res, next) {
        let { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                error: true,
                message: 'No Authorization Provided',
                code: 401,
            });
        }
        authorization = authorization.split(' ')[1];
        if (authorization !== process.env.API_KEY) {
            return res.status(401).json({
                error: true,
                message: 'Not Authorized',
                code: 401,
            });
        }
        next();
    }
}
module.exports = CheckAuthrization;
