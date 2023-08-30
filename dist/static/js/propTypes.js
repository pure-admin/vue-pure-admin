/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */function _(e){return Object.prototype.toString.call(e)==="[object Object]"}function E(e){var r,n;return _(e)===!1?!1:(r=e.constructor,r===void 0?!0:(n=r.prototype,!(_(n)===!1||n.hasOwnProperty("isPrototypeOf")===!1)))}function O(){return O=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var n=arguments[r];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},O.apply(this,arguments)}function P(e,r){if(e==null)return{};var n,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r.indexOf(n=o[t])>=0||(i[n]=e[n]);return i}const k={silent:!1,logLevel:"warn"},B=["validator"],S=Object.prototype,A=S.toString,D=S.hasOwnProperty,N=/^\s*function (\w+)/;function $(e){var r;const n=(r=e==null?void 0:e.type)!==null&&r!==void 0?r:e;if(n){const t=n.toString().match(N);return t?t[1]:""}return""}const y=E,F=e=>e;let c=F;const h=(e,r)=>D.call(e,r),L=Number.isInteger||function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e},b=Array.isArray||function(e){return A.call(e)==="[object Array]"},g=e=>A.call(e)==="[object Function]",m=(e,r)=>y(e)&&h(e,"_vueTypes_name")&&(!r||e._vueTypes_name===r),V=e=>y(e)&&(h(e,"type")||["_vueTypes_name","validator","default","required"].some(r=>h(e,r)));function T(e,r){return Object.defineProperty(e.bind(r),"__original",{value:e})}function v(e,r,n=!1){let t,i=!0,o="";t=y(e)?e:{type:e};const a=m(t)?t._vueTypes_name+" - ":"";if(V(t)&&t.type!==null){if(t.type===void 0||t.type===!0||!t.required&&r==null)return i;b(t.type)?(i=t.type.some(s=>v(s,r,!0)===!0),o=t.type.map(s=>$(s)).join(" or ")):(o=$(t),i=o==="Array"?b(r):o==="Object"?y(r):o==="String"||o==="Number"||o==="Boolean"||o==="Function"?function(s){if(s==null)return"";const u=s.constructor.toString().match(N);return u?u[1].replace(/^Async/,""):""}(r)===o:r instanceof t.type)}if(!i){const s=`${a}value "${r}" should be of type "${o}"`;return n===!1?(c(s),!1):s}if(h(t,"validator")&&g(t.validator)){const s=c,u=[];if(c=l=>{u.push(l)},i=t.validator(r),c=s,!i){const l=(u.length>1?"* ":"")+u.join(`
* `);return u.length=0,n===!1?(c(l),i):l}}return i}function d(e,r){const n=Object.defineProperties(r,{_vueTypes_name:{value:e,writable:!0},isRequired:{get(){return this.required=!0,this}},def:{value(i){return i===void 0?this.type===Boolean||Array.isArray(this.type)&&this.type.includes(Boolean)?void(this.default=void 0):(h(this,"default")&&delete this.default,this):g(i)||v(this,i,!0)===!0?(this.default=b(i)?()=>[...i]:y(i)?()=>Object.assign({},i):i,this):(c(`${this._vueTypes_name} - invalid default value: "${i}"`),this)}}}),{validator:t}=n;return g(t)&&(n.validator=T(t,n)),n}function f(e,r){const n=d(e,r);return Object.defineProperty(n,"validate",{value(t){return g(this.validator)&&c(`${this._vueTypes_name} - calling .validate() will overwrite the current custom validator function. Validator info:
${JSON.stringify(this)}`),this.validator=T(t,this),this}})}function w(e,r,n){const t=function(u){const l={};return Object.getOwnPropertyNames(u).forEach(p=>{l[p]=Object.getOwnPropertyDescriptor(u,p)}),Object.defineProperties({},l)}(r);if(t._vueTypes_name=e,!y(n))return t;const{validator:i}=n,o=P(n,B);if(g(i)){let{validator:u}=t;u&&(u=(s=(a=u).__original)!==null&&s!==void 0?s:a),t.validator=T(u?function(l){return u.call(this,l)&&i.call(this,l)}:i,t)}var a,s;return Object.assign(t,o)}function j(e){return e.replace(/^(?!\s*$)/gm,"  ")}const Y=()=>f("any",{}),C=()=>f("function",{type:Function}),x=()=>f("boolean",{type:Boolean}),I=()=>f("string",{type:String}),J=()=>f("number",{type:Number}),M=()=>f("array",{type:Array}),R=()=>f("object",{type:Object}),U=()=>d("integer",{type:Number,validator(e){const r=L(e);return r===!1&&c(`integer - "${e}" is not an integer`),r}}),z=()=>d("symbol",{validator(e){const r=typeof e=="symbol";return r===!1&&c(`symbol - invalid value "${e}"`),r}}),G=()=>Object.defineProperty({type:null,validator(e){const r=e===null;return r===!1&&c("nullable - value should be null"),r}},"_vueTypes_name",{value:"nullable"});function H(e,r="custom validation failed"){if(typeof e!="function")throw new TypeError("[VueTypes error]: You must provide a function as argument");return d(e.name||"<<anonymous function>>",{type:null,validator(n){const t=e(n);return t||c(`${this._vueTypes_name} - ${r}`),t}})}function K(e){if(!b(e))throw new TypeError("[VueTypes error]: You must provide an array as argument.");const r=`oneOf - value should be one of "${e.map(t=>typeof t=="symbol"?t.toString():t).join('", "')}".`,n={validator(t){const i=e.indexOf(t)!==-1;return i||c(r),i}};if(e.indexOf(null)===-1){const t=e.reduce((i,o)=>{if(o!=null){const a=o.constructor;i.indexOf(a)===-1&&i.push(a)}return i},[]);t.length>0&&(n.type=t)}return d("oneOf",n)}function Q(e){if(!b(e))throw new TypeError("[VueTypes error]: You must provide an array as argument");let r=!1,n=!1,t=[];for(let o=0;o<e.length;o+=1){const a=e[o];if(V(a)){if(g(a.validator)&&(r=!0),m(a,"oneOf")&&a.type){t=t.concat(a.type);continue}if(m(a,"nullable")){n=!0;continue}if(a.type===!0||!a.type){c('oneOfType - invalid usage of "true" and "null" as types.');continue}t=t.concat(a.type)}else t.push(a)}t=t.filter((o,a)=>t.indexOf(o)===a);const i=n===!1&&t.length>0?t:null;return d("oneOfType",r?{type:i,validator(o){const a=[],s=e.some(u=>{const l=v(u,o,!0);return typeof l=="string"&&a.push(l),l===!0});return s||c(`oneOfType - provided value does not match any of the ${a.length} passed-in validators:
${j(a.join(`
`))}`),s}}:{type:i})}function W(e){return d("arrayOf",{type:Array,validator(r){let n="";const t=r.every(i=>(n=v(e,i,!0),n===!0));return t||c(`arrayOf - value validation error:
${j(n)}`),t}})}function X(e){return d("instanceOf",{type:e})}function Z(e){return d("objectOf",{type:Object,validator(r){let n="";const t=Object.keys(r).every(i=>(n=v(e,r[i],!0),n===!0));return t||c(`objectOf - value validation error:
${j(n)}`),t}})}function ee(e){const r=Object.keys(e),n=r.filter(i=>{var o;return!((o=e[i])===null||o===void 0||!o.required)}),t=d("shape",{type:Object,validator(i){if(!y(i))return!1;const o=Object.keys(i);if(n.length>0&&n.some(a=>o.indexOf(a)===-1)){const a=n.filter(s=>o.indexOf(s)===-1);return c(a.length===1?`shape - required property "${a[0]}" is not defined.`:`shape - required properties "${a.join('", "')}" are not defined.`),!1}return o.every(a=>{if(r.indexOf(a)===-1)return this._vueTypes_isLoose===!0||(c(`shape - shape definition does not include a "${a}" property. Allowed keys: "${r.join('", "')}".`),!1);const s=v(e[a],i[a],!0);return typeof s=="string"&&c(`shape - "${a}" property validation error:
 ${j(s)}`),s===!0})}});return Object.defineProperty(t,"_vueTypes_isLoose",{writable:!0,value:!1}),Object.defineProperty(t,"loose",{get(){return this._vueTypes_isLoose=!0,this}}),t}const te=["name","validate","getter"],re=(()=>{var e;return(e=class{static get any(){return Y()}static get func(){return C().def(this.defaults.func)}static get bool(){return this.defaults.bool===void 0?x():x().def(this.defaults.bool)}static get string(){return I().def(this.defaults.string)}static get number(){return J().def(this.defaults.number)}static get array(){return M().def(this.defaults.array)}static get object(){return R().def(this.defaults.object)}static get integer(){return U().def(this.defaults.integer)}static get symbol(){return z()}static get nullable(){return G()}static extend(r){if(c("VueTypes.extend is deprecated. Use the ES6+ method instead. See https://dwightjack.github.io/vue-types/advanced/extending-vue-types.html#extending-namespaced-validators-in-es6 for details."),b(r))return r.forEach(u=>this.extend(u)),this;const{name:n,validate:t=!1,getter:i=!1}=r,o=P(r,te);if(h(this,n))throw new TypeError(`[VueTypes error]: Type "${n}" already defined`);const{type:a}=o;if(m(a))return delete o.type,Object.defineProperty(this,n,i?{get:()=>w(n,a,o)}:{value(...u){const l=w(n,a,o);return l.validator&&(l.validator=l.validator.bind(l,...u)),l}});let s;return s=i?{get(){const u=Object.assign({},o);return t?f(n,u):d(n,u)},enumerable:!0}:{value(...u){const l=Object.assign({},o);let p;return p=t?f(n,l):d(n,l),l.validator&&(p.validator=l.validator.bind(p,...u)),p},enumerable:!0},Object.defineProperty(this,n,s)}}).defaults={},e.sensibleDefaults=void 0,e.config=k,e.custom=H,e.oneOf=K,e.instanceOf=X,e.oneOfType=Q,e.arrayOf=W,e.objectOf=Z,e.shape=ee,e.utils={validate:(r,n)=>v(n,r,!0)===!0,toType:(r,n,t=!1)=>t?f(r,n):d(r,n)},e})();function q(e={func:()=>{},bool:!0,string:"",number:0,array:()=>[],object:()=>({}),integer:0}){var r;return(r=class extends re{static get sensibleDefaults(){return O({},this.defaults)}static set sensibleDefaults(n){this.defaults=n!==!1?O({},n!==!0?n:e):{}}}).defaults=O({},e),r}class ie extends q(){}const ne=q({func:void 0,bool:void 0,string:void 0,number:void 0,object:void 0,integer:void 0});class oe extends ne{static get style(){return f("style",{type:[String,Object]})}static get VNodeChild(){return f("VNodeChild",{type:void 0})}}export{oe as p};