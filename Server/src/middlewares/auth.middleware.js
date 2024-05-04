import { StatusCodes } from 'http-status-codes';
import { algorithms } from '~/utils/algorithm';
import ApiError from '~/utils/apiError';

const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const address = req.method === 'GET' ? req.query.address : req.body.address;
      if (!address) throw new ApiError(StatusCodes.MULTIPLE_CHOICES, 1, 'address is requied');

      const parseToken = req.headers.authorization.split(' ');
      if (parseToken[0] === 'Bearer' && parseToken[1]) {
        const getToken = await algorithms.verify_token(parseToken[1]);

        if (getToken) {
          console.log('getToken' + getToken.address);
          console.log('address' + address);
          if (getToken.address !== address) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 1, 'Token is invalid');
          }
          next();
        }
        throw new ApiError(StatusCodes.MULTIPLE_CHOICES, 1, 'Token is requied');
      }
    }
    throw new ApiError(StatusCodes.MULTIPLE_CHOICES, 1, 'Token is requied');
  } catch (e) {
    console.log(e);
    if (e.name === 'TokenExpiredError') {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token expired'));
    } else {
      next(e);
    }
  }
};

export const authMiddleware = {
  auth,
};
