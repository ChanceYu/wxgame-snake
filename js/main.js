import Snake from './npc/snake';
import Background from './runtime/background';

let context   = canvas.getContext('2d');

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.init();

    let snake = new Snake();

    // test
    snake.add();
    snake.add();
    snake.add();
  }

  init() {
    Background.render();
  }
}
