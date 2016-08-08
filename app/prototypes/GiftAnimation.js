import Animations from './Animations';
import MusicDispatcher from './MusicDispatcher';

function GiftAnimation(bless, isValid, autoDismiss) {
  this.bless = bless;
  this.isValid = isValid;
  this.autoDismiss = autoDismiss;

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
    this.element.parentNode.removeChild(this.element);
  },

  render() {
    const { sender: { nickname, login }, virtual_present: { name } } = this.bless;
    const distributorName = nickname || login;

    const element = this.element = document.createElement('div');
    element.setAttribute('class', 'anim-container');
    let tip = '';

    if (!this.isValid) tip = '<div class="invalid">无效动画</div>';

    const fragment = `
      <div class="donee-name">
        <div class="name">${distributorName}</div>
        赠送
      </div>
      <div class="anim ${name}">
        ${tip}
      </div>
      <button class="anim-close">X</button>
    `;

    element.innerHTML = fragment;
    const containment = document.querySelector('body');
    containment.appendChild(element);

    const animationElement = element.querySelectorAll('.anim')[0];
    /*eslint-disable */
    new Animations(animationElement, {
      name,
      callback: () => {
        if (this.autoDismiss) this.closeAnimation();
        
        const dispatcher = MusicDispatcher.getInstance();
        dispatcher.playBackgroundSound();
      }
    });
    /*eslint-enable */
  },

  attachEvents() {
    const closeBtn = this.closeBtn = this.element.querySelectorAll('.anim-close')[0];
    this.closeHandler = this.closeAnimation.bind(this);

    closeBtn.addEventListener('click', this.closeHandler, false);
  },

  detachEvents() {
    this.closeBtn.removeEventListener('click', this.closeHandler, false);
  },

  closeAnimation() {
    this.destroy();
  },
};

export default GiftAnimation;
