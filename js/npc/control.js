import MathTool from '../base/math-tool';

const context = canvas.getContext('2d');

// 使用实际屏幕尺寸
const CVS_WIDTH = window.CVS_WIDTH || canvas.width;
const CVS_HEIGHT = window.CVS_HEIGHT || canvas.height;

// 控制器位置和大小
const CONTROL_RADIUS = 50;
const CONTROL_CENTER_RADIUS = 15;
const CONTROL_X = CVS_WIDTH - 80;
const CONTROL_Y = CVS_HEIGHT - 80;

// 方向扇区定义
const SECTORS = {
  up: {
    start: -135,
    end: -45
  },
  right: {
    start: -45,
    end: 45
  },
  down: {
    start: 45,
    end: 135
  },
  left: {
    start: 135,
    end: 225
  }
};

export default class Control {
  constructor() {
    this.activeDirection = null;
    this.initEvents();
  }

  /**
   * 绘制控制器
   */
  draw() {
    // 外圈
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.beginPath();
    context.arc(CONTROL_X, CONTROL_Y, CONTROL_RADIUS, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    
    // 方向指示（像素风格箭头）
    this.drawArrows();
    
    // 中心圆
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.beginPath();
    context.arc(CONTROL_X, CONTROL_Y, CONTROL_CENTER_RADIUS, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    
    // 如果有激活的方向，高亮显示
    if (this.activeDirection) {
      this.drawActiveDirection(this.activeDirection);
    }
  }

  /**
   * 绘制箭头（像素风格）
   */
  drawArrows() {
    const arrowSize = 8;
    const arrowDistance = 30;
    
    context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    // 上箭头
    context.beginPath();
    context.moveTo(CONTROL_X, CONTROL_Y - arrowDistance);
    context.lineTo(CONTROL_X - arrowSize, CONTROL_Y - arrowDistance + arrowSize);
    context.lineTo(CONTROL_X + arrowSize, CONTROL_Y - arrowDistance + arrowSize);
    context.closePath();
    context.fill();
    
    // 右箭头
    context.beginPath();
    context.moveTo(CONTROL_X + arrowDistance, CONTROL_Y);
    context.lineTo(CONTROL_X + arrowDistance - arrowSize, CONTROL_Y - arrowSize);
    context.lineTo(CONTROL_X + arrowDistance - arrowSize, CONTROL_Y + arrowSize);
    context.closePath();
    context.fill();
    
    // 下箭头
    context.beginPath();
    context.moveTo(CONTROL_X, CONTROL_Y + arrowDistance);
    context.lineTo(CONTROL_X - arrowSize, CONTROL_Y + arrowDistance - arrowSize);
    context.lineTo(CONTROL_X + arrowSize, CONTROL_Y + arrowDistance - arrowSize);
    context.closePath();
    context.fill();
    
    // 左箭头
    context.beginPath();
    context.moveTo(CONTROL_X - arrowDistance, CONTROL_Y);
    context.lineTo(CONTROL_X - arrowDistance + arrowSize, CONTROL_Y - arrowSize);
    context.lineTo(CONTROL_X - arrowDistance + arrowSize, CONTROL_Y + arrowSize);
    context.closePath();
    context.fill();
  }

  /**
   * 绘制激活的方向
   */
  drawActiveDirection(direction) {
    context.fillStyle = 'rgba(74, 144, 226, 0.5)';
    
    const innerRadius = CONTROL_CENTER_RADIUS;
    const outerRadius = CONTROL_RADIUS;
    const sector = SECTORS[direction];
    
    context.beginPath();
    context.moveTo(CONTROL_X, CONTROL_Y);
    context.arc(
      CONTROL_X,
      CONTROL_Y,
      outerRadius,
      MathTool.getRadian(sector.start),
      MathTool.getRadian(sector.end)
    );
    context.lineTo(CONTROL_X, CONTROL_Y);
    context.closePath();
    context.fill();
  }

  /**
   * 初始化触摸事件
   */
  initEvents() {
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;
    
    wx.onTouchStart((e) => {
      const { pageX, pageY } = e.touches[0];
      
      // 检查是否点击在控制区域
      const distance = MathTool.getDistanceBetweenTwoPoints(
        CONTROL_X,
        CONTROL_Y,
        pageX,
        pageY
      );
      
      if (distance <= CONTROL_RADIUS) {
        isTouching = true;
        touchStartX = pageX;
        touchStartY = pageY;
        this.handleDirectionChange(pageX, pageY);
      }
    });
    
    wx.onTouchMove((e) => {
      if (!isTouching) return;
      
      const { pageX, pageY } = e.touches[0];
      this.handleDirectionChange(pageX, pageY);
    });
    
    wx.onTouchEnd(() => {
      isTouching = false;
      this.activeDirection = null;
    });
  }

  /**
   * 处理方向改变
   */
  handleDirectionChange(touchX, touchY) {
    const dx = touchX - CONTROL_X;
    const dy = touchY - CONTROL_Y;
    
    // 计算角度
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    let direction = null;
    
    // 判断方向
    if (angle >= -45 && angle < 45) {
      direction = 'right';
    } else if (angle >= 45 && angle < 135) {
      direction = 'down';
    } else if (angle >= -135 && angle < -45) {
      direction = 'up';
    } else {
      direction = 'left';
    }
    
    if (direction && direction !== this.activeDirection) {
      this.activeDirection = direction;
      this.onDirectionChange && this.onDirectionChange(direction);
    }
  }
}