import { extractPresentAvatar, extractPresentImage } from '../helper';
import Effect from './Effect';
import GiftProgress from './GiftProgress';

function GiftList(element, blesses = [], config = {}) {
  const { playOnAdded, showAnimation, total } = config;
  this.element = element;
  this.blesses = blesses;
  this.playOnAdded = playOnAdded || false;
  this.showAnimation = showAnimation;
  this.total = total || 0;
  this.animateContainer = document.querySelectorAll('.container-content')[0];
  this.overlayer = document.querySelectorAll('.party-container')[0];
  this.containerHeight = 0;
  this.initState();
  this.init();
}

GiftList.prototype = {
  init() {
    if (this.playOnAdded) {
      this.initProgressBar();
    } else {
      this.insertBlesses();
    }

    this.attachEvents();
  },

  destroy() {
    this.blesses.length = 0;
    this.progress.destroy();
    this.detachEvents();
  },

  initState() {
    this.containerWidth = this.element.clientWidth;
    this.ITEM_SIZE = GiftList.CONSTANTS.ITEM_SIZE;
    this.countInLine = Math.floor(this.containerWidth / this.ITEM_SIZE);
  },

  insertBlesses() {
    const { length } = this.blesses;

    this.initProgressBar(length);

    this.blesses.forEach((bless) => {
      this.insertBless(bless);
    });
  },

  insertBless(bless) {
    const { virtual_present: { name }, id } = bless;
    const imageAvatar = extractPresentAvatar(name);
    const node = document.createElement('div');
    node.setAttribute('class', 'gift-item');
    node.setAttribute('bless-id', id);
    node.innerHTML = `<img src="${imageAvatar}" class="gift-avatar" />`;
    this.element.appendChild(node);

    this.recalculateHeight();
    this.progress.increment();
  },

  insertNewBlesses(blesses) {
    this.blesses.push(...blesses);

    if (this.playOnAdded) {
      this.recalculateHeight();
      return;
    }

    blesses.forEach((bless) => {
      this.insertBless(bless);
    });
  },

  updateProgressTotal(total) {
    this.progress.updateTotal(total);
  },

  initProgressBar(initCount) {
    const containment = this.getProgressContainer();
    this.progress = new GiftProgress(containment, this.total, { initCount });
  },

  getProgressContainer() {
    const element = document.createElement('div');
    element.setAttribute('class', 'progress-container');
    this.element.parentNode.appendChild(element);

    return element;
  },

  getCoordinate() {
    const blessItems = this.element.querySelectorAll('.gift-item');
    const length = blessItems.length;
    let left;
    let top;
    let rect;

    if (!length) return this.getContainerRect();

    const blessItem = blessItems[length - 1];
    rect = blessItem.getBoundingClientRect();
    top = rect.top;
    left = rect.left;
    left += this.ITEM_SIZE;

    if (left + this.ITEM_SIZE > this.containerWidth) {
      left = this.getContainerRect().left;
      top += this.ITEM_SIZE;
    }

    return [left, top];
  },

  scrollToList() {
    const top = this.getContainerRect()[1];
    const offsetTop = this.element.offsetTop;
    const { clientHeight } = this.animateContainer;
    let y = offsetTop - top;
    const progress = this.element.nextSibling;
    const height = progress.clientHeight;

    if (y == 0) y = (top + this.containerHeight + height - clientHeight) * 2;

    this.animateContainer.scrollTop = y;
  },

  animateToList(element, bless, callback) {
    this.scrollToList();

    const animationElement = this.getAnimationElement(element, bless);
    const coordinate = this.getCoordinate();
    let [left, top] = coordinate;
    const half = this.ITEM_SIZE / 2;
    left += half;
    top -= half;
    const effectObj = { left, top };
    effectObj.width = this.ITEM_SIZE;

    /*eslint-disable */
    new Effect(animationElement, effectObj, 'easeInOutBack', '450ms', () => {
      animationElement.parentNode.removeChild(animationElement);
      this.insertBless(bless);

      if (typeof callback == 'function') callback();
    });
    /*eslint-enable */
  },

  getAnimationElement(element, bless) {
    const rect = element.getBoundingClientRect();
    const { left, top, width } = rect;
    const { virtual_present: { name } } = bless;
    const animateElement = document.createElement('div');

    animateElement.setAttribute('class', 'gift-animation');
    animateElement.style.position = 'absolute';
    animateElement.style.left = `${left}px`;
    animateElement.style.top = `${top}px`;
    animateElement.style.zIndex = 99;
    animateElement.style.width = `${width}px`;
    const src = extractPresentImage(name);
    animateElement.innerHTML = `<img src="${src}" class="animation-img" />`;
    // const body = document.querySelectorAll('body')[0];
    this.overlayer.appendChild(animateElement);

    element.style.display = 'none';

    return animateElement;
  },

  getContainerRect() {
    const rect = this.element.getBoundingClientRect();
    const { left, top } = rect;

    return [left, top];
  },

  recalculateHeight() {
    const { length } = this.blesses;
    const lines = Math.ceil(length / this.countInLine);
    const height = GiftList.CONSTANTS.ITEM_SIZE * lines;
    this.containerHeight = height;

    this.element.style.height = `${height}px`;
  },

  attachEvents() {
    this.onClicked = this.clickHandler.bind(this);
    this.element.addEventListener('click', this.onClicked, false);

    this.resizeHandler = this.initState.bind(this);
    window.addEventListener('resize', this.resizeHandler, false);
  },

  detachEvents() {
    this.element.removeEventListener('click', this.onClicked, false);
    window.removeEventListener('resize', this.resizeHandler, false);
  },

  clickHandler(e) {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const parentNode = this.getAncestorNode(target, 'gift-item');
    const blessId = parentNode.getAttribute('bless-id');
    const bless = this.blesses.find(b => b.id == blessId);

    if (typeof this.showAnimation == 'function') this.showAnimation(bless);
  },

  getSelfAndAncestorNodes(node, targetName) {
    let isEnd = false;
    const nodes = [ node ];

    if (this.detectClassName(node, targetName)) return nodes;

    while (!isEnd) {
      const parent = node.parentNode;
      nodes.push(parent);

      if (this.detectClassName(parent, targetName)) isEnd = true;
    }

    return nodes;
  },

  getAncestorNode(node, targetName) {
    if (this.detectClassName(node, targetName)) return node;
    let parent = node.parentNode;

    while (!this.detectClassName(parent, targetName)) {
      parent = parent.parentNode;
    }

    return parent;
  },

  detectClassName(node, targetName) {
    const className = node.getAttribute('class');

    return className.indexOf(targetName) > -1;
  },

  removeAllChildren() {
    this.element.innerHTML = '';
    this.progress.clearProgress();
  },
};

GiftList.CONSTANTS = {
  ITEM_SIZE: 50,
};

export default GiftList;
