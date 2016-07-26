import { getTipImage } from '../helper';

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
    this.adjustPosition();

    setTimeout(this.destroy.bind(this), 4000);
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
    const element = this.element.querySelectorAll('.dismiss-tip-body')[0];
    const { clientHeight } = element;
    const height = this.element.clientHeight;

    element.style.marginTop = (height - clientHeight) / 2 + 'px';
  },

  destroy() {
    this.containment.removeChild(this.element);
  }
};

export default DismissTip;
