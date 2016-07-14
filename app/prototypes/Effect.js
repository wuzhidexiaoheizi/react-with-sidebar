import Easing from '../utils/Easing';

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

function getInterval(interval) {
  if (!interval) return null;

  let time = window.parseInt(interval);
  const step = String(interval);

  if (step.indexOf('ms') == -1 && step.indexOf('s') > -1) {
    time = window.parseInt(interval) * 1000;
  }

  return time;
}

/**
 * [Effect 效果]
 * @param { DOM }    element    [动画元素]
 * @param {Object}   effectObj  [动画属性对象]
 * @param {String}   effectName [动画效果名称]
 * @param {Number}   effectTime [动画效果时间]
 * @param {Function} callback   [动画回调]
 * @param {Object}   config     [可选参数]
 */
function Effect(element, effectObj, effectName, effectTime, callback, config = {}) {
  const { effectInterval } = config;
  this.effectInterval = getInterval(effectInterval);
  this.element = element;
  this.effectObj = effectObj;
  this.effectName = effectName == 'flip' ? 'easeInOutBack' : effectName;
  this.effectTime = effectTime;
  this.callback = callback;
  this.fps = 60;
  this.fpsInterval = 1000 / 60;
  this.isFlip = effectName == 'flip';
  this.flipCount = 0;

  this.init();
}

Effect.prototype = {
  init() {
    this.initSrcAndChangeState();
    this.currentTime = 0;
    this.animate();
  },

  initSrcAndChangeState() {
    this.changedState = {};
    this.srcState = {};
    let srcVal;
    let destVal;
    let symbol;
    let index;
    let val;
    let factor;
    this.symbolState = {};

    Object.keys(this.effectObj).forEach((key) => {
      srcVal = window.parseInt(window.getComputedStyle(this.element, null).getPropertyValue(key));
      this.srcState[key] = srcVal;
      val = String(this.effectObj[key]);
      symbol = val[0];
      index = ['+', '-', '*', '/'].indexOf(symbol);

      if (index > -1) {
        factor = window.parseInt(val.slice(1).split('px')[0]);
        destVal = this.getDestVal(symbol, factor, srcVal);
      } else {
        destVal = window.parseInt(val);
      }

      this.changedState[key] = destVal - srcVal;

      if (this.isFlip) {
        this.symbolState[key] = symbol;
      }
    });
  },

  flipState() {
    let symbol;
    let srcVal;
    let factor;
    let val;
    let destVal;

    Object.keys(this.effectObj).forEach((key) => {
      val = this.effectObj[key];
      symbol = this.symbolState[key];
      symbol = this.switchSymbol(symbol);
      this.symbolState[key] = symbol;
      srcVal = this.srcState[key];
      factor = window.parseInt(val.slice(1).split('px')[0]);

      if (this.flipCount == 4) {
        destVal = this.getDestVal(symbol, factor, srcVal);
      } else {
        destVal = this.getFlipDestVal(symbol, factor, srcVal);
      }

      this.changedState[key] = destVal - srcVal;
    });
  },

  animate() {
    Object.keys(this.effectObj).forEach((key) => {
      const changedValue = this.changedState[key];
      const srcValue = this.srcState[key];
      const destVal = Easing[this.effectName](this.currentTime, srcValue,
        changedValue, this.effectTime);
      this.element.style[key] = destVal + 'px';
    });

    this.currentTime += this.fpsInterval;

    if (this.currentTime < this.effectTime) {
      this.animationTimer = setTimeout(requestAnimationFrame(this.animate.bind(this)), this.fpsInterval);
    } else {
      if (this.isFlip && this.flipCount < 4) {
        this.flipCount += 1;
        this.flip();

        return;
      }

      if ((this.isFlip && this.flipCount == 4) || !this.isFlip) {
        if (typeof this.callback == 'function') this.callback();

        if (this.effectInterval) {
          this.flipCount = 0;
          setTimeout(this.animate.bind(this), this.effectInterval);
        }
      }
    }
  },

  flip() {
    this.flipState();
    this.currentTime = 0;
    this.animate();
  },

  stop() {
    clearTimeout(this.animationTimer);

    Object.keys(this.effectObj).forEach((key) => {
      const changedValue = this.changedState[key];
      const srcValue = this.srcState[key];
      const destVal = srcValue + changedValue;
      this.element.style[key] = destVal;
    });
  },

  getDestVal(symbol, factor, srcVal) {
    switch (symbol) {
    case '+': return srcVal + factor;
    case '-': return srcVal - factor;
    case '*': return srcVal * factor;
    case '/': return srcVal / factor;
    default: return srcVal;
    }
  },

  getFlipDestVal(symbol, factor, srcVal) {
    switch (symbol) {
    case '+': return srcVal + factor * 2;
    case '-': return srcVal - factor * 2;
    case '*': return srcVal * (factor * 2);
    case '/': return srcVal / (factor * 2);
    default: return srcVal;
    }
  },

  switchSymbol(symbol) {
    switch (symbol) {
    case '+': return '-';
    case '-': return '+';
    case '*': return '/';
    case '/': return '*';
    default: return symbol;
    }
  }
};

export default Effect;