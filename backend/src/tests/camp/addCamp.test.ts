import { gCall } from "../test-utils/gCall";
import faker from "faker";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Add Camp Tests", (): void => {
  jest.setTimeout(50000);
  const campPhoneNumber = `+919690046216`;
  const campTags = ["Mountain", "Leh", "Chopta"];
  it("should return camp", async (): Promise<void> => {
    const LoginQuery = `
    query login($data: LoginUserByEmailInput!) {
    login(data: $data )
  }
  `;
    const passwordHash = await bcrypt.hash("validPassword", 12);
    const user = await new UserModel({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: passwordHash
    }).save();

    const dbUser = await UserModel.findOneAndUpdate(
      { email: user.email },
      { type: "Admin" }
    );
    expect(dbUser).toBeDefined();

    const adminUser = await UserModel.findOne({ email: user.email });
    console.log(adminUser);

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: user.email,
          password: "validPassword"
        }
      }
    });

    console.log(response);
    expect(response).toBeDefined();

    const jwtToken = response.login;
    console.log(jwtToken);

    const campOwner = await new UserModel({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password: passwordHash
    }).save();
    // Add Camp test
    const addCampMutation = `
    mutation addCamp($data: AddCampInput!) {
      addCamp(data: $data){
        id
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
      owernId: campOwner.id
    };
    console.log(camp);

    const campResponse = await gCall({
      source: addCampMutation,
      variableValues: {
        data: camp
      },
      jwtToken
    });
    console.log(campResponse);
  });
});
