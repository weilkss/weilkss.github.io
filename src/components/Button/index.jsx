import React from 'react';
import classnames from 'classnames';
import './index.less';

class Button extends React.Component {
  constructor() {
    super();
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  state = {
    obj: {
      cls: false
    }
  };
  handleMouseEnter(e) {
    this.setState({
      obj: {
        cls: true,
        left: e.pageX - e.target.offsetLeft,
        top: e.pageY - e.target.offsetTop
      }
    });
  }
  handleMouseLeave(e) {
    this.setState({
      obj: {
        cls: false,
        left: e.pageX - e.target.offsetLeft,
        top: e.pageY - e.target.offsetTop
      }
    });
  }
  render() {
    return this.props.type === 'crea' ? (
      <button className="button-name-box enter" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.props.onClick}>
        <p
          className={classnames('button-circle', { 'explode-circle': this.state.obj.cls, 'desplode-circle': !this.state.obj.cls })}
          style={{ left: this.state.obj.left, top: this.state.obj.top }}
        ></p>
        <p className="name">Weilkss Website Blog</p>
      </button>
    ) : (
      <button className="xwb-button" {...this.props}>
        <span className="xwb-button-text">{this.props.children}</span>
        <i className="xwb iconjiantou xwb-button-icon"></i>
        <div className="xwb-button-left"></div>
        <div className="xwb-button-right"></div>
        <div className="xwb-button-top"></div>
        <div className="xwb-button-bottom"></div>
      </button>
    );
  }
}
export default Button;
