const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;
const lblCarNumber = document.getElementById("lblCarNumber");
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(100, 190);
const N = 2000;
let cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  cars.forEach(car => {
    car.brain = JSON.parse(localStorage.getItem("bestBrain"));
    NeuralNetwork.mutate(car.brain, 0.2);
  });
  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

const traffic = [
  new Car(road.getLaneCenter(1), 100, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(0), 280, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(2), -100, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(2), -750, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2.2),
  new Car(road.getLaneCenter(1), -1050, 30, 50, "DUMMY", 2.2)
]

animate();

function generateCars(n) {
  const cars = [];
  for(let i=0; i<n; i++){
    cars.push(new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 3));
  }
  return cars;
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function animate(time) {
  traffic.forEach(t => t.update(road.borders, []));

  cars.forEach(car => {
    if(!car.damaged && !car.lost) {
      car.update(road.borders, traffic)
    }
  });

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  
  bestCar = cars.find(car => 
    car.y === Math.min(...cars.map(c => c.y))
  );

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);

  carCtx.globalAlpha = 0.2;
  cars.forEach(car => 
    {
      car.lost = Math.abs(Math.abs(car.y) - Math.abs(bestCar.y)) > 280;
      if(!car.damaged && !car.lost) {
        car.draw(carCtx, "blue", false);
      }
    });
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue");

  traffic.forEach(t => t.draw(carCtx, "red"));
  carCtx.restore();
  cars = cars.filter(car => !car.damaged && !car.lost);
  lblCarNumber.innerHTML = cars.length;

  networkCtx.lineDashOffset =- time/100;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}