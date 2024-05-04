/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { env } from './enviroment.js'; 
import { Loggers } from './logger.middleware.js';

export const errorHandingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  const responseError = {
    statusCode: err.statusCode,
    code: err.code,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack,
  };

  if (env.BUILD_MODE !== 'dev') delete responseError.stack;
  Loggers.logEvent(`Code: ${responseError.statusCode} ${responseError.message}`, 'errLog.log');

  res.status(responseError.statusCode).json(responseError);
};
