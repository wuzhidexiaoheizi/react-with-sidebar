import { extractPresentAvatar } from '../helper';

function GiftList(command, element, blesses = []) {
  this.command = command;
  this.element = element;
  this.blesses = blesses;

  this.initState();
  this.init();
}

GiftList.prototype = {
  constructor: GiftList,

  init() {
    this.attachEvents();
  },

  destroy() {
    this.blesses.length = 0;
    this.detachEvents();
  },

  initState() {
    this.containerWidth = this.element.clientWidth;
    this.offsetLeft = this.element.offsetLeft;
    this.ITEM_SIZE = GiftList.CONSTANTS.ITEM_SIZE;
    this.countInLine = Math.floor(this.containerWidth / this.ITEM_SIZE);
  },

  insertBlesses(blesses) {
    blesses.forEach((bless) => {
      this.insertBless(bless);
    });
  },

  insertBless(bless) {
    this.appendItem(bless, false);
  },

  appendItem(bless, isPrepend) {
    const { virtual_present: { name }, id } = bless;
    const imageAvatar = extractPresentAvatar(name);
    const node = document.createElement('div');
    node.setAttribute('class', 'gift-item');
    node.setAttribute('bless-id', id);
    node.innerHTML = `<img src="${imageAvatar}" class="gift-avatar" />`;

    if (isPrepend) {
      this.element.insertBefore(node, this.element.childNodes[0]);
    } else {
      this.element.appendChild(node);
    }

    this.command.increseWithdraw(bless);
  },

  insertNewBless(bless) {
    this.blesses.push(bless);

    this.insertBless(bless);
  },

  prependNewBless(bless) {
    this.blesses.unshift(bless);

    this.appendItem(bless, true);
  },

  insertNewBlesses(blesses) {
    this.blesses.push(...blesses);

    blesses.forEach((bless) => {
      this.insertBless(bless);
    });
  },

  attachEvents() {
    this.onClicked = this.clickHandler.bind(this);
    this.element.addEventListener('click', this.onClicked, false);

    this.resizeHandler = this.initState.bind(this);
    window.addEventListener('resize', this.resizeHandler, false);

    const list = document.querySelector('.bless-container');
    this.showBless = this.showBlessHandler.bind(this);
    list.addEventListener('click', this.showBless, false);
  },

  detachEvents() {
    this.element.removeEventListener('click', this.onClicked, false);
    window.removeEventListener('resize', this.resizeHandler, false);

    const list = document.querySelector('.bless-container');
    list.removeEventListener('click', this.showBless, false);
  },

  clickHandler(e) {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;

    if (this.command.detectClassName(target, 'gift-list')) return;

    const parentNode = this.command.getAncestorNode(target, 'gift-item');

    if (!parentNode) return;

    const blessId = parentNode.getAttribute('bless-id');
    const bless = this.blesses.find(b => b.id == blessId);

    this.command.manuallyPlayBless(bless);
  },

  showBlessHandler(e) {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;

    if (this.command.detectClassName(target, 'bless-list')) return;

    const parentNode = this.command.getAncestorNode(target, 'bless-gift');

    if (!parentNode) return;

    const blessId = parentNode.dataset.blessId;

    const bless = this.blesses.find(b => b.id == blessId);

    this.command.manuallyPlayBless(bless);
  },

  removeAllChildren() {
    this.element.innerHTML = '';
  }
};

GiftList.CONSTANTS = {
  ITEM_SIZE: 50,
};

export default GiftList;
