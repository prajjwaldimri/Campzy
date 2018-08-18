require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const schema = require('./schema/schema.js');

const app = express();

app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
);

// Connect to MLab Database
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);
mongoose.connection.once('open', () => {
  console.log('Wassup');
});

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(process.env.PORT || 4444);
