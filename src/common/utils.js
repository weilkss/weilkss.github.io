export default {
  htmltoTextLength(text) {
    text = text.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    text = text.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    text = text.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
    text = text.replace(/&nbsp;/gi, ''); //去掉&nbsp;
    return text.length;
  },
  /**
   * 数据随机取几个
   * @param {*} arr
   * @param {*} count
   */
  getRandomArrayElements(arr, count) {
    let shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
  /**
   * 分解url参数
   */
  getSearch() {
    let url = window.location.search;
    let theRequest = {};
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1);
      let strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  },
  /**
   * 生成随机数
   * @param {*} max
   * @param {*} min
   */
  getRandomNumber(max, min = 0) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
  },
  /**
   *
   * @param {*} url
   * @param {*} callback
   */
  loadJs(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (typeof callback != 'undefined') {
      if (script.readyState) {
        script.onreadystatechange = function() {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = function() {
          callback();
        };
      }
    }
    script.src = url;
    document.body.appendChild(script);
  },
  /**
   * 秒转时分秒格式
   * @param t 要转换的秒数
   * @return 时间字符串'00:02：11'
   */
  TransTime(t) {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t - h * 3600) / 60);
    const s = Math.floor(t - h * 3600 - m * 60);
    return [h <= 0 ? '00' : h < 10 ? '0' + h : h, m <= 0 ? '00' : m < 10 ? '0' + m : m, s <= 0 ? '00' : s < 10 ? '0' + s : s].join(':');
  }
};
