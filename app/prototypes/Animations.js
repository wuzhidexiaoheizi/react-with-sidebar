import Animation from './Animation';
import MusicDispatcher from './MusicDispatcher';

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
    const animation = Animations.BACKGROUNDMAP[name] || Object();
    const { images, music } = animation;
    this.images = images;
    this.music = music;

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

      const callback = this.config.callback;
      delete this.config.callback;

      const config = Object.assign({}, {
        iterationCount,
        direction,
        onAnimationStart: () => {
          if (this.music) {
            this.dispatcher = MusicDispatcher.getInstance();
            this.dispatcher.pushMusic(this.music);
          }
        },
        callback: () => {
          if (index == mainIndex) {
            if (typeof callback == 'function') callback();
          }
        }
      }, this.config);

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
    }],
    music: {
      src: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/%E6%BB%91%E8%BF%87.mp3',
      loop: true,
    }
  },
  flower: {
    images: [{
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/f6f4b746bb5650d9dfbb9faaf4b31232.png',
      position: '0 0',
      iterationCount: 5,
      direction: 'alternate',
    }],
    music: {
      src: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/%E7%A4%BC%E8%8A%B1.mp3',
      loop: true,
    }
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
    }],
    music: {
      src: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/%E5%85%AB%E9%9F%B3%E7%9B%92.mp3',
      loop: true,
    }
  },
  pleasant_sheep: {
    images: [{
      url: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/2.pic_hd.jpg',
      position: '0 0',
      iterationCount: 5,
    }],
    music: {
      src: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/%E9%AD%94%E6%B3%95%E6%A3%92.mp3',
      loop: true,
    }
  },
  ultraman: {
    images: [{
      url: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/3.pic_hd.jpg',
      position: '0 0',
      iterationCount: 5,
    }],
    music: {
      src: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/%E8%BF%AA%E8%BF%A6%E5%A5%A5%E7%89%B9%E6%9B%BC.mp3',
      loop: false,
    }
  },
  bonnie_bear: {
    images: [{
      url: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/11.pic_hd.jpg',
      position: '0 0',
      iterationCount: 5,
    }],
    music: {
      src: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/%E7%86%8A%E5%87%BA%E6%B2%A1.mp3',
      loop: false,
    }
  },
};

export default Animations;
