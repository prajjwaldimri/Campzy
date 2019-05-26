import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Add Camp Tests", (): void => {
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
        name
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
    expect(campResponse.data.addCamp.name).toEqual(campOwner.name);

    const loginQuery = `query login($data: LoginUserByEmailInput!){
      login(data: $data)
    }`;

    const loginCredientials = {
      email: campOwner.email,
      password: "validPassword"
    };
    const loginResponse = await gCall({
      source: loginQuery,
      variableValues: {
        data: loginCredientials
      }
    });
    const jwtTokenCamper = loginResponse.data.login;

    const getCurrentUserCampQuery = `query getCurrentUserCamp{
      getCurrentUserCamp{
        name
      }
    }`;

    const currentUserCampRes = await gCall({
      source: getCurrentUserCampQuery,
      jwtToken: jwtTokenCamper
    });
    expect(currentUserCampRes.data.getCurrentUserCamp.name).toEqual(camp.name);
  });

  it("should not return camp (Invalid JWT)", async (): Promise<void> => {
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
        name
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
    expect(campResponse.data.addCamp.name).toEqual(campOwner.name);

    const getCurrentUserCampQuery = `query getCurrentUserCamp{
      getCurrentUserCamp{
        name
      }
    }`;

    const currentUserCampRes = await gCall({
      source: getCurrentUserCampQuery,
      jwtToken: chance.string({ length: 20 })
    });
    expect(currentUserCampRes.errors).toBeDefined();
  });
});
