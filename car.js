class Car {

  constructor(x, y, width, height, type, maxSpeed = 2) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.03;
    this.angle = 0;
    this.damaged = false;

    this.useBrain = type === "AI";

    if (type != "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, 6, 4]
      );
    }
    this.controls = new Controls(type);
  }

  draw(ctx, color, drawSensors=true) {
    if (this.sensor && drawSensors) {
      this.sensor.draw(ctx);
    }
    if (this.damaged) {
      ctx.fillStyle = "grey";
    } else {
      ctx.fillStyle = color;
    }
    /* ctx.save();
     ctx.translate(this.x, this.y);
     ctx.rotate(-this.angle);*/

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    //ctx.restore();
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assesDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(
        s => s == null ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #move() {
    this.#applyAcceleration();
    this.#applySpeedLimits();
    this.#applyFriction();
    this.#rotate();
  }

  #applyAcceleration() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
  }

  #applySpeedLimits() {
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2
    }
  }

  #applyFriction() {
    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }
  }

  #rotate() {
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.02 * flip;
      }

      if (this.controls.right) {
        this.angle -= 0.02 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  #createPolygon() {
    const points = [];

    const diag = Math.hypot(this.width / 2, this.height / 2);
    const alpha = Math.atan2(this.width, this.height);

    points.push(
      {
        x: this.x - Math.sin(this.angle - alpha * 1.2) * diag,
        y: this.y - Math.cos(this.angle - alpha * 1.2) * diag
      }
    );
    points.push(
      {
        x: this.x - Math.sin(this.angle - alpha) * diag,
        y: this.y - Math.cos(this.angle - alpha) * diag
      }
    );

    points.push(
      {
        x: this.x - Math.sin(this.angle + alpha) * diag,
        y: this.y - Math.cos(this.angle + alpha) * diag
      }
    );
    points.push(
      {
        x: this.x - Math.sin(this.angle + alpha * 1.2) * diag,
        y: this.y - Math.cos(this.angle + alpha * 1.2) * diag
      }
    );

    points.push(
      {
        x: this.x - Math.sin(Math.PI + this.angle - alpha) * diag * 1.1,
        y: this.y - Math.cos(Math.PI + this.angle - alpha) * diag
      }
    );
    points.push(
      {
        x: this.x - Math.sin(Math.PI + this.angle + alpha) * diag * 1.1,
        y: this.y - Math.cos(Math.PI + this.angle + alpha) * diag
      }
    );
    return points;
  }

  #assesDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }
}