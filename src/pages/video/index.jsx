import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import request from '../../common/request';
import config from '../../common/config';
import utils from '../../common/utils';
import './index.less';

class Video extends React.Component {
  state = {
    videos: []
  };
  componentDidMount() {
    request.getVideos().then(res => {
      this.setState({
        videos: res
      });
    });
  }
  handleClick(objectId) {
    this.props.history.push('/video/' + objectId);
  }
  render() {
    return (
      <Fragment>
        <Header />
        <main className="video enter">
          {this.state.videos.map((item, index) => (
            <div className="video-item" key={index} onClick={() => this.handleClick(item.objectId)}>
              <div className="video-name-box">
                <p className="video-name">{item.name}</p>
                <p className="video-ename">{item.ename}</p>
              </div>
              <div className="video-mask"></div>
              <i className="xwb iconbofang"></i>
              <img className="video-cover" src={config.qiniu.domian + item.cover} alt="" />
              <p className="video-duration">时长：{utils.TransTime(item.duration)}</p>
            </div>
          ))}
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Video;
