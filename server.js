const fs = require('fs');
// Logger
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}
require("dotenv").config()
const express = require("express")
const Logger = require('./helper/logger');
const ExpressApplication = require('./config/express');
const config = require('./config');
const { sequelize } = require('./database');
const { RestaurantController } = require('./controller/Restaurant');
const app = express()
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.use('/image', express.static('public/image'));
app.use('/audio', express.static('public/audio'));

app.use(express.json({
    limit: '100mb'
}))
app.use(express.urlencoded({
    extended: true,
    limit: '100mb'
}))

RestaurantController.scheduleTasks();

ExpressApplication(app);
let server;
async function startServer() {
    const MAX_RETRIES = 10;
    let retryCount = 0;
    const connectToDatabase = async () => {
        try {
            await sequelize.sync({
                alter: true,
            });
            server = app.listen(config.PORT);

            Logger.success('Successfully connected to database');
            Logger.success(`Server started on port ${config.PORT}`);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            Logger.error('Unable to connect to database', error);
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                Logger.info(
                    `Retrying to connect to the database in 5 seconds... (Attempt ${retryCount}/${MAX_RETRIES})`
                );
                setTimeout(connectToDatabase, 5000);
            } else {
                throw new Error('Unable to connect to database after maximum retries');
            }
        }
    };
    await connectToDatabase();
}
startServer();




const exitHandler = () => {
    if (server) {
        server.close(() => {
            Logger.info('Server closed');
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    // eslint-disable-next-line no-console
    console.log({
        msg: 'uncaughtException',
        error,
    });
    //  Logger.error('uncaughtException', error);

    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    Logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
