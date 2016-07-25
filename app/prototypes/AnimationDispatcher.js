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

  initConfig(config) {
    const {
      animationFlagField,
      expireTime,
      addBlessItem,
      showPageFooter,
      hidePageFooter,
      showCloseBtn,
      hideCloseBtn,
      skipHandler,
    } = config;

    this.animationFlagField = animationFlagField;
    this.expireTime = expireTime;
    this.addBlessItem = addBlessItem;
    this.showPageFooter = showPageFooter;
    this.hidePageFooter = hidePageFooter;
    this.showCloseBtn = showCloseBtn;
    this.hideCloseBtn = hideCloseBtn;
    this.skipHandler = skipHandler;
  },

  addAnimation(animation) {
    this.animations.push(animation);
    this.allAnimations.push(animation);
  },

  addAnimations(animations) {
    for (let i = 0; i < animations.length; i++) {
      this.addAnimation(animations[i]);
    }

    this.removePlayedAnimations();
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
    this.paused = false;
    this.animationsDone = false;

    if (!this.animationGroup.length) return;
    this.beforePlayAnimations();
    this.playAnimation();
  },

  playAll() {
    this.animationGroup = this.groupAnimations(this.allAnimations);

    if (!this.animationGroup.length) return;
    this.beforePlayAnimations();
    this.playAnimation();
  },

  beforePlayAnimations() {
    if (typeof this.showCloseBtn == 'function') this.showCloseBtn();
    if (this.isPageVisible() && typeof this.hidePageFooter == 'function') this.hidePageFooter();
  },

  afterAnimationsDone() {
    if (typeof this.hideCloseBtn == 'function') this.hideCloseBtn();
    if (!this.isPageVisible() && typeof this.showPageFooter == 'function') this.showPageFooter();
  },

  isPageVisible() {
    const element = document.querySelectorAll('.page-footer')[0];

    return window.parseInt(element.style.bottom) == 0;
  },

  stopAnimations() {
    this.paused = true;
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
    if (typeof this.skipHandler == 'function') this.skipHandler(remainAnimations);

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
    const animationFlag = this.getFieldValue(animation, this.animationFlagField);
    const key = `bless-${animationFlag}`;
    let val = localStorage.getItem(key);

    if (!val) {
      val = { hasPlayed: true, expireTime: this.expireTime };
      localStorage.setItem(key, JSON.stringify(val));
    }
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
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const animation = this.animations[i];
      const animationFlag = this.getFieldValue(animation, this.animationFlagField);
      const key = `bless-${animationFlag}`;
      const val = JSON.parse(localStorage.getItem(key) || '{}');
      const { hasPlayed, expireTime } = val;

      if (hasPlayed) {
        this.animations.splice(i, 1);
        if (typeof this.addBlessItem == 'function') this.addBlessItem(animation);
      }

      if (expireTime && expireTime < Date.now()) {
        localStorage.removeItem(key);
      }
    }

    this.updateUnreadCount();
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
