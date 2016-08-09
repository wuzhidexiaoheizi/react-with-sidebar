import BlessStore from './BlessStore';
import GiftList from './GiftList';
import BlessNotification from './BlessNotification';
import GiftAnimation from './GiftAnimation';
import BlessRemark from './BlessRemark';
import GiftProgress from './GiftProgress';
import BlessScreen from './BlessScreen';
import MusicDispatcher from './MusicDispatcher';

function BlessCommand(config = {}) {
  this.config = config;
  this.init();
}

BlessCommand.prototype = {
  constructor: BlessCommand,

  init() {
    this.isPaused = false;
    this.animationsDone = true;

    const { blessFlagField } = this.config;

    // 存储bless数据
    this.store = new BlessStore(this, blessFlagField);

    // 礼品列表
    const node = document.querySelector('.gift-list');
    this.giftList = new GiftList(this, node);

    // 新礼物通知
    this.notification = new BlessNotification(this);

    // 标记bless状态
    this.remark = new BlessRemark(blessFlagField);

    // 进度条
    this.progress = new GiftProgress();

    // 过场动画画布
    this.screen = new BlessScreen(this);

    this.attachEvents();
  },

  destroy() {
    this.store.destroy();
    this.giftList.destroy();
    this.notification.destroy();
    this.screen.destroy();
    this.detachEvents();
  },

  attachEvents() {
    this.progressElement = document.querySelector('.party-body .party-gnh');
    this.progressHandler = this.replayBlessGroup.bind(this);
    this.progressElement.addEventListener('click', this.progressHandler, false);
  },

  detachEvents() {
    this.progressElement.removeEventListener('click', this.progressHandler, false);
  },

  // 将已播放的祝福加入到礼物列表中
  addBlessItemToGiftList(bless) {
    this.giftList.insertNewBless(bless);
  },

  // 将已播放的祝福插入到礼物列表最前面
  prependBlessItemToGiftList(bless) {
    this.giftList.prependNewBless(bless);
  },

  // 插入新的祝福
  addBlesses(blesses) {
    const { expireTime } = this.config;

    const toInsertBlesses = this.store.getToInsertBlesses(blesses);

    if (Date.now() > expireTime) {
      this.remark.removeRemarkFlags(blesses);
      this.addBlessesToGiftList(toInsertBlesses);
      this.store.insertToAllBlesses(toInsertBlesses);
    } else {
      this.store.addBlesses(toInsertBlesses);
    }
  },

  // 将元素插入到礼品列表中
  addBlessesToGiftList(blesses) {
    this.giftList.insertNewBlesses(blesses);
  },

  // 更新未读祝福数量
  updateUnreadCount() {
    const unreadCount = this.store.getUnreadCount();
    this.notification.updateUnreadCount(unreadCount);
  },

  // 更新超时时间
  updateExpireTime(expireTime) {
    this.config.expireTime = expireTime;
  },

  getPlayOnAddedFlag() {
    const { playOnAdded, expireTime } = this.config;

    return playOnAdded && expireTime > Date.now();
  },

  // 播放新动画
  playUnplayedBlesses() {
    this.blessGroup = this.store.getBlessGroup();

    const flag = this.getPlayOnAddedFlag();

    if (flag) {
      this.playBlessGroups();
    } else {
      this.updateUnreadCount();
    }
  },

  manuallyPlayUnplayedBlesses() {
    this.blessGroup = this.store.getBlessGroup();
    this.playBlessGroups();
  },

  // 播放多组动画
  playBlessGroups() {
    if (!this.blessGroup.length) return;

    this.paused = false;
    this.animationsDone = false;
    this.beforePlayBlessGroups();
    this.playBlessGroup();
  },

  // 播放一组动画
  playBlessGroup() {
    this.updateUnreadCount();

    if (this.paused || !this.blessGroup.length) {
      this.animationsDone = true;
      this.afterBlessGroupsPlayed();
      return;
    }

    const group = this.blessGroup.shift();
    this.remark.remarkGroupAsDisplayed(group);
    this.autoPlayBlesses(group);
  },

  // 自动播放动画
  autoPlayBlesses(group) {
    const { checkPresent } = this.config;
    const { virtual_present: { name } } = group[0];

    checkPresent(name, (isValid) => {
      this.screen.playBlessGroup(group, isValid, this.playBlessGroup.bind(this));
    });
  },

  // 手动播放动画
  manuallyPlayBless(bless) {
    const { checkPresent } = this.config;
    const { virtual_present: { name } } = bless;

    checkPresent(name, (isValid) => {
      /*eslint-disable */
      new GiftAnimation(bless, isValid);
      /*eslint-enable */
    });
  },

  // 重新播放
  replayBlessGroup() {
    this.blessGroup = this.store.getAllBlessGroup();
    this.playBlessGroups();
  },

  // 多组动画播放前的操作
  beforePlayBlessGroups() {
    this.scrollToCertainPosition();
    this.screen.beforePlaying();
  },

  // 多组动画结束后的操作
  afterBlessGroupsPlayed() {
    const dispatcher = MusicDispatcher.getInstance();
    dispatcher.pauseAllSound();
    this.screen.afterPlayed();
  },

  // 一组动画结束后的回调
  animationCallback() {
    this.playAnimation();
  },

  skipAnimations() {
    this.screen.jumpToEnd();
  },

  insertSkippedBlesses(blesses) {
    const remainedBlesses = [];

    if (blesses) remainedBlesses.push(...blesses);

    for (let i = 0; i < this.blessGroup.length; i++) {
      const group = this.blessGroup[i];
      this.remark.remarkGroupAsDisplayed(group);
      remainedBlesses.push(...group);
    }

    this.afterBlessGroupsPlayed();

    this.addBlessesToGiftList(remainedBlesses);

    this.store.clear();
    this.paused = true;
  },

  scrollToCertainPosition() {
    const nanoContent = document.querySelector('.container-content');
    const { scrollHeight, clientHeight, scrollTop } = nanoContent;
    const maxST = scrollHeight - clientHeight;
    const giftGroup = nanoContent.querySelectorAll('.gift-group')[0];
    const rect = giftGroup.getBoundingClientRect();
    const { top } = rect;
    const offsetTop = top + scrollTop;
    const originTop = this.screen.getOriginTop();

    let st = maxST;

    if (offsetTop - st < originTop) st = offsetTop - originTop;

    nanoContent.scrollTop = st;

    this.progress.clearProgress();
    this.giftList.removeAllChildren();

    this.screen.resetGiftZone(st);
  },

  scrollToTop() {
    const nanoContent = document.querySelector('.container-content');
    nanoContent.scrollTop = 0;
  },

  updateProgressTotal(total) {
    this.progress.updateTotal(total);
  },

  increseWithdraw(bless) {
    const { virtual_present: { value, name } } = bless;
    const isHeart = name == 'heart';
    this.progress.addWithdraw(value, isHeart);
  },

  getAncestorNode(node, targetName) {
    if (this.detectClassName(node, targetName)) return node;
    let parent = node.parentNode;

    while (!this.detectClassName(parent, targetName) && parent.nodeName != 'BODY') {
      parent = parent.parentNode;
    }

    return parent.nodeName == 'BODY' ? null : parent;
  },

  detectClassName(node, targetName) {
    const { className } = node;

    return className.indexOf(targetName) > -1;
  },
};

export default BlessCommand;
