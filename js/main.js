import Snake from './npc/snake';
import Background from './runtime/background';

let context   = canvas.getContext('2d');

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.init();

    context.globalCompositeOperation = 'source-over';
  }

  init() {
    Background.render();
    this.initSnake();
  }

  initSnake() {
    let snake = new Snake();

    snake.onBeforeDraw = () => {
      Background.render();
    };

    snake.start();

    // test
    snake.add();
    snake.add();
    snake.add();
  }
}
