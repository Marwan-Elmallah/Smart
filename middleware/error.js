/* eslint-disable no-unused-vars */
const path = require('path');
class APIError extends Error {
  constructor({ message, errors, status = 500 }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
  }
}
exports.APIError = APIError;
/**
 * Handles errors in the application.
 *
 * @param {Error} err - The error object containing information about the error.
 * @param {Object} req - The request object representing the incoming request.
 * @param {Object} res - The response object representing the outgoing response.
 * @param {Function} next - The next function to call in the middleware chain.
 * @return {void} This function does not return anything.
 */
const handler = (err, req, res, next) => {
  const statusCode = err.status ? err.status : 500;
  console.log(err);
  res.status(statusCode);
  res.json({
    error: true,
    code: statusCode,
    message: err.message,
    //   stack: err.status === 404 ? 'Not found' : err.stack,
  });
};
exports.handler = handler;

/**
 * Handles the "not found" error for routes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} - The error handler function.
 */
exports.notFound = (req, res, next) => {
  const isApiRequest = req.headers['user-agent'].includes('axios') || req.headers['user-agent'].includes('fetch') || req.headers['postman-token'] || req.headers['user-agent'].includes('insomnia');

  if (isApiRequest) {
    const err = new APIError({
      message: 'Route Not found',
      status: 404,
    });
    return handler(err, req, res);
  } else {
    return res.sendFile(path.join(__dirname, '..', 'public', 'notFound.html'));
  }


};
