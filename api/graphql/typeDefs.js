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
    data: [SensorData!]!
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
    ts: String!
    value_string: String!
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
  }
  type Mutation {
    login(loginInput: LoginInput): User!
    register(registerInput: RegisterInput): User!
    deleteUser(userId: ID!): Boolean!
    editUser(editUserInput: EditUserInput): User!
  }
`;
