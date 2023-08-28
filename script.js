const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(100, 190);
const car = new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 3);

const traffic = [
  new Car(road.getLaneCenter(1), 100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), 280, 30, 50, "DUMMY", 2)
]

animate();

function animate(time) {
  traffic.forEach(t => t.update(road.borders, []));

  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  
  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  car.draw(carCtx, "blue");
  traffic.forEach(t => t.draw(carCtx, "red"));
  carCtx.restore();
  
  networkCtx.lineDashOffset =- time/100;

  Visualizer.drawNetwork(networkCtx, car.brain);
  requestAnimationFrame(animate);
}