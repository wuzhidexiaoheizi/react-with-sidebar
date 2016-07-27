import { getTipImage } from '../helper';
import Effect from './Effect';

function DismissTip(containment, type, message) {
  this.containment = containment;
  this.type = type;
  this.message = message;

  this.init();
}

DismissTip.prototype = {
  constructor: DismissTip,

  init() {
    this.render();

    this.content = this.element.querySelectorAll('.dismiss-tip-body')[0];
    this.adjustPosition();

    setTimeout(() => {
      /*eslint-disable */
      new Effect(this.content, {
        width: '*=0.9',
        height: '*=0.9',
        fontSize: '*=0.6',
      }, 'easeOutBounce', '450ms', () => {
        this.containment.removeChild(this.element);
      });
      /*eslint-disable */
    }, 4000);
  },

  render() {
    const element = this.element = document.createElement('div');
    element.setAttribute('class', 'dismiss-tip-modal');
    const tipImage = getTipImage(this.type);

    element.innerHTML = `
      <div class="dismiss-tip-content">
        <div class="dismiss-tip-body">
          <div class="tip-icon"><img src="${tipImage}" /></div>
          <div class="tip-msg">${this.message}</div>
        </div>
      </div>
    `;

    this.containment.appendChild(element);
  },

  adjustPosition() {
    const { clientHeight } = this.content;
    const height = this.element.clientHeight;

    this.content.style.marginTop = (height - clientHeight) / 2 + 'px';
  }
};

export default DismissTip;
