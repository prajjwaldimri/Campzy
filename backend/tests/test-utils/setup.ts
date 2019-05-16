import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import "../../src/models/user";

beforeEach(
  (done): void => {
    function clearDB(): void {
      for (let i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove((): void => {});
      }
      return done();
    }

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(
        process.env.MONGODB_URI || "",
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          autoReconnect: true
        },
        (err): void => {
          if (err) throw err;
          return clearDB();
        }
      );
    } else {
      return clearDB();
    }
  }
);

afterEach(
  (done): void => {
    mongoose.disconnect();
    return done();
  }
);

afterAll(
  (done): void => {
    return done();
  }
);
