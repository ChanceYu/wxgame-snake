import Rect from './rect';

let context = canvas.getContext('2d');

const CVS_WIDTH = canvas.width;
const CVS_HEIGHT = canvas.height;

const UNIT = 10;
const UNIT_HALF = UNIT / 2;

const EYE_UNIT = UNIT / 4;
const EYE_UNIT_HALF = EYE_UNIT / 2;
const EYE_COLOR = '#ffffff';

const START_X = 100;
const START_Y = 50;

const COLORS = ['#2b347f', '#ffffff', '#e70614'];

export default class Snake {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.colorIndex = 0;
    this.draw();
  }

  draw(){
    this.bodies = this.bodies || [];

    this.drawBodies();
    this.drawHead();

    context.drawImage(this.canvas, 0, 0);
  }

  drawBodies() {
    let bodies = this.bodies;
    let len = bodies.length;
    let i = len - 1;

    for(; i >= 0; i--){
      this.drawBody(bodies[i]);
    }
  }

  drawBody(ball) {
    let { x, y, color, dir } = ball;

    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, UNIT, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.fill();
  }

  drawHead() {
    this.head = {
      x: START_X,
      y: START_Y,
      color: COLORS[0],
      dir: 'right'
    };
    let { x, y, color } = this.head;

    this.drawBody(this.head);

    // left eys
    this.context.beginPath();
    this.context.strokeStyle = EYE_COLOR;
    this.context.arc(x + EYE_UNIT, y - UNIT_HALF - EYE_UNIT, EYE_UNIT, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.stroke();

    // right eys
    this.context.beginPath();
    this.context.strokeStyle = EYE_COLOR;
    this.context.arc(x + EYE_UNIT, y + UNIT_HALF + EYE_UNIT, EYE_UNIT, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.stroke();
  }

  add(){
    this.colorIndex++;
    let len = this.bodies.length;
    let last = len ? this.bodies[len - 1] : this.head;

    console.log(this.colorIndex)

    let {x, y, dir} = last;
    let colorIndex = this.colorIndex;

    if (colorIndex > 2) this.colorIndex = colorIndex = 0;

    switch (dir) {
      case 'right':
        x -= UNIT + UNIT_HALF;
        break;
      case 'bottom':
        y -= UNIT + UNIT_HALF;
        break;
      case 'left':
        x += UNIT + UNIT_HALF;
        break;
      case 'top':
        y += UNIT + UNIT_HALF;
        break;
    }

    let ball = {
      x: x,
      y: y,
      dir: dir,
      color: COLORS[colorIndex]
    };

    this.bodies.push(ball);
    
    this.draw();
  }

  move(){
    
  }
}