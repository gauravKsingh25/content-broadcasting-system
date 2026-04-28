/**
 * Represents an operational API error with HTTP metadata.
 */
export default class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {Array<unknown>} [errors]
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.isOperational = true;
  }
}