import { Resolver, Query, Mutation, Arg } from "type-graphql";

export class LoginResolver {
  @Query(() => String)
  private async login() {
    return "Login!";
  }
}
