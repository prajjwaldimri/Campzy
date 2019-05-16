import { graphql } from "graphql";
import { buildSchema } from "type-graphql";
import Maybe from "graphql/tsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

export const gCall = async ({
  source,
  variableValues
}: Options): Promise<any> => {
  try {
    return graphql({
      schema: await buildSchema({
        resolvers: [
          __dirname + "/../../src/schemas/**/*.resolver.ts",
          __dirname + "/../../src/schemas/**/*.ts"
        ]
      }),
      source,
      variableValues
    });
  } catch (error) {
    console.log(error);
  }
};
