(this["webpackJsonpweilkss.github.io"]=this["webpackJsonpweilkss.github.io"]||[]).push([[22],{224:function(e,t,a){"use strict";var n=a(57),r=a(58),s=a(59),c=a(60),l=a(0),i=a.n(l),o=a(246),u=a.n(o),m=a(37),p=function(e){Object(c.a)(a,e);var t=Object(s.a)(a);function a(){var e;Object(n.a)(this,a);for(var r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];return(e=t.call.apply(t,[this].concat(s))).state={src:""},e}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.setState({src:m.a.qiniu.domian+this.props.narrow});var t=new Image;t.src=m.a.qiniu.domian+this.props.src,t.onload=function(t){e.setState({src:t.target.src})}}},{key:"componentWillUnmount",value:function(){this.setState=function(){return!1}}},{key:"render",value:function(){return this.props.see?i.a.createElement(u.a,{className:"img",src:this.state.src}):i.a.createElement("img",{className:"img",src:this.state.src,alt:"",onClick:this.props.onClick})}}]),a}(i.a.Component);t.a=p},546:function(e,t,a){},564:function(e,t,a){"use strict";a.r(t);var n=a(57),r=a(58),s=a(59),c=a(60),l=a(0),i=a.n(l),o=a(206),u=a(207),m=a(224),p=a(62),h=a(212),f=a(227),v=(a(546),function(e){Object(c.a)(a,e);var t=Object(s.a)(a);function a(){var e;Object(n.a)(this,a);for(var r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];return(e=t.call.apply(t,[this].concat(s))).state={atlas:null},e}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var e=this;p.a.getAtlasById(this.props.match.params.id).then((function(t){e.setState({atlas:t})}))}},{key:"render",value:function(){var e=this.state.atlas;return i.a.createElement(l.Fragment,null,i.a.createElement(o.a,null),e?i.a.createElement("main",{className:"see enter"},i.a.createElement("p",{className:"see-title"},e.title),i.a.createElement("blockquote",null,i.a.createElement("p",{className:"see-describe"},e.describe)),i.a.createElement("div",{className:"see-atlas"},e.atlas.map((function(e,t){return i.a.createElement(m.a,{src:e.url,narrow:e.narrow,see:!0,key:t})}))),i.a.createElement(f.a,null),i.a.createElement(h.a,{top:!0})):null,i.a.createElement(u.a,null))}}]),a}(i.a.Component));t.default=v}}]);