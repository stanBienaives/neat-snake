const Tournament = require('genetic-tournament');
const Game = require('./game');
const NeuralNetwork = require('./neural-network');
const Log = require('./log.js');
const fs = require('fs');

console.log(Log);


const seed = () => {
  const nn = new NeuralNetwork();

  return nn;
};

const mutate = (nn) => {
  
  const dna = nn.clone().getDna();
  const eject = Math.floor(Math.random() * dna.length);
  const replace = Math.floor(Math.random() * dna.length);

  dna[eject] = dna[replace];
  const clonie = nn.clone().setDna(dna);

  if (!clonie instanceof NeuralNetwork )
    throw new Error('not a NN');
  return clonie;
};

const crossover = (mother, father) => {

  const dnaMother = mother.clone().getDna();
  const dnaFather = father.clone().getDna();
  const cut1 = Math.floor(Math.random() * dnaMother.length);
  const cut2 = Math.floor(Math.random() * dnaMother.length - cut1);

  const dnaDauther = dnaMother
    .slice(0, cut1)
    .concat(dnaFather.slice(cut1, cut2))
    .concat(dnaMother.slice(cut2, dnaMother.length));

  const dnaBrother = dnaFather
    .slice(0, cut1)
    .concat(dnaMother.slice(cut1, cut2))
    .concat(dnaFather.slice(cut2, dnaMother.length));

  const dauther = mother.clone().setDna(dnaDauther);
  const brother = mother.clone().setDna(dnaBrother);


  if (!dauther instanceof NeuralNetwork )
    throw new Error('not a NN');
  if (!brother instanceof NeuralNetwork )
    throw new Error('not a NN');

  return brother;
};

const fitness = (nn) => {
  const game = new Game((sensors) => {
    const output = nn.predict(sensors);
    return directionFromScalar(output);
  });

  while (!game.gameOver)
    game.iterate();

  return game.score;

};

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


const tournament = new Tournament({
  seed,
  fitness,
  mutate,
  crossover,
  config: {
    size      : 200,
    iterations: 2000,
    survivals : 10,
  },
});

console.log('tournament start');
tournament.evolve();

console.log('tournament end');

fs.writeFileSync('best-dna.json', JSON.stringify(tournament.best.getDna()));