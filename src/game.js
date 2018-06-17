import Board from './board';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export default class Game {

  constructor () {
    this.board = new Board(30, brain1);
  }

  get matrix() {
    return this.board.getMatrix();
  }

  get fitness() {
    return this.board.score;
  }

  iterate() {
    this.board.moveSnake();
    if (this.board.gameOver())
      console.log('dead');
  }


}


const brain1 = function(sensors) {

  if(sensors[0] <= 1)
    return [0,-1]; //left

  if(sensors[3] <= 1)
    return [-1,0]; //up
    // return [0,1]; //right

  if(sensors[1] <= 1)
    return [0,1]; //right

  if(sensors[2] <= 1)
    return [1,0]; //bottom


  // return [1,0]; //bottom
  // return [-1,0]; //up
  // return [0,1]; //right
  return [0,-1]; //left

}