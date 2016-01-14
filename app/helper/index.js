export function parseData(obj, td = 0) {
  const shouldDateParseArray = ['start_at', 'end_at,'];
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

function add0(n) {
  return n < 10 ? '0' + n : n;
}

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

  return `${days}天${hours}:${minutes}:${seconds}`;
}
