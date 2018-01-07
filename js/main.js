import Snake from './npc/snake';
import Background from './runtime/background';

let context   = canvas.getContext('2d');

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    let snake = new Snake();

    snake.draw();

    this.init();
  }

  init() {
    Background.render();
  }
}
