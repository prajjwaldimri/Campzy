import { Query, Resolver, Ctx } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { UserModel, User } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class CurrentUserResolver {
  @Query(() => User)
  private async getCurrentUser(@Ctx() ctx: GraphContext): Promise<User | null> {
    try {
      const loggedInUser = await auth.getAuthenticatedUser(ctx.req);

      if (!loggedInUser) {
        throw new AuthenticationError("You need to be logged in!");
      }

      return await UserModel.findById(loggedInUser.id).exec();
    } catch (err) {
      return err;
    }
  }
}
