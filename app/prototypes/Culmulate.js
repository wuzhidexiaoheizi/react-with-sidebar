import Effect from './Effect';

function Culmulate(containment, amount, time = 250, config = {}) {
  this.containment = containment;
  this.amount = amount;
  this.time = time;
  this.config = config;
  this.init();
}

Culmulate.prototype = {
  constructor: Culmulate,

  init() {
    this.fontSize = 32;
    this.render();
  },

  render() {
    let right = 30;
    let bottom = 50;
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.right = right + 'px';
    element.style.bottom = bottom + 'px';
    element.style.color = '#F7D92C';
    element.style.fontSize = this.fontSize + 'px';
    element.style.fontWeight = 700;
    element.style.opacity = 0.8;
    element.textContent = '+' + this.amount;
    this.containment.appendChild(element);
    const { onStart, onEnd } = this.config;

    right -= 30;
    bottom += 30;
    this.fontSize = 64;
    const effectObj = { right, bottom, fontSize: this.fontSize };

    if (typeof onStart == 'function') onStart();

    /*eslint-disable */
    new Effect(element, effectObj, 'easeInExpo', this.time, () => {
      element.parentNode.removeChild(element);
      if (typeof onEnd == 'function') onEnd();
    });
    /*eslint-enable */
  },

  specifyCenterCoordinate() {
    const rect = this.containment.getBoundingClientRect();
    const { bottom, height, right, width } = rect;
    this.cneterX = right - width / 2;
    this.centerY = bottom - height / 2;
  },

  getStartCoordinate() {
    const rect = this.containment.getBoundingClientRect();
    const { right, bottom } = rect;
    const startX = right - 30;
    const startY = bottom - 30;

    return [startX, startY];
  },

  getEndCoordinate() {
    this.fontSize = 64;
    const rect = this.containment.getBoundingClientRect();
    const { top } = rect;
    const endY = top - 20;
    const endX = this.cneterX - this.fontSize;

    return [endX, endY];
  },
};

export default Culmulate;
