import React, { Fragment } from 'react';
import classnames from 'classnames';
import RVloading from 'react-vue-loading';
import './index.less';

class ReactVueloading extends React.Component {
  state = {
    tab: 0
  };
  componentDidMount() {}
  render() {
    const { tab } = this.state;
    return (
      <Fragment>
        <div className="react-vue-loading">
          <div className="load-head">
            <RVloading color="#fff" />
            <span className="l-name">react-vue-loading</span>
            <a href="https://github.com/weilkss/react-vue-loading" target="view_window">
              <i className="xwb iconGitHub"></i>
            </a>
          </div>
          <div className="l-content">
            <h1>react-vue-loading</h1>
            <h2>适用于 React Vue 的 loading 组件</h2>
          </div>
          <div className="react-box">
            <div className="tab">
              <div className={classnames('tab-item', { 'tab-item-active': tab === 0 })} onClick={() => this.setState({ tab: 0 })}>
                React
              </div>
              <div className={classnames('tab-item', { 'tab-item-active': tab === 1 })} onClick={() => this.setState({ tab: 1 })}>
                Vue
              </div>
            </div>
            <iframe
              className={classnames('react-box-iframe', tab === 0 ? 'hidden' : 'show')}
              src="https://codesandbox.io/s/dry-cloud-0noh9?file=/src/components/HelloWorld.vue"
              frameBorder="0"></iframe>
            <iframe
              className={classnames('react-box-iframe', tab === 1 ? 'hidden' : 'show')}
              src="https://codesandbox.io/s/sharp-pond-y3i0f?file=/src/App.js"
              frameBorder="0"></iframe>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ReactVueloading;
