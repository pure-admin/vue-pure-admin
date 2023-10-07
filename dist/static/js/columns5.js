import{a as Z}from"./data2.js";import{d as ee,r as y,E as A,G as N,af as ne,p as te,m as ae,g as c,f as R,n as v,F as L,y as P,at as x,dz as j,an as D,l as T,v as F,V as ie,k as w,h as M,t as W,I as H,b3 as _e,x as q,j as oe,dA as ue,K as re,q as se}from"./index.js";/*! *****************************************************************************
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
***************************************************************************** */function K(e,r,a,_){function o(b){return b instanceof a?b:new a(function(n){n(b)})}return new(a||(a=Promise))(function(b,n){function l(h){try{p(_.next(h))}catch(g){n(g)}}function u(h){try{p(_.throw(h))}catch(g){n(g)}}function p(h){h.done?b(h.value):o(h.value).then(l,u)}p((_=_.apply(e,r||[])).next())})}function de(e,r,a){let _=document.createElement(e);return _.setAttribute("class",r),a&&(_.innerText=a),_}const V=function(e){let r=Array.isArray(e)?[]:{};if(e&&typeof e=="object")for(let a in e)e.hasOwnProperty(a)&&(e[a]&&typeof e[a]=="object"?r[a]=V(e[a]):r[a]=e[a]);return r};var C=ee({name:"MouseMenu",props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:"font-icon"},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:["open","close"],setup(e,{emit:r}){const a=y(0),_=y(0),o=y(!1),b=y(0),n=y(0),l=y(!1),u=y(null),p=y([]),h=A(()=>e.menuList.some(i=>i.children&&i.children.length>0)),g=y(10),S=y();N(l,i=>K(this,void 0,void 0,function*(){var s,d;if(i){yield q();let m=S.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(f=>{m.style.setProperty(`--menu-${f}`,e.menuWrapperCss&&e.menuWrapperCss[f])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(f=>{m.style.setProperty(`--menu-item-${f}`,e.menuItemCss&&e.menuItemCss[f])});let t=(d=(s=e.menuItemCss)===null||s===void 0?void 0:s.arrowSize)===null||d===void 0?void 0:d.match(/\d+/);t?g.value=~~t[0]||10:g.value=10,m.style.setProperty("--menu-item-arrowRealSize",g.value/2+"px"),r("open")}else r("close")}));const G=(i,s)=>{i.disabled||(i.fn&&typeof i.fn=="function"&&i.fn(e.params,u.value,e.el,s),l.value=!1)},J=(i,s)=>{i.disabled||(i.fn&&typeof i.fn=="function"&&!i.disabled&&(i.fn(e.params,u.value,e.el,s),o.value=!1),l.value=!1)},U=(i,s)=>{if(s.children&&!s.disabled){o.value=!0;const d=i.currentTarget;if(!d)return;const{offsetWidth:m}=d,t=d.querySelector(".__menu__sub__wrapper");if(!t)return;const{offsetWidth:f,offsetHeight:k}=t,{innerWidth:Y,innerHeight:O}=window,{top:E,left:$}=d.getBoundingClientRect();$+m+f>Y-5?a.value=$-f+5:a.value=$+m,E+k>O-5?_.value=O-k:_.value=E+5}},I=(i,s,d,m)=>i.map(t=>(t.children&&(t.children=I(t.children,s,d,m)),t.label&&typeof t.label=="function"&&(t.label=t.label(m,s,d)),t.tips&&typeof t.tips=="function"&&(t.tips=t.tips(m,s,d)),t.icon&&typeof t.icon=="function"&&(t.icon=t.icon(m,s,d)),t.hidden&&typeof t.hidden=="function"&&(t.hidden=t.hidden(m,s,d)),t.disabled&&typeof t.disabled=="function"&&(t.disabled=t.disabled(m,s,d)),t)),Q=(i=0,s=0)=>K(this,void 0,void 0,function*(){if(u.value=document.elementFromPoint(i-1,s-1),e.menuHiddenFn?l.value=!e.menuHiddenFn(e.params,u.value,e.el):l.value=!0,!l.value)return;p.value=V(e.menuList),p.value=I(p.value,u.value,e.el,e.params),yield q();const{innerWidth:d,innerHeight:m}=window,f=S.value.offsetHeight,k=e.menuWidth||200;n.value=i+k+1>d?d-k-5:i+1,b.value=s+f+1>m?m-f-5:s+1}),X=()=>{l.value=!1},z=A(()=>e.useLongPressInMobile&&"ontouchstart"in window?"touchstart":"mousedown"),B=i=>{S.value&&!S.value.contains(i.currentTarget)&&(l.value=!1,document.oncontextmenu=null)};return N(()=>e.injectCloseListener,i=>{i?document.addEventListener(z.value,B):document.removeEventListener(z.value,B)},{immediate:!0}),ne(()=>{document.removeEventListener(z.value,B)}),{subLeft:a,subTop:_,hoverFlag:o,menuTop:b,menuLeft:n,showMenu:l,clickDomEl:u,calcMenuList:p,arrowSize:g,hasSubMenu:h,MenuWrapper:S,handleMenuItemClick:G,handleSubMenuItemClick:J,handleMenuMouseEnter:U,show:Q,close:X,clickEventKey:z}}});te("data-v-3d21bc0a");const le=["onMouseenter"],me={key:0,class:"__menu__item-icon"},ce=["innerHTML"],ve={class:"__menu__item-label"},be={class:"__menu__item-tips"},pe={class:"__menu__item-arrow-after"},he={class:"__menu__sub__item-label"},fe={class:"__menu__sub__item-tips"};ae();function ye(e,r,a,_,o,b){return c(),R(_e,{to:"body",disabled:!e.appendToBody},[e.showMenu?(c(),v("div",{key:0,ref:"MenuWrapper",class:x(["__menu__wrapper",e.customClass]),style:H({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(c(!0),v(L,null,P(e.calcMenuList,(n,l)=>(c(),v(L,null,[!n.hidden&&!n.line?(c(),v("div",{key:l,class:x(["__menu__item",n.disabled&&"disabled",n.customClass]),[j(e.clickEventKey)]:D(u=>e.handleMenuItemClick(n,u),["stop"]),onMouseenter:u=>e.handleMenuMouseEnter(u,n)},[e.hasIcon?(c(),v("div",me,[e.iconType==="font-icon"?T((c(),v("i",{key:0,class:x(n.icon)},null,2)),[[F,n.icon]]):e.iconType==="svg-icon"?T((c(),v("div",{key:1,class:"__menu__item-icon-svg",innerHTML:n.icon},null,8,ce)),[[F,n.icon]]):e.iconType==="vnode-icon"?(c(),R(ie(n.icon),{key:2})):w("v-if",!0)])):w("v-if",!0),M("span",ve,W(n.label),1),M("span",be,W(n.tips||""),1),e.hasSubMenu?(c(),v("span",{key:1,class:x(["__menu__item-arrow",{show:e.hasSubMenu&&n.children}]),style:H({width:e.arrowSize+"px",height:e.arrowSize+"px"})},[T(M("span",pe,null,512),[[F,e.hasSubMenu&&n.children]])],6)):w("v-if",!0),n.children&&n.children.length>0?T((c(),v("div",{key:2,class:"__menu__sub__wrapper",style:H({top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(c(!0),v(L,null,P(n.children,(u,p)=>(c(),v(L,null,[!u.hidden&&!u.line?(c(),v("div",{key:p,class:x(["__menu__sub__item",u.disabled&&"disabled",u.customClass]),[j(e.clickEventKey)]:D(h=>e.handleSubMenuItemClick(u,h),["stop"])},[M("span",he,W(u.label),1),M("span",fe,W(u.tips||""),1)],16)):w("v-if",!0),u.line?(c(),v("div",{key:p,class:"__menu__line"})):w("v-if",!0)],64))),256))],4)),[[F,e.hoverFlag]]):w("v-if",!0)],16,le)):w("v-if",!0),!n.hidden&&n.line?(c(),v("div",{key:l,class:"__menu__line"})):w("v-if",!0)],64))),256))],6)):w("v-if",!0)],8,["disabled"])}function we(e,r){r===void 0&&(r={});var a=r.insertAt;if(!(!e||typeof document>"u")){var _=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css",a==="top"&&_.firstChild?_.insertBefore(o,_.firstChild):_.appendChild(o),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e))}}var ge=`.__menu__mask[data-v-3d21bc0a] {
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
}`;we(ge);C.render=ye;C.__scopeId="data-v-3d21bc0a";C.__file="packages/mouse-menu/mouse-menu.vue";C.install=e=>{e.component(C.name,C)};function Ce(e){var r;const a="__mouse__menu__container";let _;document.querySelector(`.${a}`)?_=document.querySelector(`.${a}`):_=de("div",a);const o=oe(C,e);return ue(o,_),document.body.appendChild(_),(r=o.component)===null||r===void 0?void 0:r.proxy}function xe(){const e=y(re(Z,!0)),r=[{label:"ID",prop:"id"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"}],a={menuList:[{label:({id:o})=>`ID为：${o}`,disabled:!0},{label:"编辑",tips:"Edit",fn:o=>se(`您编辑了第 ${e.value.findIndex(b=>b.id===o.id)+1} 行，数据为：${JSON.stringify(o)}`,{type:"success"})}]};function _(o,b,n){n.preventDefault();const{x:l,y:u}=n;Ce({el:n.currentTarget,params:o,menuWrapperCss:{background:"var(--el-bg-color)"},menuItemCss:{labelColor:"var(--el-text-color)",hoverLabelColor:"var(--el-color-primary)",hoverTipsColor:"var(--el-color-primary)"},...a}).show(l,u)}return{columns:r,dataList:e,showMouseMenu:_}}export{xe as useColumns};
