function AnimateDispatcher(component, config = {}) {
  this.component = component;
  this.animations = [];
  this.animationGroup = [];
  this.initConfig(config);
  this.animationsDone = true;
}

AnimateDispatcher.prototype = {
  constructor: AnimateDispatcher,

  initConfig(config) {
    const { animationFlagField, expireTime, addBlessItem } = config;
    this.animationFlagField = animationFlagField;
    this.expireTime = expireTime;
    this.addBlessItem = addBlessItem;
  },

  addAnimation(animation) {
    this.animations.push(animation);
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
    this.playAnimation();
  },

  stopAnimations() {
    this.paused = true;
  },

  skipAnimations() {
    for (let i = 0; i < this.animations.length; i++) {
      const animation = this.animations[i];
      this.remarkAsDisplayed(animation);
    }

    this.animations = [];
    this.paused = true;
  },

  playAnimation() {
    if (this.paused || !this.animationGroup.length) {
      this.animationsDone = true;
      this.updateUnreadCount();
      return;
    }

    const group = this.animationGroup.shift();
    this.remarkMultiAnimationAsDisplayed(group);

    if (this.component.showAnimation) this.component.showAnimation(group, this.animationCallback.bind(this));
  },

  remarkMultiAnimationAsDisplayed(group) {
    group.forEach((animation) => {
      this.remarkAsDisplayed(animation);
    });
  },

  remarkAsDisplayed(animation) {
    const animationFlag = this.getFieldValue(animation, this.animationFlagField);
    const key = `bless-${animationFlag}`;
    const val = { hasPlayed: true, expireTime: this.expireTime };
    localStorage.setItem(key, JSON.stringify(val));
  },

  animationCallback() {
    this.playAnimation();
    this.updateUnreadCount();
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

    this.animationGroup = this.groupAnimations();
  },

  groupAnimations() {
    const animationGroup = {};
    let group;

    this.animations.forEach((animation) => {
      const { virtual_present: { name } } = animation;
      group = animationGroup[name];

      if (!group) {
        group = [];
        animationGroup[name] = group;
      }

      group.push(animation);
    });

    this.updateUnreadCount();

    return Object.values(animationGroup);
  },

  getUnreadCount() {
    return this.animationGroup.length;
  },

  animationsIsDone() {
    return this.animationsDone;
  }
};

export default AnimateDispatcher;
