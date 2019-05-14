import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server-express";
import express from "express";
import compression from "compression";
import fs from "fs";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import path from "path";
import https, { request } from "https";
import multer from "multer";
import bodyParser from "body-parser";
import Sentry from "@sentry/node";

if (process.env.ENVIRONMENT === "production") {
  Sentry.init({
    dsn: "https://0d8a506e3fad49c8b2448261d9fb373e@sentry.io/1293718"
  });
}

import {
  deleteImage,
  deleteDocuments,
  uploadCampDocuments,
  uploadCampImages,
  uploadDocument,
  imageStorage
} from "./aws";

import schema from "./schema/schema.js";

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
mongoose.connect(process.env.MONGODB_URI || "", {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.once(
  "open",
  (): void => {
    console.log("Database connected");
  }
);

// Apollo-Server Configuration
const server = new ApolloServer({
  playground: true,
  schema,
  context: { req: request, passport }
});
server.applyMiddleware({ app });

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
