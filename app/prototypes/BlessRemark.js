function BlessRemark(remarkFlag) {
  this.remarkFlag = remarkFlag;
}

BlessRemark.prototype = {
  constructor: BlessRemark,

  // 将一组bless标记为已读
  remarkGroupAsDisplayed(group) {
    group.forEach(bless => this.remarkAsDisplayed(bless));
  },

  // 将单个bless标记为已读
  remarkAsDisplayed(bless) {
    const blessFlag = this.getFieldValue(bless, this.remarkFlag);
    const key = `bless-${blessFlag}`;
    let val = localStorage.getItem(key);

    if (!val) {
      val = { hasPlayed: true };
      localStorage.setItem(key, JSON.stringify(val));
    }
  },

  // 删除一组bless的已读标记
  removeRemarkFlags(blesses) {
    blesses.forEach(bless => this.removeRemarkFlag(bless));
  },

  // 删除单个bless的已读标记
  removeRemarkFlag(bless) {
    const blessFlag = this.getFieldValue(bless, this.remarkFlag);
    const key = `bless-${blessFlag}`;

    localStorage.removeItem(key);
  },

  getFieldValue(obj, fieldName) {
    const ary = fieldName.split(':');
    let i = 0;
    let field = obj[ary[i]];

    while (++i <= ary.length - 1) {
      field = field[ary[i]];
    }

    return field;
  },
};

export default BlessRemark;
