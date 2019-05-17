import { graphql, GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import Maybe from "graphql/tsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues
}: Options): Promise<any> => {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [
        __dirname + "/../../src/schemas/**/*.resolver.ts",
        __dirname + "/../../src/schemas/**/*.ts"
      ]
    });
  }
  try {
    return graphql({
      schema,
      source,
      variableValues
    });
  } catch (error) {
    console.log(error);
  }
};