import React from 'react';
import Loading from 'halogen/PulseLoader';

export function parseData(obj) {
  const shouldDateParseArray = ['start_at', 'end_at', 'suspend_at'];
  const shouldJSONParseArray = ['avatar_urls', 'cover_urls', 'image_urls'];

  const o = {};
  const keys = Object.keys(obj);

  for (const key of keys) {
    try {
      if (shouldDateParseArray.indexOf(key) > -1) {
        o[key] = Date.parse(obj[key]);
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

export function formatTime(t) {
  const time = new Date(t);
  // const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  // const seconds = time.getSeconds();

  return `${month}月${day}日${hours}时${minutes}分`;
}

export function positiveNumber(n) {
  return n > 0 ? n : 0;
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
  case 'waiting':
  case 'wait': {
    if (flag) return '距离活动开始还有';
    return '请等待';
  }
  case 'started': {
    if (flag) return '距离活动结束还有';
    return '马上抢购';
  }
  case 'end': return '活动已结束';
  case 'timing': return <Loading color="#FFF" size="11px" margin="4px"/>;
  case 'suspend': return '已售罄';
  case 'pending': return '领取奖励';
  case 'success': return '成功'; // 只有grab 的时候在alert 里会用到
  case 'always': return '已经抢过其他商品';
  case 'created': return '已经领取奖励';
  case 'insufficient': return '已售罄';
  case 'total_amount_zero': return '已售罄';
  case 'no-executies': return '不能再抢此商品了';
  case 'lack-multi-item': return '已经抢过其他商品了';
  case 'state-invalid': return '活动未开始/已结束';
  default: return <Loading color="#FFF" size="11px" margin="4px"/>;
  }
}

export function getStatus(item) {
  const {td, status, grabs, end_at, start_at, total_amount} = item;
  const now = Date.now() + td;
  if (grabs && grabs.length) return grabs[0].status;
  if (total_amount < 1) return 'suspend';
  if (status == 'waiting' || status == 'wait' || status == 'started' || status == 'timing') {
    if (now < start_at) {
      return 'wait';
    } else if (now > end_at) {
      return 'end';
    }
    return 'started';
  }
  return status;
}
