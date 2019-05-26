import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";
import { CampModel } from "../../models/camp";

describe("Get All Camp Tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();
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
      name: chance.name(),
      email: chance.email(),
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
      name: chance.name(),
      email: chance.email(),
      password: passwordHash
    }).save();

    // Add Camp test
    const addCampMutation = `
      mutation addCamp($data: AddCampInput!) {
        addCamp(data: $data){
          id,
          name,
        }
      }
      `;
    const camp = {
      name: chance.street(),
      phoneNumber: campPhoneNumber,
      email: chance.email(),
      url: chance.url(),
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
    console.log(campResponse);

    const campOwnerId = campResponse.data.addCamp.id;
    expect(campResponse.data.addCamp.name).toEqual(campOwner.name);

    const campData = await CampModel.find({ ownerId: campOwnerId });
    const campId = campData[0].id;

    // Get All Camps
    const getCampQuery = `query getCamp($id: String!){
      getCamp(id: $id){
        id,
        name,
        phoneNumber,

      }
    }`;

    const getCampResponse = await gCall({
      source: getCampQuery,
      variableValues: {
        id: campId
      },
      jwtToken
    });
    console.log(getCampResponse);
    console.log(getCampResponse.data.getCamp);
  });
});
