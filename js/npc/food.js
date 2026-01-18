const context = canvas.getContext('2d');

// 使用实际屏幕尺寸
const CVS_WIDTH = window.CVS_WIDTH || canvas.width;
const CVS_HEIGHT = window.CVS_HEIGHT || canvas.height;

// 格子大小（与蛇保持一致）
const GRID_SIZE = 20;

// 食物颜色（像素风格）
const FOOD_COLOR = '#FF3B30';
const FOOD_BORDER_COLOR = '#C92A22';
const FOOD_HIGHLIGHT_COLOR = '#FF6B60';

export default class Food {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  /**
   * 生成食物位置
   */
  generate(snakeBodies) {
    const maxX = Math.floor(CVS_WIDTH / GRID_SIZE);
    const maxY = Math.floor(CVS_HEIGHT / GRID_SIZE);
    
    let isValidPosition = false;
    
    // 确保食物不会生成在蛇身上
    while (!isValidPosition) {
      this.x = Math.floor(Math.random() * maxX);
      this.y = Math.floor(Math.random() * maxY);
      
      isValidPosition = true;
      
      // 检查是否与蛇身重叠
      for (let body of snakeBodies) {
        if (body.x === this.x && body.y === this.y) {
          isValidPosition = false;
          break;
        }
      }
    }
  }

  /**
   * 绘制食物（像素风格苹果）
   */
  draw() {
    const x = this.x * GRID_SIZE;
    const y = this.y * GRID_SIZE;
    
    // 主体
    context.fillStyle = FOOD_COLOR;
    context.fillRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    
    // 边框
    context.strokeStyle = FOOD_BORDER_COLOR;
    context.lineWidth = 2;
    context.strokeRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    
    // 高光（像素风格）
    context.fillStyle = FOOD_HIGHLIGHT_COLOR;
    context.fillRect(x + 5, y + 5, 4, 4);
    
    // 叶子（像素风格）
    context.fillStyle = '#4CD964';
    context.fillRect(x + 11, y + 3, 4, 3);
  }
}