const { sequelize } = require("../postgres");
const { DataTypes } = require("sequelize");

const SensorData = sequelize.define(
  "data",
  {
    ts: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
    },
    value_string: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    freezeTableName: true, // prevent Sequelize from pluralizing the table name
    timestamps: false, // disable automatic timestamp fields
  }
);

module.exports = SensorData;
