import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import { merge } from 'lodash';
import { createServer } from 'http';
import postResolvers from './postResolvers';
import DB from './_db';
import pubsub, { EVENTS } from './subsriptions';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const _db = new DB();
_db.getDB();

const schema = gql`
  type Post {
    _id: ID
    title: String
    body: String
    createdUserId: String
  }

  input createPostInput {
    title: String
    body: String
    createdUserId: String
  }

  type createPostResponse {
    success: Boolean
    data: Post
    error: Error
  }

  type Error {
    status: Int
    message: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    createPost(request: createPostInput!): createPostResponse!
  }

  type Subscription {
    postCreated: Post
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    ...postResolvers
  },
  Subscription: {
    postCreated: {
      subscribe: () => {
        return pubsub.asyncIterator(EVENTS.TOPIC.POST_CREATED);
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  playground: {
    settings: {
      'editor.theme': 'dark'
    }
  },
  context: {
    async({ req, connection }) {
      if (connection) {
        return connection.context;
      } else {
        return req;
      }
    }
  }
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(3005, () => {
  console.log(`Server is running on PORT 3005`);
});
