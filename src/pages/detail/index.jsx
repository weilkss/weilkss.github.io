import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import Totop from '../../components/Totop';
import request from '../../common/request';
import NProgress from 'nprogress';
import utils from '../../common/utils';
import scrollTo from '../../common/scrollTo';
import arrayMarkDown from './Array.md';
import ReactMarkdown from 'xwb-react-markdown';
import 'nprogress/nprogress.css';
import './index.less';
import '../../common/style/highlight.less';

class Detail extends React.Component {
  state = {
    detail: null,
    types: [],
    tables: [],
    recommend: []
  };
  async componentDidMount() {
    scrollTo(0);
    NProgress.start();

    let isMax = false;
    const maxLists = ['895ff1c92f'];
    const tid = this.props.match.params.id;

    for (const itemId of maxLists) {
      if (itemId === tid) {
        isMax = true;
        break;
      } else {
        isMax = false;
      }
    }

    let articleDetailResult = null;

    if (isMax) {
      articleDetailResult = await request.getArticleDetailById(tid);
      articleDetailResult.html = new ReactMarkdown().mdParser.render(arrayMarkDown);
    } else {
      articleDetailResult = await request.getArticleDetail(tid);
    }

    let tables = [];

    articleDetailResult.html = articleDetailResult.html.replace(/<(h\d).*?>.*?<\/h\d>/g, (match, tag) => {
      const hash = match.replace(/<.*?>/g, '');
      const id = 'tag-' + tables.length;
      tables.push({ id, hash, tag });
      const newtag = `<${tag} id="${id}">${hash}</${tag}>`;
      return newtag;
    });

    this.setState({
      tables,
      detail: articleDetailResult
    });

    await request.getTypes().then(res => {
      this.setState({
        types: utils.getRandomArrayElements(res, 3)
      });
    });

    await request.getRecommendArticle(this.state.detail.objectId, this.state.detail.tid.objectId).then(res => {
      this.setState({
        recommend: res
      });
    });

    NProgress.done();
  }
  handleClick(id) {
    scrollTo(document.querySelector('#' + id).offsetTop);
  }
  goDetail(id) {
    this.props.history.push(`/detail/${id}`);
    scrollTo(0);
    setTimeout(() => {
      this.setState(
        {
          tables: [],
          detail: null
        },
        () => this.componentDidMount()
      );
    }, 500);
  }
  render() {
    const { detail } = this.state;
    return (
      <Fragment>
        <Header />
        <main className="detail enter">
          {detail ? (
            <Fragment>
              <div className="detail-header">
                <Link className="title" to={`/detail/${detail.objectId}`}>
                  {detail.title}
                </Link>
                <div className="detail-meta">
                  <span className="detail-bao">
                    <i className="xwb meta-icon iconshijian"></i>
                    <span className="detail-des">发表于</span>
                    <time title="发表时间">{detail.createdAt}</time>
                  </span>
                  <span className="meta-divider">|</span>
                  <span className="detail-bao">
                    <i className="xwb meta-icon iconwenjian"></i>
                    <span className="detail-des">分类于</span>
                    <Link className="detail-type" to={`/tabs/${detail.tid.objectId}`}>
                      {detail.tid.name}
                    </Link>
                  </span>
                  <span className="meta-divider">|</span>
                  <span className="detail-bao">
                    <i className="xwb meta-icon iconyanjing"></i>
                    <span className="detail-des">热度：{detail.visit}</span>
                  </span>
                  <p className="meta-wordcount">
                    <i className="xwb meta-icon icontongji"></i>
                    <span className="detail-des">字节统计：{detail.len}</span>
                  </p>
                </div>
              </div>
              <p className="detail-til">前言</p>
              <p className="describe">{detail.describe}</p>
              <p className="detail-til">正文</p>
              <div className="detail-html" dangerouslySetInnerHTML={{ __html: detail.html }}></div>
              <div className="detail-end">END</div>
              <p className="detail-til">更多标签</p>
              <div className="label-box">
                {this.state.types.map((item, index) => (
                  <Link className="label-box-link" key={index} to={`/tabs/${item.objectId}`}>
                    {item.name}
                  </Link>
                ))}
              </div>
              <p className="detail-til">相关推荐</p>
              <div className="recommend">
                {this.state.recommend.map((item, index) => (
                  <p className="recommend-link" key={index} onClick={() => this.goDetail(item.objectId)}>
                    <span>{index + 1}、</span>
                    {item.title}
                  </p>
                ))}
              </div>
            </Fragment>
          ) : null}
          <Totop />
          <Sidebar tables={this.state.tables} top detail onClick={id => this.handleClick(id)} />
        </main>
        <Footer />
      </Fragment>
    );
  }
}
export default Detail;
