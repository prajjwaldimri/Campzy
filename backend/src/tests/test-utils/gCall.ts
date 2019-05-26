import { graphql, GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import Maybe from "graphql/tsutils/Maybe";

interface Options {
  source: string;
  variableValues?: Maybe<{ [key: string]: any }>;
  jwtToken?: string;
}

let schema: GraphQLSchema;

export const gCall = async ({
  source,
  variableValues,
  jwtToken
}: Options): Promise<any> => {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [
        __dirname + "/../../schemas/**/*.resolver.ts",
        __dirname + "/../../schemas/**/*.ts"
      ]
    });
  }
  try {
    return await graphql({
      schema,
      source,
      variableValues,
      contextValue: {
        req: {
          headers: {
            authorization: `Bearer ${jwtToken}`
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
