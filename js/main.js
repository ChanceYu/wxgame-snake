import Snake from './npc/snake';
import Control from './npc/control';
import Food from './npc/food';
import Background from './runtime/background';

const context = canvas.getContext('2d');

// 使用实际屏幕尺寸而不是 canvas 像素尺寸
const CVS_WIDTH = window.screenWidth || canvas.width;
const CVS_HEIGHT = window.screenHeight || canvas.height;

// 导出供其他模块使用
window.CVS_WIDTH = CVS_WIDTH;
window.CVS_HEIGHT = CVS_HEIGHT;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.snake = null;
    this.control = null;
    this.food = null;
    
    this.score = 0;
    this.gameState = 'ready'; // ready, playing, paused, gameover
    this.animationFrameId = null;
    
    this.init();
  }

  init() {
    this.initGame();
    this.bindEvents();
    this.showStartScreen();
  }

  initGame() {
    this.snake = new Snake();
    this.control = new Control();
    this.food = new Food();
    this.score = 0;
    
    // 生成第一个食物
    this.food.generate(this.snake.bodies);
    
    // 设置蛇的回调
    this.snake.onMove = () => {
      this.checkFoodCollision();
      this.draw();
    };
    
    this.snake.onGameOver = () => {
      this.gameOver();
    };
  }

  bindEvents() {
    // 绑定控制器方向改变事件
    this.control.onDirectionChange = (direction) => {
      if (this.gameState === 'playing') {
        this.snake.changeDirection(direction);
      }
    };
    
    // 点击屏幕上方区域开始/重新开始游戏
    wx.onTouchStart((e) => {
      const { pageX, pageY } = e.touches[0];
      
      // 如果点击的是控制区域，不处理
      if (pageY > CVS_HEIGHT - 120) return;
      
      if (this.gameState === 'ready') {
        this.startGame();
      } else if (this.gameState === 'gameover') {
        this.restartGame();
      } else if (this.gameState === 'playing') {
        this.pauseGame();
      } else if (this.gameState === 'paused') {
        this.resumeGame();
      }
    });
  }

  showStartScreen() {
    this.draw();
    this.drawText('点击屏幕开始游戏', CVS_WIDTH / 2, CVS_HEIGHT / 2 - 50);
  }

  startGame() {
    this.gameState = 'playing';
    this.snake.start();
  }

  pauseGame() {
    this.gameState = 'paused';
    this.snake.pause();
    this.draw();
    this.drawText('游戏暂停', CVS_WIDTH / 2, CVS_HEIGHT / 2 - 50);
    this.drawText('点击继续', CVS_WIDTH / 2, CVS_HEIGHT / 2);
  }

  resumeGame() {
    this.gameState = 'playing';
    this.snake.resume();
  }

  restartGame() {
    this.gameState = 'ready';
    this.initGame();
    this.startGame();
  }

  gameOver() {
    this.gameState = 'gameover';
    this.draw();
    
    // 绘制游戏结束界面
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(0, 0, CVS_WIDTH, CVS_HEIGHT);
    
    this.drawText('游戏结束', CVS_WIDTH / 2, CVS_HEIGHT / 2 - 80, '#FF3B30', 32);
    this.drawText(`得分: ${this.score}`, CVS_WIDTH / 2, CVS_HEIGHT / 2 - 20, '#FFFFFF', 28);
    this.drawText('点击屏幕重新开始', CVS_WIDTH / 2, CVS_HEIGHT / 2 + 40, '#FFFFFF', 20);
  }

  checkFoodCollision() {
    if (this.snake.checkCollisionWithFood(this.food)) {
      this.score += 10;
      this.snake.grow();
      this.food.generate(this.snake.bodies);
    }
  }

  draw() {
    context.clearRect(0, 0, CVS_WIDTH, CVS_HEIGHT);
    
    Background.draw();
    this.food.draw();
    this.snake.draw();
    this.control.draw();
    
    // 绘制分数
    this.drawScore();
  }

  drawScore() {
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 24px Arial';
    context.textAlign = 'left';
    context.fillText(`分数: ${this.score}`, 20, 40);
  }

  drawText(text, x, y, color = '#FFFFFF', fontSize = 24) {
    context.fillStyle = color;
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, x, y);
  }
}
