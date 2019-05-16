import { Resolver, Mutation, Arg, InputType, Field } from "type-graphql";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { IsEmail, Length } from "class-validator";

@InputType()
class CreateUserByEmailInput {
  @Field({ nullable: true })
  public name?: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field()
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
    const passwordHash = await bcrypt.hash(password, 12);
    const userDocument = new UserModel({
      name: name,
      email: email,
      password: passwordHash
    });
    const createdUser = await userDocument.save();
    await auth.sendEmailVerificationToken(createdUser._id, email);
    return JSON.stringify(createdUser.generateJWT());
  }
}
