import { Resolver, Query, Mutation } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => String)
  private async hello(): Promise<string> {
    return "Hello World!";
  }
}
