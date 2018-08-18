require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser-graphql');
const schema = require('./schema/schema.js');
require('./config/passport');

const app = express();

// Connect to MLab Database
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);
mongoose.connection.once('open', () => {
  console.log('Wassup');
});

app.use(cors());
app.use(passport.initialize());

app.use('/graphql', bodyParser.graphql(), graphqlHTTP({ schema, graphiql: true }));

app.listen(process.env.PORT || 4444);
