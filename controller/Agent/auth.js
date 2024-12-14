const { Agent } = require("../../database").models;
const TokenManager = require("../../helper/jwt");
const MailTemplets = require("../../helper/MailTemplets");
const MailManger = require("../../helper/MailManger");
const config = require("../../config");
const CryptoJS = require("crypto-js");

class AuthAgentController {
    static async login(req, res) {
        const { email, password } = req.body
        const agent = await Agent.findOne({ where: { email } })
        if (!agent) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Agent not found"
            })
        }
        const bytes = CryptoJS.AES.decrypt(agent.password, process.env.BCRYPT_SEKRET_KET);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText !== password) {
            return res.status(401).json({
                error: true,
                code: 404,
                message: "Wrong Password"
            })
        }
        // token avail for 1 day
        const token = TokenManager.generateToken({ agent }, 1)
        return res.status(200).json({
            error: false,
            code: 200,
            message: `Welcome ${agent.name}`,
            token
        })
    }

    static async updatePassword(req, res) {
        const { id, password } = req.body
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "Agent ID is required"
            })
        }
        const agentExist = await Agent.findByPk(id)
        if (!agentExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Agent not found"
            })
        }
        const ciphertext = CryptoJS.AES.encrypt(password, config.BCRYPT_SEKRET_KEY).toString();
        await agentExist.update({ password: ciphertext })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Agent Password Updated Successfully',
            data: agentExist
        })
    }

    static async resetPassword(req, res) {
        const { email } = req.body
        const record = await Agent.findOne({ where: { email } })
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Agent Not Found'
            })
        }
        const token = TokenManager.generateToken({ record }, 1)
        MailManger.send(email, 'Reset Password', null, MailTemplets.ResetPassword(record, token, "agentUpdatePassword"))
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Email Sent Successfully',
            data: record
        })
    }

    static async encryptPassword(req, res) {
        const { id } = req.body
        const agentExist = await Agent.findByPk(id);
        if (!agentExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Agent Not Found'
            })
        }
        const ciphertext = CryptoJS.AES.encrypt(agentExist.password, config.BCRYPT_SEKRET_KEY).toString();
        await agentExist.update({ password: ciphertext })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Password Encrypted Successfully',
            data: ciphertext
        })
    }
}

module.exports = AuthAgentController