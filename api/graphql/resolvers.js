const User = require("../models/User");
const Sensor = require("../models/Sensor");
const SensorData = require("../models/SensorData");
const GraphQLJSON = require("graphql-type-json");

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
      if (filter.name) {
        where.name = { [Op.iLike]: filter.name };
      }

      // Convert sorting to Sequelize order option
      const order =
        sorting.length > 0
          ? sorting.map(({ field, direction }) => [field, direction])
          : undefined;

      // Fetch total count of sensors matching the filter
      const totalCount = await Sensor.countSensors(where);

      // Fetch filtered, sorted, and paginated sensor nodes
      const nodes = await Sensor.findAllSensors(where, order, paging);

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
  Sensor: {
    data: async (sensor) => {
      return await SensorData.findAll({ where: { topic_id: sensor.id } });
    },
  },
};
