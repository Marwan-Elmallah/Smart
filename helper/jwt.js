const jwt = require('jsonwebtoken');

class TokenManager {
  constructor() { }
  /**
   * Generates a token for a user for a given number of days.
   *
   * @param {object} user - The user object containing the user's information.
   * @param {number} days - The number of days for which the token is valid.
   * @return {string} The generated token.
   */
  static generateToken(data, days) {
    days = days + "d";
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: days ? days : '365d',
    });
  }
  /**
   * Compare the authorization token.
   *
   * @param {string} authorization - The authorization token.
   * @return {Object} - The decoded token or an error object.
   */
  static compareToken(authorization) {
    if (!authorization) {
      return {
        error: true,
        status: 401,
        message: 'No Authorization Token',
      };
    }
    const token = authorization.split(' ')[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decode;
    } catch (error) {
      // console.log(error);
      return {
        error: true,
        status: 401,
        message:
          'The provided token is either invalid or improperly formatted. Please ensure that you are using a valid token', error
      };
    }
  }
  /**
   * Compare the provided code token.
   *
   * @param {string} token - The token to compare.
   * @return {Object|string} - Returns the decoded token if it is valid, otherwise an error object with status and message.
   */
  static compareCodeToken(token) {
    if (!token) {
      return {
        error: true,
        status: 401,
        message: 'No Token',
      };
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decode;
    } catch (error) {
      return {
        error: true,
        status: 401,
        message:
          'The provided token is either invalid or improperly formatted. Please ensure that you are using a valid token',
      };
    }
  }
}

module.exports = TokenManager;
