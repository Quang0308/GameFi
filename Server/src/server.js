// eslint-disable no-console
import express from 'express';
import cors from 'cors';
import cookie from 'cookie-parser';
import { env } from './configs/enviroment.js';
import { errorHandingMiddleware } from './middlewares/handleErrors.middleware.js';
import { Loggers } from './middlewares/logger.middleware.js';
import { corsOptions } from './configs/cors.js';
import { API_v1 } from './routes/v1/index.js';

const START_SERVER = () => {
  const app = express();

  app.use(
    cors({
    origin:'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    optionsSuccessStatus:204,
    preflightContinue:false,
    withCredentials: true
  }
  ));
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type","X-Auth-Token","Origin","Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  })

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookie());

  app.use('/api', API_v1);



  // app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  //   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  //   next();
  // })
  // add middleware handle error
  app.use(errorHandingMiddleware);
  // add logger middleware
  app.use(Loggers.logger);

  // route

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running on ${env.APP_HOST}:${env.APP_PORT}`);
  });
};

START_SERVER();
