require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { bodyParserGraphQL } = require('body-parser-graphql');
const schema = require('./schema/schema.js');
require('./models/user');
require('./config/passport');

const app = express();

// Connect to MLab Database
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);
mongoose.connection.once('open', () => {
  console.log('Database connected');
});

app.use(cors());
app.use(bodyParserGraphQL());

app.use(
  '/graphql',
  graphqlHTTP(request => ({
    schema,
    graphiql: true,
    context: { req: request, passport },
  })),
);

app.listen(process.env.PORT || 4444);
