const Board = require('./board');
const NeuralNetwork = require('./neural-network');

class Game {

  constructor (brain) {
    this.board = new Board(30, brain, this.defaultSnakeCells());
  }

  get gameOver() {
    return this.board.gameOver();
  }

  get matrix() {
    return this.board.getMatrix();
  }

  get fitness() {
    return this.score;
  }

  get score() {
    return this.board.score;
  }

  iterate() {
    this.board.moveSnake();
    if (this.board.gameOver())
      console.log('dead');
  }

  defaultSnakeCells() {
    return [
      [11, 11],
      [11, 12],
      [11, 13],
      [11, 14],
      [12, 14],
      [13, 14],
      [14, 14],
      [15, 14],
      [15, 13],
      [15, 12],
    ];
  }


}

module.exports = Game;