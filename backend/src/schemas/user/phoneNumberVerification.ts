import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { IsEmail, Length } from "class-validator";
import { ApolloError, UserInputError } from "apollo-server-core";

export class PhoneNumberVerificationResolver {
  @Mutation(() => Boolean)
  private async sendOTPtoPhoneNumber(
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<boolean> {
    throw new Error();
  }

  @Mutation(() => Boolean)
  private async verifyOTP(@Arg("otp") otp: string): Promise<boolean> {
    throw new Error();
  }
}
