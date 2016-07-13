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
  this.speed = speed || 10;  // 移动速度
  this.lineSpacing = lineSpacing || 5; // 行距
  this.playFlag = false;
  this.children = [];
  this.container = container;
  this.renderMatrix = []; // 使用一个二维数组矩阵来分别储存每一行将要渲染的弹幕
  this.renderChildren = []; // 确认要被渲染的数组
  this.loop = loop;
  this.myReq = null;
  this.time = Date.now();
  this.fps = 45;
  this.fpsInterval = 1000 / this.fps;

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
    // 获取需要被渲染的行数
    this.renderMatrix.forEach((matrix, matrixIndex) => {
      // 根据this.trackCount把每一行放入renderMatrix里面
      if (!matrix.length) {
        this.allocateSingleLine(matrix, matrixIndex);
      } else {
        const lastItem = matrix[matrix.length - 1];

        if (this.width - lastItem.x > (lastItem.text.length * this.fontSize)) {
          this.allocateSingleLine(matrix, matrixIndex);
        }
      }
    });

    // 把二维数组Matrix里面的内容放到二维数组renderChildren里面，
    // 用来进行真正的渲染
    this.renderMatrix.forEach((matrix) => {
      matrix.forEach((columnData) => {
        if (!columnData.isRender) {
          this.renderChildren.push(columnData);
          columnData.isRender = true;
        }
      });
    });

    // 删除被标记为isDelete的弹幕
    this.renderChildren.forEach((item, index) => {
      if (item.isDelete) {
        this.renderChildren.splice(index, 1);

        if (this.loop) {
          item.isRender = false;
          item.isDelete = false;
          this.children.push(item);
        }
      }
    });

    clearTimeout(this.allocationDataTimer);

    this.allocationDataTimer = setTimeout(() => {
      this.allocationDataForMatrix();
    }, 2000);
  },

  // 为每一行分配将要渲染的弹幕
  allocateSingleLine(matrix, lineN) {
    if (!this.children.length) return;

    const item = this.children.splice(0, 1)[0];

    this.allocateDataForSingleLine(matrix, lineN, item);
  },

  allocateDataForSingleLine(matrix, lineN, item) {
    item.x = this.width + Math.floor(Math.random() * 300 + 100); // 初始X轴位置

    item.y = lineN * this.fontSize + (lineN * this.lineSpacing); // 行数

    item.speed = this.speed; // 速度

    matrix.push(item);
  },

  render() {
    const now = Date.now();
    const diff = now - this.time;

    if (diff > this.fpsInterval) {
      this.time = now;

      this.container.innerHTML = '';
      this.renderChildren.forEach((item) => {
        item.x = item.x - item.speed;
        this.draw(item.text, item.x, item.y);

        if (item.x < -(item.text.length * this.fontSize)) {
          item.isDelete = true;
        }
      });

      if (!this.loop && !this.renderChildren.length) {
        this.stop();
      }
    }

    if (this.playFlag) {
      this.myReq = requestAnimationFrame(this.render.bind(this));
    }
  },

  draw(text, x, y) {
    const node = document.createElement('div');
    node.style.position = 'absolute';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.whiteSpace = 'nowrap';
    node.style.color = this.color;
    node.style.fontSize = `${this.fontSize}px`;
    node.style.fontWeight = this.fontWeight;
    node.style.lineHeight = 1;
    node.innerText = text;

    this.container.appendChild(node);
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
    clearTimeout(this.allocationDataTimer);
    cancelAnimationFrame(this.myReq);
  },

  clear() { // 清空所有数据
    this.children = [];
    this.renderChildren = [];
    this.resetMatrix();
    this.stop();
  }
};

export default Curtain;
