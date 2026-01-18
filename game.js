import './js/libs/weapp-adapter';
import './js/libs/symbol';

import Main from './js/main';

// 适配不同分辨率的设备
const systemInfo = wx.getSystemInfoSync();
const screenWidth = systemInfo.screenWidth;
const screenHeight = systemInfo.screenHeight;
const dpr = systemInfo.pixelRatio;

// 设置画布的实际像素大小（考虑设备像素比）
canvas.width = screenWidth * dpr;
canvas.height = screenHeight * dpr;

// 缩放 canvas 上下文以匹配 CSS 尺寸
const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);

// 导出全局变量供其他模块使用
window.screenWidth = screenWidth;
window.screenHeight = screenHeight;
window.dpr = dpr;

new Main();
