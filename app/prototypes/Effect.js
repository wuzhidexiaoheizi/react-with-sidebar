import Easing from '../utils/Easing';
import { getInterval, toStrikeCase } from '../helper';

// 兼容低版本浏览器
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function requestAnimationFrame() {
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function request(callback) {
        return setTimeout(callback, 1000 / 50);
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

/**
 * [Effect 效果]
 * @param { DOM }    element     [动画元素]
 * @param {Object}   effectObj   [动画属性对象]
 * @param {String}   effectName  [动画效果名称]
 * @param {Number}   effectTime  [动画效果时间]
 * @param {Function} callback    [动画回调]
 * @param {Object}   config      [可选参数]
 */
function Effect(element, effectObj, effectName, effectTime, callback, config = {}) {
  const { effectInterval, onEffectStart, onEffectEnd, time, name } = config;
  this.effectInterval = getInterval(effectInterval);
  this.element = element;
  this.effectObj = effectObj;
  const eName = effectName || name;
  this.effectName = eName == 'flip' ? 'easeInOutBack' : eName;
  this.effectTime = getInterval(effectTime || time);
  this.onEffectEnd = callback || onEffectEnd;
  this.onEffectStart = onEffectStart;
  this.fps = 50;
  this.fpsInterval = 1000 / this.fps;
  this.isFlip = effectName == 'flip';
  this.flipCount = 0;
  this.myReq = null;

  this.init();
}

Effect.prototype = {
  constructor: Effect,

  init() {
    this.initSrcAndChangeState();
    this.currentTime = 0;

    if (typeof this.onEffectStart == 'function') this.onEffectStart();

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
      if (['left', 'top', 'width', 'height'].indexOf(key) > -1) {
        srcVal = this.element.getBoundingClientRect()[key];
      } else {
        srcVal = window.parseInt(window.getComputedStyle(this.element, null).getPropertyValue(toStrikeCase(key)));
      }

      this.srcState[key] = srcVal;
      val = String(this.effectObj[key]);
      symbol = val.slice(0, 2);
      index = ['+=', '-=', '*=', '/='].indexOf(symbol);
      if (index > -1) symbol = symbol[0];

      if (index > -1) {
        factor = +(val.slice(2).split('px')[0]);
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
    let index;
    let firstTwo;

    Object.keys(this.effectObj).forEach((key) => {
      val = String(this.effectObj[key]);
      symbol = this.symbolState[key];
      symbol = this.switchSymbol(symbol);
      this.symbolState[key] = symbol;
      srcVal = this.srcState[key];
      firstTwo = val.slice(0, 2);
      index = ['+=', '-=', '*=', '/='].indexOf(firstTwo);
      factor = index > -1 ? +(val.slice(2).split('px')[0]) : window.parseInt(val);

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

      const unit = key == 'opacity' ? '' : 'px';
      this.element.style[key] = destVal + unit;
    });

    this.currentTime += this.fpsInterval;

    if (this.currentTime <= this.effectTime) {
      this.myReq = requestAnimationFrame(this.animate.bind(this));
      this.animationTimer = setTimeout(this.myReq, this.fpsInterval);
    } else {
      if (this.isFlip && this.flipCount < 4) {
        this.flipCount += 1;
        this.flip();

        return;
      }

      if ((this.isFlip && this.flipCount == 4) || !this.isFlip) {
        if (typeof this.onEffectEnd == 'function') this.onEffectEnd();

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
    cancelAnimationFrame(this.myReq);
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
