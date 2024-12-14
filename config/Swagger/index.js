const { serve, setup } = require('./SwaggerServer');
const swaggerDocument = require('./openapi.json')
module.exports = (app) => {
    var options = {
        customCss: `
        .swagger-ui .topbar { display: none }
        `,
        customfavIcon: '/favicon.ico',
        customSiteTitle: 'Smart Serve APIs'
    };
    app.use('/docs', serve, setup(swaggerDocument, options))
    // app.get("/docs")
}
