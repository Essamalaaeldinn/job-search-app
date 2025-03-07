import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./graphql.schema.js";
import database_connection from "../../DB/connection.js";

// Start the GraphQL server
const startGraphQLServer = async () => {
  try {
    // Connect to the database
    await database_connection();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }) => ({ req }), // Pass request for authentication
    });

    console.log(`🚀 GraphQL Server ready at ${url}`);
  } catch (error) {
    console.error("❌ Error starting GraphQL server:", error);
  }
};

export default startGraphQLServer;
