import { Query, Resolver, Ctx, Arg } from "type-graphql";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { UserModel, User } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class SearchUserResolver {
  @Query(() => [User])
  private async searchUser(
    @Ctx() ctx: GraphContext,
    @Arg("searchTerm", {
      nullable: true,
      description: "(Optional) Filter users by their names"
    })
    searchTerm: string,
    @Arg("first", { description: "Number of results to fetch" }) first: number,
    @Arg("offset", { description: "Offset the result by how many?" })
    offset: number
  ): Promise<User[] | null> {
    try {
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

      return await UserModel.find({ $text: { $search: searchTerm } })
        .limit(first)
        .skip(offset * first)
        .exec();
    } catch (err) {
      return err;
    }
  }
}
