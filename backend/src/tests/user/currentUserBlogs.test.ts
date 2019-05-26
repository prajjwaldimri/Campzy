import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";
import { BlogModel } from "../../models/blog";

describe("Retrieving blogs of current logged in blogger tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();

  it("should return blog of logged in blogger", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash,
      type: "Blogger"
    }).save();

    const createdBlog = await new BlogModel({
      title: chance.sentence(),
      description: chance.sentence(),
      url: chance.string({ length: 10 }),
      content: chance.paragraph(),
      heroImage: chance.avatar({ protocol: "https" }),
      heroImageCaption: chance.sentence(),
      authorId: user._id
    }).save();

    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
        login(data: $data )
      }
    `;

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: user.email,
          password: "validPassword"
        }
      }
    });
    const jwtToken = response.data.login;

    const getCurrentUserBlogsQuery = `
      query {
        getCurrentUserBlogs {
          title,
          description
        }
      }
    `;

    const getCurrentUserBlogsResponse = await gCall({
      source: getCurrentUserBlogsQuery,
      jwtToken
    });

    expect(getCurrentUserBlogsResponse.data.getCurrentUserBlogs).toHaveLength(
      1
    );
    expect(
      getCurrentUserBlogsResponse.data.getCurrentUserBlogs[0].title
    ).toEqual(createdBlog.title);
  });

  it("should not return blog of logged in blogger (Not logged in)", async (): Promise<
    void
  > => {
    const getCurrentUserBlogsQuery = `
      query {
        getCurrentUserBlogs {
          title,
          description
        }
      }
    `;

    const getCurrentUserBlogsResponse = await gCall({
      source: getCurrentUserBlogsQuery,
      jwtToken: chance.string({ length: 10 })
    });

    expect(getCurrentUserBlogsResponse.errors).toBeDefined();
    expect(getCurrentUserBlogsResponse.data).toBeNull();
  });

  it("should not return blog of logged in blogger (Not a blogger)", async (): Promise<
    void
  > => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: chance.name(),
      email: chance.email(),
      password: passwordHash
    }).save();

    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
        login(data: $data )
      }
    `;

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: user.email,
          password: "validPassword"
        }
      }
    });
    const jwtToken = response.data.login;

    const getCurrentUserBlogsQuery = `
      query {
        getCurrentUserBlogs {
          title,
          description
        }
      }
    `;

    const getCurrentUserBlogsResponse = await gCall({
      source: getCurrentUserBlogsQuery,
      jwtToken
    });

    expect(getCurrentUserBlogsResponse.errors).toBeDefined();
    expect(getCurrentUserBlogsResponse.data).toBeNull();
  });
});
