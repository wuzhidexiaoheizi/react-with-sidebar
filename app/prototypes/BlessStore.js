function BlessStore(command, flagField) {
  this.command = command;
  this.flagField = flagField;
  this.init();
}

BlessStore.prototype = {
  constructor: BlessStore,

  init() {
    this.blesses = [];
    this.allBlesses = [];
    this.blessGroup = [];
    this.blessesDone = true;
  },

  destroy() {
    this.blesses = null;
    this.allBlesses = null;
    this.blessGroup = null;
  },

  clear() {
    this.blesses.length = 0;
    this.blessGroup.length = 0;
  },

  insertToNewBlesses(blesses) {
    this.blesses.push(...blesses);
  },

  insertToAllBlesses(blesses) {
    this.allBlesses.push(...blesses);
  },

  addBlesses(blesses) {
    if (blesses.length == 0) return;

    this.insertToNewBlesses(blesses);
    this.insertToAllBlesses(blesses);

    this.removePlayedBlesses();
    this.blessGroup = this.groupBlesses(this.blesses);
  },

  removePlayedBlesses() {
    for (let i = this.blesses.length - 1; i >= 0; i--) {
      const bless = this.blesses[i];
      const blessFlag = this.getFieldValue(bless, this.flagField);
      const key = `bless-${blessFlag}`;
      const val = JSON.parse(localStorage.getItem(key) || '{}');
      const { hasPlayed } = val;

      if (hasPlayed) {
        this.blesses.splice(i, 1);
        this.command.addBlessItemToGiftList(bless);
      }
    }
  },

  groupBlesses(blesses) {
    const blessGroup = {};
    let group;

    blesses.forEach((bless) => {
      const { virtual_present: { name } } = bless;
      group = blessGroup[name];

      if (!group) {
        group = [];
        blessGroup[name] = group;
      }

      group.push(bless);
    });

    return Object.values(blessGroup);
  },

  getBlessGroup() {
    return this.blessGroup;
  },

  getAllBlessGroup() {
    return this.groupBlesses(this.allBlesses);
  },

  getUnreadCount() {
    return this.blessGroup.length;
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

export default BlessStore;
