import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import request from '../../common/request';
import config from '../../common/config';
import { Player } from 'video-react';

import '../../common/style/video-react.css';
import './video.less';

class VideoPlay extends React.Component {
  state = {
    playerProps: null
  };

  componentDidMount() {
    request.getVideoById(this.props.match.params.id).then(res => {
      this.setState({
        playerProps: res
      });
    });
  }
  render() {
    return (
      <Fragment>
        <Header />
        {this.state.playerProps ? (
          <main className="videoplay enter">
            <p className='videoplay-name'>{this.state.playerProps.name}</p>
            <blockquote className='videoplay-describe'>{this.state.playerProps.describe}</blockquote>
            <Player src={config.qiniu.domian + this.state.playerProps.url} poster={config.qiniu.domian + this.state.playerProps.dcover}></Player>
          </main>
        ) : null}
        <Footer />
      </Fragment>
    );
  }
}

export default VideoPlay;
