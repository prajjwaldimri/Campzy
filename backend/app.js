require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { bodyParserGraphQL } = require('body-parser-graphql');
const depthLimit = require('graphql-depth-limit');
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('../webpack.config.js');
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

if (process.env.ENVIRONMENT === 'development') {
  app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.use(express.static(path.join(__dirname, '../frontend/static')));

app.use(
  '/graphql',
  graphqlHTTP(request => ({
    schema,
    graphiql: true,
    validationRules: [depthLimit(10)],
    context: { req: request, passport },
  })),
);

app.listen(process.env.PORT || 4444);
