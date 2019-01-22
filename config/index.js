require('dotenv').config({ path: './.env' });

export default {
  env: process.env.NODE_ENV || 'development',
  server: {
    port: process.env.APP_PORT || 8080,
  },
  api: {
    prefix: process.env.API_PREFIX || 'https://go-test.epiapi.com/v2',
    pageSize: process.env.PAGE_SIZE || 10,
    vbaPrefix: process.env.VBA_API_PREFIX || 'http://localhost:8080',
  },
};
