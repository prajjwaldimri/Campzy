/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ObjectId } from "mongodb";
import { Query, Resolver, Ctx, Arg } from "type-graphql";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { UserModel, User } from "../../models/user";
import * as auth from "../../config/auth";
import { ObjectIdScalar } from "../../types/objectIdScalar";

@Resolver()
export class GetUserAdminResolver {
  @Query(() => User)
  private async getUserAdmin(
    @Ctx() ctx: GraphContext,
    @Arg("userId", () => ObjectIdScalar, {
      description: "MongoDB Id of the user"
    })
    userId: ObjectId
  ): Promise<User> {
    try {
      const loggedInUser = await auth.getAuthenticatedUser(ctx.req);
      if (!loggedInUser) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const user = await UserModel.findById(loggedInUser.id)
        .select("type")
        .exec();
      if (!user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const isUserAdmin = await auth.isUserAdmin(user);
      if (!isUserAdmin) {
        throw new ForbiddenError("Not allowed to perform this action");
      }

      const foundUser = await UserModel.findById(userId).exec();
      if (!foundUser) {
        throw new UserInputError("Wrong user id!");
      }
      return foundUser;
    } catch (err) {
      return err;
    }
  }
}
