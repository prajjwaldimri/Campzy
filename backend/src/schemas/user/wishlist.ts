/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ObjectId } from "mongodb";
import { Mutation, Resolver, Ctx, Arg } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";

import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";
import { ObjectIdScalar } from "../../../types/objectIdScalar";

@Resolver()
export class WishlistResolver {
  @Mutation(() => Boolean)
  private async addCampToWishlist(
    @Ctx() ctx: GraphContext,
    @Arg("campId", type => ObjectIdScalar) campId: ObjectId
  ): Promise<boolean> {
    try {
      const loggedInUser = await auth.getAuthenticatedUser(ctx.req);
      if (!loggedInUser) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const userData = await UserModel.findById(loggedInUser.id).select(
        "wishlist"
      );
      if (!userData || userData.wishlist === undefined) {
        throw new AuthenticationError("You need to be logged in!");
      }
      userData.wishlist.push(campId);
      await userData.save();

      return true;
    } catch (err) {
      return err;
    }
  }

  @Mutation(() => Boolean)
  private async removeCampFromWishlist(
    @Ctx() ctx: GraphContext,
    @Arg("campId", type => ObjectIdScalar) campId: ObjectId
  ): Promise<boolean> {
    try {
      const loggedInUser = await auth.getAuthenticatedUser(ctx.req);
      if (!loggedInUser) {
        throw new AuthenticationError("You need to be logged in!");
      }

      const userData = await UserModel.findById(loggedInUser.id).select(
        "wishlist"
      );
      if (!userData || userData.wishlist === undefined) {
        throw new AuthenticationError("You need to be logged in!");
      }
      if (userData.wishlist.indexOf(campId) > -1) {
        userData.wishlist.splice(userData.wishlist.indexOf(campId), 1);
      }
      await userData.save();

      return true;
    } catch (err) {
      return err;
    }
  }
}
