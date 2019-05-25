import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Current User Tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should return list of users", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Admin"
    }).save();

    const toBeSearchedUser = await new UserModel({
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

    const searchUserQuery = `
      query searchUser($searchTerm: String!, $first: Float!, $offset: Float!) {
        searchUser(searchTerm: $searchTerm, first: $first, offset: $offset) {
          name
        }
      }
    `;

    const searchUserResponse = await gCall({
      source: searchUserQuery,
      variableValues: {
        searchTerm: "Test",
        first: 10,
        offset: 0
      },
      jwtToken
    });
    expect(searchUserResponse.data.searchUser).toHaveLength(1);
    expect(searchUserResponse.data.searchUser[0].name).toEqual(
      toBeSearchedUser.name
    );
  });

  it("should not return list of users (Not logged in!)", async (): Promise<
    void
  > => {
    const searchUserQuery = `
      query searchUser($searchTerm: String!, $first: Float!, $offset: Float!) {
        searchUser(searchTerm: $searchTerm, first: $first, offset: $offset) {
          name
        }
      }
    `;

    const searchUserResponse = await gCall({
      source: searchUserQuery,
      variableValues: {
        searchTerm: "Test",
        first: 10,
        offset: 0
      },
      jwtToken: chance.string({ length: 10 })
    });
    expect(searchUserResponse.errors).toBeDefined();
    expect(searchUserResponse.data).toBeNull();
  });

  it("should not return list of users (Not an admin!)", async (): Promise<
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

    const searchUserQuery = `
      query searchUser($searchTerm: String!, $first: Float!, $offset: Float!) {
        searchUser(searchTerm: $searchTerm, first: $first, offset: $offset) {
          name
        }
      }
    `;

    const searchUserResponse = await gCall({
      source: searchUserQuery,
      variableValues: {
        searchTerm: "Test",
        first: 10,
        offset: 0
      },
      jwtToken
    });
    expect(searchUserResponse.errors).toBeDefined();
    expect(searchUserResponse.data).toBeNull();
  });

  it("should not return list of users (No users found)", async (): Promise<
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

    const searchUserQuery = `
      query searchUser($searchTerm: String!, $first: Float!, $offset: Float!) {
        searchUser(searchTerm: $searchTerm, first: $first, offset: $offset) {
          name
        }
      }
    `;

    const searchUserResponse = await gCall({
      source: searchUserQuery,
      variableValues: {
        searchTerm: "sadiuaiudyius8a",
        first: 10,
        offset: 0
      },
      jwtToken
    });
    expect(searchUserResponse.data.searchUser).toHaveLength(0);
  });
});
