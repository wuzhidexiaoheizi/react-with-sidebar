import fetch from 'isomorphic-fetch';
import Constants from '../constants';
import errPNG from '../images/err.png';
import sucPNG from '../images/suc.png';
import tipPNG from '../images/tip.png';
import firstPNG from '../images/xf1.png';
import secondPNG from '../images/xf2.png';
import thirdPNG from '../images/xf3.png';
import DismissTip from '../prototypes/DismissTip';

const {
  PRESENT_HEART_IMG,
  PRESENT_MUSIC_BOX_IMG,
  PRESENT_FLOWER_IMG,
  PRESENT_TEDDY_BEAR_IMG,
  PRESENT_MOTOR_IMG,
  PRESENT_CAR_IMG,
  PRESENT_PLEASANT_SHEEP_IMG,
  PRESENT_ULTRAMAN_IMG,
  PRESENT_BOONIE_BEAR_IMG,
} = Constants;

const PRESENT_IMG_MAP = {
  heart: PRESENT_HEART_IMG,
  flower: PRESENT_FLOWER_IMG,
  car: PRESENT_CAR_IMG,
  teddy_bear: PRESENT_TEDDY_BEAR_IMG,
  music_box: PRESENT_MUSIC_BOX_IMG,
  motor: PRESENT_MOTOR_IMG,
  pleasant_sheep: PRESENT_PLEASANT_SHEEP_IMG,
  ultraman: PRESENT_ULTRAMAN_IMG,
  bonnie_bear: PRESENT_BOONIE_BEAR_IMG,
};

const TIP_IMG_MAP = {
  success: sucPNG,
  error: errPNG,
  tip: tipPNG,
};

const RANK_PNG_MAP = {
  '0': firstPNG,
  '1': secondPNG,
  '2': thirdPNG,
};

export function _fetch(url, method = 'get', body, excludeHeaders) {
  const params = {
    credentials: 'same-origin',
    method,
    body,
  };

  if (!excludeHeaders) {
    params.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  return fetch(url, params)
    .then(res => {
      const { status } = res;

      if (status != 422 && /^[4, 5][0-9]{2}$/.test(status)) throw new Error(status);

      return res;
    })
    .then(res => res.json())
    .catch((error) => {
      const { message } = error;
      let err;

      switch (message) {
      case '400': {
        err = '请求的格式不正确';
        break;
      }
      case '401': {
        err = '您没有权限访问所请求的资源';
        break;
      }
      case '404': {
        err = '您访问的请求地址不存在';
        break;
      }
      case '500': {
        err = '服务器异常';
        break;
      }
      case '502': {
        err = '无法连接服务器';
        break;
      }
      default: err = '服务器异常';
      }

      const containment = document.querySelector('body');

      /*eslint-disable */
      new DismissTip(containment, 'error', err);
      /*eslint-enable */
    });
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
  return TIP_IMG_MAP[type ? type.toLowerCase() : 'error']
    || TIP_IMG_MAP.error;
}

export function checkUserHasLogged(loggedCallback, unloggedCallback) {
  const { DOMAIN, API_USER_URL } = Constants;
  const url = `${DOMAIN}${API_USER_URL}`;

  _fetch(url)
    .then((user) => {
      if (user.id > 0) {
        loggedCallback();
      } else {
        unloggedCallback();
      }
    });
}

export function formatCurrency(amount) {
  if (isNaN(amount)) return amount;

  const currency = String(amount);
  const index = currency.indexOf('.');

  return index > -1 ? +amount.toFixed(2) : `${currency}.00`;
}

export function getInterval(interval) {
  if (!interval) return null;

  const step = String(interval);
  let time;

  if (step.indexOf('ms') > -1) {
    time = +step.split('ms')[0];
  } else if (step.indexOf('s') > -1) {
    time = +step.split('s')[0] * 1000;
  } else {
    time = +step;
  }

  return time;
}

export function getRankImage(index) {
  return RANK_PNG_MAP[index];
}

export function updateDocumentTitle(title) {
  document.title = title || '生日趴';
}

export function toStrikeCase(str) {
  return str.replace(/([ABCDEFGHIGKLMNOPQRSTUVWXYZ])/g, ($1) => {
    return '-' + $1.toLowerCase();
  });
}

export function toCamelCase(str) {
  return str
    .replace(/\s(.)/g, ($1) => { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, ($1) => { return $1.toLowerCase(); });
}
