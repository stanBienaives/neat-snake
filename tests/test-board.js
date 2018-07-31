const test = require('ava');
const Board = require('../src/board');
const Cell = require('../src/cell');

test('Board should be instantiated', (_t) => {
  const board = new Board(5, null , [
    [0, 0],
  ]);

  _t.true(board.cherry instanceof Cell);
  _t.is(board.getMatrix()[0].length, 5);
  _t.is(board.getMatrix().length, 5);
  _t.is(board.getMatrix().length, 5);

});

test('Values on snake should be 1', (_t) => {
  const board = new Board(5, null , [
    [0, 0],
    [1, 0],
    [2, 0],
  ]);

  _t.is(board.getMatrix()[0][0], 1);
  _t.is(board.getMatrix()[1][0], 1);
  _t.is(board.getMatrix()[2][0], 1);
  _t.not(board.getMatrix()[0][1], 1);

});

test('Should ', (_t) => {
  const board = new Board(5, null, [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);

  _t.is(board.score, 0);

  const cherry = new Cell(1, 0);

  board.addCherry(cherry);
  board.moveSnake('right');

  _t.deepEqual(board.snake.head, cherry);
  _t.is(board.score, 1);

});