import { Resolver, Mutation, Ctx, Arg, InputType, Field } from "type-graphql";
import { ReturnTypeFuncValue } from "type-graphql/dist/decorators/types";
import { AuthenticationError, UserInputError } from "apollo-server-core";
import { GraphContext } from "graphcontext";
import bcrypt from "bcrypt";

import { User, UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@InputType()
class UpdateUserInput {
  @Field({ nullable: true })
  public name?: string;

  @Field()
  public dateOfBirth?: Date;
}

@Resolver()
export class UpdateUserResolver {
  @Mutation((): ReturnTypeFuncValue => User)
  private async updateUser(
    @Ctx() ctx: GraphContext,
    @Arg("password") password: string,
    @Arg("dataToUpdate") { name, dateOfBirth }: UpdateUserInput
  ): Promise<User> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      let userData = await UserModel.findById(user.id)
        .select("password")
        .exec();

      if (!userData) {
        throw new AuthenticationError("Not Logged in");
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        userData.password
      );

      if (!isPasswordCorrect) {
        throw new UserInputError("Wrong password provided");
      }

      userData = await UserModel.findByIdAndUpdate(
        user.id,
        { name, dateOfBirth },
        {
          select: "email name type dateOfBirth",
          new: true
        }
      ).exec();

      if (!userData) {
        throw new UserInputError("Received wrong data");
      }

      return userData;
    } catch (err) {
      return err;
    }
  }
}
