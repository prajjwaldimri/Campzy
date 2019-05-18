import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { UserModel } from "../../models/user";

describe("User Phone Verification", (): void => {
  jest.setTimeout(50000);

  it("should send an OTP to user's phoneNumber", async (): Promise<void> => {
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
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: `+${faker.phone.phoneNumber("91##########")}`
      }
    });

    expect(response.data.sendOTPtoPhoneNumber).toEqual(true);
  });

  it("should not send an OTP to user's phoneNumber (Phone number already in use!)", async (): Promise<
    void
  > => {
    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    await UserModel.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      phoneNumber: "+917830304050"
    });

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "+917830304050"
      }
    });

    expect(response.errors).toBeTruthy();
  });

  it("should not send an OTP to user's phoneNumber (Invalid phoneNumber)", async (): Promise<
    void
  > => {
    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "2190381290831029123123"
      }
    });

    expect(response.errors).toBeTruthy();
  });

  it("should not send an OTP to user's phoneNumber (Blank phoneNumber)", async (): Promise<
    void
  > => {
    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "                       "
      }
    });

    expect(response.errors).toBeTruthy();
  });

  it("should verify user's phoneNumber", async (): Promise<void> => {
    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: `+${faker.phone.phoneNumber("91##########")}`
      }
    });
  });

  it("should not verify user's phoneNumber (Wrong OTP)", async (): Promise<
    void
  > => {
    throw new Error();
  });

  it("should not verify user's phoneNumber (Blank OTP)", async (): Promise<
    void
  > => {
    throw new Error();
  });
});
