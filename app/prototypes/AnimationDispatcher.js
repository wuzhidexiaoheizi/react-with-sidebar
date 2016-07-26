import WithdrawTip from './WithdrawTip';

function AnimateDispatcher(component, config = {}) {
  this.component = component;
  this.animations = [];
  this.allAnimations = [];
  this.animationGroup = [];
  this.initConfig(config);
  this.animationsDone = true;
}

AnimateDispatcher.prototype = {
  constructor: AnimateDispatcher,

  initConfig(config = {}) {
    this.config = config;
    const { birthday } = config;
    this.expireTime = birthday + 2 * 7 * 24 * 60 * 60 * 1000;
  },

  addAnimation(animation) {
    this.animations.push(animation);
    this.allAnimations.push(animation);
  },

  addAnimations(animations) {
    if (Date.now() >= this.expireTime) {
      this.removeRemarkFlags(animations);

      return;
    }

    for (let i = 0; i < animations.length; i++) {
      this.addAnimation(animations[i]);
    }

    this.removePlayedAnimations();

    const { playOnAdded } = this.config;

    if (playOnAdded) {
      this.playAnimations();
    } else {
      this.updateUnreadCount();
    }
  },

  removeAnimation(animation) {
    const index = this.animations.indexOf(animation);

    if (index > -1) this.animations.splice(index, 1);
  },

  clearAnimations() {
    this.animations = [];
    this.paused = true;
  },

  playAnimations() {
    if (!this.animationGroup.length) return;

    this.paused = false;
    this.animationsDone = false;
    this.animations.length = 0;
    this.beforePlayAnimations();
    this.playAnimation();
  },

  playAll() {
    this.animationGroup = this.groupAnimations(this.allAnimations);

    if (!this.animationGroup.length) return;
    this.paused = false;
    this.animationsDone = false;
    this.beforePlayAnimations();
    this.playAnimation();
  },

  beforePlayAnimations() {
    const { showCloseBtn, hidePageFooter } = this.config;

    if (typeof showCloseBtn == 'function') showCloseBtn();
    if (typeof hidePageFooter == 'function') hidePageFooter();
  },

  afterAnimationsDone() {
    const { hideCloseBtn, showPageFooter } = this.config;

    if (typeof hideCloseBtn == 'function') hideCloseBtn();
    if (typeof showPageFooter == 'function') showPageFooter();

    /*eslint-disable */
    new WithdrawTip(this.withdraw);
    /*eslint-enable */
  },

  isPageVisible() {
    const element = document.querySelectorAll('.page-footer')[0];

    return window.parseInt(element.style.bottom) == 0;
  },

  stopAnimations() {
    this.paused = true;
  },

  updateWithdraw(withdraw) {
    this.withdraw = withdraw;
  },

  skipAnimations(animations) {
    const remainAnimations = [];

    if (animations) remainAnimations.push(...animations);

    for (let i = 0; i < this.animationGroup.length; i++) {
      const group = this.animationGroup[i];
      this.remarkAnimaitionGroupAsDisplayed(group);
      remainAnimations.push(...group);
    }

    this.afterAnimationsDone();

    const { skipHandler } = this.config;
    if (typeof skipHandler == 'function') skipHandler(remainAnimations);

    this.animations.length = 0;
    this.animationGroup.length = 0;
    this.paused = true;
  },

  playAnimation() {
    this.updateUnreadCount();

    if (this.paused || !this.animationGroup.length) {
      this.animationsDone = true;

      this.afterAnimationsDone();
      return;
    }

    const group = this.animationGroup.shift();
    this.remarkAnimaitionGroupAsDisplayed(group);

    if (this.component.showAnimation) this.component.showAnimation(group, this.animationCallback.bind(this));
  },

  remarkAnimaitionGroupAsDisplayed(group) {
    group.forEach((animation) => {
      this.remarkAsDisplayed(animation);
    });
  },

  remarkAsDisplayed(animation) {
    const { animationFlagField } = this.config;
    const animationFlag = this.getFieldValue(animation, animationFlagField);
    const key = `bless-${animationFlag}`;
    let val = localStorage.getItem(key);

    if (!val) {
      val = { hasPlayed: true };
      localStorage.setItem(key, JSON.stringify(val));
    }
  },

  removeRemarkFlags(animations) {
    animations.forEach((animation) => {
      this.removeRemarkFlag(animation);
    });
  },

  removeRemarkFlag(animation) {
    const { animationFlagField } = this.config;
    const animationFlag = this.getFieldValue(animation, animationFlagField);
    const key = `bless-${animationFlag}`;

    localStorage.removeItem(key);
  },

  animationCallback() {
    this.playAnimation();
  },

  updateUnreadCount() {
    if (this.component.updateUnreadCount) {
      const unreadCount = this.getUnreadCount();
      this.component.updateUnreadCount(unreadCount);
    }
  },

  getFieldValue(obj, fieldName) {
    const ary = fieldName.split(':');
    let i = 0;
    let field = obj[ary[i]];

    while (++i <= ary.length - 1) {
      field = field[ary[i]];
    }

    return field;
  },

  removePlayedAnimations() {
    const { animationFlagField, addBlessItem } = this.config;

    for (let i = this.animations.length - 1; i >= 0; i--) {
      const animation = this.animations[i];
      const animationFlag = this.getFieldValue(animation, animationFlagField);
      const key = `bless-${animationFlag}`;
      const val = JSON.parse(localStorage.getItem(key) || '{}');
      const { hasPlayed } = val;

      if (hasPlayed) {
        this.animations.splice(i, 1);

        if (typeof addBlessItem == 'function') addBlessItem(animation);
      }
    }

    this.animationGroup = this.groupAnimations(this.animations);
  },

  groupAnimations(animations) {
    const animationGroup = {};
    let group;

    animations.forEach((animation) => {
      const { virtual_present: { name } } = animation;
      group = animationGroup[name];

      if (!group) {
        group = [];
        animationGroup[name] = group;
      }

      group.push(animation);
    });

    return Object.values(animationGroup);
  },

  getUnreadCount() {
    return this.animations.length;
  },

  animationsIsDone() {
    return this.animationsDone;
  }
};

export default AnimateDispatcher;
