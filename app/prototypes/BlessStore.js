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

  getToInsertBlesses(blesses) {
    const toInsertBlesses = [];

    blesses.forEach((bless) => {
      if (this.allBlesses.indexOf(bless) == -1) toInsertBlesses.push(bless);
    });

    return toInsertBlesses;
  },

  addBlesses(toInsertBlesses) {
    if (toInsertBlesses.length == 0) return;

    this.insertToNewBlesses(toInsertBlesses);
    this.insertToAllBlesses(toInsertBlesses);

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
        this.command.prependBlessItemToGiftList(bless);
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

  sortGroups(groups) {
    groups.sort((prev, next) => {
      return this.getPresentValue(next) - this.getPresentValue(prev);
    });

    return groups;
  },

  getPresentValue(group) {
    const { virtual_present: { value } } = group[0];

    return value;
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
