import { Resolver, Mutation, Arg, InputType, Field, Ctx } from "type-graphql";
import { Validator } from "class-validator";
import {
  ApolloError,
  UserInputError,
  AuthenticationError
} from "apollo-server-core";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { OTPModel } from "../../models/otp";
import { GraphContext } from "graphcontext";

const validator = new Validator();

export class PhoneNumberVerificationResolver {
  @Mutation(() => Boolean)
  private async sendOTPtoPhoneNumber(
    @Ctx() ctx: GraphContext,
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<boolean> {
    try {
      if (!validator.isPhoneNumber(phoneNumber, "ZZ")) {
        throw new UserInputError("Phone Number Invalid!");
      }

      const loggedInUser = await auth.getAuthenticatedUser(ctx.req);

      if (!loggedInUser) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const user = await UserModel.findOne({ phoneNumber });
      if (user) {
        throw new ApolloError("Phone number is already in use!");
      }
      await auth.sendUserOTP(phoneNumber, loggedInUser.id);
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
      const otpDocument = await OTPModel.findOne({ otpValue: otp });
      if (!otpDocument) {
        throw new ApolloError("Wrong otp provided!");
      }

      if (phoneNumber !== otpDocument.phoneNumber) {
        throw new UserInputError("OTP and phone number do not match");
      }
      const user = await UserModel.findById(otpDocument.user);
      if (!user) {
        throw new ApolloError(
          "Cannot find user associated with this phone number!"
        );
      }
      user.phoneNumber = phoneNumber;
      await user.save();
      return true;
    } catch (err) {
      return err;
    }
  }
}
