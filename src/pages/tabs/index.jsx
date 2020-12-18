import React, { Fragment } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import request from '../../common/request';
import classnames from 'classnames';
import TabsTypesIcon from '../../components/TabsTypesIcon';
import { Empty } from '../../components/Empty'

import './index.less';

class Tabs extends React.Component {
  state = {
    tabs: []
  };
  componentDidMount() {
    request.getArticleTabs(this.props.match.params.id).then(res => {
      this.setState({
        tabs: res
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
        <main className="tabs">
          {this.state.tabs.length ? (
            <Fragment>
              <div className="tabs-title enter">
                <div className="tabs-icon-box">
                  <TabsTypesIcon type={this.state.tabs[0].tid} />
                </div>
                <span className="tabs-name">{this.state.tabs[0].tid.name}</span>
              </div>
              {
                this.state.tabs.map((item, index) => (
                  <div className={classnames('tabs-item enter', { 'frist-item': index === 0 })} key={index} onClick={() => this.handleGoDetail(item.objectId)}>
                    <span className="tabs-time">{item.createdAt}</span>
                    <span className="tabs-text">{item.title}</span>
                  </div>
                ))
              }
            </Fragment>
          ) : <Empty className='empty enter'/>}
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Tabs;
