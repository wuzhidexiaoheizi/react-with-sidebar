// 兼容低版本浏览器
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function requestAnimationFrame() {
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function request(callback) {
        return setTimeout(callback, 1000 / 60);
      };
  })();

  window.cancelAnimationFrame = (function cancelAnimationFrame() {
    return window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame ||
      window.oCancelRequestAnimationFrame ||
      window.msCancelRequestAnimationFrame ||
      function cancel(callback) {
        return clearTimeout(callback);
      };
  })();
}

function Curtain(container, config) {
  const { width, trackCount, color, fontSize, lineSpacing, speed, loop, fontWeight } = config;
  this.width = width;
  this.trackCount = trackCount;
  this.color = color || '#fff'; // 颜色
  this.fontSize = window.parseInt(fontSize) || 14; // 字体大小
  this.fontWeight = fontWeight || '500';
  this.lineSpacing = lineSpacing || 5; // 行距
  this.playFlag = false;
  this.children = [];
  this.container = container;
  this.renderMatrix = []; // 使用一个二维数组矩阵来分别储存每一行将要渲染的弹幕
  this.renderChildren = []; // 确认要被渲染的数组
  this.loop = loop;
  this.myReq = null;
  this.time = Date.now();
  this.fps = 60;
  this.fpsInterval = 1000 / this.fps;
  this.speed = speed || 10;  // 移动速度
  this.myReq = null;
  this.timer = null;

  this.init();
}

Curtain.prototype = {
  constructor: Curtain,

  init() {
    this.resetMatrix();
  },

  addChild(item) {
    this.children.push(item);
  },

  resetMatrix() {
    for (let i = 0; i < this.trackCount; i++) {
      this.renderMatrix[i] = [];
    }
  },

  // 为整个Matrix分配将要渲染的弹幕
  allocationDataForMatrix() {
    let isEnd = false;

    // 分配子弹到弹道
    while (this.children.length > 0 && !isEnd) {
      const { matrix, matrixIndex } = this.getIdleMetrixAndIndex();
      if (matrix == null) { // 如果没有空闲的弹道
        isEnd = true;
      } else {
        const item = this.children.shift();
        this.allocateDataForSingleLine(matrix, matrixIndex, item);
      }
    }
  },

  getIdleMetrixAndIndex() {
    for (let i = 0; i < this.renderMatrix.length; i++) {
      const matrix = this.renderMatrix[i];

      if (!matrix.length) return { matrix, matrixIndex: i };

      const lastItem = matrix[matrix.length - 1];
      const { x, width } = lastItem;

      if (this.width > (x + width)) return { matrix, matrixIndex: i };
    }

    return { matrix: null, matrixIndex: -1 };
  },

  allocateDataForSingleLine(matrix, lineN, item) {
    delete item.node;
    let width = item.text.length * this.fontSize;

    if (width > this.width) width = this.width;
    item.width = width;
    item.x = this.width + Math.floor(Math.random() * 300 + 100); // 初始X轴位置
    item.y = lineN * this.fontSize + (lineN * this.lineSpacing); // 行数
    item.matrix = matrix;

    // 将弹道的数据添加到已渲染的数据数组中
    this.renderChildren.push(item);
    matrix.push(item);
  },

  render() {
    let item;

    for (let i = this.renderChildren.length - 1; i >= 0; i--) {
      item = this.renderChildren[i];
      item.x = item.x - this.speed;
      let node = item.node;

      if (!node) {
        const { text, x, y } = item;
        node = this.draw(text, x, y);
        item.node = node;
      } else {
        if (item.x < -item.width) {
          this.container.removeChild(node);
          const matrix = item.matrix;

          if (matrix) {
            const idx = matrix.indexOf(item);

            if (idx > -1) matrix.splice(idx, 1);
            delete item.matrix;
          }

          this.renderChildren.splice(i, 1);

          if (this.loop) {
            this.reAllocateData(item);
          }
        } else {
          node.style.left = item.x + 'px';
        }
      }
    }

    if (!this.loop && !this.renderChildren.length) {
      this.stop();
    }

    if (this.playFlag) {
      this.myReq = requestAnimationFrame(this.render.bind(this));
      this.timer = setTimeout(this.myReq, this.fpsInterval);
    }
  },

  reAllocateData(item) {
    delete item.x;
    delete item.y;
    delete item.width;
    this.children.push(item);

    this.allocationDataForMatrix();
  },

  draw(text, x, y) {
    const node = document.createElement('div');
    node.style.position = 'absolute';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.whiteSpace = 'nowrap';
    node.style.overflow = 'hidden';
    node.style.textOverflow = 'ellipsis';
    node.style.color = this.color;
    node.style.fontSize = `${this.fontSize}px`;
    node.style.fontWeight = this.fontWeight;
    node.style.lineHeight = 1;
    node.innerText = text;

    this.container.appendChild(node);

    return node;
  },

  play() {
    if (!this.playFlag) {
      this.playFlag = true;
      this.allocationDataForMatrix(); // 渲染之前分配弹幕到将要输出的矩阵
      this.render();
    }
  },

  stop() {
    this.playFlag = false;
    cancelAnimationFrame(this.myReq);
    clearTimeout(this.timer);
    this.myReq = null;
  },

  resume() {
    this.playFlag = true;
    this.render();
  },

  clear() { // 清空所有数据
    this.children = [];
    this.renderChildren = [];
    this.resetMatrix();
    this.stop();
  }
};

export default Curtain;
