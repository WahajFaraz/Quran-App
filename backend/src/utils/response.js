const sendSuccess = (res, data, message = null, statusCode = 200, pagination = null) => {
  const response = { success: true, data };
  if (message) response.message = message;
  if (pagination) response.pagination = pagination;
  res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500, code = 'ERROR', details = []) => {
  res.status(statusCode).json({
    success: false,
    error: { code, message, details },
  });
};

module.exports = { sendSuccess, sendError };
