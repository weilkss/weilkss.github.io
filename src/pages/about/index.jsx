import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

import './index.less';

class Search extends React.Component {
  state = {
    value: ''
  };
  handleSearch = () => {
    console.log(this.state.value);
  };
  render() {
    return (
      <Fragment>
        <Header />
        <main className="about enter">
          <p className='text'>曾梦想仗剑走天涯</p>
          <p className='text'>看一看世界的繁华</p>
          <video className="video" loop autoPlay src="http://file.weilkss.cn/A93D0A13-9BFF-4330-A456-02B92BEF98B8.mp4"></video>
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Search;
