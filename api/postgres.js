const { Sequelize } = require("sequelize");

// Connect to Postgres
const sequelize = new Sequelize("postgres://postgres@0.0.0.0:5432/gbt");

const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log("Postgres Connected");
  } catch (err) {
    console.log("Postgres connection unsuccessful, retry after 5 seconds.");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

module.exports = { sequelize };
