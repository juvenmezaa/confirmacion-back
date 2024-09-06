const { Sequelize } = require("sequelize");
require("dotenv").config();
console.log(process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
/*   logging: false, */
  pool: {
    max: 10,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
  dialectOptions: {
    connectTimeout: 600000, // 60 seconds
    ssl: {
      require: true,
      rejectUnauthorized: false // This can be set to true in a production environment for stricter security
    }
  },
  retry: {
    match: [
      /ECONNRESET/,
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ENETUNREACH/,
      /EADDRNOTAVAIL/,
      /ESOCKETTIMEDOUT/,
      /Connection terminated unexpectedly/,
    ],
    max: 5,
  },
  keepAlive: true,
  keepAliveInitialDelay: 3000000,
});

module.exports = sequelize;
