import { gCall } from "../test-utils/gCall";
import faker from "faker";

describe("User Register", (): void => {
  jest.setTimeout(10000);
  const registerMutation = `mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
  createUserByEmail(data: $data)
}
`;
  it("should create a user", async (): Promise<void> => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password: faker.hacker.adjective()
        }
      }
    });
    expect(response.data.createUserByEmail).toBeDefined();
  });
});
