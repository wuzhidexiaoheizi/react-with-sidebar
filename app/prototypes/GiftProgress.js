import { formatCurrency } from '../helper';

function GiftProgress(total) {
  this.total = total || 0;
  this.withdraw = 0;
}

GiftProgress.prototype = {
  constructor: GiftProgress,

  updateTotal(total) {
    this.total = total;
    this.updateProgress();
  },

  getProgressPercent() {
    if (this.total == 0) return 0;
    if (this.withdraw >= this.total) return 100;

    return Math.floor(this.withdraw / this.total * 100);
  },

  addWithdraw(withdraw, isHeart) {
    if (isNaN(withdraw)) return;

    if (!isHeart) this.total += +withdraw;
    this.withdraw += +withdraw;

    this.updateProgress();
  },

  updateProgress() {
    const percent = this.getProgressPercent();
    const nodes = document.querySelectorAll('.party-gnh');

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const bar = node.querySelectorAll('.progress-bar')[0];
      const progress = percent + '%';
      bar.style.width = progress;
      const gnhValue = node.querySelectorAll('.gnh-value')[0];
      const withdrawValue = node.querySelectorAll('.withdraw-value')[0];

      withdrawValue.textContent = '￥' + formatCurrency(this.withdraw);
      gnhValue.textContent = 10 * this.withdraw;
    }
  },

  clearProgress() {
    this.withdraw = 0;
    this.updateProgress();
  },
};

export default GiftProgress;
