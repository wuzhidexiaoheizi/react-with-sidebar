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
    const rect = this.containment.getBoundingClientRect();
    const { left, right } = rect;
    let x = (left + right) / 2;
    let top = 100;
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = x + 'px';
    element.style.top = top + 'px';
    element.style.color = '#F7D92C';
    element.style.fontSize = this.fontSize + 'px';
    element.style.fontWeight = 700;
    element.style.opacity = 0.8;
    element.textContent = '+' + this.amount;
    this.containment.appendChild(element);
    const { onStart, onEnd } = this.config;

    x -= 30;
    top -= 60;
    this.fontSize = 64;
    const effectObj = { left: x, top, fontSize: this.fontSize };

    if (typeof onStart == 'function') onStart();

    /*eslint-disable */
    new Effect(element, effectObj, 'easeOutExpo', this.time, () => {
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
