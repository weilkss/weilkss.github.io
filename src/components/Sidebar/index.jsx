import React from 'react';
import request from '../../common/request';
import classnames from 'classnames';

import './index.less';

const Personal = props => (
  <div className="personal">
    <img className="personal-headpic personal-enter" src="http://q6x8pj73c.bkt.clouddn.com/34527431.jpeg" alt="" />
    <p className="personal-name personal-enter">Deng Wei</p>
    <p className="personal-work personal-enter">WEB前端开发工程师</p>
    <div className="personal-tab personal-enter">
      <div className="personal-item personal-border">
        <p className="personal-num">{(props.pdata && props.pdata.acount) || 0}</p>
        <p className="personal-text">文章</p>
      </div>
      <div className="personal-item personal-border">
        <p className="personal-num">{(props.pdata && props.pdata.tcount) || 0}</p>
        <p className="personal-text">标签</p>
      </div>
      <div className="personal-item personal-border">
        <p className="personal-num">{(props.pdata && props.pdata.icount) || 0}</p>
        <p className="personal-text">图片</p>
      </div>
      <div className="personal-item">
        <p className="personal-num">{(props.pdata && props.pdata.vcount) || 0}</p>
        <p className="personal-text">视频</p>
      </div>
    </div>
    <p className="personal-link personal-enter">
      <span>
        <i className="xwb  iconGitHub"></i>
        <a className="personal-link-a" href="https://github.com/weilkss" target="view_window">
          GitHub
        </a>
      </span>
      <span>
        <i className="xwb iconjuejin"></i>
        <a className="personal-link-a" href="https://juejin.im/user/5c1c5f37e51d454a890bf513" target="view_window">
          掘金
        </a>
      </span>
      <span>
        <i className="xwb iconjianshu"></i>
        <a className="personal-link-a" href="https://www.jianshu.com/u/3912184c56da" target="view_window">
          简书
        </a>
      </span>
    </p>
    <p className="personal-tuijian personal-enter">
      <i className="xwb iconumidd18"></i> <span>推荐链接</span>
    </p>
    <a className="personal-tuijian-a personal-enter" target="view_window" href="https://github.com/aliyunfe/weekly">
      阿里云前端技术周刊
    </a>
    <a className="personal-tuijian-a personal-enter" target="view_window" href="https://zhuanlan.zhihu.com/ElemeFE">
      饿了么前端团队
    </a>
    <a className="personal-tuijian-a personal-enter" target="view_window" href="https://frontendmasters.com/books/front-end-handbook/2019/">
      前端开发手册
    </a>
    <a className="personal-tuijian-a personal-enter" target="view_window" href="https://codeguide.bootcss.com/">
      编写一致、灵活和可持续的 HTML 和 CSS 代码的规范
    </a>
  </div>
);

const Catalog = props => {
  function handleCatalogClick(e, id) {
    let nodeList = [...document.querySelectorAll('dt'), ...document.querySelectorAll('dd')];
    for (const item of nodeList) {
      item.className = '';
    }
    e.currentTarget.className = 'catalog-active';
    props.onClick(id);
  }
  return (
    <div className="catalog">
      <dl>
        {props.tables.map(({ id, hash, tag }, index) =>
          tag === 'h1' ? (
            <dt key={index} className={props.active === id || (!props.active && index === 0) ? 'catalog-active' : ''} onClick={e => handleCatalogClick(e, id)}>
              {hash}
            </dt>
          ) : (
            <dd key={index} className={props.active === id || (!props.active && index === 0) ? 'catalog-active' : ''} onClick={e => handleCatalogClick(e, id)}>
              {hash}
            </dd>
          )
        )}
      </dl>
    </div>
  );
};

class Sidebar extends React.Component {
  constructor() {
    super();
    this.handleTabs = this.handleTabs.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  state = {
    index: 1,
    pdata: null,
    top: false,
    show: false,
    active: '',
    mshow: false,
    visible: true
  };
  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll, false);
    request.getPersonalCount().then(res => {
      this.setState({
        pdata: res,
        index: this.props.detail ? 1 : 2
      });
    });
    if (this.props.detail) {
      setTimeout(() => {
        this.handleClick();
      }, 1000);
    }
  }
  componentWillUnmount() {
    this.setState = () => {
      return false;
    };
    document.body.removeAttribute('style');
    window.removeEventListener('scroll', this.handleScroll, false);
  }
  handleScroll() {
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    let nodeList = [];
    for (let i = 0; i < 6; i++) {
      nodeList = [...nodeList, ...document.querySelectorAll(`h${i + 1}`)];
    }

    for (const item of nodeList) {
      if (item.offsetTop <= scrollTop + 50 && item.offsetTop >= scrollTop - 50) {
        this.setState({
          active: item.id
        });
      }
    }

    if (scrollTop && this.props.top) {
      this.setState({
        top: true
      });
    } else {
      this.setState({
        top: false
      });
    }
    return true;
  }
  handleClick() {
    if (document.body.offsetWidth > 1000) {
      if (this.state.show) {
        document.body.removeAttribute('style');
      } else {
        document.body.style.paddingRight = '320px';
      }
    } else {
      if (this.state.show) {
        document.body.removeAttribute('style');
      } else {
        document.body.style.overflow = 'hidden';
      }
    }
    this.setState({
      show: !this.state.show,
      mshow: false
    });
  }
  handleMouseEnter() {
    if (!this.state.show) {
      this.setState({
        mshow: true
      });
    }
  }
  handleMouseLeave() {
    if (!this.state.show) {
      this.setState({
        mshow: false
      });
    }
  }
  handleTabs(index) {
    this.setState({
      index
    });
  }
  render() {
    return (
      <div className="sidebar enter">
        <div
          className={classnames('sidebar-button', { 'sidebar-active': this.state.show, 'sidebar-mouse': this.state.mshow, 'sidebar-top': this.state.top })}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
        >
          <span className="sidebar-item"></span>
          <span className="sidebar-item"></span>
          <span className="sidebar-item"></span>
        </div>
        {this.state.show && document.body.offsetWidth <= 1000 ? <div className="sidebar-mask"></div> : null}
        <div className={classnames('sidebar-inner', { 'sidebar-inner-show': this.state.show })}>
          {this.props.detail ? (
            <div className="sidebar-tabs">
              <span className={classnames('sidebar-tabs-item1', { 'sidebar-tabs-active': this.state.index === 1 })} onClick={() => this.handleTabs(1)}>
                目录
              </span>
              <span className={classnames('sidebar-tabs-item2', { 'sidebar-tabs-active': this.state.index === 2 })} onClick={() => this.handleTabs(2)}>
                站点
              </span>
            </div>
          ) : null}
          {this.state.show ? (
            this.state.index === 1 && this.props.tables ? (
              <Catalog tables={this.props.tables} active={this.state.active} onClick={id => this.props.onClick(id)} />
            ) : (
              <Personal pdata={this.state.pdata} />
            )
          ) : null}
        </div>
      </div>
    );
  }
}

export default Sidebar;
