import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './index.less';

class Search extends React.Component {
  render() {
    return (
      <Fragment>
        <Header />
        <main className="search enter">
          <div className="search-box">
            <input className="search-input" type="text" placeholder="输入搜索内容" />
            <i className="xwb iconmagnifyingglass"></i>
          </div>
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Search;
