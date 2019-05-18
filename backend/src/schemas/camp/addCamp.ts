import { Resolver, Ctx, Mutation, InputType, Field, Arg } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { GraphContext } from "graphcontext";
import { IsEmail } from "class-validator";

import { CampModel, Camp } from "../../models/camp";
import { UserModel } from "../../models/user";
import * as auth from "../../config/auth";

@InputType()
class AddCampInput {
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
  public url!: string;

  @Field()
  public tags!: string[];

  @Field()
  public ownerId!: string;
}
@Resolver()
export class AddCampResolver {
  @Mutation(() => Camp)
  private async addCamp(
    @Ctx() ctx: GraphContext,
    @Arg("data")
    { name, phoneNumber, email, location, url, tags, ownerId }: AddCampInput
  ): Promise<any> {
    try {
      const user = await auth.getAuthenticatedUser(ctx.req);
      const userData = await UserModel.findById(user.id);
      const isUserAdmin = auth.isUserAdmin(userData);
      if (userData === null) {
        throw new AuthenticationError("You need to be logged in!");
      }
      if (!isUserAdmin) {
        throw new AuthenticationError("You are not authorised for this!");
      }
      const camp = new CampModel({
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        shortDescription: "Unfilled Description",
        location: location,
        url: url,
        tags: tags,
        ownerId: ownerId
      });

      const createdCamp = await camp.save();
      return await UserModel.findByIdAndUpdate(ownerId, {
        ownedCampId: createdCamp.id,
        type: "CampOwner"
      });
    } catch (err) {
      return err;
    }
  }
}
