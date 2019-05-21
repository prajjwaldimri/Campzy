import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import { UserModel } from "../../models/user";

describe("User Register", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should create a user", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: chance.name(),
      email: chance.email(),
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
          name: chance.name(),
          email: "gibberishASDKLja.com",
          password: chance.string({ length: 10 })
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
          name: chance.name(),
          email: "         ",
          password: chance.string({ length: 10 })
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
          name: chance.name(),
          email: chance.email(),
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
          name: chance.name(),
          email: chance.email(),
          password: "                     "
        }
      }
    });
    console.log(response);
    expect(response.data).toBeNull();
  });
});
