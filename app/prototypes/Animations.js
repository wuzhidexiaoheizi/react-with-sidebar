import Animation from './Animation';

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

function Animations(containment, config = {}) {
  this.containment = containment;
  this.config = config;
  const { clientWidth, clientHeight } = this.containment;
  this.containerWidth = clientWidth;
  this.containerHeight = clientHeight;
  this.animations = [];

  this.init();
}

Animations.prototype = {
  constructor: Animations,

  init() {
    const { name } = this.config;
    this.images = (Animations.BACKGROUNDMAP[name] || Object()).images;

    if (!this.images || !this.images.length) return;
    this.createElements();
  },

  createElements() {
    let element;
    let animation;
    const mainIndex = this.lookupMainAnimationIndex();

    this.images.forEach((image, index) => {
      const { url, position, iterationCount, direction } = image;
      element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      element.style.width = this.containerWidth + 'px';
      element.style.height = this.containerHeight + 'px';
      element.style.backgroundImage = `url(${url})`;
      element.style.backgroundPosition = position;

      this.containment.appendChild(element);
      const config = Object.assign({}, { iterationCount, direction }, this.config);

      if (index != mainIndex) delete config.callback;

      animation = new Animation(element, config);
      this.animations.push(animation);
    });
  },

  lookupMainAnimationIndex() {
    if (this.images.length == 1) return 0;

    this.images.forEach((image) => {
      const { iterationCount } = image;

      if ((this.iterationCount && iterationCount < this.iterationCount) || !this.iterationCount) {
        this.iterationCount = iterationCount;
      }
    });

    return this.iterationCount;
  },

  destroy() {
    this.animations.forEach((animation) => {
      if (animation.destroy) animation.destroy();
    });

    this.animations.length = 0;
  },

  interruptAnimations() {
    this.animations.forEach((animation) => {
      if (animation.jumpToEnd) animation.jumpToEnd();
      if (animation.destroy) animation.destroy();
    });

    this.animations.length = 0;
  },
};

Animations.BACKGROUNDMAP = {
  heart: {
    images: [{
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/fa2fbd0d1d1b6a3dc6afe0f5a7bad564.png',
      position: '-5px -5px',
      iterationCount: 5,
      direction: 'alternate',
    }]
  },
  flower: {
    images: [{
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/f6f4b746bb5650d9dfbb9faaf4b31232.png',
      position: '0 0',
      iterationCount: 5,
      direction: 'alternate',
    }]
  },
  music_box: {
    images: [{
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/dde840de53fdb781337fa5b157668ba4.png',
      position: '0 0',
      iterationCount: 5,
    }, {
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/bf7b89ce08855b6a2df4ed78df011a76.png',
      position: '0 0',
      iterationCount: 10,
    }]
  }
};

export default Animations;
