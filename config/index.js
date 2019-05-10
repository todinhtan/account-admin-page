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
  tz: 'Asia/Shanghai',
  database: {
    uri: process.env.MONGO_CONNECTION_STRING,
  },
  withdraw: {
    source: {
      'AC-6TBVQL9WHWQ': 'WYRE_ACCOUNT_ID',
    },
    paymentmethod: {
      'PA-VMPJ88WBUQ6': 'WYRE_PAYMENT_METHOD',
      'PA-VMPCHEQT4JN': 'WYRE_PAYMENT_METHOD',
      'PA-ZHP4Y22Q3TN': 'WYRE_PAYMENT_METHOD',
      'PA-GAPTL6M23H3': 'WYRE_PAYMENT_METHOD',
    },
    feeDest: 'AC-ZWGMW2AUXEY',
  },
};
