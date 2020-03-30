import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import './index.less';

class Personal extends React.Component {
  render() {
    return (
      <Fragment>
        <Header />
        <main className="personal">personal</main>
        <Footer />
      </Fragment>
    );
  }
}

export default Personal;
