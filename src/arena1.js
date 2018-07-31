import * as Genetic from 'genetic-js';
import NeuralNetwork from './neural-network';
import Game from './game';

const genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

genetic.NeuralNetwork = NeuralNetwork;
genetic.Game = Game;


genetic.seed = function seed() {
  const nn = new NeuralNetwork();
  
  return nn;
}

genetic.mutate = function mutate(nn) {
  const dna = nn.clone().getDna();
  const eject = Math.floor(Math.random() * dna.length)
  const replace = Math.floor(Math.random() * dna.length)
  dna[eject] = dna[replace]; 
  nn.setDna(dna);

  return nn;
}

genetic.crossover = function crossover(mother, father) {
  const dnaMother = mother.clone().getDna();
  const dnaFather = father.clone().getDna();
  const cut1 = Math.floor(Math.random()* dnaMother.length);
  const cut2 = Math.floor(Math.random()* dnaMother.length - cut1);

  const dnaDauther = dnaMother.slice(0,cut1).concat(dnaFather.slice(cut1, cut2)).concat(dnaMother.slice(cut2, dnaMother.length));
  const dnaBrother = dnaFather.slice(0,cut1).concat(dnaMother.slice(cut1, cut2)).concat(dnaFather.slice(cut2, dnaMother.length));

  const dauther = mother.clone().setDna(dnaDauther);
  const brother = mother.clone().setDna(dnaBrother);

  return [dauther, brother];
}


genetic.fitness = function fitness(nn) {
  const game = new Game((sensors) => {
    const output = nn.predict(sensors);
    return directionFromScalar(output);
  })

  while(!game.gameOver)
    game.iterate();
  
  // console.log(game.score);
  return game.score;
}

genetic.notification = function(pop, generation, stats, isFinished) {
  console.log('pop', pop)
  console.log('pop', generation)
  console.log('stats', stats)
  console.log('isFinished', isFinished)
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

console.log('coucou');
var config = {
  "iterations": 4000
  , "size": 250
  , "crossover": 0.3
  , "mutation": 0.3
  , "skip": 20
  // , "webWorkers": 2
};

genetic.evolve = function(config) {
  var k;
		for (k in config) {
			this.configuration[k] = config[k];
    }
  this.start.bind(genetic)();
};


genetic.start = function() {
  var i;
  var self = this;
    
  function mutateOrNot(entity) {
    // applies mutation based on mutation probability
    return Math.random() <= self.configuration.mutation && self.mutate ? self.mutate(entity) : entity;
  }
  
  // seed the population
  for (i=0;i<this.configuration.size;++i)  {
    this.entities.push(this.seed());
  }

	for (i=0;i<this.configuration.iterations;++i) {
    // reset for each generation
    this.internalGenState = {};
    
    // score and sort
    var pop = this.entities
      .map(function (entity) {
        return {"fitness": self.fitness(entity), "entity": entity };
      })
      .sort(function (a, b) {
        return self.optimize(a.fitness, b.fitness) ? -1 : 1;
      });
    

    // generation notification
    var mean = pop.reduce(function (a, b) { return a + b.fitness; }, 0)/pop.length;
    var stdev = Math.sqrt(pop
      .map(function (a) { return (a.fitness - mean) * (a.fitness - mean); })
      .reduce(function (a, b) { return a+b; }, 0)/pop.length);
      
    var stats = {
      "maximum": pop[0].fitness
      , "minimum": pop[pop.length-1].fitness
      , "mean": mean
      , "stdev": stdev
    };


    var r = this.generation ? this.generation(pop, i, stats) : true;
    var isFinished = (typeof r != "undefined" && !r) || (i == this.configuration.iterations-1);
    
    if (
      this.notification
      && (isFinished || this.configuration["skip"] == 0 || i%this.configuration["skip"] == 0)
    ) {
      this.sendNotification(pop.slice(0, this.maxResults), i, stats, isFinished);
    }


    if (isFinished)
      break;
    
    // crossover and mutate
    var newPop = [];
    
    if (this.configuration.fittestAlwaysSurvives) // lets the best solution fall through
      newPop.push(pop[0].entity);
          
    // crossover and mutate
    var newPop = [];
    
    if (this.configuration.fittestAlwaysSurvives) // lets the best solution fall through
      newPop.push(pop[0].entity);
    
    while (newPop.length < self.configuration.size) {
      if (
        this.crossover // if there is a crossover function
        && Math.random() <= this.configuration.crossover // base crossover on specified probability
        && newPop.length+1 < self.configuration.size // keeps us from going 1 over the max population size
      ) {
        var parents = this.select2(pop);
        var children = this.crossover(parents[0], parents[1]).map(mutateOrNot);
        newPop.push(children[0], children[1]);
      } else {
        newPop.push(mutateOrNot(self.select1(pop)));
      }
    }
    
    this.entities = newPop;

  }


}

genetic.evolve(config);


