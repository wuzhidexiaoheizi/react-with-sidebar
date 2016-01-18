// parse 数据
export function parseData(obj, td = 0) {
  const shouldDateParseArray = ['start_at', 'end_at', 'suspend_at'];
  const shouldJSONParseArray = ['avatar_urls', 'cover_urls', 'image_urls'];

  const o = {};
  const keys = Object.keys(obj);

  for (const key of keys) {
    try {
      if (shouldDateParseArray.indexOf(key) > -1) {
        o[key] = Date.parse(obj[key]) - td;
      } else if (shouldJSONParseArray.indexOf(key) > -1) {
        o[key] = JSON.parse(obj[key]);
      } else {
        o[key] = obj[key];
      }
    } catch (e) {
      o[key] = obj[key];
    }
  }
  return o;
}

// 格式化时间
export function formatTime(t) {
  const time = new Date(t);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  return {
    longDate: `${year}年 ${month}月 ${day}日`,
    shortDate: `${month}月 ${day}日`,
    longTime: `${hours}时:${minutes}分:${seconds}秒`,
    shortTime: `${hours}时:${minutes}分`,
  };
}

// 10位 补0
export function add0(n) {
  return n < 10 ? '0' + n : n;
}

// 获取正数
export function positiveNumber(n) {
  return n > 0 ? n : 0;
}

// 距离现在的时间
export function diffTime(t) {
  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  let d = Math.floor(Math.abs(Date.now() - t) / 1000);

  const days = Math.floor(d / DAY);
  d -= days * DAY;

  const hours = add0(Math.floor(d / HOUR));
  d -= hours * HOUR;

  const minutes = add0(Math.floor(d / MINUTE));
  d -= minutes * MINUTE;

  const seconds = add0(d);

  if (days) return `${days}天${hours}:${minutes}:${seconds}`;
  if (hours) return `${hours}:${minutes}:${seconds}`;
  return `${minutes}:${seconds}`;
}

// 'always': '您已经抢过了',
// 'no-executies': '没有抢购机会了',
// 'lack-multi-item': '您已经抢过其他的',
// 'insufficient': '商品库存不足',
// 'suspend': '商品已经抢光了',
// 'waiting': '活动未开始',
// 'end': '活动已结束',
// 'state-invalid': '活动未开始/已结束',
// 'total_amount_zero': '本期活动中此商品总库存为0',
// 'quantity_zero': '本期活动中此商品的每次抢购个数为0'
export function statusDescs(status, flag) {
  switch (status) {
  case 'wait': {
    if (flag) return '距离活动开始还有';
    return '请等待';
  }
  case 'started': {
    if (flag) return '距离活动结束还有';
    return '马上抢购';
  }
  case 'end': return '活动已结束';
  case 'suspend': return '已售罄';
  case 'pending': return '领取奖励';
  case 'always': return '您已经抢过了';
  case 'created': return '已经领取奖励';
  case 'no-executies': return '不能再抢此商品了';
  case 'lack-multi-item': return '已经抢过其他商品了';
  case 'state-invalid': return '活动未开始或已结束';
  default: return '下次再来吧';
  }
}

// 获取状态
export function getStatus(item) {
  const {item_status, grabs, status, end_at, start_at, total_amount} = item;
  const now = Date.now();

  if (grabs && grabs.length) return grabs[0].status;
  if (item_status) return item_status;
  if (total_amount < 1) return 'suspend';
  if (status !== 'timing') return status;
  if (now < start_at) return 'wait';
  if (now > end_at) return 'end';
  return 'started';
}
