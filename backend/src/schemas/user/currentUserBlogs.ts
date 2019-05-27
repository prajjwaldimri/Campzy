import { Resolver, Query, Ctx } from "type-graphql";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { BlogModel, Blog } from "../../models/blog";
import { ReturnTypeFuncValue } from "type-graphql/dist/decorators/types";

@Resolver()
export class CurrentUserBlogsResolver {
  @Query((): ReturnTypeFuncValue => [Blog])
  private async getCurrentUserBlogs(
    @Ctx() ctx: GraphContext
  ): Promise<Blog[] | null> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      const userData = await UserModel.findById(user.id).exec();

      if (!userData) {
        throw new AuthenticationError("Not Logged in");
      }
      const isUserBlogger = await auth.isUserBlogger(userData);

      if (!isUserBlogger) {
        throw new ForbiddenError(
          "You do not have proper privilege to access this"
        );
      }
      return await BlogModel.find({ authorId: user.id }).exec();
    } catch (err) {
      return err;
    }
  }
}
