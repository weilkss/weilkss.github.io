import React from 'react';
import Zmage from 'react-zmage';
import config from '../../common/config';

class ImageWarp extends React.Component {
  state = {
    src: ''
  };
  componentDidMount() {
    this.setState({
      src: config.qiniu.domian + this.props.narrow
    });

    let img = new Image();
    img.src = config.qiniu.domian + this.props.src;
    img.onload = e => {
      this.setState({
        src: e.target.src
      });
    };
  }
  componentWillUnmount() {
    this.setState = () => {
      return false;
    };
  }
  render() {
    return this.props.see ? <Zmage className='img' src={this.state.src} /> : <img className='img' src={this.state.src} alt="" onClick={this.props.onClick} />;
  }
}

export default ImageWarp;
