import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Count Total Users Test", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should return number of users", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Admin"
    }).save();

    await new UserModel({
      name: "Test name",
      email: chance.email(),
      password: passwordHash
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

    const countTotalUsersAdminQuery = `
      query {
        countTotalUsersAdmin
      }
    `;

    const countTotalUsersAdminResponse = await gCall({
      source: countTotalUsersAdminQuery,
      jwtToken
    });
    expect(countTotalUsersAdminResponse.data.countTotalUsersAdmin).toEqual(2);
  });

  it("should not return number of users (Not logged in)", async (): Promise<
    void
  > => {
    const countTotalUsersAdminQuery = `
      query {
        countTotalUsersAdmin
      }
    `;

    const countTotalUsersAdminResponse = await gCall({
      source: countTotalUsersAdminQuery,
      jwtToken: chance.string({ length: 10 })
    });
    expect(countTotalUsersAdminResponse.errors).toBeDefined();
    expect(countTotalUsersAdminResponse.data).toBeNull();
  });

  it("should return number of users", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash
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

    const countTotalUsersAdminQuery = `
      query {
        countTotalUsersAdmin
      }
    `;

    const countTotalUsersAdminResponse = await gCall({
      source: countTotalUsersAdminQuery,
      jwtToken
    });
    expect(countTotalUsersAdminResponse.errors).toBeDefined();
    expect(countTotalUsersAdminResponse.data).toBeNull();
  });
});
