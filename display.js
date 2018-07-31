import m from "mithril";
import Game  from './src/game.js';


const size = 30;

class State  {
  constructor() {
    this.game = new Game();
    this._pause = false;
  }

  get matrix () {
    return this.game.matrix;
  }

  get isPaused() {
    return this._pause;
  }

  iterate () {
    if (!this.game.gameOver)
      return this.game.iterate();
    this.game = new Game();
  } 

  tooglePause() {
    this._pause = !this._pause;
  }
}

const state = new State();


const board = {
  oninit: () => {
    setInterval(() => {
      if (!state.isPaused) {
        state.iterate();
        m.redraw();
      }
    }, 300);
  },
  view: () => {

    return m('.board', {
      style: {
        "grid-template-columns": `repeat(${size}, auto)`, 
        "grid-template-rows": `repeat(${size}, auto)`, 
      },
      onclick: () => state.tooglePause(),
    }, state.matrix.map((line) => {
      return line.map((cell) => m('.cell',{
        class: (!cell)? 'white' : (cell == 1)? 'black' : 'red',
      }, cell));
    }));
  },
};

const log = {
  view: () => {
    return m('.log', state.game.fitness)
  },
};

const playground = document.querySelector('.playground');
const logs = document.querySelector('.logs');

m.mount(playground, board);
m.mount(logs, log);