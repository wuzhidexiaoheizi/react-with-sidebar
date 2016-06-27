import fetch from 'isomorphic-fetch';
import Constants from '../constants';
import errPNG from '../images/err.png';
import sucPNG from '../images/suc.png';
import tipPNG from '../images/tip.png';

const {
  PRESENT_HEART_IMG,
  PRESENT_MUSIC_BOX_IMG,
  PRESENT_FLOWER_IMG,
  PRESENT_TEDDY_BEAR_IMG,
  PRESENT_MOTOR_IMG,
  PRESENT_CAR_IMG
} = Constants;

const PRESENT_IMG_MAP = {
  heart: PRESENT_HEART_IMG,
  flower: PRESENT_FLOWER_IMG,
  car: PRESENT_CAR_IMG,
  teddy_bear: PRESENT_TEDDY_BEAR_IMG,
  music_box: PRESENT_MUSIC_BOX_IMG,
  motor: PRESENT_MOTOR_IMG,
};

const TIP_IMG_MAP = {
  success: sucPNG,
  error: errPNG,
  tip: tipPNG,
};

export function _fetch(url, method = 'get', body) {
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method,
    body,
  })
  .then(res => {
    if (res.status == 401 || res.status == 404) throw new Error(401);

    return res;
  })
  .then(res => res.json());
}

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

export function zeroize(val, len) {
  const length = len != 0 ? len : 2;
  const value = String(val);

  let zeros = '';

  for (let i = 0; i < (length - value.length); i++) {
    zeros += '0';
  }

  return zeros + value;
}

export function formatPrintDate(d, mask) {
  return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, ($0) => {
    switch ($0) {

    case 'd':
      return d.getDate();

    case 'dd':
      return zeroize(d.getDate());

    case 'ddd':
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];

    case 'dddd':
      return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];

    case 'M':
      return d.getMonth() + 1;

    case 'MM':
      return zeroize(d.getMonth() + 1);

    case 'MMM':
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];

    case 'MMMM':
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];

    case 'yy':
      return String(d.getFullYear()).substr(2);

    case 'yyyy':
      return d.getFullYear();

    case 'h':
      return d.getHours() % 12 || 12;

    case 'hh':
      return zeroize(d.getHours() % 12 || 12);

    case 'H':
      return d.getHours();

    case 'HH':
      return zeroize(d.getHours());

    case 'm':
      return d.getMinutes();

    case 'mm':
      return zeroize(d.getMinutes());

    case 's':
      return d.getSeconds();

    case 'ss':
      return zeroize(d.getSeconds());

    case 'l':
      return zeroize(d.getMilliseconds(), 3);

    case 'L':
      let m = d.getMilliseconds();

      if (m > 99) m = Math.round(m / 10);

      return zeroize(m);

    case 'tt':
      return d.getHours() < 12 ? 'am' : 'pm';

    case 'TT':
      return d.getHours() < 12 ? 'AM' : 'PM';

    case 'Z':
      return d.toUTCString().match(/[A-Z]+$/);

    default:
      return $0.substr(1, $0.length - 2);
    }
  });
}

export function formatDate(date, mask) {
  const type = Object.prototype.toString.call(date);

  let d;

  if (type == '[object Date]') {
    d = date;
  } else if (type == '[object Number]') {
    d = new Date(date);
  } else {
    try {
      const t = Date.parse(date);
      d = new Date(t);
    } catch (e) {
      return date;
    }
  }

  return formatPrintDate(d, mask);
}

export function serializeParams(obj, prefix) {
  const str = [];

  for (const key of Object.keys(obj)) {
    const v = obj[key];
    const k = prefix ? prefix + '[' + key + ']' : key;

    if (Object.prototype.toString.call(v) == '[object Object]') {
      str.push(serializeParams(v, k));
    } else {
      str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }

  return str.join('&');
}

export function extractPresentImage(presentName) {
  return PRESENT_IMG_MAP[presentName] || PRESENT_HEART_IMG;
}

export function extractPresentAvatar(presentName) {
  const image = extractPresentImage(presentName);

  return `${image}!avatar`;
}

export function getTipImage(type) {
  return TIP_IMG_MAP[type ? type.toLowerCase : 'error']
    || TIP_IMG_MAP.error;
}
