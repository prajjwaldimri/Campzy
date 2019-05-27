import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Update User Tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should update the user's details", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Blogger"
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

    const updateUserMutation = `
      mutation updateUser($dataToUpdate: UpdateUserInput!, $password: String!) {
        updateUser(dataToUpdate: $dataToUpdate, password: $password) {
          name,
          email,
          type
        }
      }
    `;

    const updateUserResponse = await gCall({
      source: updateUserMutation,
      variableValues: {
        dataToUpdate: {
          name: chance.name(),
          dateOfBirth: chance.date()
        },
        password: "validPassword"
      },
      jwtToken
    });

    expect(updateUserResponse.data.updateUser).toBeDefined();
  });

  it("should not update the user's details (Not logged in)", async (): Promise<
    void
  > => {
    const updateUserMutation = `
      mutation updateUser($dataToUpdate: UpdateUserInput!, $password: String!) {
        updateUser(dataToUpdate: $dataToUpdate, password: $password) {
          name,
          email,
          type
        }
      }
    `;

    const updateUserResponse = await gCall({
      source: updateUserMutation,
      variableValues: {
        dataToUpdate: {
          name: chance.name(),
          dateOfBirth: chance.date()
        },
        password: "validPassword"
      },
      jwtToken: chance.string({ length: 10 })
    });

    expect(updateUserResponse.errors).toBeDefined();
    expect(updateUserResponse.data).toBeNull();
  });

  it("should not update the user's details (Wrong password)", async (): Promise<
    void
  > => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Blogger"
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

    const updateUserMutation = `
      mutation updateUser($dataToUpdate: UpdateUserInput!, $password: String!) {
        updateUser(dataToUpdate: $dataToUpdate, password: $password) {
          name,
          email,
          type
        }
      }
    `;

    const updateUserResponse = await gCall({
      source: updateUserMutation,
      variableValues: {
        dataToUpdate: {
          name: chance.name(),
          dateOfBirth: chance.date()
        },
        password: chance.string()
      },
      jwtToken
    });

    expect(updateUserResponse.errors).toBeDefined();
    expect(updateUserResponse.data).toBeNull();
  });
});
