const pino = require('pino');
// const Helper = require('./Helper');
const pinoLogger = pino.default(
  {
    level: 'debug',
  },
  pino.multistream([
    {
      level: 'info',

      stream: pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:mm:ss',
          ignore: 'pid,hostname',
          singleLine: false,
          hideObject: true,
          customColors: 'info:magenta,warn:yellow,error:red,debug:green',
        },
      }),
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
        };
      },
    },
    {
      level: 'debug',
      stream: pino.destination({
        dest: `${process.cwd()}/logs/logs.log`,
        sync: true,
      }),
    },
  ])
);

class Logger {
  /**
   * @param {string} content
   */
  static success(content) {
    pinoLogger.info(content);
    // writeLogger(30, content , null );
  }

  /**
   * @param {string} content
   */
  static info(content) {
    pinoLogger.info(content);
  }

  /**
   * @param {string} content
   */
  static warn(content) {
    pinoLogger.warn(content);
  }

  /**
   * @param {string} content
   * @param {object} ex
   */
  static error(content, ex) {
    if (ex) {
      pinoLogger.error(ex, `${content}: ${ex?.message}`);
      //    Helper.writeLogger(50, content, ex);
    } else {
      pinoLogger.error(content);
      //    Helper.writeLogger(50, content, null);
    }
  }

  /**
   * @param {string} content
   */
  static debug(content) {
    pinoLogger.debug(content);
    // writeLogger(20, content , null );
  }
}
module.exports = Logger;
