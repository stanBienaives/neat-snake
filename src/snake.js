import Cell from './cell';

export default class Snake {
  constructor(length, board, brain) {
    this._body = [];
    this.init(length);
    this.board = board;
    this.brain = brain || this.defaultBrain;
  }

  get cherry() {
    return this.board.cherry;
  }


  get head() {
    return this._body[0];
  }

  get tail() {
    return this._body[this.length -1];
  }

  get length() {
    return this._body.length;
  }

  get body() {
    return this._body;
  }

  move() {
    const [x,y] = this.brain(this.sensors());
    const newHead = new Cell(this.head.x + x, this.head.y + y)
    this._shadowTail = this._body.pop();
    this._body.unshift(newHead);
    console.log(this.sensors());
  }

  get shadowTail() {
    return this._shadowTail;
  }

  sensors() {
    // distanceto Wall
    const size = this.board.size;

    const distanceToWalls = [
      this.head.x + 1,
      size - this.head.x,
      this.head.y + 1,
      size - this.head.y,
    ]
    // distance to cherry
    const cherryX = this.head.x - this.cherry.x;
    const cherryY = this.head.y - this.cherry.y;
    const distanceToCherry = [
      (cherryX > 0)? cherryX : 0,
      (cherryX < 0)? Math.abs(cherryX) : 0,
      (cherryY > 0)? cherryY : 0,
      (cherryY < 0)? Math.abs(cherryY) : 0,
    ]

    const distanceToBody = this.bodySensors();


    const sensor =  distanceToWalls.concat(distanceToCherry).concat(distanceToBody);
    return sensor;

    // distance to body
  }

  bodySensors() {
    const x = this.head.x;
    const y = this.head.y;

    const [right, left, up, bottom] = [0,0,0,0];

    for(const cell in this._body) {
       if (cell.x == x && cell.y <= y)
          up = y - cell.y;
       if (cell.x == x && cell.y <= y)
          bottom = cell.y - y;
       if (cell.y == y && cell.x <= x)
          left = cell.x - x;
        if(cell.y == y && cell.x >= x)
          right = cell.y - y;
    }
    return [right, left, up , bottom];

  }
  
  isDead() {
    for(const [index, cell] of this._body.entries()) {
      if (!index) 
        continue;

      if (this.head.x == cell.x && this.head.y == cell.y)
        return true;
    }
    return false;
  }

  defaultBrain(sensors) {
    let x = Math.round(Math.random())*2 - 1;
    let y = Math.round(Math.random())*2 - 1;
    (Math.random() < 0.5)?  x = 0 : y = 0;
    x = 0;
    y = 1;

    return [x, y];
  }


  
  init(length) {
    let [startx, starty] = [15, 15];
    const head = new Cell(startx, starty); 
    this._body.push(head);
    while(this._body.length < length) {
      startx +=1;
      const cell = new Cell(startx, starty);
      this._body.push(cell);
    }
  }

}