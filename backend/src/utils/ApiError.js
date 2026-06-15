class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR', details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

module.exports = ApiError;
