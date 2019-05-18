import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { Validator } from "class-validator";
import { ApolloError, UserInputError } from "apollo-server-core";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { OTPModel } from "../../models/otp";

const validator = new Validator();

export class PhoneNumberVerificationResolver {
  @Mutation(() => Boolean)
  private async sendOTPtoPhoneNumber(
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<boolean> {
    try {
      if (!validator.isPhoneNumber(phoneNumber, "ZZ")) {
        throw new UserInputError("Phone Number Invalid!");
      }
      const user = await UserModel.findOne({ phoneNumber });
      if (user) {
        throw new ApolloError("Phone number is already in use!");
      }
      await auth.sendUserOTP(phoneNumber);
      return true;
    } catch (err) {
      return err;
    }
  }

  @Mutation(() => Boolean)
  private async verifyOTP(
    @Arg("phoneNumber") phoneNumber: string,
    @Arg("otp") otp: string
  ): Promise<boolean> {
    try {
      const otpDocument = await OTPModel.findOne({ otp });
      if (!otpDocument) {
        return false;
      }
      if (phoneNumber === otpDocument.phoneNumber) {
        return true;
      }
      return true;
    } catch (err) {
      return err;
    }
  }
}
