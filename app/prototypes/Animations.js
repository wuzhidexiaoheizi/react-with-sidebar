import Animation from './Animation';
import MusicDispatcher from './MusicDispatcher';
import Constants from '../constants';

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

const {
  PRESENT_HEART_MUSIC,
  PRESENT_FLOWER_MUSIC,
  PRESENT_MUSIC_BOX_MUSIC,
  PRESENT_PLEASANT_SHEEP_MUSIC,
  PRESENT_BOONIE_BEAR_MUSIC,
  PRESENT_ULTRAMAN_MUSIC,
} = Constants;

Animations.prototype = {
  constructor: Animations,

  init() {
    const { name } = this.config;
    const animation = Animations.BACKGROUNDMAP[name] || Object();
    const { images, music } = animation;
    this.images = images;
    this.music = Object.assign({}, music, { name });

    if (!this.images || !this.images.length) return;

    const mainIndex = this.lookupMainAnimationIndex();
    const dispatcher = MusicDispatcher.getInstance();
    dispatcher.pushSound(this.music, () => {
      this.createAnimations(mainIndex);
    });
  },

  createAnimations(mainIndex) {
    let element;
    let animation;

    this.images.forEach((image, index) => {
      const { url, position, iterationCount, direction, frameTime, frameCount } = image;
      element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      element.style.width = this.containerWidth + 'px';
      element.style.height = this.containerHeight + 'px';

      this.containment.appendChild(element);

      const callback = this.config.callback;
      const config = Object.assign({}, {
        iterationCount,
        direction,
        frameTime,
        frameCount,
        url,
        position,
        callback: () => {
          if (index == mainIndex && typeof callback == 'function') callback();
        }
      }, this.config);

      const dispatcher = MusicDispatcher.getInstance();
      dispatcher.pushSound(this.music, () => {
        animation = new Animation(element, config);
        this.animations.push(animation);
      });
    });
  },

  lookupMainAnimationIndex() {
    let mainIndex = 0;

    this.images.forEach((image, index) => {
      const { iterationCount } = image;

      if ((this.iterationCount && iterationCount < this.iterationCount) || !this.iterationCount) {
        this.iterationCount = iterationCount;
        mainIndex = index;
      }
    });

    return mainIndex;
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
      iterationCount: 3,
      direction: 'alternate',
    }],
    music: {
      src: PRESENT_HEART_MUSIC,
      loop: false,
    }
  },
  flower: {
    images: [{
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/f6f4b746bb5650d9dfbb9faaf4b31232.png',
      position: '0 0',
      iterationCount: 1,
      direction: 'alternate',
    }],
    music: {
      src: PRESENT_FLOWER_MUSIC,
      loop: false,
    }
  },
  music_box: {
    images: [{
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/dde840de53fdb781337fa5b157668ba4.png',
      position: '0 0',
      iterationCount: 2,
    }, {
      url: 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/bf7b89ce08855b6a2df4ed78df011a76.png',
      position: '0 0',
      iterationCount: 4,
    }],
    music: {
      src: PRESENT_MUSIC_BOX_MUSIC,
      loop: false,
    }
  },
  pleasant_sheep: {
    images: [{
      url: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/2.pic_hd.jpg',
      position: '0 0',
      iterationCount: 1,
    }],
    music: {
      src: PRESENT_PLEASANT_SHEEP_MUSIC,
      loop: false,
    }
  },
  ultraman: {
    images: [{
      url: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/3.pic_hd.jpg',
      position: '0 0',
      iterationCount: 1,
    }],
    music: {
      src: PRESENT_ULTRAMAN_MUSIC,
      loop: false,
    }
  },
  bonnie_bear: {
    images: [{
      url: 'https://s3.cn-north-1.amazonaws.com.cn/wlassets/11.pic_hd.jpg',
      position: '0 0',
      iterationCount: 1,
      frameCount: 33,
    }],
    music: {
      src: PRESENT_BOONIE_BEAR_MUSIC,
      loop: false,
    }
  },
};

export default Animations;
