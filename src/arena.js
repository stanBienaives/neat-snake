const Tournament = require('genetic-tournament');
const Game = require('./game');
const NeuralNetwork = require('./neural-network');

// import * as Tournament from 'genetic-tournament';
// import Game from './game';
// import NeuralNetwork from './neural-network';
// import { cpus } from 'os';

const seed = () => {
  const nn = new NeuralNetwork();

  return nn;
};

const mutate = (nn) => {
  console.log('mutate');
  const dna = nn.clone().getDna();
  const eject = Math.floor(Math.random() * dna.length);
  const replace = Math.floor(Math.random() * dna.length);

  dna[eject] = dna[replace];
  nn.setDna(dna);

  return nn;
};

const crossover = (mother, father) => {
  console.log('crossover');
  const dnaMother = mother.clone().getDna();
  const dnaFather = father.clone().getDna();
  const cut1 = Math.floor(Math.random() * dnaMother.length);
  const cut2 = Math.floor(Math.random() * dnaMother.length - cut1);

  const dnaDauther = dnaMother.slice(0, cut1).concat(dnaFather.slice(cut1, cut2)).concat(dnaMother.slice(cut2, dnaMother.length));
  const dnaBrother = dnaFather.slice(0, cut1).concat(dnaMother.slice(cut1, cut2)).concat(dnaFather.slice(cut2, dnaMother.length));

  const dauther = mother.clone().setDna(dnaDauther);
  const brother = mother.clone().setDna(dnaBrother);

  return [dauther, brother];
}

const fitness = (nn) => {
  const game = new Game((sensors) => {
    const output = nn.predict(sensors);
    return directionFromScalar(output);
  })

  while(!game.gameOver)
    game.iterate();
  
  return game.score;

}

const directionFromScalar = function(output) {
  if (output < 0.25)
    return [0,-1]; //left
  if (output < 0.5)
    return [-1,0]; //up
  if (output < 0.75)
    return [0,1]; //right

  return [1,0]; //bottom
}

var config = {
  "iterations": 40
  , "size": 250
  , "crossover": 0.3
  , "mutation": 0.3
  , "skip": 20
  // , "webWorkers": 2
};


const tournament = new Tournament({
  seed,
  fitness,
  mutate,
  crossover,
  config: {
    size: 2,
    iterations: 2,
  }
});

tournament.evolve();

console.log(tournament.best);


