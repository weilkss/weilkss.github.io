import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import request from '../../common/request';
import TabsTypesIcon from '../../components/TabsTypesIcon';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import 'react-vertical-timeline-component/style.min.css';
import './index.less';
/**
 * 热门
 */
class Hot extends React.Component {
  state = {
    hots: []
  };
  componentDidMount() {
    request.getArticleHot().then(res => {
      this.timer = setTimeout(() => {
        this.setState({
          hots: res
        });
      }, 1200);
    });
  }
  componentWillUnmount = () => {
    clearTimeout(this.timer);
  };
  render() {
    return (
      <Fragment>
        <Header />
        <main className="hot">
          {this.state.hots.length ? (
            <VerticalTimeline layout="1-column">
              {this.state.hots.map((item, index) => (
                <Link className="item" to={`/detail/${item.objectId}`} key={index}>
                  <VerticalTimelineElement
                    contentStyle={{ background: '#eee', color: '#333' }}
                    contentArrowStyle={{ borderRight: '6px solid  #eee' }}
                    date={item.createdAt}
                    iconStyle={{ background: '#eee', color: '#333', boxShadow: 'none', textAlign: 'center', lineHeight: '40px', fontWeight: 'bold' }}
                    icon={<TabsTypesIcon type={item.tid.name} />}
                  >
                    <p className="hot-title">{item.title}</p>
                    <p className="hot-describe">{item.describe}</p>
                    <span className="hot-des">{item.visit}</span>
                  </VerticalTimelineElement>
                </Link>
              ))}
            </VerticalTimeline>
          ) : null}
          <Sidebar />
        </main>
        <Footer />
      </Fragment>
    );
  }
}

export default Hot;
