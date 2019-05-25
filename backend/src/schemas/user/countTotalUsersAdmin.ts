import { Query, Ctx, Resolver } from "type-graphql";
import { GraphContext } from "graphcontext";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";

import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class CountTotalUsersAdminResolver {
  @Query(() => Number)
  private async countTotalUsersAdmin(
    @Ctx() ctx: GraphContext
  ): Promise<number> {
    const user = await auth.getAuthenticatedUser(ctx.req);
    const userData = await UserModel.findById(user.id).exec();

    if (!userData) {
      throw new AuthenticationError("Not Logged in");
    }

    const isUserAdmin = auth.isUserAdmin(userData);
    if (!isUserAdmin) {
      throw new ForbiddenError(
        "You do not have proper privilege to access this"
      );
    }
    return await UserModel.estimatedDocumentCount({}).exec();
  }
}
