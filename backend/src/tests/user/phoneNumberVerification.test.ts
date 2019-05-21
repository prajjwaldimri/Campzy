import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import { UserModel } from "../../models/user";
import { OTPModel } from "../../models/otp";

describe("User Phone Verification", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should send an OTP to user's phoneNumber", async (): Promise<void> => {
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

    const jwtToken = responseRegister.data.createUserByEmail;

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: `+917830207022`
      },
      jwtToken
    });

    expect(response.data.sendOTPtoPhoneNumber).toEqual(true);
  });

  it("should not send an OTP to user's phoneNumber (Phone number already in use!)", async (): Promise<
    void
  > => {
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

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    await UserModel.create({
      email: chance.email(),
      password: chance.string({ length: 10 }),
      phoneNumber: "+917830304050"
    });

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "+917830304050"
      },
      jwtToken
    });

    expect(response.errors).toBeTruthy();
  });

  it("should not send an OTP to user's phoneNumber (Invalid phoneNumber)", async (): Promise<
    void
  > => {
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

    const jwtToken = responseRegister.data.createUserByEmail;

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "2190381290831029123123"
      },
      jwtToken
    });

    expect(response.errors).toBeTruthy();
  });

  it("should not send an OTP to user's phoneNumber (Blank phoneNumber)", async (): Promise<
    void
  > => {
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

    const jwtToken = responseRegister.data.createUserByEmail;

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    const response = await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "                       "
      },
      jwtToken
    });

    expect(response.errors).toBeTruthy();
  });

  it("should not send an OTP to user's phoneNumber (Not logged in!)", async (): Promise<
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
        phoneNumber: "+917830304050"
      }
    });

    expect(response.errors).toBeTruthy();
  });

  it("should verify user's phoneNumber", async (): Promise<void> => {
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

    const jwtToken = responseRegister.data.createUserByEmail;

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "+919690046216"
      },
      jwtToken
    });

    const verificationMutation = `
    mutation verifyOTP($phoneNumber: String!, $otp: String!) {
      verifyOTP(phoneNumber: $phoneNumber, otp: $otp)
    }
    `;

    const otpDocument = await OTPModel.findOne({
      phoneNumber: "+919690046216"
    });

    if (!otpDocument) {
      throw new Error();
    }

    const response = await gCall({
      source: verificationMutation,
      variableValues: {
        phoneNumber: "+919690046216",
        otp: otpDocument.otpValue
      }
    });

    console.log(response);

    expect(response.data.verifyOTP).toEqual(true);
  });

  it("should not verify user's phoneNumber (Wrong OTP)", async (): Promise<
    void
  > => {
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

    const jwtToken = responseRegister.data.createUserByEmail;

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "+919810325245"
      },
      jwtToken
    });

    const verificationMutation = `
    mutation verifyOTP($phoneNumber: String!, $otp: String!) {
      verifyOTP(phoneNumber: $phoneNumber, otp: $otp)
    }
    `;

    const response = await gCall({
      source: verificationMutation,
      variableValues: {
        phoneNumber: "+919810325245",
        otp: "a2891371"
      }
    });

    expect(response.errors).toBeTruthy();
  });

  it("should not verify user's phoneNumber (Blank OTP)", async (): Promise<
    void
  > => {
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

    const jwtToken = responseRegister.data.createUserByEmail;

    const otpMutation = `
    mutation sendOTPtoPhoneNumber($phoneNumber: String!) {
      sendOTPtoPhoneNumber(phoneNumber: $phoneNumber)
    }
    `;

    await gCall({
      source: otpMutation,
      variableValues: {
        phoneNumber: "+919690046216"
      },
      jwtToken
    });

    const verificationMutation = `
    mutation verifyOTP($phoneNumber: String!, $otp: String!) {
      verifyOTP(phoneNumber: $phoneNumber, otp: $otp)
    }
    `;

    const response = await gCall({
      source: verificationMutation,
      variableValues: {
        phoneNumber: "+919690046216",
        otp: "           "
      }
    });

    expect(response.errors).toBeTruthy();
  });
});
