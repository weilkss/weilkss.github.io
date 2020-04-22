import React, { Fragment } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import request from "../../common/request";

class VideoPlay extends React.Component {
	state = {
		playerProps: null,
	};

	componentDidMount() {
		request.getVideoById(this.props.match.params.id).then(res => {
			this.setState({
				playerProps: res,
			});
		});
	}
	render() {
		return (
			<Fragment>
				<Header />
				<div style={{ width: "700px", margin: "auto" }}>
					<iframe
						title="myiframe"
						frameBorder="0"
						width="700"
						height="460"
						src={this.state.playerProps && this.state.playerProps.url}
						allowFullScreen={true}
						webkitallowfullscreen="true"
						mozallowfullscreen="true"></iframe>
				</div>
				<Footer />
			</Fragment>
		);
	}
}

export default VideoPlay;
