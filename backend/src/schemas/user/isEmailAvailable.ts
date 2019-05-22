import { Query, Resolver, Arg } from "type-graphql";
import { UserModel } from "../../models/user";
import { Validator } from "class-validator";
import { UserInputError } from "apollo-server-core";

@Resolver()
export class EmailAvailableResolver {
  @Query(() => Boolean)
  private async isEmailAvailable(
    @Arg("email") email: string
  ): Promise<boolean> {
    try {
      let validator = new Validator();
      if (!validator.isEmail(email)) {
        throw new UserInputError("Email is not valid!");
      }
      const user = await UserModel.findOne({ email: email });
      if (user) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return err;
    }
  }
}