import { gCall } from "../test-utils/gCall";
import faker from "faker";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("User Login", (): void => {
  jest.setTimeout(50000);

  it("should Logged In", async (): Promise<void> => {
    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: faker.name.firstName(),
      email: faker.internet.email(),
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
    console.log(response);
    expect(response).toBeDefined();

    const dbUser = await UserModel.findOne({ email: user.email });
    console.log(dbUser);
    expect(dbUser).toBeDefined();
  });

  it("should not Logged In (Invalid Email)", async (): Promise<void> => {
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
    console.log(response);
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
    console.log(response);
  });
});
