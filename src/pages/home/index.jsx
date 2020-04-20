import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Botton from "../../components/Button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import Pagination from "rc-pagination";
import request from "../../common/request";
import scrollTo from "../../common/scrollTo";

import "./index.less";
import "../../common/style/rcpagination.less";

class Home extends React.Component {
	constructor() {
		super();
		this.handClick = this.handClick.bind(this);
		this.handlePage = this.handlePage.bind(this);
	}
	state = {
		show: false,
		page: 1,
		pagesize: 10,
		total: 0,
		alists: [],
	};
	componentDidMount() {
		this.getArticleList();
	}
	getArticleList() {
		request.getArticleList(this.state.page, this.state.pagesize, this.state.total).then(res => {
			this.setState({
				show: true,
				...res,
			});
		});
	}
	handClick(objectId) {
		this.props.history.push("/detail/" + objectId);
	}
	handlePage(page) {
		scrollTo(0);
		this.setState({ page, show: false }, () => this.getArticleList());
	}
	render() {
		return (
			<Fragment>
				{this.state.show ? <Header /> : null}
				<main className="home">
					{this.state.show ? (
						<div className="home-list">
							{this.state.alists.map((item, index) => (
								<div className="item enter" key={index}>
									<div className="home-header">
										<Link to={`/detail/${item.objectId}`} className="title">
											<span data-letters-l={item.title.slice(0, item.title.length / 2)} data-letters-r={item.title.slice(item.title.length / 2, item.title.length)}>
												{item.title}
											</span>
										</Link>
										<div className="home-meta">
											<span className="home-bao">
												<i className="xwb meta-icon iconshijian"></i>
												<span className="home-des">发表于</span>
												<time title="发表时间">{item.createdAt}</time>
											</span>
											<span className="meta-divider">|</span>
											<span className="home-bao">
												<i className="xwb meta-icon iconwenjian"></i>
												<span className="home-des">分类于</span>
												<Link className="home-type" to={`/tabs/${item.tid.objectId}`}>
													{item.tid.name}
												</Link>
											</span>
											<span className="meta-divider">|</span>
											<span className="home-bao">
												<i className="xwb meta-icon iconyanjing"></i>
												<span className="home-des">热度：{item.visit}</span>
											</span>
											<p className="meta-wordcount">
												<i className="xwb meta-icon icontongji"></i>
												<span className="home-des">字节统计：{item.len}</span>
											</p>
										</div>
										<p className="describe">{item.describe}</p>
										<div className="godetail">
											<Botton onClick={() => this.handClick(item.objectId)}>阅读全文</Botton>
										</div>
										<hr />
									</div>
								</div>
							))}
							{this.state.alists.length ? <Pagination current={this.state.page} defaultPageSize={this.state.pagesize} total={this.state.total} onChange={this.handlePage} /> : null}
						</div>
					) : null}
					<Sidebar />
				</main>
				<Footer />
			</Fragment>
		);
	}
}
export default Home;
