module.exports = {
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_DATABASE || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'mysecretpassword',
  },
};
