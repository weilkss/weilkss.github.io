import React from 'react';
import Select from 'react-select';
import XwbReactMarkdown from 'xwb-react-markdown';
import Toast from '../../components/Toast';
import request from '../../common/request';
import config from '../../common/config';
import './index.less';

class Edit extends React.Component {
  state = {
    types: [],
    describe: '',
    title: '',
    text: '',
    html: '',
    tid: 0
  };
  componentDidMount() {
    request.getTypes().then(res => {
      let types = [];
      for (const item of res) {
        types.push({
          value: item.objectId,
          label: item.name
        });
      }

      this.setState({
        types
      });
    });
  }

  handleEditorChange = (html, text) => {
    this.setState({
      text,
      html
    });
  };
  handleTitle = e => {
    this.setState({
      title: e.target.value.trim()
    });
  };
  handleChange = obj => {
    this.setState({
      tid: obj.value
    });
  };
  handletextChange = e => {
    this.setState({
      describe: e.target.value.trim()
    });
  };
  handleReple = title => {
    if (!this.state.title) {
      return Toast.error('请输入标题');
    }
    if (!this.state.tid) {
      return Toast.error('请选择分类');
    }
    if (!this.state.describe) {
      return Toast.error('请输入描述');
    }
    if (this.state.text.length < 10) {
      return Toast.error('内容至少10个字');
    }

    request
      .setArticle({
        title,
        ...this.state
      })
      .then(() => {
        Toast.success('发布成功!');
        setTimeout(() => {
          this.props.history.push('/');
        }, 2000);
      });
  };
  render() {
    const params = {
      height: document.body.clientHeight - 100,
      token: config.qiniu.token,
      domian: config.qiniu.domian,
      uploadUrl: config.qiniu.uploadUrl
    };
    return (
      <div className="edit">
        <div className="edit-head">
          <input className="edit-title" placeholder="输入标题..." onChange={this.handleTitle}></input>
          <div className="select">
            <Select defaultValue={this.state.types[0]} placeholder="选择分类" options={this.state.types} onChange={this.handleChange} />
          </div>
          <button className="reple" onClick={this.handleReple}>
            发布
          </button>
        </div>
        <textarea className="edit-describe" placeholder="输入描述" onChange={this.handletextChange}></textarea>
        <XwbReactMarkdown config={params} handleEditorChange={this.handleEditorChange} />
      </div>
    );
  }
}

export default Edit;
