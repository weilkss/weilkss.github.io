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
    const URL = tab ? 'https://codesandbox.io/s/dry-cloud-0noh9?file=/src/components/HelloWorld.vue' : 'https://codesandbox.io/s/sharp-pond-y3i0f?file=/src/App.js';
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
              <div className={classnames('tab-item', { 'tab-item-active': this.state.tab === 0 })} onClick={() => this.setState({ tab: 0 })}>
                React
              </div>
              <div className={classnames('tab-item', { 'tab-item-active': this.state.tab === 1 })} onClick={() => this.setState({ tab: 1 })}>
                Vue
              </div>
            </div>
            <iframe className="react-box-iframe" src={URL} frameBorder="0"></iframe>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ReactVueloading;
