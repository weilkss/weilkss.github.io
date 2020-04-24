import React, { Fragment } from 'react';
import RVloading from 'react-vue-loading';
import './index.less';

class ReactVueloading extends React.Component {
	componentDidMount() {}
	render() {
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
					<div className='l-content'>
							<h1>react-vue-loading</h1>
							<h2>适用于 React Vue 的 loading 组件</h2>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default ReactVueloading;
