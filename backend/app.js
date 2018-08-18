require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bodyParserGraph = require('body-parser-graphql');
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
app.use(passport.initialize());

app.use('/graphql', bodyParserGraph.graphql(), graphqlHTTP({ schema, graphiql: true }));

app.listen(process.env.PORT || 4444);
