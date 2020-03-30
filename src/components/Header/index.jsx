import React from 'react';
import Button from '../Button';
import { NavLink } from 'react-router-dom';
import './index.less';

class Header extends React.Component {
  state = {
    tabs: [
      { text: '首页', icon: 'iconhome', path: '/' },
      { text: '热门', icon: 'iconremen', path: '/hot' },
      { text: '分类', icon: 'iconleimupinleifenleileibie2', path: '/type' },
      { text: '标签', icon: 'iconlabels', path: '/label' },
      { text: '归档', icon: 'iconsuitcases', path: '/record' },
      { text: '图集', icon: 'icontuji', path: '/atlas' },
      { text: '电影', icon: 'iconmovie', path: '/video' },
      { text: '搜索', icon: 'iconmagnifyingglass', path: '/search' }
    ]
  };
  handleClick() {
    window.location.href = 'https://www.buttr.cn';
  }
  render() {
    return (
      <header className="header">
        <a href="https://github.com/buttr" target="view_window">
          <i className="xwb iconGitHub enter"></i>
        </a>
        <div>
          <Button type="crea" onClick={this.handleClick}>
            Another button
          </Button>
        </div>
        <p className="quotation quotation-size enter">真正的大师永远都怀着一颗学徒的心。</p>
        <p className="quotation quotation-mb enter">A true master is an eternal student.</p>
        <div className="tab enter">
          {this.state.tabs.map((item, index) => (
            <NavLink exact className="item" key={index} to={item.path}>
              <i className={'xwb ' + item.icon}></i>
              <p>{item.text}</p>
            </NavLink>
          ))}
        </div>
      </header>
    );
  }
}
export default Header;
