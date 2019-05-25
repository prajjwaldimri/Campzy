import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("All Users Admin Tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should return list of all users (Without any searchTerm)", async (): Promise<
    void
  > => {
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

    const getAllUsersAdminQuery = `
      query getAllUsersAdmin($first: Float!, $offset: Float!) {
        getAllUsersAdmin(first: $first, offset: $offset) {
          name
        }
      }
    `;

    const getAllUsersAdminResponse = await gCall({
      source: getAllUsersAdminQuery,
      variableValues: {
        first: 10,
        offset: 0
      },
      jwtToken
    });
    expect(getAllUsersAdminResponse.data.getAllUsersAdmin).toHaveLength(2);
  });

  it("should return list of all users (With searchTerm)", async (): Promise<
    void
  > => {
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

    const getAllUsersAdminQuery = `
      query getAllUsersAdmin($searchTerm: String, $first: Float!, $offset: Float!) {
        getAllUsersAdmin(searchTerm: $searchTerm, first: $first, offset: $offset) {
          name
        }
      }
    `;

    const getAllUsersAdminResponse = await gCall({
      source: getAllUsersAdminQuery,
      variableValues: {
        searchTerm: user.name,
        first: 10,
        offset: 0
      },
      jwtToken
    });
    expect(getAllUsersAdminResponse.data.getAllUsersAdmin).toHaveLength(1);
    expect(getAllUsersAdminResponse.data.getAllUsersAdmin[0].name).toEqual(
      user.name
    );
  });

  it("should not return list of all users (Not logged in)", async (): Promise<
    void
  > => {
    const getAllUsersAdminQuery = `
      query getAllUsersAdmin($first: Float!, $offset: Float!) {
        getAllUsersAdmin(first: $first, offset: $offset) {
          name
        }
      }
    `;

    const getAllUsersAdminResponse = await gCall({
      source: getAllUsersAdminQuery,
      variableValues: {
        first: 10,
        offset: 0
      },
      jwtToken: chance.string({ length: 10 })
    });
    expect(getAllUsersAdminResponse.errors).toBeDefined();
    expect(getAllUsersAdminResponse.data).toBeNull();
  });

  it("should not return list of all users (Not admin)", async (): Promise<
    void
  > => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash
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

    const getAllUsersAdminQuery = `
      query getAllUsersAdmin($first: Float!, $offset: Float!) {
        getAllUsersAdmin(first: $first, offset: $offset) {
          name
        }
      }
    `;

    const getAllUsersAdminResponse = await gCall({
      source: getAllUsersAdminQuery,
      variableValues: {
        first: 10,
        offset: 0
      },
      jwtToken
    });
    expect(getAllUsersAdminResponse.errors).toBeDefined();
    expect(getAllUsersAdminResponse.data).toBeNull();
  });
});
