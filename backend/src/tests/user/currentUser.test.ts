import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import { UserModel } from "../../models/user";

describe("Current User Tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should return current user", async (): Promise<void> => {
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
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    console.log(responseRegister);

    const jwtToken = responseRegister.data.createUserByEmail;

    const currentUserQuery = `
      query {
        getCurrentUser {
          name
          email
          type
        }
      }
    `;

    const response = await gCall({
      source: currentUserQuery,
      jwtToken
    });

    expect(response.data.getCurrentUser.name).toEqual(user.name);
    expect(response.data.getCurrentUser.email).toEqual(
      user.email.toLowerCase()
    );
    expect(response.data.getCurrentUser.type).toEqual("Camper");
  });

  it("should not return current user (Not logged in!)", async (): Promise<
    void
  > => {
    const currentUserQuery = `
      query {
        getCurrentUser {
          name
          email
          type
        }
      }
    `;

    const response = await gCall({
      source: currentUserQuery,
      jwtToken: chance.string({ length: 20 })
    });

    expect(response.errors).toBeDefined();
  });
});
