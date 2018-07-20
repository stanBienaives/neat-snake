const test = require('ava');
const Snake = require('../src/snake');
const Cell = require('../src/cell');

test('Check moves', (_t) => {
  const snake = Snake.fromArray([
    [0, 1],
  ]);

  _t.is(1, snake.length);
  snake.moveDirection('right');
  _t.deepEqual([new Cell(1, 1)], snake.body);
  snake.moveDirection('left');
  _t.deepEqual([new Cell(0, 1)], snake.body);
  snake.moveDirection('up');
  _t.deepEqual([new Cell(0, 0)], snake.body);
  snake.moveDirection('down');
  _t.deepEqual([new Cell(0, 1)], snake.body);

});

test('Cannot create an invalid snake', (_t) => {

  const {message} = _t.throws(() => {
    const snake = Snake.fromArray([
      [0, 0],
      [1, 1],
    ]);
  });

  _t.is(message, 'Invalid snake');

});

test('Overlapping snake should be dead', (_t) => {
  const snakeAlive = Snake.fromArray([
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 0],
  ]);

  _t.false(snakeAlive.isOverlapping());

  const snakeDead = Snake.fromArray([
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 0],
  ]);

  _t.true(snakeDead.isOverlapping());
});

test('Snake far left off the board should be deak', (_t) => {
  const snake = Snake.fromArray([
    [0, 0],
  ]);

  snake.moveDirection('left');
  _t.false(snake.insideBox(2));

});

test('Snake far up off e board should be deak', (_t) => {
  const snake = Snake.fromArray([
    [0, 0],
  ]);

  snake.moveDirection('up');
  _t.false(snake.insideBox(2));

});

test('Snake far right off  the board should be deak', (_t) => {
  const snake = Snake.fromArray([
    [0, 0],
  ]);

  snake.moveDirection('right');
  _t.true(snake.insideBox(2));
  _t.false(snake.insideBox(1));

});

test('Snake far bottom off  the board should be deak', (_t) => {
  const snake = Snake.fromArray([
    [0, 0],
  ]);

  snake.moveDirection('down');
  _t.true(snake.insideBox(2));
  _t.false(snake.insideBox(1));
});

test('when snake moves it should keep the same length', (_t) => {
  const snake = Snake.fromArray([
    [0, 1],
  ]);

  _t.is(1, snake.length);
  snake.moveDirection('right');
  snake.moveDirection('right');
  snake.moveDirection('right');
  snake.moveDirection('right');
  _t.is(1, snake.length);
});


test('when snake eats it', (_t) => {
  const snake = Snake.fromArray([
    [0, 1],
  ]);

  snake.moveDirection('right');
  snake.eat();
  _t.is(2, snake.length);

  _t.deepEqual([new Cell(1, 1), new Cell(0, 1)], snake.body);

});


test('Sensors should detect self', (_t) => {
  const snake = Snake.fromArray([
    [1, 2],
    [2, 2],
    [2, 1],
    [2, 0],
    [1, 0],
    [0, 0],
  ]);


  _t.deepEqual(snake.bodySensors(), {
    up   : 1,
    right: 0,
    down : 9,
    left : 9,
  });
});

test('Sensors should detect self', (_t) => {
  const snake = Snake.fromArray([
    [1, 2],
    [2, 2],
    [2, 1],
    [2, 0],
    [1, 0],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 4],
  ]);


  _t.deepEqual(snake.bodySensors(), {
    up   : 1,
    right: 0,
    down : 1,
    left : 0,
  });
});


test('Sensor should see position the cherry', (_t) => {
  const snake = Snake.fromArray([
    [0, 0],
  ]);

  const cherry = new Cell(1, 2);

  snake.cherrySensor(cherry);

  _t.deepEqual(snake.cherrySensor(cherry), {
    x: 1,
    y: 2,
  });

});

test('Sensor should see position the cherry', (_t) => {
  const snake = Snake.fromArray([
    [1, 2],
  ]);

  const cherry = new Cell(0, 0);

  snake.cherrySensor(cherry);

  _t.deepEqual(snake.cherrySensor(cherry), {
    x: -1,
    y: -2,
  });

});

test('Sensor should detect border of the board', (_t) => {
  const snake = Snake.fromArray([
    [1, 2],
  ]);

  const boardSize = 5;

  _t.deepEqual(snake.boardSensors(boardSize), {
    up   : 2,
    left : 1,
    right: 3,
    down : 2,
  });

});