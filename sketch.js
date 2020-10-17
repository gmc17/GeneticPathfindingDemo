let mutationRate = 0.006;
let popSize = 200;

let populationThetas = [];
let fitnesses = [];
let fitnessesArray = [];

let startPositionX = 100;
let startPositionY = 250;

let desiredPositionX = 700;
let desiredPositionY = 700;
let goalRadius = 40;

let totalFitness;
let averageFitness;
let totalGenerations = 1;

let numOfMovements = 8;
let framesPerTheta = 60;
let speed = 1;

let frameNum = 0;
let framesPerSecond = 10;

let birds = [];
let obstacles = [];

let numOfObstacles = 20;

let obstacleX = [];
let obstacleY = [];
let obstacleRadii = [];

let centerOfMassX;
let centerOfMassY;
let averageDistances = [];
let averageFitnesses = [];

const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

class Bird {
  //constructor
  constructor(posX, posY, index) {
    this.posX=posX;
    this.posY=posY;
    this.vX = 0;
    this.vY = 0;
    this.radius=5;
    this.hasTouchedObstacle = 0;
    this.hasTouchedGoal = 0;
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
    
    for (let k=0; k<numOfObstacles; k++) {
      let distToObs = Math.sqrt((obstacles[k].posX-this.posX)*(obstacles[k].posX-this.posX)+(obstacles[k].posY-this.posY)*(obstacles[k].posY-this.posY));
      if (distToObs <= obstacles[k].radius+this.radius) {
        this.hasTouchedObstacle=true;
      }
    }
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

class Obstacle {
  //constructor
  constructor(index) {
    this.posX=obstacleX[index];
    this.posY=obstacleY[index];
    this.radius=obstacleRadii[index];
  }
  display() {
    stroke(0);
    fill('rgba(250,0,0, 0.55)');
    circle(this.posX, this.posY, this.radius);
    noFill();
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

function getFitness(x, y, hasTouchedObstacle, hasTouchedGoal) {
  let distance = Math.sqrt((desiredPositionX-x)*(desiredPositionX-x)+(desiredPositionY-y)*(desiredPositionY-y));
  if (hasTouchedObstacle) {
    return 0;
  }
  if (hasTouchedGoal) {
    distance/=10;
  }
  return 1000000/(Math.exp(distance/100)+goalRadius);
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
    let fitness = getFitness(birds[i].posX, birds[i].posY, birds[i].hasTouchedObstacle, birds[i].hasTouchedGoal);
    
    fitnesses[i] = fitness;
    totalFitness += fitness;
    fitnessesArray[i] = totalFitness;
  }
  averageFitness=totalFitness/popSize;
  //console.log(averageFitness);
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
    if (getFitness(birds[i].posX, birds[i].posY, birds[i].hasTouchedObstacle, birds[i].hasTouchedGoal)>bestFitness) {
      indexOfBestFitness=i;
      bestFitness = getFitness(birds[i].posX, birds[i].posY, birds[i].hasTouchedObstacle, birds[i].hasTouchedGoal);
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
  createCanvas(830, 800);
  background(220);

  populationThetas = [];
  fitnesses = [];
  fitnessesArray = [];
  totalGenerations = 1;
  averageDistances = [];

  obstacleX = [];
  obstacleY = [];
  obstacleRadii = [];
  //randomize bird population genes
  for (let i=0; i<popSize; i++) {
    populationThetas[i]=createRandTheta();
  }
  frameRate(60);
  //create bird object array
  birds = [];
  for (let i=0; i<popSize; i++) {
    birds[i] = new Bird(startPositionX, startPositionY, i);
  }
  //randomize obstacle characteristics

  for (let i=0; i<numOfObstacles; i++) {
    obstacleRadii[i]=Math.random()*50+10;
    obstacleX[i]=Math.random()*(width-170)+150;
    obstacleY[i]=Math.random()*(height-220)+200;
  }

  //create obstacle object array
  obstacles = [];
  for (let i=0; i<numOfObstacles; i++) {
    obstacles[i] = new Obstacle(i);
  }
  frameNum=0;
  
}

function restart() {
  populationThetas = [];
  fitnesses = [];
  fitnessesArray = [];
  if (document.getElementById("numOfMovements").value.length !== 0) {
    numOfMovements = document.getElementById("numOfMovements").value;
  }
  framesPerTheta = 600/numOfMovements;
  if (document.getElementById("popSize").value.length !== 0) {
    popSize = document.getElementById("popSize").value;
  }
  if (document.getElementById("mutationRate").value.length !== 0) {
    mutationRate = (document.getElementById("mutationRate").value)/100;
  }
  if (document.getElementById("speed").value.length !== 0) {
    speed = (document.getElementById("speed").value);
  }
  if (document.getElementById("numObstacles").value.length !== 0) {
    numOfObstacles = (document.getElementById("numObstacles").value);
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
  averageFitness=0;
  setup();
}

function reset() {
  mutationRate = 0.006;
  popSize = 200;

  populationThetas = [];
  fitnesses = [];
  fitnessesArray = [];

  startPositionX = 100;
  startPositionY = 250;

  desiredPositionX = 700;
  desiredPositionY = 700;
  goalRadius = 40;
  totalGenerations = 1;

  numOfMovements = 8;
  framesPerTheta = 60;
  speed = 1;

  frameNum = 0;
  framesPerSecond = 10;

  birds = [];
  obstacles = [];

  numOfObstacles = 20;

  obstacleX = [];
  obstacleY = [];
  obstacleRadii = [];

  averageDistances = [];
  averageFitnesses = [];

  setup();
}

function draw() {
  background(255);
  for (let i=0; i<numOfObstacles; i++) {
    obstacles[i].display();
  }
  if (frameNum>framesPerTheta*numOfMovements-1) {
    createNewGeneration();
    totalGenerations++;
    frameNum=0;
  } else {
    let numDead=0;
    for (let i=0; i<popSize; i++) {
      birds[i].update(frameNum);
      numDead = 0;
      if (birds[i].hasTouchedObstacle) {
        numDead++;   
      }
      
    }
    if (numDead>0) {
      console.log(numDead);
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
  averageFitnesses[totalGenerations-1]=averageFitness;

  averageDistances[totalGenerations-1]=averageDistance;

  fill('rgba(10,240,0, 0.55)');
  circle(desiredPositionX, desiredPositionY, goalRadius);
  fill(0);
  let indexOfBestFitness = calculateBestScorer();
  textFont('Courier');
  textSize(30);
  text("Best Scorer: " + Math.floor(Math.log(getFitness(birds[indexOfBestFitness].posX, birds[indexOfBestFitness].posY, birds[indexOfBestFitness].hasTouchedObstacle, birds[indexOfBestFitness].hasTouchedGoal))), 10, 40);
  textSize(12);
  textSize(20);
  text("Generation: " + totalGenerations + "  Mutation Rate: " + 100*mutationRate + "%" + "  Average fitness: " + Math.floor(averageFitness), 10, 76);
  text("Number of specimen bred: " + totalGenerations*popSize + "  Speed: " + speed, 10, 110);
  
  for (let i=0; i<totalGenerations; i++) {
    fill('rgba(120,120,240, 0.55)');
    rect((i+1)*30-18, 184-Math.sqrt(averageFitnesses[i]), 30, Math.sqrt(averageFitnesses[i]));
    fill(0);
    textSize(14);
    text(i+1, (i+1)*30-7, 200);
    //text(floor(averageFitnesses[i]), (i+1)*30-15, 180-Math.sqrt(averageFitnesses[i]));
  }
  
  //text("Number of direction changes: " + numOfMovements, 10, 140);
}

