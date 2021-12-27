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
          <a className="beian" target='_blank' href='https://github.com/weilkss/weilkss.github.io.git'>蜀ICP备20010488号-1</a>
        </p>
      </footer>
    );
  }
}

export default Footer;
