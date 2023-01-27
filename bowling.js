export class Game {
  constructor() {
    this.framesInAGame = 10;
    this.bonusFrameNumber = this.framesInAGame + 1; // the extra rolls are saved in an 11th 'bonus' frame
    this.frames = [new Frame()];
  }

  roll(pins) {
    if (this.gameHasFinished()) return false;
    this.currentFrame().roll(pins);
    this.advanceFrameIfNeeded();
    return true;
  }

  score() {
    let score = 0;
    this.frames.forEach((frame, rawIndex) => {
      const frameNumber = rawIndex + 1;

      if (frameNumber > this.framesInAGame) return;

      score += frame.totalPins();
      if (frame.isSpare()) score += this.getNextRoll(frameNumber);
      if (frame.isStrike())
        score +=
          this.getNextRoll(frameNumber) + this.getRollAfterNext(frameNumber);
    });

    return score;
  }

  gameHasFinished() {
    return (
      this.currentFrameNumber() > this.framesInAGame && !this.shouldRollExtra()
    );
  }

  advanceFrameIfNeeded() {
    if (
      this.currentFrameNumber() <= this.framesInAGame &&
      this.currentFrame().isComplete()
    )
      this.advanceFrame();
  }

  advanceFrame() {
    this.frames.push(new Frame());
  }

  currentFrameNumber() {
    return this.frames.length;
  }

  currentFrame() {
    return this.getFrame(this.currentFrameNumber());
  }

  shouldRollExtra() {
    const lastGameFrame = this.getFrame(this.framesInAGame);
    const bonusFrame = this.getFrame(this.bonusFrameNumber);

    return (
      (lastGameFrame.isStrike() && !bonusFrame.rolledTwice()) ||
      (lastGameFrame.isSpare() && !bonusFrame.rolledOnce())
    );
  }

  getNextRoll(frameNumber) {
    return this.getFrame(frameNumber + 1).getRoll(1);
  }

  getRollAfterNext(frameNumber) {
    const nextFrame = this.getFrame(frameNumber + 1);
    if (nextFrame.rolledTwice()) return nextFrame.getRoll(2);

    return this.getFrame(frameNumber + 2).getRoll(1);
  }

  getFrame(frameNumber) {
    return this.frames[frameNumber - 1];
  }

  // used to debug
  pp() {
    return this.frames
      .map((f, i) => i + 1 + " [ " + f.rolls.join(", ") + " ]")
      .join("\n");
  }
}

export class Frame {
  constructor() {
    this.rolls = [];
  }

  roll(pins) {
    this.rolls.push(pins);
  }

  isStrike() {
    return this.rolledOnce() && this.totalPins() === 10;
  }

  isSpare() {
    return this.rolledTwice() && this.totalPins() === 10;
  }

  isComplete() {
    return this.isStrike() || this.rolledTwice();
  }

  rolledTwice() {
    return this.rolls.length === 2;
  }

  rolledOnce() {
    return this.rolls.length === 1;
  }

  totalPins() {
    return (this.getRoll(1) || 0) + (this.getRoll(2) || 0);
  }

  getRoll(rollNumber) {
    return this.rolls[rollNumber - 1];
  }
}
