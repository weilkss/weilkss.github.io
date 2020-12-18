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
        </p>
      </footer>
    );
  }
}

export default Footer;
