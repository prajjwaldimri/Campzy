import { Resolver, Ctx, Query } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { CampModel, Camp } from "../../models/camp";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class CountCampsResolver {
  @Query(() => Camp)
  private async countCamps(@Ctx() ctx: GraphContext): Promise<any> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      const userData = await UserModel.findById(user.id).exec();
      if (!userData) {
        throw new AuthenticationError("You need to be logged in!");
      }
      const isUserAdmin = auth.isUserAdmin(userData);

      if (!isUserAdmin) {
        throw new AuthenticationError("You are not authorised for this!");
      }
      const count = await CampModel.estimatedDocumentCount({}).exec();
      return {
        count
      };
    } catch (err) {
      return err;
    }
  }
}
