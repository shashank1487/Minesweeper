import { start_game } from "../js/Main.js";

jasmine.getFixtures().fixturesPath = "/";

describe("Layout.js", () => {
  let game;
  describe("Initial Load", () => {
    beforeAll(function() {
      loadFixtures("game.html");
      game = start_game();
    });

    it("should have the configuration set", () => {
      expect(game.layout.dimension).toBe(10);
      expect(game.layout.mineCount).toBe(10);
      expect(game.layout.element.className).toBe("game-layout");
      expect(game.layout.cells.length).toBe(10);
    });
  });
});
