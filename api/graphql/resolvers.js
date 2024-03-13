const User = require("../models/User");
const Sensor = require("../models/Sensor");
const SensorData = require("../models/SensorData");
const GraphQLJSON = require("graphql-type-json");
const { Op } = require("sequelize");

module.exports = {
  JSON: GraphQLJSON,
  Query: {
    async getUsers() {
      return await User.find().sort({ userId: 1 });
    },
    async getUser(_, { userId }) {
      return await User.findById(userId);
    },
    async user(_, { id }) {
      return await User.findById(id);
    },
    async sensor(_, { id }) {
      return await Sensor.findByPk(id);
    },
    sensors: async (
      _,
      { filter = {}, sorting = [], paging = { offset: 0, limit: 10 } }
    ) => {
      // Convert filter to Sequelize where clause
      const where = {};
      if (
        filter.name &&
        typeof filter.name === "object" &&
        filter.name.iLike !== undefined
      ) {
        where.name = { [Op.iLike]: filter.name.iLike };
      }

      // Convert sorting to Sequelize order option
      const order =
        sorting.length > 0 &&
        sorting.every(({ field, direction }) => field && direction)
          ? sorting.map(({ field, direction }) => [field, direction])
          : undefined;

      // Fetch total count of sensor data matching the filter
      const totalCount = await Sensor.count({ where });

      // Fetch filtered, sorted, and paginated sensor data nodes
      const nodes = await Sensor.findAll({
        where,
        order,
        offset: paging.offset,
        limit: paging.limit,
      });

      return {
        totalCount,
        nodes,
      };
    },
    sensorData: async (
      _,
      { topic_id = [], filter = {}, sorting = [], paging = {} }
    ) => {
      // Convert filter to Sequelize where clause
      const where = {};
      if (topic_id.length > 0) {
        where.topic_id = { [Op.in]: topic_id };
      }
      if (filter.id && filter.id.in && Array.isArray(filter.id.in)) {
        where.topic_id = { [Op.in]: filter.id.in };
      }
      if (
        filter.ts &&
        typeof filter.ts === "object" &&
        filter.ts.eq !== undefined
      ) {
        where.ts = filter.ts.eq;
      }
      if (
        filter.value_string &&
        typeof filter.value_string === "object" &&
        filter.value_string.eq !== undefined
      ) {
        where.value_string = filter.value_string.eq;
      }

      // Convert sorting to Sequelize order option
      const order =
        sorting.length > 0 &&
        sorting.every(({ field, direction }) => field && direction)
          ? sorting.map(({ field, direction }) => [
              field === "id" ? "topic_id" : field,
              direction,
            ])
          : undefined;

      // Fetch total count of sensor data matching the filter
      const totalCount = await SensorData.count({ where });

      // Fetch filtered, sorted, and paginated sensor data nodes
      const nodes = await SensorData.findAll({
        where,
        order,
        offset: paging.offset || 0,
        limit: paging.limit || undefined,
      });

      return {
        totalCount,
        nodes,
      };
    },
  },
  Mutation: {
    async login(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ email: email, password: password });
      if (!user.accessToken) {
        user.accessToken = Math.random().toString(36).substring(2);
        await user.save((isNew = false));
      }
      return user;
    },
    async register(_, { registerInput: { email, password, accessLevel } }) {
      const user = new User({
        name: email.split("@")[0],
        email: email,
        password: password,
        accessLevel: accessLevel,
        createdAt: new Date().toISOString(),
      });

      const res = await user.save();
      return res;
    },
    async deleteUser(_, { userId }) {
      const wasDeleted = (await User.deleteOne({ _id: userId })).deletedCount;
      return wasDeleted;
    },
    async editUser(
      _,
      {
        editUserInput: {
          id,
          update: { name, email, accessLevel },
        },
      }
    ) {
      const res = await User.updateOne(
        { _id: id },
        {
          name: name,
          email: email,
          accessLevel: accessLevel,
        }
      );

      if (res.modifiedCount > 0) {
        const updatedUser = await User.findById(id);
        return updatedUser;
      } else {
        throw new Error("User not found or not modified");
      }
    },
  },
};
