const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(100, 190);
const car = new Car(road.getLaneCenter(1), 400, 30, 50);
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.8);
  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();
  requestAnimationFrame(animate);
}