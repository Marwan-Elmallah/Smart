const exceptionHandler = require('express-exception-handler');
exceptionHandler.handle();
const { ErrorMangement } = require('../middleware');
const allAppRoutes = require('../routes');
const config = require('.');
const requestQueue = [];
/**
 * Processes the next request in the request queue.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function processNextRequest() {
    if (requestQueue.length > 0) {
        const {
            // req, res, 
            next } = requestQueue[0];
        // console.log(`Processing request for ${req.method} ${req.baseUrl}`);
        setTimeout(() => {
            next();
            requestQueue.shift();
            processNextRequest();
        }, 10);
    }
}

/**
 * Initializes an Express application.
 *
 * @param {Object} app - The Express application object.
 * @return {undefined}
 */

const ExpressApplication = (app) => {
    const allowedHeaders = config.allowedHeaders.join(', ');
    app.use((req, res, next) => {
        const origin = req.get('origin');
        res.set('x-powered-by', 'Elmallah');
        if (req.method === 'OPTIONS') {
            if (config.Client_Url.includes(origin)) {
                res.set('Access-Control-Allow-Origin', origin);
            }
            res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE ,OPTIONS');
            res.set('Access-Control-Allow-Headers', allowedHeaders);
            res.set('Content-Length', '0');
            res.status(204).end();
        } else {
            // Handle other requests
            if (config.Client_Url.includes(origin) || !origin) {
                if (origin) {
                    res.set('Access-Control-Allow-Origin', origin);
                }
                res.set('Access-Control-Allow-Headers', allowedHeaders);
                // res.set('Content-Encoding', 'gzip');
                res.set('Content-Type', 'application/json');
                res.set('Access-Control-Allow-Credentials', true);
                res.set(
                    'Access-Control-Allow-Methods',
                    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
                );
                res.set('Access-Control-Max-Age', '86400');
                res.set('X-Frame-Options', 'SAMEORIGIN');
                res.set('X-XSS-Protection', '1; mode=block');
                res.set('X-Content-Type-Options', 'nosniff');
                res.set('Referrer-Policy', 'no-referrer');
                res.set('Cross-Origin-Embedder-Policy', 'require-corp');
                res.set('Cross-Origin-Opener-Policy', 'same-origin');
                res.set('Cross-Origin-Resource-Policy', 'same-origin');
                res.set(
                    'Strict-Transport-Security',
                    'max-age=31536000; includeSubDomains; preload'
                );
                next();
            } else {
                res.status(403).json({
                    message: 'Origin not allowed',
                    status: 'Forbidden',
                    error: true,
                    code: 403,
                });
            }
        }
    });
    app.use((req, res, next) => {
        //  enqueue incoming requests
        requestQueue.push({ req, res, next });
        if (requestQueue.length === 1) {
            processNextRequest();
        }
        // tracking request time for each request
        const start = Date.now();
        res.on('finish', async () => {
            const end = Date.now();
            const duration = end - start;
            // eslint-disable-next-line no-console
            console.log({
                method: req.method,
                route: req.baseUrl,
                status: res.statusCode,
                duration: `${duration}ms`,
                ip: req.userIp || req.ip,
                Auth: req.headers['authorization'] || 'Not Authenticated',
            })
        });
        // add ip Adress to request
        const forwardedFor = req.headers['x-forwarded-for'];
        const userIp = forwardedFor ? forwardedFor.split(',')[0] : req.headers['x-real-ip'] || req.headers['x-client-ip'] || req.headers['x-remote-ip'];
        if (userIp) {
            req.userIp = userIp;
        }
        next();
    });
    // app.use(UserAgentFetcher.initMiddleware());
    // Middleware to log the time taken for each request
    allAppRoutes(app);
    //  swagger docs
    require("./Swagger")(app)
    app.use(ErrorMangement.handler);
    app.use(ErrorMangement.notFound);
};
module.exports = ExpressApplication;
