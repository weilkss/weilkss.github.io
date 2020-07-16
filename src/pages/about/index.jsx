import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import config from '../../common/config';
import request from '../../common/request';

import './index.less';

class Search extends React.Component {
  state = {
    url: ''
  };
  componentDidMount() {
    request.getAbout().then(res => {
      this.setState({
        url: config.qiniu.domian + res.url
      });
    });
  }
  render() {
    return (
      <Fragment>
        <Header />
        <main className="about enter">
          <p className="text">曾梦想仗剑走天涯</p>
          <p className="text">看一看世界的繁华</p>
          <video className="video" loop autoPlay src={this.state.url}></video>
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Search;
