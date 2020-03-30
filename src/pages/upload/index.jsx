import React from 'react';
import axios from 'axios';
import config from '../../common/config';
import request from '../../common/request';
import Toast from '../../components/Toast';

import './index.less';

class Upload extends React.Component {
  constructor() {
    super();
    this.uploadFunc = this.uploadFunc.bind(this);
    this.handleReple = this.handleReple.bind(this);
  }
  state = {
    title: '',
    describe: '',
    atlas: []
  };
  handleTitle = e => {
    this.setState({
      title: e.target.value.trim()
    });
  };
  handletextChange = e => {
    this.setState({
      describe: e.target.value.trim()
    });
  };
  async uploadFunc(files, index) {
    let atlas = this.state.atlas;
    let uploadObj = {
      narrow: '',
      url: '',
      width: 100,
      height: 100
    };
    let formData = new FormData();
    let cformData = new FormData();

    let { cfile, originHeight, originWidth } = await this.compressImg(files[index]);
    uploadObj.width = originWidth;
    uploadObj.height = originHeight;
    // 上传略缩图
    cformData.append('token', config.qiniu.token);
    cformData.append('key', new Date().getTime() + '-' + files[index].name);
    cformData.append('file', cfile);
    await axios.post(config.qiniu.uploadUrl, cformData, { 'Content-Type': 'multipart/form-data' }).then(res => {
      uploadObj.narrow = res.data.key;
    });

    // 上传原图
    formData.append('token', config.qiniu.token);
    formData.append('key', new Date().getTime() + '-' + files[index].name);
    formData.append('file', files[index]);
    await axios.post(config.qiniu.uploadUrl, formData, { 'Content-Type': 'multipart/form-data' }).then(res => {
      uploadObj.url = res.data.key;
    });

    atlas = [uploadObj, ...atlas];
    this.setState(
      {
        atlas
      },
      () => {
        if (index < files.length - 1) {
          this.uploadFunc(files, index + 1);
        }
      }
    );
  }
  handleUpload(e) {
    if (e.target.files.length) {
      this.uploadFunc(e.target.files, 0);
    }
  }
  /**
   * 压缩图片
   */
  compressImg(file) {
    return new Promise(resolve => {
      // 压缩图片需要的一些元素和对象
      let reader = new FileReader();
      //创建一个img对象
      let img = new Image();

      reader.readAsDataURL(file);
      // 文件base64化，以便获知图片原始尺寸
      reader.onload = function(e) {
        img.src = e.target.result;
      };

      // base64地址图片加载完毕后执行
      img.onload = function() {
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        // 图片原始尺寸
        let originWidth = this.width;
        let originHeight = this.height;

        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        let maxWidth = 100,
          maxHeight = 100;
        // 目标尺寸
        let targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过100x100的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

        //压缩后的图片转base64 url
        /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
         * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
        let dataurl = canvas.toDataURL('image/jpeg', 0.92); //base64 格式

        let arr = dataurl.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split('/')[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        resolve({
          cfile: new File([u8arr], `file.${suffix}`, { type: mime }),
          originWidth,
          originHeight
        });
      };
    });
  }
  handleReple() {
    request.setAtlas(this.state).then(res => {
      Toast.success('发布成功!');
      setTimeout(() => {
        this.props.history.push('/atlas');
      }, 2000);
    });
  }
  render() {
    return (
      <div className="upload">
        <p className="upload-title">上传图集&TEST</p>
        <div className="upload-top">
          <input className="upload-name" type="text" placeholder="标题" onChange={this.handleTitle} />
          <button className="upload-reple" onClick={this.handleReple}>
            发布
          </button>
        </div>
        <textarea className="upload-describe" placeholder="输入描述" onChange={this.handletextChange}></textarea>
        <div className="upload-btn">
          <input className="upload-input" type="file" multiple accept=".jpg,.jpeg,.png,.gif" onChange={e => this.handleUpload(e)} />
          <i className="xwb iconshangchuan"></i>
          <p>上传图集【可多选】</p>
        </div>
        <div className="upload-img-box">
          {this.state.atlas.map((item, index) => (
            <img className="upload-img" src={config.qiniu.domian + item.narrow} alt="" key={index} />
          ))}
        </div>
      </div>
    );
  }
}

export default Upload;
