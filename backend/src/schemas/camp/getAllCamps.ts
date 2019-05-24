import { Resolver, Ctx, Query, Arg } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { CampModel, Camp } from "../../models/camp";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@Resolver()
export class GetAllCampsResolver {
  @Query(() => Camp)
  private async getAllCamps(
    @Ctx() ctx: GraphContext,
    @Arg("page") page: number
  ): Promise<any> {
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

      return await CampModel.find({})
        .populate("ownerId", "name")
        .limit(8)
        .skip((page - 1) * 8)
        .exec();
    } catch (err) {
      return err;
    }
  }
}
