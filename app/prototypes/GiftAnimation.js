import Animations from './Animations';
import MusicDispatcher from './MusicDispatcher';
import Constants from '../constants';

function GiftAnimation(containment, config = {}) {
  const {
    animationBlesses,
    autoDismiss,
    isValidAnimation,
    animationCallback,
    animationFun,
  } = config;

  this.containment = containment;
  this.animationBlesses = animationBlesses;
  this.autoDismiss = autoDismiss;
  this.isValidAnimation = isValidAnimation;
  this.animationCallback = animationCallback;
  this.animationFun = animationFun;

  this.init();
}

GiftAnimation.prototype = {
  constructor: GiftAnimation,

  init() {
    this.render();
    this.attachEvents();
  },

  destroy() {
    this.detachEvents();
    this.containment.removeChild(this.element);
  },

  render() {
    const bless = this.animationBlesses[0];
    const { virtual_present: { name }, sender: { nickname, login } } = bless;
    const doneeName = nickname || login;
    const element = this.element = document.createElement('div');
    element.setAttribute('class', 'anim-container');
    let tip = '';
    let button = '';

    if (!this.isValidAnimation) tip = '<div class="invalid">无效动画</div>';
    if (!this.autoDismiss) button = '<button class="anim-close">X</button>';

    const fragment = `
      <div class="donee-name">
        <div class="name">${doneeName}</div>
        赠送
      </div>
      <div class="anim ${name}">
        ${tip}
      </div>
      ${button}
    `;

    element.innerHTML = fragment;
    this.containment.appendChild(element);

    /*eslint-disable */
    const animationElement = this.animationElement = element.querySelectorAll('.anim')[0];
    new Animations(animationElement, {
      name,
      callback: () => {
        if (this.autoDismiss) this.autoDismissInAnimationDone();
      }
    });
    /*eslint-enable */
  },

  updateDoneeName(bless) {
    const { sender: { nickname, login } } = bless;
    const doneeName = nickname || login;
    this.element.querySelectorAll('.name')[0].innerText = doneeName;
  },

  attachEvents() {
    if (!this.autoDismiss) {
      const closeBtn = this.closeBtn = this.element.querySelectorAll('.anim-close')[0];
      this.closeHandler = this.closeAnimation.bind(this);

      closeBtn.addEventListener('click', this.closeHandler, false);
      return;
    }
  },

  detachEvents() {
    if (!this.autoDismiss) {
      this.closeBtn.removeEventListener('click', this.closeHandler, false);
      return;
    }
  },

  closeAnimation() {
    this.destroy();
  },

  autoDismissInAnimationDone() {
    const bless = this.animationBlesses.shift();

    this.started = true;
    this.ended = false;

    if (typeof this.animationFun == 'function') {
      this.isFirstTime = true;
      this.addBlessToList(bless);
    }
  },

  animationEndHandler() {
    this.closeAnimation();

    if (typeof this.animationCallback == 'function') {
      this.animationCallback();
    }
  },

  addBlessToList(bless) {
    if (this.ended) {
      this.animationEndHandler();
      return;
    }

    const dispatcher = MusicDispatcher.getInstance();
    const { BUBBLE_MUSIC } = Constants;

    if (this.isFirstTime) {
      dispatcher.pushMusic({
        src: BUBBLE_MUSIC,
        loop: false,
      });
    } else {
      dispatcher.replay();
    }

    this.animationFun(this.animationElement, bless, () => {
      if (this.animationBlesses.length == 0) {
        this.started = false;
        this.ended = true;
        this.animationEndHandler();
      } else {
        const _bless = this.animationBlesses.shift();
        this.updateDoneeName(_bless);
        this.isFirstTime = false;
        this.addBlessToList(_bless);
      }
    });
  },

  jumpToEnd(interruptAnimation) {
    this.ended = true;
    this.destroy();

    const blesses = this.animationBlesses;

    if (typeof interruptAnimation == 'function') interruptAnimation(blesses);
  },
};

export default GiftAnimation;
