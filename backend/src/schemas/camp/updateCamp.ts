import { Resolver, Ctx, Mutation, InputType, Field, Arg } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";
import { IsEmail } from "class-validator";

import { CampModel, Camp } from "../../models/camp";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@InputType()
class UpdateCampInput {
  @Field()
  public id!: string;

  @Field()
  public name!: string;

  @Field()
  public phoneNumber!: string;

  @Field()
  @IsEmail()
  public email!: string;

  @Field()
  public location!: string;

  @Field()
  public gst!: string;

  @Field(() => [String])
  public tags!: [string];

  @Field()
  public ownerId!: string;
}

@Resolver()
export class UpdateCampResolver {
  @Mutation(() => Camp)
  private async updateCamp(
    @Ctx() ctx: GraphContext,
    @Arg("data")
    {
      id,
      name,
      phoneNumber,
      email,
      location,
      gst,
      tags,
      ownerId
    }: UpdateCampInput
  ): Promise<any> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      const userData = await UserModel.findById(user.id).exec();
      const isUserAdmin = auth.isUserAdmin(userData);
      if (userData === null) {
        throw new AuthenticationError("You need to be logged in!");
      }
      if (!isUserAdmin) {
        throw new AuthenticationError("You are not authorised for this!");
      }

      const oldCampData = await CampModel.findById(id, "id ownerId").exec();
      if (!oldCampData) {
        throw new AuthenticationError("You are not authorised for this!");
      }
      await UserModel.findByIdAndUpdate(oldCampData.ownerId, {
        ownedCampId: null,
        type: "Camper"
      }).exec();

      await CampModel.findByIdAndUpdate(id, {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        location: location,
        gst: gst,
        tags: tags,
        ownerId: ownerId
      }).exec();

      return await UserModel.findByIdAndUpdate(ownerId, {
        ownedCampId: id,
        type: "CampOwner"
      }).exec();
    } catch (err) {
      return err;
    }
  }
}
