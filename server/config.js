const config = {
  app: {
    hostname: 'localhost',
    port: 8080,
  },
  jwt: {
    secret: '1337_JW7_S3CR37',
    tokenLife: 86400,
  },
  database: {
    ip: process.env.DATABASE_HOST,
    port: '5432',
    name: 'area',
    user: 'area_admin',
    password: 'area_admin_pass',
  },
};

module.exports = config;
