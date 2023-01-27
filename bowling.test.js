import { Game } from "./bowling";

const roll = (game, rolls) => {
  let response;
  rolls.forEach((pins) => {
    response = game.roll(pins);
  });
  return response;
};

const sum = (rolls) => rolls.reduce((sum, pins) => sum + pins, 0);

const nineFrames = [1, 0, 2, 0, 3, 0, 10, 5, 0, 6, 0, 7, 3, 8, 0, 9, 0];

describe("Bowling Game Frames", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  it("starts with frame 1", () => {
    expect(game.currentFrameNumber()).toBe(1);
  });

  it("stays in the same frame after rolling 1 pin down", () => {
    game.roll(1);
    expect(game.currentFrameNumber()).toBe(1);
  });

  it("moves to the second frame after rolling twice", () => {
    roll(game, [1, 5]);
    expect(game.currentFrameNumber()).toBe(2);
  });

  it("moves to the second frame after a strike", () => {
    roll(game, [10]);
    expect(game.currentFrameNumber()).toBe(2);
  });

  it("finishes the game after 10th frame w/ no bonus", () => {
    const rolledLastOne = roll(game, [...nineFrames, 1, 0, 1]);
    expect(rolledLastOne).toBe(false);
  });

  it("gives 2 bonus rolls after 10th strike", () => {
    const rolledLastOne = roll(game, [...nineFrames, 10, 1, 2]);
    expect(rolledLastOne).toBe(true);
    expect(game.roll(1)).toBe(false);
  });

  it("gives bonus roll after 10th spare", () => {
    const rolledLastOne = roll(game, [...nineFrames, 1, 9, 1]);
    expect(rolledLastOne).toBe(true);
    expect(game.roll(1)).toBe(false);
  });

  it("finishes the game after extra ball", () => {
    const rolledLastOne = roll(game, [...nineFrames, 10, 1, 2]);
    expect(rolledLastOne).toBe(true);
    expect(game.roll(1)).toBe(false);
  });
});

describe("Bowling Game Score", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  it("starts with score 0", () => {
    expect(game.score()).toBe(0);
  });

  it("score is the number of pins after 1 roll < 10", () => {
    game.roll(5);
    expect(game.score()).toBe(5);
  });

  it("score is the number of pins after multiple strikes < 10", () => {
    const rolls = [1, 2, 3, 4, 4, 5];
    roll(game, rolls);
    expect(game.score()).toBe(sum(rolls));
  });

  it("adds bonus of 1 roll after spare", () => {
    const rolls = [1, 2, 3, 7, 4, 5];
    roll(game, rolls);
    expect(game.score()).toBe(sum(rolls) + 4);
  });

  it("adds bonus of 2 rolls in non-strike frame after strike", () => {
    const rolls = [1, 2, 10, 2, 3, 4, 5];
    roll(game, rolls);
    expect(game.score()).toBe(sum(rolls) + 5);
  });

  it("adds bonus of 2 rolls in strike frame after strike", () => {
    const rolls = [10, 10, 3, 4, 5];
    roll(game, rolls);
    expect(game.score()).toBe(sum(rolls) + 20);
  });

  it("adds bonus of 2 rolls after strike in last frame", () => {
    const rolls = [
      1, 0, 1, 0, 3, 0, 1, 4, 5, 0, 6, 2, 7, 1, 8, 0, 9, 0, 10, 2, 3,
    ];
    roll(game, rolls);
    expect(game.score()).toBe(sum(rolls));
  });

  it("adds bonus of 1 roll after spare in last frame", () => {
    const rolls = [
      1, 0, 1, 0, 3, 0, 3, 4, 2, 4, 6, 3, 7, 1, 8, 0, 9, 0, 2, 8, 1,
    ];
    roll(game, rolls);
    expect(game.score()).toBe(sum(rolls));
  });
});
