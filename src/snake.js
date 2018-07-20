const Cell = require('./cell');

class Snake {
  constructor(length, brain, boardSize = 20) {
    this._body = [];
    this.boardSize = boardSize;
    this.brain = brain || this.defaultBrain;
  }

  get head() {
    return this._body[0];
  }

  get tail() {
    return this._body[this.length - 1];
  }

  get length() {
    return this._body.length;
  }

  get body() {
    return this._body;
  }

  /**
   * Decide the next move base on direction given
   * @param {string} direction direction toward wich the snake should move
   * if undefined the brain takes over;
   * @returns {undefined}
   */
  moveDirection(direction) {
    let [x, y] = [0, 0];

    switch (direction) {
    case 'left':
      [x, y] = [-1, 0];
      break;

    case 'right':
      [x, y] = [1, 0];
      break;

    case 'up':
      [x, y] = [0, -1];
      break;

    case 'down':
      [x, y] = [0, 1];
      break;

    default:
      [x, y] = [0, 0];
    }
    this._move([x, y]);
  }

  /**
   * Decide direction from brain
   * @param  {Cell} cherry cherry position
   * @param  {number} boardSize size of the board
   * @returns {undefined}
   */
  move(cherry, boardSize) {
    const sensors = this.sensors(cherry, boardSize);
    const [x, y] = this.brain(sensors);

    this._move([x, y]);
  }

  /**
   * Decide the next move base on the brain behaviour
   * @param {number} x, move left
   * @param {number}  y move right
   * if undefined the brain takes over;
   * @returns {undefined}
   */
  _move([x, y]) {
    if (this.isDead())
      return;

    const newHead = new Cell(this.head.x + x, this.head.y + y);

    this._shadowTail = this._body.pop();
    this._body.unshift(newHead);
  }

  /**
   * Eat the given cell
   * @returns {undefined}
   */
  eat() {
    this.body.push(this._shadowTail);
    delete this._shadowTail;
  }

  /**
   * Shadow tail
   *
   */
  get shadowTail() {
    return this._shadowTail;
  }

  /**
   * Returns sensors as array
   * @param  {Cell} cherry cherry position
   * @param  {number} boardSize  size of the board
   * @returns {Array} array of sensors
   */
  sensors(cherry, boardSize) {
    const cherrySensor = this.cherrySensor(cherry);
    const boardSensors = this.boardSensors(boardSize);
    const bodySensors = this.bodySensors();

    return [
      cherrySensor.x,
      cherrySensor.y,
      boardSensors.up,
      boardSensors.right,
      boardSensors.left,
      boardSensors.down,
      bodySensors.up,
      bodySensors.right,
      bodySensors.left,
      bodySensors.down,
    ];
  }

  bodySensors() {
    const {x, y} = this.head;

    let [right, left, up, down] = [9, 9, 9, 9];


    for (const cell of this.body.slice(0).reverse()) {

      if (cell.x === this.head.x && cell.y === this.head.y)
        break;

      if (cell.x === x && cell.y <= y)
        up = y - cell.y - 1;
      if (cell.x === x && cell.y >= y)
        down = cell.y - y - 1;
      if (cell.y === y && cell.x <= x)
        left = x - cell.x - 1;
      if (cell.y === y && cell.x >= x)
        right = cell.x - x - 1;
    }

    return {
      right,
      left,
      up,
      down,
    };

  }

  /**
   * Board sensors
   * @param  {number} boardSize size of the board
   * @returns {object} directions
   */
  boardSensors(boardSize) {
    return {
      up   : this.head.y,
      down : boardSize - this.head.y - 1,
      left : this.head.x,
      right: boardSize - this.head.x - 1,
    };
  }

  /**
   * Detect position from the cherry
   * @param  {Cell} cherry position of the cherry
   * @return {object} {x, y}
   */
  cherrySensor(cherry) {
    return {
      x: cherry.x - this.head.x,
      y: cherry.y - this.head.y,
    };
  }

  isDead() {

    if (this.isOverlapping())
      return true;

    if (!this.insideBox(this.boardSize))
      return true;

    return false;
  }

  insideBox(size) {
    if (this.head.x < 0 || this.head.y < 0)
      return false;

    if (this.head.x >= size || this.head.y >= size)
      return false;

    return true;

  }

  isOverlapping() {
    for (const [index, cell] of this.body.entries()) {
      if (index && this.head.x === cell.x && this.head.y === cell.y)
        return true;
    }

    return false;
  }

  defaultBrain(sensors) {
    let x = Math.round(Math.random()) * 2 - 1;
    let y = Math.round(Math.random()) * 2 - 1;

    Math.random() < 0.5 ? x = 0 : y = 0;
    x = 0;
    y = 1;

    return [x, y];
  }


  static fromArray(positions, boardSize) {
    const snake = new Snake(positions.length, null, boardSize);

    for (let index = 0; index < positions.length; index += 1) {
      snake.body.push(new Cell(...positions[index]));

      if (positions[index + 1]) {
        const move = Math.abs(positions[index][0] - positions[index + 1][0]) + Math.abs(positions[index][1] - positions[index + 1][1]);

        if (move !== 1)
          throw new Error('Invalid snake');
      }

    }

    return snake;

  }

}
module.exports = Snake;