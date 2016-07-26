function WithdrawTip(withdraw, callback) {
  this.withdraw = withdraw;
  this.callback = callback;
  this.init();
}

WithdrawTip.prototype = {
  constructor: WithdrawTip,

  init() {
    this.render();
    this.adjustPostion();

    setTimeout(this.destroy.bind(this), 4000);
  },

  render() {
    const element = this.element = document.createElement('div');
    element.setAttribute('class', 'withdraw-modal');
    element.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="withdraw-tip">恭喜您获得￥${this.withdraw}元返现</div>
        </div>
      </div>
    `;

    const containment = document.querySelectorAll('body')[0];
    containment.appendChild(element);
  },

  adjustPostion() {
    const dom = this.element.querySelectorAll('.withdraw-tip')[0];
    const { clientHeight } = dom;
    dom.style.marginTop = (window.innerHeight - clientHeight) / 2 + 'px';
  },

  destroy() {
    this.element.parentNode.removeChild(this.element);

    if (typeof this.callback == 'function') this.callback();
  }
};

export default WithdrawTip;
