function AnimateDispatcher(component, config = {}) {
  this.component = component;
  this.animations = [];
  this.initConfig(config);
  this.animationsDone = true;
}

AnimateDispatcher.prototype = {
  constructor: AnimateDispatcher,

  initConfig(config) {
    const { animationNameField, animationFlagField, expireTime, doneeField } = config;
    this.animationFlagField = animationFlagField;
    this.animationNameField = animationNameField;
    this.expireTime = expireTime;
    this.doneeField = doneeField;
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
    if (this.paused || !this.animations.length) {
      this.animationsDone = true;
      return;
    }

    const animation = this.animations.shift();
    const doneeName = this.getFieldValue(animation, this.doneeField);
    const animationName = this.getFieldValue(animation, this.animationNameField);
    this.remarkAsDisplayed(animation);

    if (this.component.showAnimation) this.component.showAnimation(doneeName, animationName, this.animationCallback.bind(this));
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
    for (let i = 0; i < this.animations.length; i++) {
      const animation = this.animations[i];
      const animationFlag = this.getFieldValue(animation, this.animationFlagField);
      const key = `bless-${animationFlag}`;
      const val = JSON.parse(localStorage.getItem(key) || '{}');
      const { hasPlayed, expireTime } = val;

      if (hasPlayed) {
        this.animations.splice(i, 1);
      }

      if (expireTime && expireTime < Date.now()) {
        localStorage.removeItem(key);
      }
    }

    this.updateUnreadCount();
  },

  getUnreadCount() {
    return this.animations.length;
  },

  animationsIsDone() {
    return this.animationsDone;
  }
};

export default AnimateDispatcher;
