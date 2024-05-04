import 'dotenv/config';

export const env = {
  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,

  BUILD_MODE: process.env.BUILD_MODE,

  TOKEN_ADRESS: process.env.TOKEN_ADRESS,
  VAULT_ADRESS: process.env.VAULT_ADRESS,
  WITHDRAWER_ADDRESS: process.env.WITHDRAWER_ADDRESS,
  WITHDRAWER_PRIVATE_ADDRESS: process.env.WITHDRAWER_PRIVATE_ADDRESS,
  PRIVATE_KEY_JSONTKEN: process.env.PRIVATE_KEY_JSONTKEN,
};
