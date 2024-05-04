import jwt from 'jsonwebtoken';
import { env } from '../configs/enviroment';

const sign_token = (object) => {
  try {
    return jwt.sign({ ...object }, env.PRIVATE_KEY_JSONTKEN, { expiresIn: '1d' });
  } catch (e) {
    console.error(e);
    return false;
  }
};

const verify_token = async (token) => {
  try {
    return jwt.verify(token, env.PRIVATE_KEY_JSONTKEN);
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const algorithms = {
  sign_token,
  verify_token,
};
