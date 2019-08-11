import { start_game } from "../js/Main.js";

jasmine.getFixtures().fixturesPath = "/";

describe("Cell.js", () => {
  let game;

  describe("Initial Load", () => {
    let cellElement;

    beforeAll(function() {
      loadFixtures("game.html");
      game = start_game();
      cellElement = game.els.layout.querySelector(".cell");
    });

    it("should have the configuration set", () => {
      expect(cellElement.element).not.toBeNull();
      expect(cellElement.row).not.toBeNull();
      expect(cellElement.column).not.toBeNull();
    });
  });
});
