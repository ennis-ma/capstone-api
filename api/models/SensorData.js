const { sequelize, Op } = require("../postgres");
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

SensorData.countSensorData = async function (filter = {}) {
  return await this.count({ where: filter });
};

SensorData.findAllSensorData = async function (
  where = {},
  order = [],
  paging = { offset: 0, limit: 10 }
) {
  // Fetch filtered, sorted, and paginated sensor data nodes
  return await this.findAll({
    where,
    order,
    offset: paging.offset,
    limit: paging.limit,
  });
};

module.exports = SensorData;
