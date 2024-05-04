import { WHITELIST_DOMAINS } from 'file:///c:/Users/This Pc/OneDrive - VNU-HCMUS/Desktop/FLP-SMC-test/Server/src/utils/constant.js';
import { env } from './enviroment.js';
import { StatusCodes } from 'http-status-codes';
import ApiError from 'file:///c:/Users/This Pc/OneDrive - VNU-HCMUS/Desktop/FLP-SMC-test/Server/src/utils/apiError.js';

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && env.BUILD_MODE === 'dev') {
      return callback(null, true);
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`),
    );
  },

  optionsSuccessStatus: 200,

  credentials: true,
};
