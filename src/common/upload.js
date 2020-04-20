import * as qiniu from 'qiniu-js';
import config from './config';

/**
 * qiniu upload
 *
 * https://github.com/qq49019994/Qiniu-JavaScript-SDK/
 */

class Upload {
  constructor(option) {
    this.onProgress = () => {};
    this.onComplete = () => {};
    this.file = option.file;
    this.type = option.type;
    this.upload();
  }
  progress(param) {
    this.onProgress = param;
    return this;
  }
  complete(param) {
    this.onComplete = param;
    return this;
  }
  upload() {
    const putExtra = {
      fname: this.file.name,
      params: {},
      mimeType: this.type === 'image' ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'] : ['video/mp4'],
    };
    const qinuiConfig = {
      useCdnDomain: false,
      region: qiniu.region.z2,
    };
    const key = new Date().getTime() + this.file.name;
    const observable = qiniu.upload(this.file, key, config.qiniu.token, putExtra, qinuiConfig);

    observable.subscribe(
      (next) => {
        this.onProgress(Math.floor(next.total.percent * 100) / 100);
      },
      (error) => {
        console.error(error);
      },
      (complete) => {
        this.onComplete(complete.key);
      }
    );
  }
}

const upload = (option, callback) => {
  return new Promise((resolve) => {
    new Upload(option)
      .complete((key) => {
        resolve(key);
      })
      .progress((param) => callback&&callback(param));
  });
};

export default upload;
