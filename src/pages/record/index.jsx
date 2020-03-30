import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import request from '../../common/request';
import classnames from 'classnames';

import './index.less';

class Record extends React.Component {
  state = {
    alists: []
  };
  componentDidMount() {
    request.getArticleList(1, 100).then(res => {
      let year = new Date('9999-12-12 00:00:00').getFullYear();
      let alists = [];
      for (const item of res.alists) {
        let createYear = new Date(item.createdAt).getFullYear();
        if (createYear < year) {
          alists.push({
            type: 1,
            year: createYear
          });
          year = createYear;
        }
        item.type = 0;
        alists.push(item);
      }
      this.setState({
        alists
      });
    });
  }
  handleGoDetail(id) {
    this.props.history.push('/detail/' + id);
  }
  render() {
    return (
      <Fragment>
        <Header />
        <main className="record enter">
          {this.state.alists.length ? (
            <Fragment>
              {this.state.alists.map((item, index) =>
                item.type ? (
                  <div className={classnames('record-item', { 'frist-item': index === 0 })} key={index}>
                    <p className="record-year">{item.year}</p>
                  </div>
                ) : (
                  <div className="record-item pointer" key={index} onClick={() => this.handleGoDetail(item.objectId)}>
                    <span className="record-time">{item.createdAt}</span>
                    <span className="record-text">{item.title}</span>
                  </div>
                )
              )}
            </Fragment>
          ) : null}
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Record;
