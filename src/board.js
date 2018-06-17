import Snake from './snake.js';
import Cell from './cell.js';

export default class Board  {

  constructor(size, brain) {
    this._size = size;
    this.matrix = this.generateEmptyMatrix();

    this.snake = new Snake(10, this, brain);
    this.addCherry();
    // const snake = new Snake(5);
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
    return Array(this.size).fill().map((_, i) => {
      return Array(this.size)
        .fill()
        .map((_, i) => 0);
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

  addCherry(cell= this.randomCell()) {
    this._cherry = cell;
    this.setValue(cell, 2);
  }

  randomCell() {
    const randomVal = () => Math.floor(Math.random() * this.size)
    return new Cell(randomVal(), randomVal());
  }


  moveSnake() {
    this.snake.move();
    this.drawSnake()
    this.collectPoints();
  }

  drawSnake() {
    this.snake.body.forEach((cell) => this.setValue(cell, 1));
    if (this.snake._shadowTail)
      this.setValue(this.snake._shadowTail, 0);
  }

  gameOver() {
    return this.snake.isDead();
  }

  collectPoints() {
    if (this.snake.head.x == this.cherry.x && this.snake.head.y == this.cherry.y) {
      this._score += 1;
      this.addCherry();
    }
  }

}
