require("dotenv").config();
const ApolloError = require("apollo-errors");
const express = require("express");
const compression = require("compression");
const fs = require("fs");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const depthLimit = require("graphql-depth-limit");
const path = require("path");
const history = require("connect-history-api-fallback");
const https = require("https");
const multer = require("multer");
const bodyParser = require("body-parser");
const Sentry = require("@sentry/node");
const { sitemap } = require("./sitemapGen");

if (process.env.ENVIRONMENT === "production") {
  Sentry.init({
    dsn: "https://0d8a506e3fad49c8b2448261d9fb373e@sentry.io/1293718"
  });
}

const {
  deleteImage,
  deleteDocuments,
  uploadCampDocuments,
  uploadCampImages,
  uploadDocument,
  imageStorage
} = require("./aws.js");

const schema = require("./schema/schema.js");
require("./models/user");

const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(compression());
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Sitemap generator
app.get("/sitemap.xml", (req, res) => {
  // eslint-disable-next-line consistent-return
  sitemap.toXML((err, xml) => {
    if (err) {
      return res.status(500).end();
    }
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });
});

// Upload CampOwner's Documents
app.post(
  "/uploadCampOwnerDocuments",
  uploadDocument.array("document", 5),
  uploadCampDocuments
);

// Delete CampOwner's Documents

app.delete("/deleteDocuments", deleteDocuments);
// Image uploads

app.post(
  "/uploadImages",
  multer({
    storage: imageStorage
  }).array("images", 10),
  uploadCampImages
);

// Delete file from s3
app.delete("/deleteImages", deleteImage);

// Connect to MLab Database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

// History mode fallback
app.use(history({}));

// if (process.env.ENVIRONMENT === 'development') {
//   app.use(webpackMiddleware(webpack(webpackConfig)));
// } else {
//   app.get('/', (req, res) => {
//     res
//       .status(200)
//       .sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//   });
// }

// Public static directories

app.use(
  "/",
  graphqlHTTP(request => ({
    schema,
    formatError: ApolloError.formatError,
    validationRules: [depthLimit(10)],
    graphiql: true,
    context: {
      req: request,
      passport
    }
  }))
);

// Last ditch error handler
if (process.env.ENVIRONMENT === "production") {
  app.use(Sentry.Handlers.errorHandler());
}

if (process.env.ENVIRONMENT === "development") {
  // HTTPS on localhost
  const certOptions = {
    key: fs.readFileSync(path.resolve(__dirname, "certs/server.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "certs/server.crt"))
  };
  https.createServer(certOptions, app).listen(443);
} else {
  app.listen(process.env.PORT || 4444);
}
