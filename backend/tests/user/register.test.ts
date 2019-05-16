import { gCall } from "../test-utils/gCall";

describe("User Register", (): void => {
  const registerMutation = ``;
  it("should create a user", async (): Promise<void> => {
    console.log(
      await gCall({
        source: registerMutation
      })
    );
  });
});
