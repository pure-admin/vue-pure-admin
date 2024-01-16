var te=Object.defineProperty;var N=Object.getOwnPropertySymbols;var ae=Object.prototype.hasOwnProperty,ie=Object.prototype.propertyIsEnumerable;var A=(e,t,n)=>t in e?te(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,R=(e,t)=>{for(var n in t||(t={}))ae.call(t,n)&&A(e,n,t[n]);if(N)for(var n of N(t))ie.call(t,n)&&A(e,n,t[n]);return e};import{a as _e}from"./data-FSCBAEm_.js";import{d as oe,r as y,J as P,X as j,ad as ue,p as re,m as se,g as c,c as D,n as v,F as L,z as q,a4 as x,dw as K,am as V,l as T,v as F,S as de,k as w,h as M,t as W,ai as O,b3 as le,y as J,j as me,dx as ce,O as ve,s as be}from"./index-OPODCVBK.js";/*! *****************************************************************************
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
***************************************************************************** */function U(e,t,n,o){function u(b){return b instanceof n?b:new n(function(a){a(b)})}return new(n||(n=Promise))(function(b,a){function l(h){try{p(o.next(h))}catch(g){a(g)}}function r(h){try{p(o.throw(h))}catch(g){a(g)}}function p(h){h.done?b(h.value):u(h.value).then(l,r)}p((o=o.apply(e,t||[])).next())})}function pe(e,t,n){let o=document.createElement(e);return o.setAttribute("class",t),n&&(o.innerText=n),o}const X=function(e){let t=Array.isArray(e)?[]:{};if(e&&typeof e=="object")for(let n in e)e.hasOwnProperty(n)&&(e[n]&&typeof e[n]=="object"?t[n]=X(e[n]):t[n]=e[n]);return t};var C=oe({name:"MouseMenu",props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:"font-icon"},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:["open","close"],setup(e,{emit:t}){const n=y(0),o=y(0),u=y(!1),b=y(0),a=y(0),l=y(!1),r=y(null),p=y([]),h=P(()=>e.menuList.some(_=>_.children&&_.children.length>0)),g=y(10),S=y();j(l,_=>U(this,void 0,void 0,function*(){var s,d;if(_){yield J();let m=S.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(f=>{m.style.setProperty(`--menu-${f}`,e.menuWrapperCss&&e.menuWrapperCss[f])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(f=>{m.style.setProperty(`--menu-item-${f}`,e.menuItemCss&&e.menuItemCss[f])});let i=(d=(s=e.menuItemCss)===null||s===void 0?void 0:s.arrowSize)===null||d===void 0?void 0:d.match(/\d+/);i?g.value=~~i[0]||10:g.value=10,m.style.setProperty("--menu-item-arrowRealSize",g.value/2+"px"),t("open")}else t("close")}));const G=(_,s)=>{_.disabled||(_.fn&&typeof _.fn=="function"&&_.fn(e.params,r.value,e.el,s),l.value=!1)},Q=(_,s)=>{_.disabled||(_.fn&&typeof _.fn=="function"&&!_.disabled&&(_.fn(e.params,r.value,e.el,s),u.value=!1),l.value=!1)},Y=(_,s)=>{if(s.children&&!s.disabled){u.value=!0;const d=_.currentTarget;if(!d)return;const{offsetWidth:m}=d,i=d.querySelector(".__menu__sub__wrapper");if(!i)return;const{offsetWidth:f,offsetHeight:k}=i,{innerWidth:ne,innerHeight:I}=window,{top:E,left:$}=d.getBoundingClientRect();$+m+f>ne-5?n.value=$-f+5:n.value=$+m,E+k>I-5?o.value=I-k:o.value=E+5}},H=(_,s,d,m)=>_.map(i=>(i.children&&(i.children=H(i.children,s,d,m)),i.label&&typeof i.label=="function"&&(i.label=i.label(m,s,d)),i.tips&&typeof i.tips=="function"&&(i.tips=i.tips(m,s,d)),i.icon&&typeof i.icon=="function"&&(i.icon=i.icon(m,s,d)),i.hidden&&typeof i.hidden=="function"&&(i.hidden=i.hidden(m,s,d)),i.disabled&&typeof i.disabled=="function"&&(i.disabled=i.disabled(m,s,d)),i)),Z=(_=0,s=0)=>U(this,void 0,void 0,function*(){if(r.value=document.elementFromPoint(_-1,s-1),e.menuHiddenFn?l.value=!e.menuHiddenFn(e.params,r.value,e.el):l.value=!0,!l.value)return;p.value=X(e.menuList),p.value=H(p.value,r.value,e.el,e.params),yield J();const{innerWidth:d,innerHeight:m}=window,f=S.value.offsetHeight,k=e.menuWidth||200;a.value=_+k+1>d?d-k-5:_+1,b.value=s+f+1>m?m-f-5:s+1}),ee=()=>{l.value=!1},z=P(()=>e.useLongPressInMobile&&"ontouchstart"in window?"touchstart":"mousedown"),B=_=>{S.value&&!S.value.contains(_.currentTarget)&&(l.value=!1,document.oncontextmenu=null)};return j(()=>e.injectCloseListener,_=>{_?document.addEventListener(z.value,B):document.removeEventListener(z.value,B)},{immediate:!0}),ue(()=>{document.removeEventListener(z.value,B)}),{subLeft:n,subTop:o,hoverFlag:u,menuTop:b,menuLeft:a,showMenu:l,clickDomEl:r,calcMenuList:p,arrowSize:g,hasSubMenu:h,MenuWrapper:S,handleMenuItemClick:G,handleSubMenuItemClick:Q,handleMenuMouseEnter:Y,show:Z,close:ee,clickEventKey:z}}});re("data-v-3d21bc0a");const he=["onMouseenter"],fe={key:0,class:"__menu__item-icon"},ye=["innerHTML"],we={class:"__menu__item-label"},ge={class:"__menu__item-tips"},Ce={class:"__menu__item-arrow-after"},Se={class:"__menu__sub__item-label"},ke={class:"__menu__sub__item-tips"};se();function xe(e,t,n,o,u,b){return c(),D(le,{to:"body",disabled:!e.appendToBody},[e.showMenu?(c(),v("div",{key:0,ref:"MenuWrapper",class:x(["__menu__wrapper",e.customClass]),style:O({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(c(!0),v(L,null,q(e.calcMenuList,(a,l)=>(c(),v(L,null,[!a.hidden&&!a.line?(c(),v("div",{key:l,class:x(["__menu__item",a.disabled&&"disabled",a.customClass]),[K(e.clickEventKey)]:V(r=>e.handleMenuItemClick(a,r),["stop"]),onMouseenter:r=>e.handleMenuMouseEnter(r,a)},[e.hasIcon?(c(),v("div",fe,[e.iconType==="font-icon"?T((c(),v("i",{key:0,class:x(a.icon)},null,2)),[[F,a.icon]]):e.iconType==="svg-icon"?T((c(),v("div",{key:1,class:"__menu__item-icon-svg",innerHTML:a.icon},null,8,ye)),[[F,a.icon]]):e.iconType==="vnode-icon"?(c(),D(de(a.icon),{key:2})):w("v-if",!0)])):w("v-if",!0),M("span",we,W(a.label),1),M("span",ge,W(a.tips||""),1),e.hasSubMenu?(c(),v("span",{key:1,class:x(["__menu__item-arrow",{show:e.hasSubMenu&&a.children}]),style:O({width:e.arrowSize+"px",height:e.arrowSize+"px"})},[T(M("span",Ce,null,512),[[F,e.hasSubMenu&&a.children]])],6)):w("v-if",!0),a.children&&a.children.length>0?T((c(),v("div",{key:2,class:"__menu__sub__wrapper",style:O({top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(c(!0),v(L,null,q(a.children,(r,p)=>(c(),v(L,null,[!r.hidden&&!r.line?(c(),v("div",{key:p,class:x(["__menu__sub__item",r.disabled&&"disabled",r.customClass]),[K(e.clickEventKey)]:V(h=>e.handleSubMenuItemClick(r,h),["stop"])},[M("span",Se,W(r.label),1),M("span",ke,W(r.tips||""),1)],16)):w("v-if",!0),r.line?(c(),v("div",{key:p,class:"__menu__line"})):w("v-if",!0)],64))),256))],4)),[[F,e.hoverFlag]]):w("v-if",!0)],16,he)):w("v-if",!0),!a.hidden&&a.line?(c(),v("div",{key:l,class:"__menu__line"})):w("v-if",!0)],64))),256))],6)):w("v-if",!0)],8,["disabled"])}function Me(e,t){t===void 0&&(t={});var n=t.insertAt;if(!(!e||typeof document=="undefined")){var o=document.head||document.getElementsByTagName("head")[0],u=document.createElement("style");u.type="text/css",n==="top"&&o.firstChild?o.insertBefore(u,o.firstChild):o.appendChild(u),u.styleSheet?u.styleSheet.cssText=e:u.appendChild(document.createTextNode(e))}}var ze=`.__menu__mask[data-v-3d21bc0a] {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}
.__menu__wrapper[data-v-3d21bc0a] {
  --menu-background: #c8f2f0;
  --menu-boxShadow: 0 1px 5px #888;
  --menu-padding: 5px 0;
  --menu-borderRadius: 0;
  --menu-item-height: 30px;
  --menu-item-padding: 0 10px;
  --menu-item-iconSize: 20px;
  --menu-item-iconFontSize: 14px;
  --menu-item-iconColor: #484852;
  --menu-item-labelColor: #484852;
  --menu-item-labelFontSize: 14px;
  --menu-item-tipsColor: #889;
  --menu-item-tipsFontSize: 12px;
  --menu-item-arrowColor: #484852;
  --menu-item-disabledColor: #bcc;
  --menu-item-hoverBackground: rgba(255, 255, 255, 0.8);
  --menu-item-hoverIconColor: inherit;
  --menu-item-hoverLabelColor: inherit;
  --menu-item-hoverTipsColor: inherit;
  --menu-item-hoverArrowColor: inherit;
  --menu-lineColor: #ccc;
  --menu-lineMargin: 5px 0;
}
.__menu__wrapper[data-v-3d21bc0a] {
  position: fixed;
  width: 200px;
  background: var(--menu-background);
  box-shadow: var(--menu-boxShadow);
  padding: var(--menu-padding);
  border-radius: var(--menu-borderRadius);
  z-index: 99999;
}
.__menu__line[data-v-3d21bc0a],
.__menu__sub__line[data-v-3d21bc0a] {
  border-top: 1px solid var(--menu-lineColor);
  margin: var(--menu-lineMargin);
}
.__menu__item[data-v-3d21bc0a],
.__menu__sub__item[data-v-3d21bc0a] {
  display: flex;
  height: var(--menu-item-height);
  align-items: center;
  cursor: pointer;
  padding: var(--menu-item-padding);
}
.__menu__item .__menu__item-icon[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-icon[data-v-3d21bc0a] {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--menu-item-iconColor);
  width: var(--menu-item-iconSize);
  height: var(--menu-item-iconSize);
}
.__menu__item .__menu__item-icon i[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-icon i[data-v-3d21bc0a] {
  font-size: var(--menu-item-iconFontSize);
}
.__menu__item .__menu__item-icon .__menu__item-icon-svg[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-icon .__menu__item-icon-svg[data-v-3d21bc0a] {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.__menu__item .__menu__item-label[data-v-3d21bc0a],
.__menu__item .__menu__sub__item-label[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-label[data-v-3d21bc0a],
.__menu__sub__item .__menu__sub__item-label[data-v-3d21bc0a] {
  width: 100%;
  max-height: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-size: var(--menu-item-labelFontSize);
  color: var(--menu-item-labelColor);
  margin-right: 5px;
  overflow: hidden;
}
.__menu__item .__menu__item-tips[data-v-3d21bc0a],
.__menu__item .__menu__sub__item-tips[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-tips[data-v-3d21bc0a],
.__menu__sub__item .__menu__sub__item-tips[data-v-3d21bc0a] {
  font-size: var(--menu-item-tipsFontSize);
  color: var(--menu-item-tipsColor);
}
.__menu__item .__menu__item-arrow[data-v-3d21bc0a],
.__menu__sub__item .__menu__item-arrow[data-v-3d21bc0a] {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  position: relative;
}
.__menu__item.disabled[data-v-3d21bc0a],
.__menu__sub__item.disabled[data-v-3d21bc0a] {
  cursor: not-allowed;
}
.__menu__item.disabled .__menu__item-icon[data-v-3d21bc0a],
.__menu__item.disabled .__menu__item-label[data-v-3d21bc0a],
.__menu__item.disabled .__menu__sub__item-label[data-v-3d21bc0a],
.__menu__item.disabled .__menu__item-tips[data-v-3d21bc0a],
.__menu__item.disabled .__menu__sub__item-tips[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-icon[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-label[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__sub__item-label[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-tips[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__sub__item-tips[data-v-3d21bc0a] {
  color: var(--menu-item-disabledColor);
}
.__menu__item.disabled .__menu__item-arrow .__menu__item-arrow-after[data-v-3d21bc0a],
.__menu__sub__item.disabled .__menu__item-arrow .__menu__item-arrow-after[data-v-3d21bc0a] {
  border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-disabledColor);
}
.__menu__item[data-v-3d21bc0a]:not(.disabled):hover {
  background: var(--menu-item-hoverBackground);
}
.__menu__item:not(.disabled):hover .__menu__item-icon[data-v-3d21bc0a] {
  color: var(--menu-item-hoverIconColor);
}
.__menu__item:not(.disabled):hover .__menu__item-label[data-v-3d21bc0a] {
  color: var(--menu-item-hoverLabelColor);
}
.__menu__item:not(.disabled):hover .__menu__item-tips[data-v-3d21bc0a] {
  color: var(--menu-item-hoverTipsColor);
}
.__menu__item:not(.disabled):hover .__menu__item-arrow[data-v-3d21bc0a] {
  color: var(--menu-item-hoverArrowColor);
}
.__menu__sub__item[data-v-3d21bc0a]:not(.disabled):hover {
  background: var(--menu-item-hoverBackground);
}
.__menu__sub__item:not(.disabled):hover .__menu__sub__item-label[data-v-3d21bc0a] {
  color: var(--menu-item-hoverLabelColor);
}
.__menu__sub__item:not(.disabled):hover .__menu__sub__item-tips[data-v-3d21bc0a] {
  color: var(--menu-item-hoverTipsColor);
}
.__menu__item-icon[data-v-3d21bc0a] {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  margin-right: 4px;
}
.__menu__item-arrow.show .__menu__item-arrow-after[data-v-3d21bc0a] {
  position: absolute;
  width: 0;
  height: 0;
  left: 8px;
  border-left: var(--menu-item-arrowRealSize) solid var(--menu-item-arrowColor);
  border-top: var(--menu-item-arrowRealSize) solid transparent;
  border-bottom: var(--menu-item-arrowRealSize) solid transparent;
}
.__menu__sub__wrapper[data-v-3d21bc0a] {
  position: fixed;
  visibility: hidden;
  width: 200px;
  background: var(--menu-background);
  box-shadow: var(--menu-boxShadow);
  padding: var(--menu-padding);
  border-radius: var(--menu-borderRadius);
}
.__menu__item:hover .__menu__sub__wrapper[data-v-3d21bc0a] {
  visibility: visible;
}`;Me(ze);C.render=xe;C.__scopeId="data-v-3d21bc0a";C.__file="packages/mouse-menu/mouse-menu.vue";C.install=e=>{e.component(C.name,C)};function Le(e){var t;const n="__mouse__menu__container";let o;document.querySelector(`.${n}`)?o=document.querySelector(`.${n}`):o=pe("div",n);const u=me(C,e);return ce(u,o),document.body.appendChild(o),(t=u.component)===null||t===void 0?void 0:t.proxy}function Be(){const e=y(ve(_e,!0)),t=[{label:"ID",prop:"id"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"}],n={menuList:[{label:({id:u})=>`ID为：${u}`,disabled:!0},{label:"编辑",tips:"Edit",fn:u=>be(`您编辑了第 ${e.value.findIndex(b=>b.id===u.id)+1} 行，数据为：${JSON.stringify(u)}`,{type:"success"})}]};function o(u,b,a){a.preventDefault();const{x:l,y:r}=a;Le(R({el:a.currentTarget,params:u,menuWrapperCss:{background:"var(--el-bg-color)"},menuItemCss:{labelColor:"var(--el-text-color)",hoverLabelColor:"var(--el-color-primary)",hoverTipsColor:"var(--el-color-primary)"}},n)).show(l,r)}return{columns:t,dataList:e,showMouseMenu:o}}export{Be as useColumns};
