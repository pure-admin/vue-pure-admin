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
***************************************************************************** */var a=function(n,t){return a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(o,r){o.__proto__=r}||function(o,r){for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(o[i]=r[i])},a(n,t)};function u(n,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");a(n,t);function o(){this.constructor=n}n.prototype=t===null?Object.create(t):(o.prototype=t.prototype,new o)}var f=function(){function n(t){this.colorStops=t||[]}return n.prototype.addColorStop=function(t,o){this.colorStops.push({offset:t,color:o})},n}();const p=f;var _=function(n){u(t,n);function t(o,r,i,c,l,s){var e=n.call(this,l)||this;return e.x=o??0,e.y=r??0,e.x2=i??1,e.y2=c??0,e.type="linear",e.global=s||!1,e}return t}(p);const y=_;export{p as G,y as L,u as _};
