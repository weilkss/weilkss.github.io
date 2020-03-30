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
          <a className="footer-link footer-left" href="https://github.com/buttr" target="view_window">
            <i className="xwb iconGitHub"></i>
            <span>BUTTR</span>
          </a>
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
