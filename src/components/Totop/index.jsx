import React from 'react';
import classnames from 'classnames';
import scrollTo from '../../common/scrollTo';
import './index.less';

class Totop extends React.Component {
  constructor() {
    super();
    this.handleScroll = this.handleScroll.bind(this);
  }
  state = {
    num: 0
  };
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
  }
  handleScroll() {
    let scrollNow = window.pageYOffset;
    let pageClientHeight = document.documentElement.clientHeight;
    let scrollHeight =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ) - pageClientHeight; // Full Window Height minus the viewport height

    let fullWindowHeightInPercentage = Math.round((scrollNow / scrollHeight) * 100);

    this.setState({
      num: fullWindowHeightInPercentage
    });
  }
  goTop() {
    scrollTo(0);
  }
  render() {
    return (
      <div className={classnames('totop', { 'totop-none': !this.state.num })} onClick={this.goTop}>
        <i className="xwb iconfanhuidingbu"></i>
        <p className="num">{this.state.num}%</p>
      </div>
    );
  }
}

export default Totop;
