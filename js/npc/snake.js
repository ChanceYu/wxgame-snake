const context = canvas.getContext('2d');

// 使用实际屏幕尺寸
const CVS_WIDTH = window.CVS_WIDTH || canvas.width;
const CVS_HEIGHT = window.CVS_HEIGHT || canvas.height;

// 格子大小（像素风格）
const GRID_SIZE = 20;
const HALF_GRID = GRID_SIZE / 2;

// 蛇的起始位置（格子坐标）
const START_GRID_X = 8;
const START_GRID_Y = 6;

// 颜色定义（更像真蛇的配色）
const SNAKE_HEAD_COLOR = '#4CAF50';
const SNAKE_BODY_COLOR_1 = '#66BB6A';
const SNAKE_BODY_COLOR_2 = '#81C784';
const SNAKE_BELLY_COLOR = '#C8E6C9';
const SNAKE_EYE_COLOR = '#000000';
const SNAKE_EYE_WHITE = '#FFFFFF';
const SNAKE_BORDER_COLOR = '#2E7D32';
const SNAKE_TONGUE_COLOR = '#E91E63';
const SNAKE_SCALE_COLOR = '#388E3C';

export default class Snake {
  constructor() {
    this.bodies = [];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.speed = 150;
    this.isRunning = false;
    this.timer = null;
    this.tongueFrame = 0; // 舌头动画帧
    
    // 初始化蛇（3节身体）
    this.bodies = [
      { x: START_GRID_X, y: START_GRID_Y },
      { x: START_GRID_X - 1, y: START_GRID_Y },
      { x: START_GRID_X - 2, y: START_GRID_Y }
    ];
  }

  /**
   * 绘制蛇
   */
  draw() {
    // 从尾部开始绘制，让头部在最上层
    for (let i = this.bodies.length - 1; i >= 0; i--) {
      const body = this.bodies[i];
      const x = body.x * GRID_SIZE;
      const y = body.y * GRID_SIZE;
      
      if (i === 0) {
        // 绘制蛇头
        this.drawHead(x, y);
      } else if (i === this.bodies.length - 1) {
        // 绘制尾部
        this.drawTail(x, y, i);
      } else {
        // 绘制身体
        this.drawBody(x, y, i);
      }
    }
    
    // 更新舌头动画帧
    this.tongueFrame = (this.tongueFrame + 1) % 20;
  }

  /**
   * 绘制蛇头（更像真蛇）
   */
  drawHead(x, y) {
    // 主体 - 圆润的头部
    context.fillStyle = SNAKE_HEAD_COLOR;
    context.fillRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
    
    // 头部圆角效果（像素风格）
    context.fillRect(x + 4, y + 2, GRID_SIZE - 8, 1);
    context.fillRect(x + 4, y + GRID_SIZE - 3, GRID_SIZE - 8, 1);
    context.fillRect(x + 2, y + 4, 1, GRID_SIZE - 8);
    context.fillRect(x + GRID_SIZE - 3, y + 4, 1, GRID_SIZE - 8);
    
    // 深色边框
    context.strokeStyle = SNAKE_BORDER_COLOR;
    context.lineWidth = 1;
    context.strokeRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
    
    // 鳞片纹理
    context.fillStyle = SNAKE_SCALE_COLOR;
    if (this.direction === 'right' || this.direction === 'left') {
      context.fillRect(x + 6, y + 5, 2, 2);
      context.fillRect(x + 12, y + 5, 2, 2);
      context.fillRect(x + 6, y + 13, 2, 2);
      context.fillRect(x + 12, y + 13, 2, 2);
    } else {
      context.fillRect(x + 5, y + 6, 2, 2);
      context.fillRect(x + 13, y + 6, 2, 2);
      context.fillRect(x + 5, y + 12, 2, 2);
      context.fillRect(x + 13, y + 12, 2, 2);
    }
    
    // 眼睛位置和大小
    let eye1X, eye1Y, eye2X, eye2Y;
    const eyeSize = 4;
    const pupilSize = 2;
    
    if (this.direction === 'right') {
      eye1X = x + 13;
      eye1Y = y + 5;
      eye2X = x + 13;
      eye2Y = y + 11;
    } else if (this.direction === 'left') {
      eye1X = x + 3;
      eye1Y = y + 5;
      eye2X = x + 3;
      eye2Y = y + 11;
    } else if (this.direction === 'up') {
      eye1X = x + 5;
      eye1Y = y + 3;
      eye2X = x + 11;
      eye2Y = y + 3;
    } else {
      eye1X = x + 5;
      eye1Y = y + 13;
      eye2X = x + 11;
      eye2Y = y + 13;
    }
    
    // 画眼白
    context.fillStyle = SNAKE_EYE_WHITE;
    context.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
    context.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
    
    // 画瞳孔
    context.fillStyle = SNAKE_EYE_COLOR;
    context.fillRect(eye1X + 1, eye1Y + 1, pupilSize, pupilSize);
    context.fillRect(eye2X + 1, eye2Y + 1, pupilSize, pupilSize);
    
    // 画舌头（动态效果）
    if (this.tongueFrame < 10) {
      const tongueLength = Math.floor(this.tongueFrame / 2);
      context.fillStyle = SNAKE_TONGUE_COLOR;
      
      if (this.direction === 'right') {
        for (let i = 0; i <= tongueLength; i++) {
          context.fillRect(x + GRID_SIZE - 2 + i * 2, y + HALF_GRID - 1, 2, 2);
        }
        // 分叉
        if (tongueLength > 2) {
          context.fillRect(x + GRID_SIZE - 2 + tongueLength * 2, y + HALF_GRID - 3, 1, 1);
          context.fillRect(x + GRID_SIZE - 2 + tongueLength * 2, y + HALF_GRID + 1, 1, 1);
        }
      } else if (this.direction === 'left') {
        for (let i = 0; i <= tongueLength; i++) {
          context.fillRect(x + 2 - i * 2, y + HALF_GRID - 1, 2, 2);
        }
        if (tongueLength > 2) {
          context.fillRect(x + 2 - tongueLength * 2, y + HALF_GRID - 3, 1, 1);
          context.fillRect(x + 2 - tongueLength * 2, y + HALF_GRID + 1, 1, 1);
        }
      } else if (this.direction === 'up') {
        for (let i = 0; i <= tongueLength; i++) {
          context.fillRect(x + HALF_GRID - 1, y + 2 - i * 2, 2, 2);
        }
        if (tongueLength > 2) {
          context.fillRect(x + HALF_GRID - 3, y + 2 - tongueLength * 2, 1, 1);
          context.fillRect(x + HALF_GRID + 1, y + 2 - tongueLength * 2, 1, 1);
        }
      } else {
        for (let i = 0; i <= tongueLength; i++) {
          context.fillRect(x + HALF_GRID - 1, y + GRID_SIZE - 2 + i * 2, 2, 2);
        }
        if (tongueLength > 2) {
          context.fillRect(x + HALF_GRID - 3, y + GRID_SIZE - 2 + tongueLength * 2, 1, 1);
          context.fillRect(x + HALF_GRID + 1, y + GRID_SIZE - 2 + tongueLength * 2, 1, 1);
        }
      }
    }
  }

