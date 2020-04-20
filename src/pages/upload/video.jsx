import React from "react";
import upload from "../../common/upload";
import request from "../../common/request";
import Toast from "../../components/Toast";

import "./index.less";

class UploadVideo extends React.Component {
	constructor() {
		super();
		this.fileChange = this.fileChange.bind(this);
		this.handleReple = this.handleReple.bind(this);
	}
	state = {
		percent: 0,
		name: "",
		ename: "",
		year: "",
		describe: "",
		cover: "",
		url: "",
		dcover: "",
		width: 0,
		height: 0,
		size: 0,
		duration: 0,
		imgProgress: 0,
	};

	/**
	 * 获取信息
	 * 截取封面
	 * @param {} file
	 */
	getVideoImg(file) {
		let blob = new Blob([file]);
		let videoElement = this.refs.video;
		videoElement.src = URL.createObjectURL(blob);
		videoElement.addEventListener("canplay", async () => {
			const canvas = document.createElement("canvas");
			canvas.width = videoElement.videoWidth;
			canvas.height = videoElement.videoHeight;
			canvas.getContext("2d").drawImage(videoElement, 0, 0, canvas.width, canvas.height);
			let arr = canvas.toDataURL("image/jpeg").split(",");
			let mime = arr[0].match(/:(.*?);/)[1];
			let suffix = mime.split("/")[1];
			let bstr = atob(arr[1]);
			let n = bstr.length;
			let u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			const ifile = new File([u8arr], `file.${suffix}`, { type: mime });
			const dcover = await upload({ file: ifile, type: "image" });
			this.setState({
				duration: videoElement.duration,
				dcover,
				width: videoElement.videoWidth,
				height: videoElement.videoHeight,
			});
		});
	}
	async fileChange(e) {
		if (e.target.files.length) {
			const file = e.target.files[0];
			const url = await upload({ file, type: "video" }, res => {
				this.setState({
					percent: res,
				});
			});
			this.setState({
				url,
				size: file.size,
			});
			this.getVideoImg(file);
		}
	}
	handleReple() {
		const { name, ename, describe, year, url, cover, dcover, duration, width, height, size } = this.state;
		request
			.setVideo({
				name,
				ename,
				year,
				describe,
				url,
				cover,
				dcover,
				duration,
				width,
				height,
				size,
			})
			.then(res => {
				Toast.success("发布成功!");
				setTimeout(() => {
					this.props.history.push("/video/" + res.objectId);
				}, 2000);
			});
	}
	/**
	 * 上传封面
	 * @param {*} e
	 */
	async handleUploadCover(e) {
		if (e.target.files.length) {
			const file = e.target.files[0];
			const cover = await upload({ file, type: "image" }, res => {
				this.setState({
					imgProgress: res,
				});
			});
			this.setState({
				cover,
			});
		}
	}
	handleName = e => {
		this.setState({
			name: e.target.value.trim(),
		});
	};
	handleeName = e => {
		this.setState({
			ename: e.target.value.trim(),
		});
	};
	handleeYear = e => {
		this.setState({
			year: new Date(e.target.value).getTime(),
		});
	};
	handletextChange = e => {
		this.setState({
			describe: e.target.value.trim(),
		});
	};
	render() {
		return (
			<div className="upload">
				<p className="upload-title">上传电影&TEST</p>
				<div className="upload-top">
					<input className="upload-name" type="text" placeholder="电影名" onChange={this.handleName} />
					<input className="upload-name" type="text" placeholder="电影英文名" onChange={this.handleeName} />
					<input className="upload-name" type="date" onChange={this.handleeYear} />
					<button className="upload-reple" onClick={this.handleReple}>
						发布
					</button>
				</div>

				<textarea className="upload-describe" placeholder="输入描述" onChange={this.handletextChange}></textarea>

				<div className="upload-btn">
					<input className="upload-input" type="file" multiple accept=".jpg,.jpeg,.png,.gif" onChange={e => this.handleUploadCover(e)} />
					<i className="xwb iconshangchuan"></i>
					<p>上传封面</p>
					<div className="progress" style={{ width: this.state.imgProgress + "%" }}>
						{this.state.imgProgress + "%"}
					</div>
				</div>

				<div className="upload-btn">
					<input className="upload-input" type="file" onChange={this.fileChange} />
					<video className="video-video" src="" ref="video"></video>
					<i className="xwb iconshangchuan"></i>
					<p>上传电影</p>
					<div className="progress" style={{ width: this.state.percent + "%" }}>
						{this.state.percent + "%"}
					</div>
				</div>
			</div>
		);
	}
}

export default UploadVideo;
