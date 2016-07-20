function GiftAnimations(containment, config = {}) {
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

GiftAnimations.prototype = {
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
  },

  updateDoneeName(bless) {
    const { sender: { nickname, login } } = bless;
    const doneeName = nickname || login;
    this.element.querySelectorAll('.name').innerText = doneeName;
  },

  attachEvents() {
    if (!this.autoDismiss) {
      const closeBtn = this.closeBtn = this.element.querySelectorAll('.anim-close')[0];
      this.closeHandler = this.closeAnimation.bind(this);

      closeBtn.addEventListener('click', this.closeHandler, false);
      return;
    }

    if (this.isValidAnimation) {
      const animationElement = this.animationElement = this.element.querySelectorAll('.anim')[0];
      this.animationEnd = this.autoDismissInAnimationDone.bind(this);

      animationElement.addEventListener('webkitAnimationEnd', this.animationEnd, false);
      animationElement.addEventListener('oAnimationEnd', this.animationEnd, false);
      animationElement.addEventListener('animationend', this.animationEnd, false);
    } else {
      setTimeout(this.animationCallback.bind(this), 2000);
    }
  },

  detachEvents() {
    if (!this.autoDismiss) {
      this.closeBtn.removeEventListener('click', this.closeHandler, false);
      return;
    }

    const animationElement = this.animationElement;

    animationElement.removeEventListener('webkitAnimationEnd', this.animationEnd, false);
    animationElement.removeEventListener('oAnimationEnd', this.animationEnd, false);
    animationElement.removeEventListener('animationend', this.animationEnd, false);
  },

  closeAnimation() {
    this.destroy();
  },

  autoDismissInAnimationDone() {
    const bless = this.animationBlesses.shift();

    if (typeof this.animationFun == 'function') this.addBlessToList(bless);
  },

  addBlessToList(bless) {
    this.animationFun(this.animationElement, bless, () => {
      if (this.animationBlesses.length == 0) {
        if (typeof this.animationCallback == 'function') {
          this.closeAnimation();
          this.animationCallback();
        }
      } else {
        this.animationElement.style.display = 'block';
        const _bless = this.animationBlesses.shift();
        this.updateDoneeName(_bless);
        this.addBlessToList(_bless);
      }
    });
  },
};

export default GiftAnimations;