  /**
   * 绘制身体（更像真蛇，带鳞片和渐变）
   */
  drawBody(x, y, index) {
    // 交替颜色形成条纹
    const bodyColor = index % 2 === 0 ? SNAKE_BODY_COLOR_1 : SNAKE_BODY_COLOR_2;
    
    // 主体
    context.fillStyle = bodyColor;
    context.fillRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
    
    // 腹部（浅色）
    context.fillStyle = SNAKE_BELLY_COLOR;
    context.fillRect(x + 7, y + 7, GRID_SIZE - 14, GRID_SIZE - 14);
    
    // 边框
    context.strokeStyle = SNAKE_BORDER_COLOR;
    context.lineWidth = 1;
    context.strokeRect(x + 3, y + 3, GRID_SIZE - 6, GRID_SIZE - 6);
    
    // 鳞片纹理
    context.fillStyle = SNAKE_SCALE_COLOR;
    context.fillRect(x + 5, y + 5, 2, 2);
    context.fillRect(x + 13, y + 5, 2, 2);
    context.fillRect(x + 5, y + 13, 2, 2);
    context.fillRect(x + 13, y + 13, 2, 2);
  }

  /**
   * 绘制尾部（渐变变细）
   */
  drawTail(x, y, index) {
    const bodyColor = index % 2 === 0 ? SNAKE_BODY_COLOR_1 : SNAKE_BODY_COLOR_2;
    
    // 尾部比身体小一些
    context.fillStyle = bodyColor;
    context.fillRect(x + 5, y + 5, GRID_SIZE - 10, GRID_SIZE - 10);
    
    // 边框
    context.strokeStyle = SNAKE_BORDER_COLOR;
    context.lineWidth = 1;
    context.strokeRect(x + 5, y + 5, GRID_SIZE - 10, GRID_SIZE - 10);
    
    // 尾巴尖
    context.fillRect(x + 8, y + 8, GRID_SIZE - 16, GRID_SIZE - 16);
  }

  /**
   * 开始移动
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.gameLoop();
  }

  /**
   * 暂停
   */
  pause() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * 恢复
   */
  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.gameLoop();
    }
  }

  /**
   * 游戏循环
   */
  gameLoop() {
    if (!this.isRunning) return;
    
    this.direction = this.nextDirection;
    this.move();
    
    if (this.checkCollision()) {
      this.pause();
      this.onGameOver && this.onGameOver();
      return;
    }
    
    this.onMove && this.onMove();
    
    this.timer = setTimeout(() => {
      this.gameLoop();
    }, this.speed);
  }

  /**
   * 移动蛇
   */
  move() {
    const head = { ...this.bodies[0] };
    
    // 根据方向移动蛇头
    switch (this.direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }
    
    // 添加新头部
    this.bodies.unshift(head);
    
    // 如果没有吃到食物，移除尾部
    if (!this.shouldGrow) {
      this.bodies.pop();
    } else {
      this.shouldGrow = false;
    }
  }

  /**
   * 改变方向
   */
  changeDirection(newDirection) {
    // 防止反向移动
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };
    
    if (opposites[this.direction] !== newDirection) {
      this.nextDirection = newDirection;
    }
  }

  /**
   * 碰撞检测
   */
  checkCollision() {
    const head = this.bodies[0];
    
    // 检测是否撞墙
    const maxX = Math.floor(CVS_WIDTH / GRID_SIZE);
    const maxY = Math.floor(CVS_HEIGHT / GRID_SIZE);
    
    if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
      return true;
    }
    
    // 检测是否撞到自己
    for (let i = 1; i < this.bodies.length; i++) {
      if (head.x === this.bodies[i].x && head.y === this.bodies[i].y) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 检测是否吃到食物
   */
  checkCollisionWithFood(food) {
    const head = this.bodies[0];
    return head.x === food.x && head.y === food.y;
  }

  /**
   * 增长
   */
  grow() {
    this.shouldGrow = true;
    // 随着长度增加，速度加快
    if (this.bodies.length % 5 === 0 && this.speed > 80) {
      this.speed -= 10;
    }
  }
}