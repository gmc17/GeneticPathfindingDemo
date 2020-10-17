let mutationRate = 0.01;
let popSize = 200;

let populationThetas = [];
let populationPositions = [];
let fitnesses = [];
let fitnessesArray = [];

let startPositionX = 250;
let startPositionY = 250;

let desiredPositionX = 700;
let desiredPositionY = 700;


let totalFitness;
let totalGenerations = 1;

let numOfMovements = 10;
let framesPerTheta = 60;
let speed = 0.35;

let frameNum = 0;
let framesPerSecond = 10;

let birds = [];
let centerOfMassX;
let centerOfMassY;

const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

class Bird {
  //constructor
  constructor(posX, posY, index) {
    this.posX=posX;
    this.posY=posY;
    this.vX = 0;
    this.vY = 0;
    this.radius=5;
    this.thetas=populationThetas[index];
  }
  //movement
  update(frameNum) {
    let i=Math.floor(frameNum/framesPerTheta);
    this.aX = Math.cos(this.thetas[i]);
    this.aY = Math.sin(this.thetas[i]);
    this.vX += speed*this.aX/framesPerSecond;
    this.vY += speed*this.aY/framesPerSecond;
    this.posX += this.vX/framesPerSecond;
    this.posY += this.vY/framesPerSecond;
    this.display();
  }
  //display
  display() {
    stroke(0);
    fill(255);
    circle(this.posX, this.posY, this.radius);
  }
  distance() {
    return Math.sqrt((desiredPositionX-this.posX)*(desiredPositionX-this.posX)+(desiredPositionY-this.posY)*(desiredPositionY-this.posY));
  }
}

function distance(x, y) {
  return Math.sqrt((desiredPositionX-x)*(desiredPositionX-x)+(desiredPositionY-y)*(desiredPositionY-y));
}

function createChild(parent1Theta, parent2Theta, fitness1, fitness2) {
  let theta = [];
  for (let i=0; i<numOfMovements; i++) {
    let rand = Math.random();
    let mutationRand = Math.random();
    if (mutationRand<mutationRate) {
      theta[i]=Math.random()*2*Math.PI;
    } else if (rand>fitness1/(fitness1+fitness2)) {
      theta[i]=parent2Theta[i];
    } else {
      theta[i]=parent1Theta[i];
    }
  }
  return theta;
}

function createRandTheta() {
  let theta = [];
  for (let i=0; i<numOfMovements; i++) {
    theta[i] = Math.random()*2*Math.PI;
  }
  return theta;
}

function getFitness(x, y) {
  let distance = Math.sqrt((desiredPositionX-x)*(desiredPositionX-x)+(desiredPositionY-y)*(desiredPositionY-y));
  return 100/(distance*distance);
}

function chooseFitMember() {
  let rand = Math.random()*totalFitness;
  let i=0;
  while (fitnessesArray[i]<rand) {
    i++;
  }
  return i;
}

function createArrays() {
  totalFitness=0;
  for (let i=0; i<popSize; i++) {
    let fitness = getFitness(birds[i].posX, birds[i].posY);
    
    fitnesses[i] = fitness;
    totalFitness += fitness;
    fitnessesArray[i] = totalFitness;
  }
}

function createNewGeneration() {
  createArrays();
  for (let i=0; i<popSize; i++) {
    let indexParent1 = chooseFitMember();
    let indexParent2 = chooseFitMember();
    let parent1Theta = populationThetas[indexParent1];
    let parent2Theta = populationThetas[indexParent2];
    let fitness1 = fitnesses[indexParent1];
    let fitness2 = fitnesses[indexParent2];
    populationThetas[i] = createChild(parent1Theta, parent2Theta, fitness1, fitness2);
  }
  for (let i=0; i<popSize; i++) {
    birds[i] = new Bird(startPositionX, startPositionY, i);
  }
}

