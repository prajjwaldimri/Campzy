import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { UserModel } from "../../src/models/user";

describe("User Register", (): void => {
  jest.setTimeout(50000);

  it("should create a user", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });
    expect(response.data.createUserByEmail).toBeDefined();

    const dbUser = await UserModel.findOne({ email: user.email });
    expect(dbUser).toBeDefined();
  });

  it("should not create a user (Wrong Email)", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          name: faker.name.firstName(),
          email: "gibberishASDKLja.com",
          password: faker.hacker.adjective()
        }
      }
    });
    expect(response.data).toBeNull();
  });

  it("should not create a user (Empty Email)", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          name: faker.name.firstName(),
          email: "         ",
          password: faker.hacker.adjective()
        }
      }
    });
    expect(response.data).toBeNull();
  });

  it("should not create a user (Wrong Password)", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password: "1"
        }
      }
    });
    expect(response.data).toBeNull();
  });

  it("should not create a user (Empty Password)", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password: "                     "
        }
      }
    });
    expect(response.data).toBeNull();
  });
});
