import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import request from '../../common/request';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import './index.less';

class Type extends React.Component {
  state = {
    types: []
  };
  componentDidMount() {
    request.getTypesArticleCount(types => {
      this.setState({
        types
      });
    });
  }Í
  render() {
    return (
      <Fragment>
        <Header />
        <main className="type enter">
          <ul className="type-box">
            {this.state.types.map((item, index) => (
              <li className="type-item" key={index}>
                <Link className="type-link" to={`/tabs/${item.objectId}`}>
                  <span className="type-name">{item.name}</span>
                  <span className="type-count">（{item.count || 0}）</span>
                </Link>
              </li>
            ))}
          </ul>
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Type;
