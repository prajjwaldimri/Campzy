import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";

describe("Add Camp Tests", (): void => {
  jest.setTimeout(50000);
  let chance = new Chance();
  const campPhoneNumber = `+919690046216`;
  const campTags = ["Mountain", "Leh", "Chopta"];
  const updatedCampTags = ["Mountain", "Leh", "Chopta", "Snow"];

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
        id
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
    console.log(campResponse);
    expect(campResponse.data.addCamp.id).toBeDefined();
    expect(campResponse.data.addCamp.name).toEqual(camp.name);
    const campId = campResponse.data.addCamp.id;

    const updateCampMutation = `mutation updateCamp($data: UpdateCampInput!){
      updateCamp(data: $data){
        name

      }
    }`;

    const updatedCamp = {
      id: campId,
      name: chance.street(),
      phoneNumber: "+919876542310",
      email: chance.email(),
      gst: "GST1254P155",
      tags: updatedCampTags,
      location: "Chopta",
      ownerId: campOwner.id
    };

    const updatedCampResponse = await gCall({
      source: updateCampMutation,
      variableValues: {
        data: updatedCamp
      },
      jwtToken
    });

    console.log(updatedCampResponse);
    expect(updatedCampResponse.data.updateCamp.name).toEqual(campOwner.name);
  });

  // it("should not return camp(Invlaid JWT)", async (): Promise<void> => {
  //   const passwordHash = await bcrypt.hash("validPassword", 12);

  //   const campOwner = await new UserModel({
  //     name: chance.name(),
  //     email: chance.email(),
  //     password: passwordHash
  //   }).save();

  //   // Add Camp test
  //   const addCampMutation = `
  //   mutation addCamp($data: AddCampInput!) {
  //     addCamp(data: $data){
  //       name
  //     }
  //   }
  //   `;
  //   const camp = {
  //     name: chance.street(),
  //     phoneNumber: campPhoneNumber,
  //     email: chance.email(),
  //     url: chance.url(),
  //     tags: campTags,
  //     location: "Chopta",
  //     ownerId: campOwner.id
  //   };

  //   const campResponse = await gCall({
  //     source: addCampMutation,
  //     variableValues: {
  //       data: camp
  //     },
  //     jwtToken: chance.string({ length: 10 })
  //   });
  //   expect(campResponse.errors).toBeDefined();
  // });
});
