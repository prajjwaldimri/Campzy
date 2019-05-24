import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("User Login", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should Log In", async (): Promise<void> => {
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
    expect(response.data.login).toBeDefined();
  });

  it("should not Log In (Invalid Email)", async (): Promise<void> => {
    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: "abc@test.com",
          password: "validPassword"
        }
      }
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeNull();
  });

  it("should not Logged In (Invalid Password or Email)", async (): Promise<
    void
  > => {
    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: "abc@test.com",
          password: "InvalidPassword"
        }
      }
    });
    expect(response.errors).toBeDefined();
    expect(response.data).toBeNull();
  });
});
