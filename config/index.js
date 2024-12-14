const HTTP_PORT = process.env.PORT || 3001;
const ALLOWED_HEADERS = [
    'X-Requested-With',
    'Authorization',
    'Content-Type',
    'Origin',
    'Accept',
];
const ArabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFEFC]/g;

const CLIENT_URL = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    "http://localhost:3005",
    "http://localhost:8080",
]

const APP_URL = process.env.APP_URL || 'APP URL HERE'
const config = {
    APP_NAME: process.env.APP_NAME || 'APP NAME HERE',
    PORT: HTTP_PORT,
    allowedHeaders: ALLOWED_HEADERS,
    ArabicRegex,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    BCRYPT_SEKRET_KEY: process.env.BCRYPT_SEKRET_KET,
    Client_Url: CLIENT_URL,
    App_Url: APP_URL
}

module.exports = config