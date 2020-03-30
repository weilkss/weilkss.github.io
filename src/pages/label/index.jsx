import React, { Fragment } from 'react';
import request from '../../common/request';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';
import utils from '../../common/utils';

import './index.less';

class Label extends React.Component {
  state = {
    types: []
  };
  componentDidMount() {
    request.getTypes().then(res => {
      this.setState({
        types: res
      });
    });
  }
  render() {
    return (
      <Fragment>
        <Header />
        <main className="label">
          <div className="label-head enter">
            <h1 className="label-title">tags</h1>
            <p className="label-text">目前共计 {this.state.types.length} 个标签</p>
          </div>
          <div className="label-tabs enter">
            {this.state.types.map((item, index) => (
              <Link className="link" key={index} to={`/tabs/${item.objectId}`} style={{ opacity: utils.getRandomNumber(2, 10) * 0.1, fontSize: utils.getRandomNumber(12, 48) }}>
                {item.name}
              </Link>
            ))}
          </div>
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Label;
