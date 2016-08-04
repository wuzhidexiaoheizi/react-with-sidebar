import Constants from '../constants';
import Effect from '../prototypes/Effect';

function BlessNotification(command) {
  this.command = command;
  this.init();
}

BlessNotification.prototype = {
  constructor: BlessNotification,

  init() {
    this.isNotifying = false;
    this.unreadCount = 0;
    this.render();

    this.attachEvent();
  },

  destroy() {
    this.detachEvent();
    this.element.parentNode.removeChild(this.element);
  },

  render() {
    const { UNREAD_GIFT_ICON } = Constants;
    const element = this.element = document.createElement('div');
    element.className = 'unread-gifts';
    element.innerHTML = `
      <img src="${UNREAD_GIFT_ICON}" />
      <div class="unread-desc">新礼物</div>
    `;
    const containment = document.querySelector('body');
    containment.appendChild(element);
  },

  attachEvent() {
    this.clickHandler = this.playNewlyBlesses.bind(this);
    this.element.addEventListener('click', this.clickHandler, false);
  },

  detachEvent() {
    this.element.removeEventListener('click', this.clickHandler, false);
  },

  playNewlyBlesses() {
    this.command.manuallyPlayUnplayedBlesses();
  },

  updateUnreadCount(unreadCount) {
    this.unreadCount = unreadCount;
    this.notify();
  },

  notify() {
    if (this.unreadCount > 0) {
      if (!this.isNotifying) {
        this.element.style.display = 'block';
        this.isNotifying = true;
        this.effect = new Effect(this.element, { bottom: '+=5px' },
          'flip', 100, null, { effectInterval: 2000 });
      }
    } else {
      this.isNotifying = false;
      this.element.style.display = 'none';

      if (this.effect) {
        this.effect.stop();
        this.effect = null;
      }
    }
  }
};

export default BlessNotification;
