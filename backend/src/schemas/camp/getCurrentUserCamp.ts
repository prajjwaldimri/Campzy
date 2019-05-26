import { Resolver, Ctx, Query } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { CampModel, Camp } from "../../models/camp";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class GetCurrentUserCampResolver {
  @Query(() => Camp)
  private async getCurrentUserCamp(@Ctx() ctx: GraphContext): Promise<any> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      const userData = await UserModel.findById(user.id).exec();
      if (!userData) {
        throw new AuthenticationError("You need to be logged in!");
      }
      const isUserCampOwner = await auth.isUserCampOwner(userData);
      if (!isUserCampOwner) {
        throw new AuthenticationError("You are not authorised for this!");
      }

      return await CampModel.findById({ _id: userData.ownedCampId })
        .populate("ownerId", "name")
        .exec();
    } catch (err) {
      return err;
    }
  }
}
