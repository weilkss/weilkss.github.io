import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from '../../components/Image';
import Sidebar from '../../components/Sidebar';
import request from '../../common/request';

import './index.less';

class Atlas extends React.Component {
  state = {
    atlas: []
  };
  componentDidMount() {
    request.getAtlas().then(res => {
      this.setState({
        atlas: res
      });
    });
  }
  handleClick(id) {
    this.props.history.push('/atlas/' + id);
  }

  render() {
    return (
      <Fragment>
        <Header />
        <main className="atlas enter">
          {this.state.atlas.map((item, index) => (
            <Image src={item.atlas[0].url} narrow={item.atlas[0].narrow} key={index} onClick={() => this.handleClick(item.objectId)} />
          ))}
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Atlas;
