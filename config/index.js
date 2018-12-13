require('dotenv').config({ path: './.env' });

export default {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: process.env.APP_PORT,
  },
  api: {
    prefix: process.env.API_PREFIX,
    pageSize: process.env.PAGE_SIZE,
  },
};
