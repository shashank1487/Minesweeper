import { start_game } from "../js/Main.js";
import * as Constants from "../utils/Constants.js";
import { flattenArray } from "../utils/Helper.js";

jasmine.getFixtures().fixturesPath = "/";

describe("Game.js", () => {
  let game,
    game_on_level_change,
    game_custom_level,
    game_event_left,
    game_event_right;

  describe("Initial Load", () => {
    beforeAll(function() {
      loadFixtures("game.html");
      game = start_game();
    });

    it("should have the corresponding html elements set in the els object", () => {
      expect(game.els.error.className).toBe("game-error");
      expect(game.els.layout.className).toBe("game-layout");
      expect(game.els.level.className).toBe("game-level");
      expect(game.els.mine.className).toBe("game-mines-count");
      expect(game.els.restart.className).toBe("game-restart");
      expect(game.els.time.className).toBe("game-time");
    });

    it("should have the level of the game set to beginner", () => {
      expect(parseInt(game.els.level.value)).toBe(1);
    });

    it("should have the mine count text set to 0", () => {
      expect(game.els.mine.textContent).toBe("10 of 10 mine left");
    });

    it("should have the timer text set to the user score", () => {
      expect(game.els.time.textContent).toBe("Your score: 0");
    });

    it("should have the button text set to restart", () => {
      expect(game.els.restart.textContent).toBe("Restart");
    });

    it("should have the dimension set to 10", () => {
      expect(parseInt(game.dimension)).toBe(10);
    });

    it("should have the mine count set to 10", () => {
      expect(parseInt(game.mineCount)).toBe(10);
    });

    it("should have the user mine count set to 10", () => {
      expect(parseInt(game.userMineCount)).toBe(10);
    });
  });

  describe("On game level change", () => {
    beforeAll(function() {
      loadFixtures("game.html");
      game_on_level_change = start_game();
    });

    it("should update the game configuration on level change", () => {
      const selectValue = 2;
      const selectElement = game_on_level_change.els.level;
      spyOn(selectElement, "onchange").and.callThrough();
      selectElement.value = selectValue;
      selectElement.dispatchEvent(new Event("change"));

      const levelObject = Constants.LEVELS[selectValue];
      expect(parseInt(game_on_level_change.els.level.value)).toBe(2);
      expect(game_on_level_change.els.mine.textContent).toBe(
        `${levelObject.mineCount} of ${levelObject.mineCount} mine left`
      );
      expect(game_on_level_change.els.time.textContent).toBe("Your score: 0");
      expect(game_on_level_change.els.restart.textContent).toBe("Restart");
      expect(parseInt(game_on_level_change.dimension)).toBe(
        levelObject.dimension
      );
      expect(parseInt(game_on_level_change.mineCount)).toBe(
        levelObject.mineCount
      );
      expect(parseInt(game_on_level_change.userMineCount)).toBe(
        levelObject.mineCount
      );
      expect(selectElement.onchange).toHaveBeenCalled();
    });
  });

  describe("On custom level selection", () => {
    const dimension = 12;
    const selectValue = 4;

    beforeAll(function() {
      loadFixtures("game.html");
      game_custom_level = start_game();
      spyOn(window, "prompt").and.returnValue(dimension);
      const selectElement = game_custom_level.els.level;
      selectElement.value = selectValue;
      selectElement.dispatchEvent(new Event("change"));
    });

    it("should display a prompt", () => {
      expect(window.prompt).toHaveBeenCalledWith(
        "Please provide the dimension?",
        "10"
      );
    });

    it("should update the mine count to 20% of the the total cells ", () => {
      const mineCount = Math.floor(0.2 * dimension * dimension);
      expect(game_custom_level.mineCount).toBe(mineCount);
    });

    it("should update the game configuration on custom level change", () => {
      const mineCount = Math.floor(0.2 * dimension * dimension);
      expect(parseInt(game_custom_level.els.level.value)).toBe(selectValue);
      expect(game_custom_level.els.mine.textContent).toBe(
        `${mineCount} of ${mineCount} mine left`
      );
      expect(game_custom_level.els.time.textContent).toBe("Your score: 0");
      expect(game_custom_level.els.restart.textContent).toBe("Restart");
      expect(parseInt(game_custom_level.dimension)).toBe(dimension);
      expect(parseInt(game_custom_level.mineCount)).toBe(mineCount);
      expect(parseInt(game_custom_level.userMineCount)).toBe(mineCount);
    });
  });

  describe("On left click", () => {
    let layoutElement, firstElement, mineCellElement;

    beforeAll(function() {
      loadFixtures("game.html");
      game_event_left = start_game();
      layoutElement = game_event_left.els.layout;
      firstElement = layoutElement.querySelector(".cell");
      spyOn(firstElement, "onclick").and.stub();
      spyOn(window, "alert").and.stub();
    });

    it("should set the clicked cell as revealed", () => {
      firstElement.click();
      let flattenedData = flattenArray(game_event_left.layout.cells);
      let clickedCellElement = flattenedData.find(cell => cell.isRevealed);
      expect(clickedCellElement.isRevealed).toBe(true);
    });
  });

  describe("On right click", () => {
    let layoutElement, firstElement;

    beforeAll(function() {
      loadFixtures("game.html");
      game_event_right = start_game();
      layoutElement = game_event_right.els.layout;
      firstElement = layoutElement.querySelector(".cell");
      spyOn(firstElement, "oncontextmenu").and.returnValue(false);
    });

    it("should call the right click handler on right click", () => {
      firstElement.dispatchEvent(new CustomEvent("contextmenu"));
      let flattenedData = flattenArray(game_event_right.layout.cells);
      expect(firstElement.oncontextmenu).toHaveBeenCalled();
    });
  });
});
