import { gCall } from "../test-utils/gCall";
import faker from "faker";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Add Camp Tests", (): void => {
  jest.setTimeout(50000);
  const campPhoneNumber = `+919690046216`;
  const campTags = ["Mountain", "Leh", "Chopta"];

  it("should return camp", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const registerMutation = `
    mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
      createUserByEmail(data: $data)
    }
    `;

    const user = {
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: passwordHash
    };
    const responseRegister = await gCall({
      source: registerMutation,
      variableValues: {
        data: user
      }
    });
    console.log(responseRegister);

    const dbUser = await UserModel.findOneAndUpdate(
      { email: user.email },
      { type: "Admin" }
    );
    expect(dbUser).toBeDefined();
    const jwtToken = responseRegister.data.createUserByEmail;

    const campOwner = await new UserModel({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: passwordHash
    }).save();

    // Add Camp test
    const addCampMutation = `
    mutation addCamp($data: AddCampInput!) {
      addCamp(data: $data){
        name
      }
    }
    `;
    const camp = {
      name: faker.name.findName(),
      phoneNumber: campPhoneNumber,
      email: faker.internet.email(),
      url: faker.internet.url(),
      tags: campTags,
      location: "Chopta",
      ownerId: campOwner.id
    };

    const campResponse = await gCall({
      source: addCampMutation,
      variableValues: {
        data: camp
      },
      jwtToken
    });
    expect(campResponse.data.addCamp.name).toEqual(campOwner.name);
  });

  it("should not return camp(Invlaid JWT)", async (): Promise<void> => {
    const passwordHash = await bcrypt.hash("validPassword", 12);

    const campOwner = await new UserModel({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: passwordHash
    }).save();

    // Add Camp test
    const addCampMutation = `
    mutation addCamp($data: AddCampInput!) {
      addCamp(data: $data){
        name
      }
    }
    `;
    const camp = {
      name: faker.name.findName(),
      phoneNumber: campPhoneNumber,
      email: faker.internet.email(),
      url: faker.internet.url(),
      tags: campTags,
      location: "Chopta",
      ownerId: campOwner.id
    };

    const campResponse = await gCall({
      source: addCampMutation,
      variableValues: {
        data: camp
      },
      jwtToken: faker.random.alphaNumeric(20).toString()
    });
    expect(campResponse.errors).toBeDefined();
  });
});
