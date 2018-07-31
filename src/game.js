const Board = require('./board');
const NeuralNetwork = require('./neural-network');

class Game {

  constructor (brain) {
    this.board = new Board(30, brain = brain2, this.defaultSnakeCells());
  }

  get gameOver() {
    return this.board.snake.isDead();
  }

  get matrix() {
    return this.board.getMatrix();
  }

  get fitness() {
    return this.board.score;
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


const brain2 = function(sensors) {
  const nn = new NeuralNetwork();
  const output = nn.predict(sensors);

  return directionFromScalar(output);
}

const directionFromScalar = function(output) {
  if (output < 0.25)
    return [0,-1]; //left
  if (output < 0.5)
    return [-1,0]; //up
  if (output < 0.75)
    return [0,1]; //right

  return [1,0]; //bottom
}


module.exports = Game;