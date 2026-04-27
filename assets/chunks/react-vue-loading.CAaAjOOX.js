class n extends HTMLElement{static get observedAttributes(){return["size","color"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}attributeChangedCallback(r,e,t){e!==t&&this.render()}render(){if(!this.shadowRoot)return;const r=this.getAttribute("size")||"24",e=this.getAttribute("color")||"#2396fa",t=Number(r),s=t/2,o=t/10,a=s-o,i=`
      :host { display: inline-block; width: ${t}px; height: ${t}px; }
      svg { animation: rotate-svg 2s infinite linear; }
      circle {
        stroke-dasharray: 1, ${t*2};
        stroke-dashoffset: 0;
        animation: dash-circle 1.5s ease-in-out infinite;
        stroke-linecap: round;
      }
      @keyframes rotate-svg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes dash-circle {
        0% { stroke-dasharray: 1, ${t*4}; stroke-dashoffset: 0; }
        50% { stroke-dasharray: ${t*2.5}, ${t*4}; stroke-dashoffset: -${t*.7}; }
        100% { stroke-dasharray: 1, ${t*4}; stroke-dashoffset: -${t*2.48}; }
      }
    `;this.shadowRoot.innerHTML=`
      <style>${i}</style>
      <svg width="${t}" height="${t}" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${s}" cy="${s}" r="${a}" stroke="${e}" stroke-miterlimit="10" stroke-width="${o}" fill="none" />
      </svg>
    `}}typeof window<"u"&&!customElements.get("rv-loading")&&customElements.define("rv-loading",n);const h="rv-loading";export{h as default};
