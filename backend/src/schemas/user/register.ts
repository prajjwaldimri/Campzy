import { Resolver, Query, Mutation } from "type-graphql";
import { User } from "../../models/user";

@Resolver()
export class UserResolver {
  @Query(() => User)
  private async hello(): Promise<User> {
    return new User();
  }
}
