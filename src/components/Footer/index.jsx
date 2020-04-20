import React from 'react';
import './index.less';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <section className="copyright">
          Copyright © 2019 - <span>{new Date().getFullYear()}</span> My WebSite. All Rights Reserved.
        </section>
        <p className="youqing">
          <span className="beian">蜀ICP备20010488号-1</span>
          <span>友情链接：</span>
          <a className="footer-link" href="http://www.baixiaosheng.top" target="view_window">
            柏小生的博客
          </a>
        </p>
      </footer>
    );
  }
}

export default Footer;
