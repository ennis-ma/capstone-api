const { ApolloServer } = require("apollo-server-express");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const MONGODB =
  "mongodb+srv://capstone:Project@capstone-project.l8cbls6.mongodb.net/?retryWrites=true&w=majority&appName=capstone-project";

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  // Create schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // Set up WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Use graphql-ws to handle WebSocket connections
  useServer({ schema }, wsServer);

  // Connect to MongoDB
  mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

  // Listen
  const PORT = 5000;
  httpServer.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startApolloServer(typeDefs, resolvers);
