import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { UserModel } from "../../models/user";

describe("User Phone Verification", (): void => {
  jest.setTimeout(50000);

  it("should send an OTP to user's phoneNumber", async (): Promise<void> => {
    throw new Error();
  });

  it("should not send an OTP to user's phoneNumber (Invalid phoneNumber)", async (): Promise<
    void
  > => {
    throw new Error();
  });

  it("should not send an OTP to user's phoneNumber (Blank phoneNumber)", async (): Promise<
    void
  > => {
    throw new Error();
  });

  it("should verify user's phoneNumber", async (): Promise<void> => {
    throw new Error();
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
