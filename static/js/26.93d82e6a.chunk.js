(this["webpackJsonpxwb007.github.io"]=this["webpackJsonpxwb007.github.io"]||[]).push([[26],{176:function(t,e,a){"use strict";var n=a(40),r=a(41),s=a(42),c=a(43),i=a(0),o=a.n(i),l=a(216),u=a.n(l),h=a(132),m=function(t){Object(c.a)(a,t);var e=Object(s.a)(a);function a(){var t;Object(n.a)(this,a);for(var r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];return(t=e.call.apply(e,[this].concat(s))).state={src:""},t}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.setState({src:h.a.qiniu.domian+this.props.narrow});var e=new Image;e.src=h.a.qiniu.domian+this.props.src,e.onload=function(e){t.setState({src:e.target.src})}}},{key:"componentWillUnmount",value:function(){this.setState=function(){return!1}}},{key:"render",value:function(){return this.props.see?o.a.createElement(u.a,{className:"img",src:this.state.src}):o.a.createElement("img",{className:"img",src:this.state.src,alt:"",onClick:this.props.onClick})}}]),a}(o.a.Component);e.a=m},583:function(t,e,a){},623:function(t,e,a){"use strict";a.r(e);var n=a(40),r=a(41),s=a(42),c=a(43),i=a(0),o=a.n(i),l=a(133),u=a(134),h=a(176),m=a(148),p=a(131),f=(a(583),function(t){Object(c.a)(a,t);var e=Object(s.a)(a);function a(){var t;Object(n.a)(this,a);for(var r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];return(t=e.call.apply(e,[this].concat(s))).state={atlas:[]},t}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var t=this;p.a.getAtlas().then((function(e){t.setState({atlas:e})}))}},{key:"handleClick",value:function(t){this.props.history.push("/atlas/"+t)}},{key:"render",value:function(){var t=this;return o.a.createElement(i.Fragment,null,o.a.createElement(l.a,null),o.a.createElement("main",{className:"atlas enter"},this.state.atlas.map((function(e,a){return o.a.createElement(h.a,{src:e.atlas[0].url,narrow:e.atlas[0].narrow,key:a,onClick:function(){return t.handleClick(e.objectId)}})})),o.a.createElement(m.a,null)),o.a.createElement(u.a,null))}}]),a}(o.a.Component));e.default=f}}]);