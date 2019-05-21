import { Resolver, Query, Arg, InputType, Field } from "type-graphql";
import bcrypt from "bcrypt";

import { UserModel } from "../../models/user";
import { IsEmail } from "class-validator";
import { UserInputError } from "apollo-server-core";

@InputType()
class LoginUserByEmailInput {
  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  public password!: string;
}
@Resolver()
export class LoginResolver {
  @Query(() => String)
  private async login(@Arg("data")
  {
    email,
    password
  }: LoginUserByEmailInput): Promise<string> {
    try {
      if (!email || !password) {
        throw new UserInputError("Invalid Email or Password");
      }

      const userDocument = await UserModel.findOne({ email }).exec();
      if (!userDocument) {
        throw new UserInputError("Invalid Email or Password");
      }

      const passwordsMatch = await bcrypt.compare(
        password,
        userDocument.password
      );
      if (!passwordsMatch) {
        throw new UserInputError("Invalid Password");
      }
      return userDocument.generateJWT();
    } catch (err) {
      return err;
    }
  }
}
