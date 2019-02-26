import m from "mithril";
import Game  from './src/game.js';
import NeuralNetwork from './src/neural-network'
import best from './best-dna.json';

console.log(best);


const size = 30;

class State  {
  constructor(brain) {
    this.brain = brain;
    this.game = new Game(this.brain);
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
   this.game = new Game(this.brain);
  } 

  tooglePause() {
    this._pause = !this._pause;
  }
}

const brain = new NeuralNetwork();
brain.setDna(best);

const state = new State((sensors) => {
  const output = brain.predict(sensors);

  return directionFromScalar(output);
});

const directionFromScalar = (output) => {
  if (output < 0.25)
    // Left
    return [0, -1];

  if (output < 0.5)
    // Up
    return [-1, 0];

  if (output < 0.75)
    // Right
    return [0, 1];

  // Bottom
  return [1, 0];
};



const board = {
  oninit: () => {
    setInterval(() => {
      if (!state.isPaused) {
        state.iterate();
        m.redraw();
      }
    }, 30);
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