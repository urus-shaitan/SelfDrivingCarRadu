const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(100, 190);
const car = new Car(road.getLaneCenter(1), 400, 30, 50, "AI", 3);

const traffic = [
  new Car(road.getLaneCenter(1), 100, 30, 50, "DUMMY", 2)
]

animate();

function animate() {

  traffic.forEach(t => t.update(road.borders, []));

  car.update(road.borders, traffic);
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  car.draw(ctx, "blue");
  traffic.forEach(t => t.draw(ctx, "red"));

  ctx.restore();
  requestAnimationFrame(animate);
}