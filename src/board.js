const Snake = require('./snake');
const Cell = require('./cell');

class Board {

  constructor(size, brain, snakeCells) {
    this._size = size;
    this.matrix = this.generateEmptyMatrix();
    this._iteraction = 0;

    this.snake = Snake.fromArray(snakeCells, brain, size);
    this.addCherry();

    this.drawSnake();
    this._score = 0;
  }

  get cherry() {
    return this._cherry;
  }

  get size() {
    return this._size;
  }

  get score() {
    return this._score;
  }

  generateEmptyMatrix() {
    return Array(this.size)
      .fill()
      .map(() => {
        return Array(this.size)
          .fill()
          .map(() => 0);
      });
  }

  getMatrix() {
    return this.matrix;
  }

  setValue(cell, value) {
    this.matrix[cell.x][cell.y] = value;
  }

  getVal(cell) {
    return this.matrix[cell.x][cell.y];
  }

  addCherry(cell = this.randomCell()) {
    this._cherry = cell;
    this.setValue(cell, 2);
  }

  randomCell() {
    const randomVal = () => Math.floor(Math.random() * (this.size - 1));

    return new Cell(randomVal(), randomVal());
  }


  moveSnake(direction) {
    if (direction)
      this.snake.moveDirection(direction);
    else
      this.snake.move(this.cherry, this.size);

    if (this.snake.isDead(this.size))
      return;

    if (this.snake.head.isEqual(this.cherry)) {
      this.snake.eat();
      this._score += 1;
      this.addCherry();
    }

    this.drawSnake();
  }

  drawSnake() {
    this.snake.body.forEach((cell) => this.setValue(cell, 1));
    if (this.snake._shadowTail)
      this.setValue(this.snake._shadowTail, 0);
  }

  gameOver() {
    return this.snake.isDead(this.size);
  }

}

module.exports = Board;