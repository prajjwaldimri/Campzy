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
  public shortDescription!: string;

  @Field()
  public longDescription!: string;

  @Field()
  public longitude!: string;

  @Field()
  public latitude!: string;

  @Field()
  public url!: string;

  @Field(() => [String])
  public tags!: [string];
}

@Resolver()
export class UpdateCampResolver {
  @Mutation(() => Camp)
  private async updateUserCamp(
    @Ctx() ctx: GraphContext,
    @Arg("data")
    {
      id,
      name,
      phoneNumber,
      email,
      shortDescription,
      longDescription,
      url,
      latitude,
      longitude,
      tags
    }: UpdateCampInput
  ): Promise<any> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      const userData = await UserModel.findById(user.id).exec();
      if (!userData) {
        throw new AuthenticationError("You need to be logged in!");
      }
      const isUserCampOwner = auth.isUserCampOwner(userData);

      if (!isUserCampOwner) {
        throw new AuthenticationError("You are not authorised for this!");
      }

      return await CampModel.findByIdAndUpdate(id, {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        shortDescription: shortDescription,
        longDescription: longDescription,
        tags: tags,
        url: url,
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      }).exec();
    } catch (err) {
      return err;
    }
  }
}
