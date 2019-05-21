import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Email Availability Tests", (): void => {
  const chance = new Chance();

  it("should show email as available", async (): Promise<void> => {
    const emailAvailableQuery = `
      query isEmailAvailable($email: String!) {
        isEmailAvailable(email: $email)
      }
    `;

    const response = await gCall({
      source: emailAvailableQuery,
      variableValues: {
        email: chance.email()
      }
    });

    expect(response.data.isEmailAvailable).toEqual(true);
  });

  it("should not show email as available (Already is use!)", async (): Promise<
    void
  > => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash
    }).save();

    const emailAvailableQuery = `
      query isEmailAvailable($email: String!) {
        isEmailAvailable(email: $email)
      }
    `;

    const response = await gCall({
      source: emailAvailableQuery,
      variableValues: {
        email: user.email
      }
    });

    expect(response.data.isEmailAvailable).toEqual(false);
  });

  it("should not show email as available (Wrong email!)", async (): Promise<
    void
  > => {
    const emailAvailableQuery = `
      query isEmailAvailable($email: String!) {
        isEmailAvailable(email: $email)
      }
    `;

    const response = await gCall({
      source: emailAvailableQuery,
      variableValues: {
        email: "asd897d892@(87129837"
      }
    });

    expect(response.errors).toBeDefined();
  });
});
