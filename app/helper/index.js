import fetch from 'isomorphic-fetch';

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
    if (res.status == 401 || res.status == 404) {
      throw new Error(401);
    }
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
