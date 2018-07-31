
class Cell {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  isEqual(cell) {
    return cell.x === this.x && cell.y === this.y;
  }
}


module.exports = Cell;