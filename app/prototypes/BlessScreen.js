import Animations from './Animations';
import { extractPresentAvatar } from '../helper';
import Effect from './Effect';
import MusicDispatcher from './MusicDispatcher';
import Constants from '../constants';

function BlessScreen(command) {
  this.command = command;
  this.init();
}

BlessScreen.prototype = {
  constructor: BlessScreen,

  init() {
    this.render();
    this.initState();

    this.skipBtn = this.element.querySelectorAll('.skip-btn')[0];
    this.attachEvents();
  },

  destroy() {
    this.detachEvents();
  },

  initState() {
    const containerWidth = this.element.clientWidth;
    this.offsetLeft = this.element.offsetLeft;
    this.ITEM_SIZE = BlessScreen.CONSTANTS.ITEM_SIZE;
    this.countInLine = Math.floor(containerWidth / this.ITEM_SIZE);
    this.ended = false;
  },

  render() {
    const element = this.element = document.createElement('div');
    element.className = 'cut-screen';
    element.innerHTML = `
      <div class="light-overlayer"></div>
      <div class="dark-overlayer"></div>
      <div class="screen-container">
        <div class="container">
          <div class="row">
            <div class="screen-content">
              <div class="skip-btn">跳过动画</div>
              <div class="main-zone">
                <div class="text-ellipsis contributor"></div>
                <div class="animate-zone"></div>
              </div>
              <div class="gift-zone"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    const body = document.querySelector('body');
    body.appendChild(element);
  },

  attachEvents() {
    this.skipHandler = this.skipAnimations.bind(this);
    this.skipBtn.addEventListener('click', this.skipHandler, false);
  },

  skipAnimations() {
    this.command.skipAnimations();
  },

  detachEvents() {
    this.skipBtn.removeEventListener('click', this.skipHandler, false);
  },

  resetMainZone(bless, isValid, callback) {
    const { sender: { nickname, login }, virtual_present: { name } } = bless;
    const contributor = nickname || login;
    const text = contributor + '赠送';

    this.element.querySelectorAll('.contributor')[0].textContent = text;

    const node = this.element.querySelectorAll('.animate-zone')[0];
    node.innerHTML = '';

    if (isValid) {
      /*eslint-disable */
      new Animations(node, {
        name,
        callback,
      });
      /*eslint-enable */
    } else {
      node.innerHTML = '<div class="invalid">无效动画</div>';
      setTimeout(callback, 2000);
    }
  },

  resetGiftZone(st) {
    const nodeToClone = document.querySelector('.party-body .gift-group');
    const node = nodeToClone.cloneNode(true);
    const containment = this.element.querySelectorAll('.gift-zone')[0];
    containment.innerHTML = '';
    containment.appendChild(node);

    if (st > 260) {
      containment.style.top = st + 'px';
    }
  },

  beforePlaying() {
    this.element.style.visibility = 'visible';
    this.showSkipBtn();
  },

  showSkipBtn() {
    this.skipBtn.style.display = 'block';
  },

  hideSkipBtn() {
    this.skipBtn.style.display = 'none';
  },

  afterPlayed() {
    this.hideSkipBtn();
    this.element.style.visibility = 'hidden';
  },

  playBlessGroup(group, isValid, callback) {
    this.remained = group;

    if (this.ended) return;

    const { BUBBLE_MUSIC } = Constants;
    const dispatcher = MusicDispatcher.getInstance();
    dispatcher.pushMusic({
      src: BUBBLE_MUSIC,
      loop: false,
    });

    const bless = group.shift();
    const { virtual_present: {name} } = bless;
    const isHeart = name == 'heart';

    if (isHeart) {
      setTimeout(() => {
        this.animateToList(bless, () => {
          this.aminationCallback(group, isValid, callback);
        });
      }, 100);
    } else {
      setTimeout(() => {
        this.animateToList(bless, () => {
          this.resetMainZone(bless, isValid, () => {
            this.aminationCallback(group, isValid, callback);
          });
        });
      }, 100);
    }
  },

  aminationCallback(group, isValid, callback) {
    if (group.length > 0) {
      this.playBlessGroup(group, isValid, callback);
    } else {
      if (typeof callback == 'function') callback();
    }
  },

  // 获取动画目标坐标
  getCoordinate() {
    const blessItems = this.element.querySelectorAll('.gift-item');
    const length = blessItems.length;

    if (!length) return this.getContainerRect();

    const blessItem = blessItems[length - 1];
    const rect = blessItem.getBoundingClientRect();
    let { left, top } = rect;
    const { right, bottom } = rect;
    left = right;

    if (right - this.offsetLeft >= this.ITEM_SIZE * this.countInLine) {
      left = this.getContainerRect()[0];
      top = bottom;
    }

    return [left, top];
  },

  // 获取容器坐标
  getContainerRect() {
    const containment = this.element.querySelectorAll('.gift-list')[0];
    const rect = containment.getBoundingClientRect();
    const { left, top } = rect;

    return [left, top];
  },

  // 动画元素
  getElement(bless) {
    const node = document.createElement('div');
    const size = this.ITEM_SIZE;
    const { innerWidth, innerHeight } = window;
    const x = (innerWidth - size) / 2;
    const y = innerHeight - size / 2;
    const { virtual_present: { name} } = bless;

    node.className = 'gift-animation';
    node.style.position = 'absolute';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.style.zIndex = 99;
    node.style.width = `${size}px`;
    const src = extractPresentAvatar(name);
    node.innerHTML = `<img src="${src}" class="animation-img" />`;
    this.element.appendChild(node);

    return node;
  },

  // 飞入动画
  animateToList(bless, callback) {
    const element = this.getElement(bless);
    const coordinate = this.getCoordinate();
    const [left, top] = coordinate;
    const effectObj = { left, top };

    /*eslint-disable */
    new Effect(element, effectObj, 'easeInOutBack', '250ms', () => {
      element.parentNode.removeChild(element);
      this.insertBless(bless);
      this.command.addBlessItemToGiftList(bless);
      
      if (typeof callback == 'function') callback();
    });
    /*eslint-enable */
  },

  // 插入礼物
  insertBless(bless) {
    const { virtual_present: { name }, id } = bless;
    const imageAvatar = extractPresentAvatar(name);
    const node = document.createElement('div');
    node.className = 'gift-item';
    node.setAttribute('bless-id', id);
    node.innerHTML = `<img src="${imageAvatar}" class="gift-avatar" />`;
    const containment = this.element.querySelectorAll('.gift-list')[0];
    containment.appendChild(node);
  },

  jumpToEnd() {
    this.ended = true;
    this.hideSkipBtn();
    this.command.insertSkippedBlesses(this.remained);
  },
};

BlessScreen.CONSTANTS = {
  ITEM_SIZE: 50,
};

export default BlessScreen;
