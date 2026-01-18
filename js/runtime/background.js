const context = canvas.getContext('2d');

// 使用实际屏幕尺寸
const CVS_WIDTH = window.CVS_WIDTH || canvas.width;
const CVS_HEIGHT = window.CVS_HEIGHT || canvas.height;

// 格子大小
const GRID_SIZE = 20;

// 背景颜色（像素风格）
const BACKGROUND_COLOR = '#2C3E50';
const GRID_LINE_COLOR = '#34495E';

export default {
  draw() {
    this.fillBackground();
    this.drawGrid();
  },
  
  fillBackground() {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, CVS_WIDTH, CVS_HEIGHT);
  },
  
  drawGrid() {
    context.strokeStyle = GRID_LINE_COLOR;
    context.lineWidth = 1;
    
    // 绘制垂直线
    for (let x = 0; x <= CVS_WIDTH; x += GRID_SIZE) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, CVS_HEIGHT);
      context.stroke();
    }
    
    // 绘制水平线
    for (let y = 0; y <= CVS_HEIGHT; y += GRID_SIZE) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(CVS_WIDTH, y);
      context.stroke();
    }
  }
}