import { gCall } from "../test-utils/gCall";
import Chance from "chance";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user";
import { CampModel } from "../../models/camp";

describe("Update User Camp Tests", (): void => {
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
    expect(campResponse.data.addCamp.id).toBeDefined();
    expect(campResponse.data.addCamp.name).toEqual(campOwner.name);
    const campOwnerId = campResponse.data.addCamp.id;

    const campData = await CampModel.find({ ownerId: campOwnerId });
    const campId = campData[0].id;

    const LoginQuery = `
      query login($data: LoginUserByEmailInput!) {
      login(data: $data )
    }
    `;

    const response = await gCall({
      source: LoginQuery,
      variableValues: {
        data: {
          email: campOwner.email,
          password: "validPassword"
        }
      }
    });
    // expect(response.data.login).toBeDefined();
    const campOwnerJWT = response.data.login;
    console.log(response.data.login);

    const updateCampMutation = `mutation updateUserCamp($data: UpdateUserCampInput!){
      updateUserCamp(data: $data){
        name,
        tags
      }
    }`;

    const updatedCamp = {
      id: campId,
      name: chance.name(),
      phoneNumber: "+919876542310",
      email: chance.email(),
      shortDescription: chance.string({ length: 50 }),
      longDescription: chance.string({ length: 100 }),
      tags: updatedCampTags,
      url: chance.string({ length: 10 }),
      longitude: chance.longitude().toString(),
      latitude: chance.latitude().toString()
    };

    console.log(updatedCamp);

    const updatedCampResponse = await gCall({
      source: updateCampMutation,
      variableValues: {
        data: updatedCamp
      },
      jwtToken: campOwnerJWT
    });
    console.log(updatedCampResponse);

    // expect(updatedCampResponse.data.updateCamp.name).toEqual(campOwner.name);
  });

  // it("should not update camp (Invalid JWT)", async (): Promise<void> => {
  //   const passwordHash = await bcrypt.hash("validPassword", 12);
  //   const registerMutation = `
  //   mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
  //     createUserByEmail(data: $data)
  //   }
  //   `;

  //   const user = {
  //     name: chance.name(),
  //     email: chance.email(),
  //     password: passwordHash
  //   };
  //   const responseRegister = await gCall({
  //     source: registerMutation,
  //     variableValues: {
  //       data: user
  //     }
  //   });

  //   const dbUser = await UserModel.findOneAndUpdate(
  //     { email: user.email },
  //     { type: "Admin" }
  //   );
  //   expect(dbUser).toBeDefined();
  //   const jwtToken = responseRegister.data.createUserByEmail;

  //   const campOwner = await new UserModel({
  //     name: chance.name(),
  //     email: chance.email(),
  //     password: passwordHash
  //   }).save();

  //   // Add Camp test
  //   const addCampMutation = `
  //   mutation addCamp($data: AddCampInput!) {
  //     addCamp(data: $data){
  //       id
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
  //     jwtToken
  //   });
  //   expect(campResponse.data.addCamp.name).toEqual(campOwner.name);
  //   const campOwnerId = campResponse.data.addCamp.id;

  //   const campData = await CampModel.find({ ownerId: campOwnerId });
  //   const campId = campData[0].id;

  //   const updateCampMutation = `mutation updateCamp($data: UpdateCampInput!){
  //     updateCamp(data: $data){
  //       name
  //     }
  //   }`;

  //   const updatedCamp = {
  //     id: campId,
  //     name: chance.street(),
  //     phoneNumber: "+919876542310",
  //     email: chance.email(),
  //     gst: "GST1254P155",
  //     tags: updatedCampTags,
  //     location: "Chopta",
  //     ownerId: campOwner.id
  //   };

  //   const updatedCampResponse = await gCall({
  //     source: updateCampMutation,
  //     variableValues: {
  //       data: updatedCamp
  //     },
  //     jwtToken: chance.string({ length: 10 })
  //   });

  //   expect(updatedCampResponse.errors).toBeDefined();
  // });

  // it("should not update camp (Invalid Camp Id)", async (): Promise<void> => {
  //   const passwordHash = await bcrypt.hash("validPassword", 12);
  //   const registerMutation = `
  //   mutation CreateUserByEmail($data: CreateUserByEmailInput!) {
  //     createUserByEmail(data: $data)
  //   }
  //   `;

  //   const user = {
  //     name: chance.name(),
  //     email: chance.email(),
  //     password: passwordHash
  //   };
  //   const responseRegister = await gCall({
  //     source: registerMutation,
  //     variableValues: {
  //       data: user
  //     }
  //   });

  //   const dbUser = await UserModel.findOneAndUpdate(
  //     { email: user.email },
  //     { type: "Admin" }
  //   );
  //   expect(dbUser).toBeDefined();
  //   const jwtToken = responseRegister.data.createUserByEmail;

  //   const campOwner = await new UserModel({
  //     name: chance.name(),
  //     email: chance.email(),
  //     password: passwordHash
  //   }).save();

  //   // Add Camp test
  //   const addCampMutation = `
  //   mutation addCamp($data: AddCampInput!) {
  //     addCamp(data: $data){
  //       id
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
  //     jwtToken
  //   });
  //   expect(campResponse.data.addCamp.name).toEqual(campOwner.name);

  //   const updateCampMutation = `mutation updateCamp($data: UpdateCampInput!){
  //     updateCamp(data: $data){
  //       name
  //     }
  //   }`;

  //   const updatedCamp = {
  //     id: "123456987012121545451213",
  //     name: chance.street(),
  //     phoneNumber: "+919876542310",
  //     email: chance.email(),
  //     gst: "GST1254P155",
  //     tags: updatedCampTags,
  //     location: "Chopta",
  //     ownerId: campOwner.id
  //   };

  //   const updatedCampResponse = await gCall({
  //     source: updateCampMutation,
  //     variableValues: {
  //       data: updatedCamp
  //     },
  //     jwtToken
  //   });

  //   expect(updatedCampResponse.errors).toBeDefined();
  // });
});
