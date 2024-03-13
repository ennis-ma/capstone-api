const { gql } = require("apollo-server");
const GraphQLJSON = require("graphql-type-json");

module.exports = gql`
  scalar JSON
  # User
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    accessLevel: String!
    accessToken: String!
  }
  input RegisterInput {
    password: String!
    email: String!
    accessLevel: String!
  }
  input EditUserInput {
    id: ID!
    update: UserUpdate!
  }

  input UserUpdate {
    name: String!
    email: String!
    accessLevel: String!
  }
  input LoginInput {
    password: String!
    email: String!
  }

  # Sensor
  type Sensor {
    id: ID!
    name: String!
    metadata: String!
  }

  type SensorResponse {
    totalCount: Int!
    nodes: [Sensor!]!
  }

  input SensorFilter {
    name: JSON
  }

  input SensorSorting {
    field: String!
    direction: String!
  }

  input OffsetPaging {
    offset: Int!
    limit: Int!
  }

  type SensorData {
    topic_id: ID!
    ts: String!
    value_string: String!
  }

  type SensorDataResponse {
    totalCount: Int!
    nodes: [SensorData!]!
  }

  input SensorDataFilter {
    id: IDFilter
    ts: JSON
    value_string: JSON
  }

  input IDFilter {
    in: [ID]
  }

  input SensorDataSorting {
    field: String!
    direction: String!
  }

  input OffsetPaging {
    offset: Int
    limit: Int
  }

  type Query {
    user(id: ID!): User
    getUsers: [User]
    getUser(userId: String!): User
    sensor(id: ID!): Sensor!
    sensors(
      filter: SensorFilter
      sorting: [SensorSorting]
      paging: OffsetPaging
    ): SensorResponse!
    sensorData(
      topic_id: [ID]
      filter: SensorDataFilter
      sorting: [SensorDataSorting]
      paging: OffsetPaging
    ): SensorDataResponse!
  }
  type Mutation {
    login(loginInput: LoginInput): User!
    register(registerInput: RegisterInput): User!
    deleteUser(userId: ID!): Boolean!
    editUser(editUserInput: EditUserInput): User!
  }
`;
