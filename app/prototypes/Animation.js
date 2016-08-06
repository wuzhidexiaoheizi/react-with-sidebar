import { getInterval } from '../helper';

function Animation(element, config = {}) {
  const {
    name,
    delay,
    iterationCount,
    direction,
    callback,
    onAnimationStart,
    frameCount,
    url,
    position,
  } = config;

  let { frameTime } = config;
  frameTime = frameTime || '60ms';

  this.element = element;
  this.name = name;
  this.frameTime = getInterval(frameTime);
  this.delay = delay || 0;
  this.iterationCount = iterationCount || Infinity;
  this.direction = direction || 'normal'; // 'normal' or 'alternate'
  this.callback = callback;
  this.onAnimationStart = onAnimationStart;
  this.frameCount = frameCount;
  this.url = url;
  this.position = position;
  this.isDone = false;
  this.fpsInterval = 1000 / 50;
  this.myReq = null;
  this.timer = null;
  this.elementWidth = this.element.clientWidth;
  this.elementHeight = this.element.clientHeight;

  this.init();
}

Animation.prototype = {
  constructor: Animation,

  init() {
    const imageUrl = this.url;
    const position = this.position;
    const image = new Image();
    this.playedCount = 0;
    this.backgroundUrl = imageUrl;
    const [ left, top ] = position.split(' ');
    this.initLeft = left;
    this.initTop = window.parseInt(top);

    image.onload = () => {
      const { width, height } = image;

      if (this.elementWidth > width) {
        this.element.style.width = width + 'px';
        this.element.style.left = (this.elementWidth - width) / 2 + 'px';
      }

      if (this.frameCount) {
        this.step = height / this.frameCount;
      } else {
        this.frameCount = height / width;
        this.step = width;
      }

      if (this.elementHeight > this.step) {
        this.element.style.height = this.step + 'px';
      }

      this.element.style.backgroundImage = `url(${imageUrl})`;
      this.element.style.backgroundPosition = position;

      this.animationTime = this.frameTime * this.frameCount;

      this.initState();
      this.symbol = Animation.SYMBOL.PLUS;

      if (typeof this.onAnimationStart == 'function') this.onAnimationStart();
      this.animate();
    };

    image.src = imageUrl;
  },

  destroy() {
    this.element.parentNode.removeChild(this.element);
    cancelAnimationFrame(this.myReq);
    clearTimeout(this.timer);
  },

  initState() {
    this.currentTop = this.initTop;
    this.animatedTime = 0;
    this.destValue = this.step * (this.frameCount - 1);
  },

  animate() {
    let y;

    this.animatedTime += this.fpsInterval;

    if (this.animatedTime != this.animationTime && this.animatedTime % this.frameTime == 0) {
      if (this.symbol == Animation.SYMBOL.PLUS) {
        y = this.currentTop + this.step;
      } else if (this.symbol == Animation.SYMBOL.MINUS) {
        y = this.currentTop - this.step;
      }

      this.currentTop = y;

      this.element.style.backgroundPosition = `${this.initLeft} ${-y}px`;
    }

    if (this.animatedTime >= this.animationTime) { // 一次播放结束
      this.playedCount ++;

      if (this.playedCount >= this.iterationCount) {
        this.isDone = true;
        if (typeof this.callback == 'function') this.callback();
      } else {
        if (this.delay > 0) {
          setTimeout(this.loopAnimate.bind(this), this.delay);
        } else {
          this.loopAnimate();
        }
      }
    } else {
      this.myReq = requestAnimationFrame(this.animate.bind(this));
      this.timer = setTimeout(this.myReq, this.fpsInterval);
    }
  },

  jumpToEnd() {
    cancelAnimationFrame(this.myReq);
    clearTimeout(this.timer);

    this.element.style.backgroundPosition = `${this.initLeft} ${this.destValue}px`;
    this.isDone = true;
    if (typeof this.callback == 'function') this.callback();
  },

  loopAnimate() {
    if (this.direction == 'alternate') {
      this.alternateAnimate();
    } else {
      this.reAnimate();
    }
  },

  reAnimate() {
    this.initState();
    this.animate();
  },

  alternateAnimate() {
    this.symbol = this.switchSymbol(this.symbol);
    this.destValue = this.initTop;
    this.animatedTime = 0;
    this.animate();
  },

  switchSymbol(symbol) {
    switch (symbol) {
    case Animation.SYMBOL.PLUS: return Animation.SYMBOL.MINUS;
    case Animation.SYMBOL.MINUS: return Animation.SYMBOL.PLUS;
    default: return symbol;
    }
  },

  isAnimationDone() {
    return this.isDone;
  }
};

Animation.SYMBOL = {
  'PLUS': '+',
  'MINUS': '-'
};

export default Animation;
