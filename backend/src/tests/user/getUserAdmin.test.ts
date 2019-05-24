import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Get User by Id", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should return a user by id", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Admin"
    }).save();

    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: user.email,
          password: "validPassword"
        }
      }
    });
    const jwtToken = response.data.login;

    const getUserAdminQuery = `
      query getUserAdmin($userId: ObjectId!) {
        getUserAdmin(userId: $userId) {
          name
        }
      }
    `;

    const userResponse = await gCall({
      source: getUserAdminQuery,
      variableValues: {
        userId: user._id
      },
      jwtToken
    });

    expect(userResponse.data.getUserAdmin.name).toEqual(user.name);
  });

  it("should not return a user by id (Not logged in!)", async (): Promise<
    void
  > => {
    const getUserAdminQuery = `
      query getUserAdmin($userId: ObjectId!) {
        getUserAdmin(userId: $userId) {
          name
        }
      }
    `;

    const userResponse = await gCall({
      source: getUserAdminQuery,
      variableValues: {
        userId: chance.string({ length: 10 })
      },
      jwtToken: chance.string({ length: 10 })
    });

    expect(userResponse.errors).toBeDefined();
  });

  it("should not return a user by id (Not an admin)", async (): Promise<
    void
  > => {
    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash
    }).save();

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: user.email,
          password: "validPassword"
        }
      }
    });
    const jwtToken = response.data.login;

    const getUserAdminQuery = `
      query getUserAdmin($userId: ObjectId!) {
        getUserAdmin(userId: $userId) {
          name
        }
      }
    `;

    const userResponse = await gCall({
      source: getUserAdminQuery,
      variableValues: {
        userId: user._id
      },
      jwtToken
    });

    expect(userResponse.errors).toBeDefined();
  });

  it("should not return a user by id (Wrong user Id)", async (): Promise<
    void
  > => {
    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Admin"
    }).save();

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: user.email,
          password: "validPassword"
        }
      }
    });
    const jwtToken = response.data.login;

    const getUserAdminQuery = `
      query getUserAdmin($userId: ObjectId!) {
        getUserAdmin(userId: $userId) {
          name
        }
      }
    `;

    const userResponse = await gCall({
      source: getUserAdminQuery,
      variableValues: {
        userId: chance.string({ length: 10 })
      },
      jwtToken
    });

    expect(userResponse.errors).toBeDefined();
  });
});
