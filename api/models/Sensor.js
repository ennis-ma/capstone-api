const { sequelize } = require("../postgres");
const { DataTypes, Op } = require("sequelize");
const SensorData = require("./SensorData");

const Sensor = sequelize.define(
  "topics",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "topic_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "topic_name",
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // prevent Sequelize from pluralizing the table name
    timestamps: false, // disable automatic timestamp fields
  }
);

Sensor.countSensors = async function (filter = {}) {
  return await this.count({ where: filter });
};

Sensor.findAllSensors = async function (
  filter = {},
  sorting = [],
  paging = { offset: 0, limit: 10 }
) {
  const where = {};

  // Convert filter to Sequelize where clause
  if (filter.name) {
    where.name = { [Op.iLike]: filter.name };
  }

  // Convert sorting to Sequelize order option
  const order =
    sorting.length > 0 &&
    sorting.every(({ field, direction }) => field && direction)
      ? sorting.map(({ field, direction }) => [field, direction])
      : undefined;

  // Fetch filtered, sorted, and paginated sensor nodes
  return await this.findAll({
    where,
    order,
    offset: paging.offset,
    limit: paging.limit,
    include: [
      {
        model: SensorData,
        required: false,
      },
    ],
  });
};

Sensor.hasMany(SensorData, { foreignKey: "topic_id" });

SensorData.belongsTo(Sensor, { foreignKey: "topic_id" });

module.exports = Sensor;
