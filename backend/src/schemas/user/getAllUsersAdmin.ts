import { Query, Resolver, Ctx, Arg } from "type-graphql";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { UserModel, User } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class GetAllUsersAdminResolver {
  @Query(() => [User])
  private async getAllUsersAdmin(
    @Ctx() ctx: GraphContext,
    @Arg("first") first: number,
    @Arg("offset") offset: number,
    @Arg("searchTerm", { nullable: true }) searchTerm: string
  ): Promise<User[] | null> {
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

    let searchQuery = {};
    if (searchTerm) {
      searchQuery = { $text: { $search: searchTerm } };
    }

    return await UserModel.find(searchQuery)
      .limit(first)
      .skip(offset * first)
      .exec();
  }
}