function calculateBestScorer() {
  let bestFitness=0;
  let indexOfBestFitness;
  for (let i=0; i<popSize; i++) {
    if (getFitness(birds[i].posX, birds[i].posY)>bestFitness) {
      indexOfBestFitness=i;
      bestFitness = getFitness(birds[i].posX, birds[i].posY);
    }
  }
  return indexOfBestFitness;
}

function findCenterOfMassX() {
  let total=0;
  for (let i=0; i<popSize; i++) {
    total+=birds[i].posX;
  }
  let average=total/popSize;
  return average;
}

function findCenterOfMassY() {
  let total=0;
  for (let i=0; i<popSize; i++) {
    total+=birds[i].posY;
  }
  let average=total/popSize;
  return average;
}

function setup() {
  createCanvas(800, 800);
  background(220);

  populationThetas = [];
  fitnesses = [];
  fitnessesArray = [];
  totalGenerations = 1;

  for (let i=0; i<popSize; i++) {
    populationThetas[i]=createRandTheta();
  }
  frameRate(100);
  birds = [];
  for (let i=0; i<popSize; i++) {
    birds[i] = new Bird(startPositionX, startPositionY, i);
  }
  frameNum=0;
}

function restart() {
  populationThetas = [];
  fitnesses = [];
  fitnessesArray = [];
  if (document.getElementById("numOfMovements").value.length !== 0) {
    numOfMovements =  document.getElementById("numOfMovements").value;
  }
  if (document.getElementById("popSize").value.length !== 0) {
    popSize = document.getElementById("popSize").value;
  }
  if (document.getElementById("mutationRate").value.length !== 0) {
    mutationRate = (document.getElementById("mutationRate").value)/100;
  }
  if (document.getElementById("speed").value.length !== 0) {
    speed = (document.getElementById("speed").value);
  }
  for (let i=0; i<popSize; i++) {
    populationThetas[i]=createRandTheta();
  }
  frameRate(100);
  birds = [];
  for (let i=0; i<popSize; i++) {
    birds[i] = new Bird(startPositionX, startPositionY, i);
  }
  frameNum=0;
  setup();
}

function reset() {
  mutationRate = 0.01;
  popSize = 400;

  populationThetas = [];
  populationPositions = [];
  fitnesses = [];
  fitnessesArray = [];

  startPositionX = 200;
  startPositionY = 200;

  desiredPositionX = 700;
  desiredPositionY = 700;


  totalFitness;
  totalGenerations = 1;

  numOfMovements = 10;
  framesPerTheta = 60;
  speed = 0.35;

  frameNum = 0;
  framesPerSecond = 10;

  birds = [];
  centerOfMassX;
  centerOfMassY;

  setup();
}

function draw() {
  background(255);
  if (frameNum>framesPerTheta*numOfMovements-1) {
    createNewGeneration();
    totalGenerations++;
    frameNum=0;
  } else {
    for (let i=0; i<popSize; i++) {
      birds[i].update(frameNum);
    }
    fill('rgba(0,150,250, 0.35)');
    circle(findCenterOfMassX(), findCenterOfMassY(), 20);
    noFill();
  }
  
  frameNum++;
  let totalDistance=0;
  for (let i=0; i<popSize; i++) {
    totalDistance+=distance(birds[i].posX, birds[i].posY);
  }
  let averageDistance=totalDistance/popSize;
  

  fill('rgba(10,240,0, 0.55)');
  rect(desiredPositionX, desiredPositionY, 30, 30, 5);
  fill(0);
  let indexOfBestFitness = calculateBestScorer();
  textFont('Courier');
  textSize(30);
  text("Best Scorer: " + Math.floor(birds[indexOfBestFitness].distance()), 10, 40);
  textSize(12);
  textSize(20);
  text("Generation: " + totalGenerations + "  Mutation Rate: " + 100*mutationRate + "%" + "  Average distance from goal: " + Math.floor(averageDistance), 10, 76);
  text("Number of specimen bred: " + totalGenerations*popSize + "  Speed: " + speed, 10, 110);
  text("Number of direction changes: " + numOfMovements, 10, 144);
}

