import { gCall } from "../test-utils/gCall";
import faker from "faker";
import { UserModel } from "../../models/user";
import { CampModel } from "../../models/camp";

describe("Current User Tests", (): void => {
  jest.setTimeout(50000);

  it("should add camp to user's wishlist", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const createdUser = await UserModel.findOne({ email: user.email }).exec();

    if (!createdUser) {
      throw new Error("User not created!");
    }

    const camp = await CampModel.create({
      name: faker.address.streetName(),
      email: faker.internet.email(),
      url: faker.random.alphaNumeric(10),
      shortDescription: faker.lorem.sentence(),
      ownerId: createdUser._id
    });

    const jwtToken = responseRegister.data.createUserByEmail;

    const addWishlistMutation = `
    mutation addCampToWishlist($campId: ObjectId!) {
      addCampToWishlist(campId: $campId)
    }
    `;

    const response = await gCall({
      source: addWishlistMutation,
      variableValues: {
        campId: camp._id
      },
      jwtToken
    });

    expect(response.data.addCampToWishlist).toEqual(true);
  });

  it("should not add camp to user's wishlist (Not logged in)", async (): Promise<
    void
  > => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const createdUser = await UserModel.findOne({ email: user.email }).exec();

    if (!createdUser) {
      throw new Error("User not created!");
    }
    const camp = await CampModel.create({
      name: faker.address.streetName(),
      email: faker.internet.email(),
      url: faker.random.alphaNumeric(10),
      shortDescription: faker.lorem.sentence(),
      ownerId: createdUser._id
    });

    const addWishlistMutation = `
    mutation addCampToWishlist($campId: ObjectId!) {
      addCampToWishlist(campId: $campId)
    }
    `;

    const response = await gCall({
      source: addWishlistMutation,
      variableValues: {
        campId: camp._id
      },
      jwtToken: faker.random.alphaNumeric(20)
    });

    expect(response.errors).toBeDefined();
  });

  it("should not add camp to user's wishlist (Wrong camp id)", async (): Promise<
    void
  > => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const createdUser = await UserModel.findOne({ email: user.email }).exec();

    if (!createdUser) {
      throw new Error("User not created!");
    }

    const jwtToken = responseRegister.data.createUserByEmail;

    const addWishlistMutation = `
    mutation addCampToWishlist($campId: ObjectId!) {
      addCampToWishlist(campId: $campId)
    }
    `;

    const response = await gCall({
      source: addWishlistMutation,
      variableValues: {
        campId: faker.random.alphaNumeric(20)
      },
      jwtToken
    });

    expect(response.errors).toBeDefined();
  });

  it("should remove camp from user's wishlist", async (): Promise<void> => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const createdUser = await UserModel.findOne({ email: user.email }).exec();

    if (!createdUser) {
      throw new Error("User not created!");
    }

    const camp = await CampModel.create({
      name: faker.address.streetName(),
      email: faker.internet.email(),
      url: faker.random.alphaNumeric(10),
      shortDescription: faker.lorem.sentence(),
      ownerId: createdUser._id
    });

    const jwtToken = responseRegister.data.createUserByEmail;

    const addWishlistMutation = `
    mutation addCampToWishlist($campId: ObjectId!) {
      addCampToWishlist(campId: $campId)
    }
    `;

    await gCall({
      source: addWishlistMutation,
      variableValues: {
        campId: camp._id
      },
      jwtToken
    });

    const removeWishlistMutation = `
    mutation removeCampFromWishlist($campId: ObjectId!) {
      removeCampFromWishlist(campId: $campId)
    }
    `;

    const responseRemove = await gCall({
      source: removeWishlistMutation,
      variableValues: {
        campId: camp._id
      },
      jwtToken
    });

    expect(responseRemove.data.removeCampFromWishlist).toEqual(true);
  });

  it("should not remove camp from user's wishlist (Not logged in)", async (): Promise<
    void
  > => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const createdUser = await UserModel.findOne({ email: user.email }).exec();

    if (!createdUser) {
      throw new Error("User not created!");
    }

    const camp = await CampModel.create({
      name: faker.address.streetName(),
      email: faker.internet.email(),
      url: faker.random.alphaNumeric(10),
      shortDescription: faker.lorem.sentence(),
      ownerId: createdUser._id
    });

    const removeWishlistMutation = `
    mutation removeCampFromWishlist($campId: ObjectId!) {
      removeCampFromWishlist(campId: $campId)
    }
    `;

    const responseRemove = await gCall({
      source: removeWishlistMutation,
      variableValues: {
        campId: camp._id
      },
      jwtToken: faker.random.alphaNumeric(20)
    });

    expect(responseRemove.errors).toBeDefined();
  });

  it("should not remove camp from user's wishlist (Wrong camp id)", async (): Promise<
    void
  > => {
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: "validPassword"
    };
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });

    const createdUser = await UserModel.findOne({ email: user.email }).exec();

    if (!createdUser) {
      throw new Error("User not created!");
    }

    const camp = await CampModel.create({
      name: faker.address.streetName(),
      email: faker.internet.email(),
      url: faker.random.alphaNumeric(10),
      shortDescription: faker.lorem.sentence(),
      ownerId: createdUser._id
    });

    const jwtToken = responseRegister.data.createUserByEmail;

    const addWishlistMutation = `
    mutation addCampToWishlist($campId: ObjectId!) {
      addCampToWishlist(campId: $campId)
    }
    `;

    await gCall({
      source: addWishlistMutation,
      variableValues: {
        campId: camp._id
      },
      jwtToken
    });

    const removeWishlistMutation = `
    mutation removeCampFromWishlist($campId: ObjectId!) {
      removeCampFromWishlist(campId: $campId)
    }
    `;

    const responseRemove = await gCall({
      source: removeWishlistMutation,
      variableValues: {
        campId: faker.random.alphaNumeric(20)
      },
      jwtToken
    });

    expect(responseRemove.errors).toBeDefined();
  });
});
