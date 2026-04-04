/**
 * Consistent API response envelope.
 *
 * All responses follow the same shape so the frontend can rely on a single
 * type definition and error-handling pattern.
 *
 * Success:  { success: true,  data: {...},  message: "..." }
 * Error:    { success: false, error: "...", code: "SNAKE_CASE_CODE" }
 */

const sendSuccess = (res, data = null, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendCreated = (res, data, message = 'Created') => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = 'Something went wrong', statusCode = 500, code = null) => {
  const body = { success: false, message };
  if (code) body.code = code;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendCreated, sendError };
