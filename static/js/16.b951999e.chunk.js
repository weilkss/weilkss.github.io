/*! For license information please see 16.b951999e.chunk.js.LICENSE.txt */
(this["webpackJsonpweilkss.github.io"]=this["webpackJsonpweilkss.github.io"]||[]).push([[16],{203:function(e,t,a){var n;!function(){"use strict";var a={}.hasOwnProperty;function r(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var s=typeof n;if("string"===s||"number"===s)e.push(n);else if(Array.isArray(n)&&n.length){var o=r.apply(null,n);o&&e.push(o)}else if("object"===s)for(var l in n)a.call(n,l)&&n[l]&&e.push(l)}}return e.join(" ")}e.exports?(r.default=r,e.exports=r):void 0===(n=function(){return r}.apply(t,[]))||(e.exports=n)}()},205:function(e,t,a){"use strict";var n=a(57),r=a(58),s=a(61),o=a(59),l=a(60),c=a(0),i=a.n(c),u=a(203),p=a.n(u),h=(a(208),function(e){Object(l.a)(a,e);var t=Object(o.a)(a);function a(){var e;return Object(n.a)(this,a),(e=t.call(this)).state={obj:{cls:!1}},e.handleMouseEnter=e.handleMouseEnter.bind(Object(s.a)(e)),e.handleMouseLeave=e.handleMouseLeave.bind(Object(s.a)(e)),e}return Object(r.a)(a,[{key:"handleMouseEnter",value:function(e){this.setState({obj:{cls:!0,left:e.pageX-e.target.offsetLeft,top:e.pageY-e.target.offsetTop}})}},{key:"handleMouseLeave",value:function(e){this.setState({obj:{cls:!1,left:e.pageX-e.target.offsetLeft,top:e.pageY-e.target.offsetTop}})}},{key:"render",value:function(){return"crea"===this.props.type?i.a.createElement("button",{className:"button-name-box enter",onMouseEnter:this.handleMouseEnter,onMouseLeave:this.handleMouseLeave,onClick:this.props.onClick},i.a.createElement("p",{className:p()("button-circle",{"explode-circle":this.state.obj.cls,"desplode-circle":!this.state.obj.cls}),style:{left:this.state.obj.left,top:this.state.obj.top}}),i.a.createElement("p",{className:"name"},"Weilkss Website Blog")):i.a.createElement("button",Object.assign({className:"xwb-button"},this.props),i.a.createElement("span",{className:"xwb-button-text"},this.props.children),i.a.createElement("i",{className:"xwb iconjiantou xwb-button-icon"}),i.a.createElement("div",{className:"xwb-button-left"}),i.a.createElement("div",{className:"xwb-button-right"}),i.a.createElement("div",{className:"xwb-button-top"}),i.a.createElement("div",{className:"xwb-button-bottom"}))}}]),a}(i.a.Component));t.a=h},206:function(e,t,a){"use strict";var n=a(57),r=a(58),s=a(59),o=a(60),l=a(0),c=a.n(l),i=a(205),u=a(63),p=(a(209),function(e){Object(o.a)(a,e);var t=Object(s.a)(a);function a(){var e;Object(n.a)(this,a);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=t.call.apply(t,[this].concat(s))).state={tabs:[{text:"\u9996\u9875",icon:"iconhome",path:"/"},{text:"\u70ed\u95e8",icon:"iconremen",path:"/hot"},{text:"\u5206\u7c7b",icon:"iconleimupinleifenleileibie2",path:"/type"},{text:"\u6807\u7b7e",icon:"iconlabels",path:"/label"},{text:"\u5f52\u6863",icon:"iconsuitcases",path:"/record"},{text:"\u56fe\u96c6",icon:"icontuji",path:"/atlas"},{text:"\u7535\u5f71",icon:"iconmovie",path:"/video"},{text:"\u641c\u7d22",icon:"iconmagnifyingglass",path:"/search"}]},e}return Object(r.a)(a,[{key:"handleClick",value:function(){window.location.href="https://www.weilkss.cn"}},{key:"render",value:function(){return c.a.createElement("header",{className:"header"},c.a.createElement("a",{href:"https://github.com/weilkss",target:"view_window"},c.a.createElement("i",{className:"xwb iconGitHub enter"})),c.a.createElement("div",null,c.a.createElement(i.a,{type:"crea",onClick:this.handleClick},"Another button")),c.a.createElement("p",{className:"quotation quotation-size enter"},"\u771f\u6b63\u7684\u5927\u5e08\u6c38\u8fdc\u90fd\u6000\u7740\u4e00\u9897\u5b66\u5f92\u7684\u5fc3\u3002"),c.a.createElement("p",{className:"quotation quotation-mb enter"},"A true master is an eternal student."),c.a.createElement("div",{className:"tab enter"},this.state.tabs.map((function(e,t){return c.a.createElement(u.c,{exact:!0,className:"item",key:t,to:e.path},c.a.createElement("i",{className:"xwb "+e.icon}),c.a.createElement("p",null,e.text))}))))}}]),a}(c.a.Component));t.a=p},207:function(e,t,a){"use strict";var n=a(57),r=a(58),s=a(59),o=a(60),l=a(0),c=a.n(l),i=(a(210),function(e){Object(o.a)(a,e);var t=Object(s.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return c.a.createElement("footer",{className:"footer"},c.a.createElement("section",{className:"copyright"},"Copyright \xa9 2019 - ",c.a.createElement("span",null,(new Date).getFullYear())," My WebSite. All Rights Reserved."),c.a.createElement("p",{className:"youqing"},c.a.createElement("span",{className:"beian"},"\u8700ICP\u590720010488\u53f7-1"),c.a.createElement("span",null,"\u53cb\u60c5\u94fe\u63a5\uff1a"),c.a.createElement("a",{className:"footer-link",href:"http://www.baixiaosheng.top",target:"view_window"},"\u67cf\u5c0f\u751f\u7684\u535a\u5ba2")))}}]),a}(c.a.Component));t.a=i},208:function(e,t,a){},209:function(e,t,a){},210:function(e,t,a){},563:function(e,t,a){"use strict";a.r(t);var n=a(57),r=a(58),s=a(59),o=a(60),l=a(0),c=a.n(l),i=a(206),u=a(207),p=a(62),h=function(e){Object(o.a)(a,e);var t=Object(s.a)(a);function a(){var e;Object(n.a)(this,a);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=t.call.apply(t,[this].concat(s))).state={playerProps:null},e}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var e=this;p.a.getVideoById(this.props.match.params.id).then((function(t){e.setState({playerProps:t})}))}},{key:"render",value:function(){return c.a.createElement(l.Fragment,null,c.a.createElement(i.a,null),c.a.createElement("div",{style:{width:"700px",margin:"auto"}},c.a.createElement("iframe",{frameBorder:"0",width:"700",height:"460",src:this.state.playerProps&&this.state.playerProps.url,allowFullScreen:!0,webkitallowfullscreen:"true",mozallowfullscreen:"true"})),c.a.createElement(u.a,null))}}]),a}(c.a.Component);t.default=h}}]);