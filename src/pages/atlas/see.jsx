import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from '../../components/Image';
import request from '../../common/request';
import Sidebar from '../../components/Sidebar';
import Totop from '../../components/Totop';

import './see.less';

class See extends React.Component {
  state = {
    atlas: null
  };
  componentDidMount() {
    request.getAtlasById(this.props.match.params.id).then(res => {
      this.setState({
        atlas: res
      });
    });
  }
  render() {
    const atlas = this.state.atlas;
    return (
      <Fragment>
        <Header />
        {atlas ? (
          <main className="see enter">
            <p className="see-title">{atlas.title}</p>
            <blockquote>
              <p className="see-describe">{atlas.describe}</p>
            </blockquote>
            <div className="see-atlas">
              {atlas.atlas.map((item, index) => (
                <Image src={item.url} narrow={item.narrow} see key={index} />
              ))}
            </div>
            <Totop />
            <Sidebar top />
          </main>
        ) : null}
        <Footer />
      </Fragment>
    );
  }
}

export default See;
