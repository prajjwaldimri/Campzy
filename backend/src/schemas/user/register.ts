import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { IsEmail, Length } from "class-validator";
import { ApolloError, UserInputError } from "apollo-server-core";

@InputType()
class CreateUserByEmailInput {
  @Field({ nullable: true })
  public name?: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  @Length(4)
  public password!: string;
}

@Resolver()
export class RegisterResolver {
  @Mutation(() => String)
  private async createUserByEmail(@Arg("data")
  {
    email,
    password,
    name
  }: CreateUserByEmailInput): Promise<string> {
    try {
      if (password.trim().length < 4) {
        throw new UserInputError("Password is too short!");
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const userDocument = new UserModel({
        name: name,
        email: email,
        password: passwordHash
      });
      const createdUser = await userDocument.save();
      await auth.sendEmailVerificationToken(createdUser._id, email);
      return createdUser.generateJWT();
    } catch (err) {
      return err;
    }
  }
}
