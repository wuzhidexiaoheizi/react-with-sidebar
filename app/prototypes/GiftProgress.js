function GiftProgress(containment, total, config = {}) {
  const { initCount } = config;
  this.containment = containment;
  this.total = total;
  this.initCount = initCount || 0;
  this.initialPercent = this.getProgressPercent();
  this.init();
}

GiftProgress.prototype = {
  init() {
    this.render();
  },

  destroy() {
    this.containment.removeChild(this.element);
  },

  render() {
    const element = this.element = document.createElement('div');
    element.setAttribute('class', 'progress');
    element.innerHTML = `
      <div class="progress-bar progress-bar-danger" style="width: ${this.initialPercent}%" />
    `;
    this.containment.appendChild(element);
  },

  updateTotal(total) {
    this.total = total;
    this.updateProgress();
  },

  getProgressPercent() {
    if (this.total == 0) return 0;
    if (this.initCount >= this.total) return 100;

    return Math.floor(this.initCount / this.total * 100);
  },

  increment() {
    this.initCount ++;
    this.updateProgress();
  },

  decrement() {
    this.initCount --;
    this.updateProgress();
  },

  updateProgress() {
    const percent = this.getProgressPercent();
    const bar = this.element.querySelectorAll('.progress-bar')[0];
    const progress = percent + '%';
    bar.style.width = progress;
  },

  clearProgress() {
    this.initCount = 0;
    this.updateProgress();
  },
};

export default GiftProgress;
