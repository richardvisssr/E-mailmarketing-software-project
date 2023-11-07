"use strict";

const Player = require("../player");

test("jest environment works", () => {
  expect(0).toEqual(0);
});

test("creates a new player with a state equal to null when no state is provided", () => {
  const p = new Player();
  expect(p.state).toEqual(null);
});

test("create a player with default initial values", async () => {
  const p = new Player();
  const description = await p.startNew();

  expect(description).toEqual("a town");
});

describe("location stuff", () => {
  let testPlayer;

  beforeEach(async () => {
    testPlayer = new Player();
    await testPlayer.startNew();
  });

  test("get description and exits of the current location", () => {
    const expectedResult = {
      description: "a town",
      exits: ["forest", "mountain"],
    };

    const result = testPlayer.getLocationInformation();

    expect(result).toEqual(expectedResult);
  });

  test("moving to an existing reachable location", async () => {
    const expectedResult = "a forest";

    const result = await testPlayer.goToLocation("forest");

    expect(result).toEqual(expectedResult);
  });

  test("moving to a non-existing location", async () => {
    const expectedResult = "a town";

    const result = await testPlayer.goToLocation("dubai");

    expect(result).toEqual(expectedResult);
  });

  test("moving to a non-reachable location", async () => {
    const expectedResult = "a town";

    const result = await testPlayer.goToLocation("bali");

    expect(result).toEqual(expectedResult);
  });
});
