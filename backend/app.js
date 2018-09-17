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
const sharp = require('sharp');

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
app.use(bodyParser.urlencoded({ extended: true }));

// Upload CampOwner's Documents
const uploadDocument = multer({
  storage: multerS3({
    s3: aws3,
    bucket: 'campzy-documents',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key(req, file, cb) {
      cb(null, `${Date.now()}__${file.originalname}`);
    },
  }),
});

app.post(
  '/uploadCampOwnerDocuments',
  uploadDocument.array('document', 5),
  (req, res) => {
    if (!req.files) {
      throw new Error('Cannot update empty files');
    }
    console.log(req.files);
    res.json(req.files);
  },
);

// Delete CampOwner's Documents

app.delete('/deleteDocuments', (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Cannot Delete Empty Body');
    }
    const documentDelete = req.body.documentName;
    aws3.deleteObject(
      {
        Bucket: 'campzy-documents',
        Key: `${documentDelete}`,
      },
      (err) => {
        if (err) {
          throw new Error('Cannot Delete');
        }
        res.json(documentDelete);
      },
    );
  } catch (err) {
    return err;
  }
  return true;
});
// Image uploads

const imageStorage = multer.memoryStorage({
  destination(req, file, callback) {
    callback(null, '');
  },
});

app.post(
  '/uploadImages',
  multer({ storage: imageStorage }).array('images', 10),
  (req, res) => {
    if (req.files.length !== 0) {
      let filesLength = 0;
      const filesArray = [];
      req.files.forEach((file) => {
        const fileName = `${Date.now()}__${file.originalname}`;
        filesLength += 1;
        filesArray.push(fileName);
        aws3.putObject(
          {
            Bucket: 'campzy-images',
            Key: `high-res/${fileName}`,
            Body: file.buffer,
            ACL: 'public-read',
          },
          () => {
            sharp(file.buffer)
              .resize(300, null)
              .png({ progressive: true, compressionLevel: 5 })
              .toBuffer((err, buffer) => {
                aws3.putObject(
                  {
                    Bucket: 'campzy-images',
                    Key: `low-res/${fileName}`,
                    Body: buffer,
                    ACL: 'public-read',
                  },
                  () => {
                    sharp(file.buffer)
                      .resize(40, 40)
                      .png({ progressive: true, compressionLevel: 9 })
                      .toBuffer((err2, buffer2) => {
                        aws3.putObject(
                          {
                            Bucket: 'campzy-images',
                            Key: `thumbnails/${fileName}`,
                            Body: buffer2,
                            ACL: 'public-read',
                          },
                          () => {
                            if (filesLength === req.files.length) {
                              res.json(filesArray);
                            }
                          },
                        );
                      });
                  },
                );
              });
          },
        );
      });
    } else {
      res.json('Error');
    }
  },
);

// Delete file from s3
app.delete('/deleteImages', (req, res) => {
  try {
    if (!req.body) {
      throw new Error('Cannot send Empty Key');
    }
    if (req.body) {
      let imageDelete = '';
      if (req.body.blogImage) {
        imageDelete = req.body.blogImage;
      }
      if (req.body.imageName) {
        imageDelete = req.body.imageName;
      }
      aws3.deleteObject(
        {
          Bucket: 'campzy-images',
          Key: `high-res/${imageDelete}`,
        },
        () => {
          aws3.deleteObject(
            {
              Bucket: 'campzy-images',
              Key: `low-res/${imageDelete}`,
            },
            () => {
              aws3.deleteObject(
                {
                  Bucket: 'campzy-images',
                  Key: `thumbnails/${imageDelete}`,
                },
                (err) => {
                  if (err) {
                    return err;
                  }
                  return res.json(imageDelete);
                },
              );
            },
          );
        },
      );
    } else {
      throw new Error('Cannot Delete');
    }
  } catch (err) {
    return err;
  }
  return true;
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
    res
      .status(200)
      .sendFile(path.join(__dirname, '../frontend/dist/index.html'));
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
  https.createServer(certOptions, app).listen(443, (err) => {
    console.log(err);
    console.log('HTTP Server running');
  });
} else {
  app.listen(process.env.PORT || 4444);
}
