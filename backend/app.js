require('dotenv').config();
const ApolloError = require('apollo-errors');
const express = require('express');
const compression = require('compression');
const fs = require('fs');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const depthLimit = require('graphql-depth-limit');
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const path = require('path');
const history = require('connect-history-api-fallback');
const https = require('https');
const Rollbar = require('rollbar');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const bodyParser = require('body-parser');
// const axios = require('axios');
// const VueAxios = require('vue-axios');
aws.config.update({
  secretAccessKey: process.env.aws_secret_access_key,
  accessKeyId: process.env.aws_access_key_id,
  region: 'us-east-1',
});

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_KEY,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.ENVIRONMENT,
});
const webpackConfig = require('../webpack.config.js');
const schema = require('./schema/schema.js');
require('./models/user');

const app = express();
app.use(compression());
app.use(cors());

// Upload file to AWS
const aws3 = new aws.S3();

app.use(bodyParser.json());

const upload = multer({
  storage: multerS3({
    s3: aws3,
    bucket: 'campzy-documents',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, file.fieldname + Date.now().toString());
    },
  }),
});

app.post('/uploadCampOwnerDocuments', upload.array('document', 5), (req, res) => {
  res.json('Success');
});

// Delete file from s3
app.delete('/deleteDocuments', (req, res) => {
  const documentDel = req.body.document;
  const params = {
    Bucket: 'campzy-documents',
    Key: `${documentDel}`,
  };
  aws3.deleteObject(params, (err, data) => {
    if (err) {
      return err;
    }
    res.json('Success');
    return data;
  });
});

// Connect to MLab Database
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true },
);
mongoose.connection.once('open', () => {
  console.log('Database connected');
});

// History mode fallback
app.use(history({}));

if (process.env.ENVIRONMENT === 'development') {
  app.use(webpackMiddleware(webpack(webpackConfig)));
} else {
  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.use(express.static(path.join(__dirname, '../frontend/static')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(
  '/graphql',
  graphqlHTTP(request => ({
    schema,
    formatError: ApolloError.formatError,
    validationRules: [depthLimit(10)],
    context: { req: request, passport },
  })),
);

app.use(rollbar.errorHandler());

// Last ditch error handler
app.use((err) => {
  rollbar.critical(err);
});

if (process.env.ENVIRONMENT === 'development') {
  // HTTPS on localhost
  const certOptions = {
    key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt')),
  };
  https.createServer(certOptions, app).listen(443);
} else {
  app.listen(process.env.PORT || 4444);
}
