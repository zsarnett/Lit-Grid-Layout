/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,e,s,i){var r,n=arguments.length,o=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,s,o):r(e,s))||o);return n>3&&o&&Object.defineProperty(e,s,o),o
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */}const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,s=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},i=`{{lit-${String(Math.random()).slice(2)}}}`,r=`\x3c!--${i}--\x3e`,n=new RegExp(`${i}|${r}`);class o{constructor(t,e){this.parts=[],this.element=e;const s=[],r=[],o=document.createTreeWalker(e.content,133,null,!1);let h=0,p=-1,c=0;const{strings:u,values:{length:g}}=t;for(;c<g;){const t=o.nextNode();if(null!==t){if(p++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let i=0;for(let t=0;t<s;t++)a(e[t].name,"$lit$")&&i++;for(;i-- >0;){const e=u[c],s=d.exec(e)[2],i=s.toLowerCase()+"$lit$",r=t.getAttribute(i);t.removeAttribute(i);const o=r.split(n);this.parts.push({type:"attribute",index:p,name:s,strings:o}),c+=o.length-1}}"TEMPLATE"===t.tagName&&(r.push(t),o.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(i)>=0){const i=t.parentNode,r=e.split(n),o=r.length-1;for(let e=0;e<o;e++){let s,n=r[e];if(""===n)s=l();else{const t=d.exec(n);null!==t&&a(t[2],"$lit$")&&(n=n.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),s=document.createTextNode(n)}i.insertBefore(s,t),this.parts.push({type:"node",index:++p})}""===r[o]?(i.insertBefore(l(),t),s.push(t)):t.data=r[o],c+=o}}else if(8===t.nodeType)if(t.data===i){const e=t.parentNode;null!==t.previousSibling&&p!==h||(p++,e.insertBefore(l(),t)),h=p,this.parts.push({type:"node",index:p}),null===t.nextSibling?t.data="":(s.push(t),p--),c++}else{let e=-1;for(;-1!==(e=t.data.indexOf(i,e+1));)this.parts.push({type:"node",index:-1}),c++}}else o.currentNode=r.pop()}for(const t of s)t.parentNode.removeChild(t)}}const a=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},h=t=>-1!==t.index,l=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function p(t,e){const{element:{content:s},parts:i}=t,r=document.createTreeWalker(s,133,null,!1);let n=u(i),o=i[n],a=-1,h=0;const l=[];let d=null;for(;r.nextNode();){a++;const t=r.currentNode;for(t.previousSibling===d&&(d=null),e.has(t)&&(l.push(t),null===d&&(d=t)),null!==d&&h++;void 0!==o&&o.index===a;)o.index=null!==d?-1:o.index-h,n=u(i,n),o=i[n]}l.forEach(t=>t.parentNode.removeChild(t))}const c=t=>{let e=11===t.nodeType?0:1;const s=document.createTreeWalker(t,133,null,!1);for(;s.nextNode();)e++;return e},u=(t,e=-1)=>{for(let s=e+1;s<t.length;s++){const e=t[s];if(h(e))return s}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const g=new WeakMap,m=t=>"function"==typeof t&&g.has(t),_={},y={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class f{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),s=[],i=this.template.parts,r=document.createTreeWalker(t,133,null,!1);let n,o=0,a=0,l=r.nextNode();for(;o<i.length;)if(n=i[o],h(n)){for(;a<n.index;)a++,"TEMPLATE"===l.nodeName&&(s.push(l),r.currentNode=l.content),null===(l=r.nextNode())&&(r.currentNode=s.pop(),l=r.nextNode());if("node"===n.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,n.name,n.strings,this.options));o++}else this.__parts.push(void 0),o++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const v=` ${i} `;class w{constructor(t,e,s,i){this.strings=t,this.values=e,this.type=s,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",s=!1;for(let n=0;n<t;n++){const t=this.strings[n],o=t.lastIndexOf("\x3c!--");s=(o>-1||s)&&-1===t.indexOf("--\x3e",o+1);const a=d.exec(t);e+=null===a?t+(s?v:r):t.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+i}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const S=t=>null===t||!("object"==typeof t||"function"==typeof t),b=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class x{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let t=0;t<s.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new P(this)}_getValue(){const t=this.strings,e=t.length-1;let s="";for(let i=0;i<e;i++){s+=t[i];const e=this.parts[i];if(void 0!==e){const t=e.value;if(S(t)||!b(t))s+="string"==typeof t?t:String(t);else for(const e of t)s+="string"==typeof e?e:String(e)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class P{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===_||S(t)&&t===this.value||(this.value=t,m(t)||(this.committer.dirty=!0))}commit(){for(;m(this.value);){const t=this.value;this.value=_,t(this)}this.value!==_&&this.committer.commit()}}class N{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(l()),this.endNode=t.appendChild(l())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=l()),t.__insert(this.endNode=l())}insertAfterPart(t){t.__insert(this.startNode=l()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;m(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=_,t(this)}const t=this.__pendingValue;t!==_&&(S(t)?t!==this.value&&this.__commitText(t):t instanceof w?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):b(t)?this.__commitIterable(t):t===y?(this.value=y,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,s="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=s:this.__commitNode(document.createTextNode(s)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof f&&this.value.template===e)this.value.update(t.values);else{const s=new f(e,t.processor,this.options),i=s._clone();s.update(t.values),this.__commitNode(i),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,i=0;for(const r of t)s=e[i],void 0===s&&(s=new N(this.options),e.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(r),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){s(this.startNode.parentNode,t.nextSibling,this.endNode)}}class E{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;m(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=_,t(this)}if(this.__pendingValue===_)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=_}}class C extends x{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new k(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class k extends P{}let z=!1;(()=>{try{const t={get capture(){return z=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class ${constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;m(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=_,t(this)}if(this.__pendingValue===_)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=T(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=_}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const T=t=>t&&(z?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function A(t){let e=Y.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},Y.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const r=t.strings.join(i);return s=e.keyString.get(r),void 0===s&&(s=new o(t,t.getTemplateElement()),e.keyString.set(r,s)),e.stringsArray.set(t.strings,s),s}const Y=new Map,R=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const V=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(t,e,s,i){const r=e[0];if("."===r){return new C(t,e.slice(1),s).parts}if("@"===r)return[new $(t,e.slice(1),i.eventContext)];if("?"===r)return[new E(t,e.slice(1),s)];return new x(t,e,s).parts}handleTextExpression(t){return new N(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const M=(t,...e)=>new w(t,e,"html",V)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,X=(t,e)=>`${t}--${e}`;let O=!0;void 0===window.ShadyCSS?O=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),O=!1);const L=t=>e=>{const s=X(e.type,t);let r=Y.get(s);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},Y.set(s,r));let n=r.stringsArray.get(e.strings);if(void 0!==n)return n;const a=e.strings.join(i);if(n=r.keyString.get(a),void 0===n){const s=e.getTemplateElement();O&&window.ShadyCSS.prepareTemplateDom(s,t),n=new o(e,s),r.keyString.set(a,n)}return r.stringsArray.set(e.strings,n),n},H=["html","svg"],D=new Set,U=(t,e,s)=>{D.add(t);const i=s?s.element:document.createElement("template"),r=e.querySelectorAll("style"),{length:n}=r;if(0===n)return void window.ShadyCSS.prepareTemplateStyles(i,t);const o=document.createElement("style");for(let t=0;t<n;t++){const e=r[t];e.parentNode.removeChild(e),o.textContent+=e.textContent}(t=>{H.forEach(e=>{const s=Y.get(X(e,t));void 0!==s&&s.keyString.forEach(t=>{const{element:{content:e}}=t,s=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{s.add(t)}),p(t,s)})})})(t);const a=i.content;s?function(t,e,s=null){const{element:{content:i},parts:r}=t;if(null==s)return void i.appendChild(e);const n=document.createTreeWalker(i,133,null,!1);let o=u(r),a=0,h=-1;for(;n.nextNode();){h++;for(n.currentNode===s&&(a=c(e),s.parentNode.insertBefore(e,s));-1!==o&&r[o].index===h;){if(a>0){for(;-1!==o;)r[o].index+=a,o=u(r,o);return}o=u(r,o)}}}(s,o,a.firstChild):a.insertBefore(o,a.firstChild),window.ShadyCSS.prepareTemplateStyles(i,t);const h=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==h)e.insertBefore(h.cloneNode(!0),e.firstChild);else if(s){a.insertBefore(o,a.firstChild);const t=new Set;t.add(o),p(s,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const W={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},j=(t,e)=>e!==t&&(e==e||t==t),B={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:j};class q extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,s)=>{const i=this._attributeNameForProperty(s,e);void 0!==i&&(this._attributeToPropertyMap.set(i,s),t.push(i))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=B){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(s){const i=this[t];this[e]=s,this._requestUpdate(t,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||B}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const s of e)this.createProperty(s,t[s])}}static _attributeNameForProperty(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,s=j){return s(t,e)}static _propertyValueFromAttribute(t,e){const s=e.type,i=e.converter||W,r="function"==typeof i?i:i.fromAttribute;return r?r(t,s):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const s=e.type,i=e.converter;return(i&&i.toAttribute||W.toAttribute)(t,s)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,s){e!==s&&this._attributeToProperty(t,s)}_propertyToAttribute(t,e,s=B){const i=this.constructor,r=i._attributeNameForProperty(t,s);if(void 0!==r){const t=i._propertyValueToAttribute(e,s);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(r):this.setAttribute(r,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const s=this.constructor,i=s._attributeToPropertyMap.get(t);if(void 0!==i){const t=s.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=s._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}_requestUpdate(t,e){let s=!0;if(void 0!==t){const i=this.constructor,r=i.getPropertyOptions(t);i._valueHasChanged(this[t],e,r.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==r.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,r))):s=!1}!this._hasRequestedUpdate&&s&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}q.finalized=!0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const I=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:s,elements:i}=e;return{kind:s,elements:i,finisher(e){window.customElements.define(t,e)}}})(t,e),F=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?Object.assign(Object.assign({},e),{finisher(s){s.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(s){s.createProperty(e.key,t)}};function J(t){return(e,s)=>void 0!==s?((t,e,s)=>{e.constructor.createProperty(s,t)})(t,e,s):F(t,e)}function G(t){return J({attribute:!1,hasChanged:null==t?void 0:t.hasChanged})}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const K="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol();class Z{constructor(t,e){if(e!==Q)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(K?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const tt=(t,...e)=>{const s=e.reduce((e,s,i)=>e+(t=>{if(t instanceof Z)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+t[i+1],t[0]);return new Z(s,Q)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const et={};class st extends q{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(void 0===t)this._styles=[];else if(Array.isArray(t)){const e=(t,s)=>t.reduceRight((t,s)=>Array.isArray(s)?e(s,t):(t.add(s),t),s),s=e(t,new Set),i=[];s.forEach(t=>i.unshift(t)),this._styles=i}else this._styles=[t]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?K?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==et&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){return et}}st.finalized=!0,st.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const r=i.scopeName,n=R.has(e),o=O&&11===e.nodeType&&!!e.host,a=o&&!D.has(r),h=a?document.createDocumentFragment():e;if(((t,e,i)=>{let r=R.get(e);void 0===r&&(s(e,e.firstChild),R.set(e,r=new N(Object.assign({templateFactory:A},i))),r.appendInto(e)),r.setValue(t),r.commit()})(t,h,Object.assign({templateFactory:L(r)},i)),a){const t=R.get(h);R.delete(h);const i=t.value instanceof f?t.value.template:void 0;U(r,h,i),s(e,e.firstChild),e.appendChild(h),R.set(e,t)}!n&&o&&window.ShadyCSS.styleElement(e.host)};const it=(t,e,s={})=>{t.dispatchEvent(new CustomEvent(e,{detail:s}))};let rt=class extends st{constructor(){super(...arguments),this.isDraggable=!0,this._dragging=!1}firstUpdated(){this.addEventListener("mousedown",this._dragStart.bind(this)),document.addEventListener("mousemove",this._drag.bind(this)),document.addEventListener("mouseup",this._dragEnd.bind(this))}render(){return M`<slot></slot>`}_dragStart(t){if(t.stopPropagation(),t.preventDefault(),!this.isDraggable)return;const e=this._getPos(t);this.startX=e.x,this.startY=e.y,this._dragging=!0,it(this,"dragStart",{startX:this.startX,startY:this.startY})}_drag(t){if(t.stopPropagation(),t.preventDefault(),!this._dragging||!this.isDraggable)return;const e=this._getPos(t);let s=e.x-this.startX,i=e.y-this.startY;this.grid&&(s=Math.round(s/this.grid[0])*this.grid[0],i=Math.round(i/this.grid[1])*this.grid[1]),(s||i)&&it(this,"dragging",{deltaX:s,deltaY:i})}_dragEnd(t){t.stopPropagation(),t.preventDefault(),this._dragging&&this.isDraggable&&(this._dragging=!1,it(this,"dragEnd"))}_getPos(t){return{x:t.type.startsWith("touch")?t.touches[0].clientX:t.clientX,y:t.type.startsWith("touch")?t.touches[0].clientY:t.clientY}}};t([J({type:Array})],rt.prototype,"grid",void 0),t([J({type:Boolean,reflect:!0})],rt.prototype,"isDraggable",void 0),rt=t([I("lit-draggable")],rt);let nt=class extends st{render(){return M`
      <lit-draggable @dragging=${this._drag} @dragStart=${this._dragStart}>
        <slot></slot>
      </lit-draggable>
    `}_dragStart(){const t=this.getBoundingClientRect(),e=this.parentElement.getBoundingClientRect();this.startLeft=t.left-e.left,this.startTop=t.top-e.top}_drag(t){const{deltaX:e,deltaY:s}=t.detail;this.style.setProperty("--drag-x",Math.round(this.startLeft+e)+"px"),this.style.setProperty("--drag-y",Math.round(this.startTop+s)+"px")}static get styles(){return tt`
      :host {
        position: absolute;
        transform: translate(var(--drag-x), var(--drag-y));
      }
    `}};t([J({type:Array})],nt.prototype,"grid",void 0),nt=t([I("lit-draggable-wrapper")],nt);const ot=t=>{let e=0;for(const s of t){const t=s.posY+s.height;e=t>e?t:e}return e},at=(t,e)=>t.key!==e.key&&(!(t.posX+t.width<=e.posX)&&(!(t.posX>=e.posX+e.width)&&(!(t.posY+t.height<=e.posY)&&!(t.posY>=e.posY+e.height)))),ht=(t,e)=>{for(const s of t)if(at(s,e))return s},lt=(t,e,s)=>{e.posY+=1;for(let i=t.map(t=>t.key).indexOf(e.key)+1;i<t.length;i++){const r=t[i];if(r.posY>e.posY+e.height)break;at(e,r)&&lt(t,r,s+e.height)}e.posY=s};function dt(t){return t.slice(0).sort((function(t,e){return t.posY>e.posY||t.posY===e.posY&&t.posX>e.posX?1:t.posY===e.posY&&t.posX===e.posX?0:-1}))}const pt=t=>{const e=[],s=[],i=dt(t);for(const r of i){for(;r.posY>0&&!ht(e,r);)r.posY--;let n;for(;n=ht(e,r);)lt(i,r,n.posY+n.height);r.hasMoved=!1,e.push(r),s[t.indexOf(r)]=r}return s};function ct(t,e,s,i,r){if(r){r=!1;const n={posX:s.posX,posY:Math.max(s.height-e.posY,0),width:s.width,height:s.height,key:"-1"};if(!ht(t,n))return ut(t,s,void 0,n.posY,i,r)}return ut(t,s,void 0,s.posY+1,i,r)}function ut(t,e,s,i,r,n){if(e.posY===i&&e.posX===s)return t;const o=e.posY;void 0!==s&&(e.posX=s),void 0!==i&&(e.posY=i),e.hasMoved=!0;let a=dt(t);void 0!==i&&o>=i&&(a=a.reverse());const h=function(t,e){return t.filter(t=>at(t,e))}(a,e),l=t.findIndex(t=>t.key===e.key);t[l]=e;for(let s=0,i=h.length;s<i;s++){const i=h[s];i.hasMoved||(t=ct([...t],e,i,r,n))}return t}let gt=class extends st{render(){return M`
      <slot></slot>

      <lit-draggable
        @dragging=${this._resize}
        @dragStart=${this._resizeStart}
        @dragEnd=${this._resizeEnd}
      >
      </lit-draggable>
    `}_resizeStart(){this.startWidth=this.clientWidth,this.startHeight=this.clientHeight,it(this,"resizeStart")}_resize(t){t.stopPropagation();const{deltaX:e,deltaY:s}=t.detail,i=this.startWidth+e,r=this.startHeight+s;it(this,"resize",{width:i,height:r,deltaX:e,deltaY:s})}_resizeEnd(){it(this,"resizeEnd")}static get styles(){return tt`
      :host {
        position: relative;
        display: block;
      }

      lit-draggable {
        width: 10px;
        height: 10px;
        background: blue;
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: se-resize;
      }
    `}};gt=t([I("lit-resizable")],gt);let mt=class extends st{constructor(){super(...arguments),this.minWidth=1,this.minHeight=1,this.isDraggable=!0,this.isResizable=!0,this._isDragging=!1,this._isResizing=!1}updated(){this._isDragging||(this.style.setProperty("--item-left",Math.round(this.posX*(this._getColumnWidth()+this.margin[0]))+"px"),this.style.setProperty("--item-top",Math.round(this.posY*(this.rowHeight+this.margin[1]))+"px"),this._isResizing||(this.style.setProperty("--item-width",this.width*this._getColumnWidth()+Math.max(0,this.width-1)*this.margin[0]+"px"),this.style.setProperty("--item-height",this.height*this.rowHeight+Math.max(0,this.height-1)*this.margin[1]+"px")))}render(){let t=M`<slot></slot>`;return this.isResizable&&(t=M` <lit-resizable
        @resizeStart=${this._resizeStart}
        @resize=${this._resize}
        @resizeEnd=${this._resizeEnd}
      >
        ${t}
      </lit-resizable>`),this.isDraggable&&(t=M`
        <lit-draggable
          .isDraggable=${this.isDraggable}
          @dragStart=${this._dragStart}
          @dragging=${this._drag}
          @dragEnd=${this._dragEnd}
        >
          ${t}
        </lit-draggable>
      `),t}_resizeStart(){this.isDraggable=!1,this._isResizing=!0,it(this,"resizeStart")}_resize(t){let{width:e,height:s}=t.detail;const i=this._getColumnWidth()*this.minWidth,r=(this._getColumnWidth()+this.margin[0])*(this.columns-this.posX)-this.margin[0],n=this.rowHeight*this.minHeight;e=e<i?i:e>r?r:e,s=s<this.rowHeight?n:s,this.style.setProperty("--item-width",e+"px"),this.style.setProperty("--item-height",s+"px");const o=Math.round((e+this.margin[0])/(this._getColumnWidth()+this.margin[0])),a=Math.round((s+this.margin[1])/(this.rowHeight+this.margin[1])),h=o-this.width,l=a-this.height;(h||l)&&it(this,"resize",{newWidth:o,newHeight:a})}_resizeEnd(){this.isDraggable=!0,this._isResizing=!1,it(this,"resizeEnd")}_dragStart(){const t=this.getBoundingClientRect(),e=this.offsetParent.getBoundingClientRect();this._startLeft=t.left-e.left,this._startTop=t.top-e.top,this._startPosX=this.posX,this._startPosY=this.posY,this._isDragging=!0,it(this,"dragStart")}_drag(t){if(t.stopPropagation(),void 0===this._startPosX||void 0===this._startPosY)return;const{deltaX:e,deltaY:s}=t.detail;this.style.setProperty("--item-left",this._startLeft+e+"px"),this.style.setProperty("--item-top",this._startTop+s+"px");const i=Math.round(e/(this._getColumnWidth()+this.margin[0])),r=Math.round(s/(this.rowHeight+this.margin[1]));if(!r&&!i)return;let n=this._startPosX+i,o=this._startPosY+r;void 0===n||isNaN(n)||void 0===o||isNaN(o)||(n=Math.max(0,n),o=Math.max(0,o),n=Math.min(this.columns-this.width,n),it(this,"dragging",{newPosX:n,newPosY:o}))}_dragEnd(){this._isDragging=!1,this._startLeft=void 0,this._startTop=void 0,this._startPosX=void 0,this._startPosY=void 0,it(this,"dragEnd")}_getColumnWidth(){return(this.parentWidth-this.margin[0]*(this.columns-1))/this.columns}static get styles(){return tt`
      :host {
        position: absolute;
        width: var(--item-width);
        height: var(--item-height);
        transform: translate(var(--item-left), var(--item-top));
        transition: var(--grid-item-transition, all 200ms);
        z-index: 2;
      }

      :host([dragging]) {
        transition: none;
        z-index: 3;
      }

      :host([resizing]) {
        z-index: 3;
        transition-property: transform;
      }

      lit-resizable {
        width: 100%;
        height: 100%;
      }
    `}};t([J({type:Number})],mt.prototype,"width",void 0),t([J({type:Number})],mt.prototype,"height",void 0),t([J({type:Number})],mt.prototype,"posX",void 0),t([J({type:Number})],mt.prototype,"posY",void 0),t([J({type:Number})],mt.prototype,"rowHeight",void 0),t([J({type:Number})],mt.prototype,"columns",void 0),t([J({type:Number})],mt.prototype,"parentWidth",void 0),t([J({type:Array})],mt.prototype,"margin",void 0),t([J({type:Number})],mt.prototype,"minWidth",void 0),t([J({type:Number})],mt.prototype,"minHeight",void 0),t([J({type:Boolean})],mt.prototype,"isDraggable",void 0),t([J({type:Boolean})],mt.prototype,"isResizable",void 0),t([J()],mt.prototype,"key",void 0),t([J({attribute:"dragging",reflect:!0,type:Boolean})],mt.prototype,"_isDragging",void 0),t([J({attribute:"resizing",reflect:!0,type:Boolean})],mt.prototype,"_isResizing",void 0),mt=t([I("lit-grid-item")],mt);let _t=class extends st{constructor(){super(...arguments),this.layout=[],this.elements=[],this.rowHeight=30,this.columns=12,this.margin=[10,10],this._currentLayout=[]}get childrenElements(){return this.elements.concat(...Array.prototype.filter.call(this.children,t=>t.classList.contains("lit-grid-item")))}get layoutHeight(){const t=ot(this.layout);return t*this.rowHeight+(t-1)*this.margin[1]}updated(t){super.updated(t),t.has("layout")&&(this.setupLayout(),this.style.height=this.layoutHeight+"px")}render(){var t;return(null===(t=this._currentLayout)||void 0===t?void 0:t.length)?M`
      ${this.childrenElements.map((t,e)=>{const s=this._currentLayout[e];return M`
          <lit-grid-item
            .width=${s.width}
            .height=${s.height}
            .posY=${s.posY}
            .posX=${s.posX}
            .key=${s.key}
            .parentWidth=${this.clientWidth}
            .columns=${this.columns}
            .rowHeight=${this.rowHeight}
            .margin=${this.margin}
            @resizeStart=${this._itemResizeStart}
            @resize=${this._itemResize}
            @resizeEnd=${this._itemResizeEnd}
            @dragStart=${this._itemDragStart}
            @dragging=${this._itemDrag}
            @dragEnd=${this._itemDragEnd}
          >
            ${t}
          </lit-grid-item>
        `})}
      ${this._renderPlaceHolder()}
    `:M``}setupLayout(){let t=[];for(const e of this.childrenElements){let s=this.layout.find(t=>t.key===e.key);if(!s){const i=e.grid||{width:1,height:1,posX:0,posY:ot(t)};s=Object.assign(Object.assign({},i),{key:e.key})}t.push(s)}t=((t,e)=>{for(const s of t)s.posX+s.width>e&&(s.posX=e-s.width),s.posX<0&&(s.posX=0);return t})(t,this.columns),this._currentLayout=pt(t)}_itemResizeStart(t){this._placeholder=this._currentLayout.find(e=>e.key===t.currentTarget.key)}_itemResize(t){const{newWidth:e,newHeight:s}=t.detail,i=t.currentTarget.key,r=this._currentLayout.findIndex(t=>t.key===i),n=this._currentLayout[r],o=Object.assign(Object.assign({},n),{width:e,height:s});this._currentLayout[r]=o,this._placeholder=o,this._currentLayout=pt(this._currentLayout)}_itemResizeEnd(){this._placeholder=void 0}_itemDragStart(t){this._placeholder=this._currentLayout.find(e=>e.key===t.currentTarget.key)}_itemDrag(t){t.stopPropagation(),t.preventDefault();const{newPosX:e,newPosY:s}=t.detail,i=t.currentTarget.key,r=this._currentLayout.findIndex(t=>t.key===i),n=this._currentLayout[r],o=ut([...this._currentLayout],n,e,s,this.columns,!0);this._currentLayout=pt(o),this._placeholder=this._currentLayout.find(t=>t.key===i)}_itemDragEnd(){this._placeholder=void 0}_renderPlaceHolder(){return this._placeholder?M`
      <lit-grid-item
        .width=${this._placeholder.width}
        .height=${this._placeholder.height}
        .posY=${this._placeholder.posY}
        .posX=${this._placeholder.posX}
        .key=${this._placeholder.key}
        .parentWidth=${this.clientWidth}
        .columns=${this.columns}
        .rowHeight=${this.rowHeight}
        .margin=${this.margin}
        .isDraggable=${!1}
        .isResizable=${!1}
        class="placeholder"
      >
      </lit-grid-item>
    `:M``}static get styles(){return tt`
      :host {
        display: block;
        position: relative;
      }

      .placeholder {
        background-color: var(--placeholder-background-color, red);
        opacity: var(--placeholder-background-opacity, 0.2);
        z-index: 1;
      }
    `}};t([J({type:Array})],_t.prototype,"layout",void 0),t([J({type:Array})],_t.prototype,"elements",void 0),t([J({type:Number})],_t.prototype,"rowHeight",void 0),t([J({type:Number})],_t.prototype,"columns",void 0),t([J({type:Array})],_t.prototype,"margin",void 0),t([G()],_t.prototype,"_currentLayout",void 0),t([G()],_t.prototype,"_placeholder",void 0),_t=t([I("lit-grid-layout")],_t);