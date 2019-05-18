import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { Validator } from "class-validator";
import { ApolloError, UserInputError } from "apollo-server-core";

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
  private async verifyOTP(@Arg("otp") otp: string): Promise<boolean> {
    try {
      return true;
    } catch (err) {
      return false;
    }
  }
}
