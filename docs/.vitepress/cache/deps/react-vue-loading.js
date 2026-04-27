// node_modules/.pnpm/react-vue-loading@1.0.6/node_modules/react-vue-loading/lib/react-vue-loading.js
var n = class extends HTMLElement {
  static get observedAttributes() {
    return ["size", "color"];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(o, e, t) {
    e !== t && this.render();
  }
  render() {
    if (!this.shadowRoot) return;
    const o = this.getAttribute("size") || "24", e = this.getAttribute("color") || "#2396fa", t = Number(o), s = t / 2, r = t / 10, i = s - r, a = `
      :host { display: inline-block; width: ${t}px; height: ${t}px; }
      svg { animation: rotate-svg 2s infinite linear; }
      circle {
        stroke-dasharray: 1, ${t * 2};
        stroke-dashoffset: 0;
        animation: dash-circle 1.5s ease-in-out infinite;
        stroke-linecap: round;
      }
      @keyframes rotate-svg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes dash-circle {
        0% { stroke-dasharray: 1, ${t * 4}; stroke-dashoffset: 0; }
        50% { stroke-dasharray: ${t * 2.5}, ${t * 4}; stroke-dashoffset: -${t * 0.7}; }
        100% { stroke-dasharray: 1, ${t * 4}; stroke-dashoffset: -${t * 2.48}; }
      }
    `;
    this.shadowRoot.innerHTML = `
      <style>${a}</style>
      <svg width="${t}" height="${t}" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${s}" cy="${s}" r="${i}" stroke="${e}" stroke-miterlimit="10" stroke-width="${r}" fill="none" />
      </svg>
    `;
  }
};
typeof window < "u" && !customElements.get("rv-loading") && customElements.define("rv-loading", n);
var c = "rv-loading";
export {
  c as default
};
//# sourceMappingURL=react-vue-loading.js.map
