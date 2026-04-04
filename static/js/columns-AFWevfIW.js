import{A as e,B as t,C as n,Jt as r,Kt as i,S as a,St as o,Wt as s,Y as c,Z as l,_ as u,a as d,b as f,ct as p,d as m,dt as h,h as g,k as _,p as v,q as y,qt as b,tt as x,w as S,x as C,z as w}from"./vue.runtime.esm-bundler-7ocrn71d.js";import{n as T,t as E}from"./objectSpread2-Ct4-21PI.js";import{t as D}from"./asyncToGenerator-DL1V6A25.js";import{s as O}from"./dist-Cnc1TxCH.js";import{D as k}from"./index-r1RzYCK_.js";import{n as A}from"./data-DVDkOd1J.js";var j=function(e){let t=Array.isArray(e)?[]:{};if(e&&typeof e==`object`)for(let n in e)e.hasOwnProperty(n)&&(e[n]&&typeof e[n]==`object`?t[n]=j(e[n]):t[n]=e[n]);return t},M=e({name:`MouseMenu`,props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:`font-icon`},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:[`open`,`close`],expose:[`show`,`close`,`showMenu`],setup(e,{emit:n}){let r=o(0),i=o(0),a=o(!1),s=o(0),c=o(0),l=o(!1),u=o(null),d=o([]),m=f(()=>e.menuList.some(e=>e.children&&e.children.length>0)),h=o(10),g=o();p(l,function(){var r=D(function*(r){if(r){var i;yield t();let r=g.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(t=>{r.style.setProperty(`--menu-${t}`,e.menuWrapperCss&&e.menuWrapperCss[t])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(t=>{r.style.setProperty(`--menu-item-${t}`,e.menuItemCss&&e.menuItemCss[t])});let a=(i=e.menuItemCss)==null||(i=i.arrowSize)==null?void 0:i.match(/\d+/);a?h.value=~~a[0]||10:h.value=10,r.style.setProperty(`--menu-item-arrowRealSize`,h.value/2+`px`),n(`open`,e.params,u.value,e.el)}else n(`close`,e.params,u.value,e.el)});return function(e){return r.apply(this,arguments)}}());let _=(t,n)=>{t.disabled||t.fn&&typeof t.fn==`function`&&t.fn(e.params,u.value,e.el,n)===!1||(l.value=!1)},v=(t,n)=>{if(!t.disabled){if(t.fn&&typeof t.fn==`function`&&!t.disabled){if(t.fn(e.params,u.value,e.el,n)===!1)return;a.value=!1}l.value=!1}},b=function(){var e=D(function*(e,n){if(n.children&&!n.disabled){a.value=!0,yield t();let n=e.currentTarget;if(!n)return;let{offsetWidth:o}=n,s=n.querySelector(`.__menu__sub__wrapper`);if(!s)return;let{offsetWidth:c,offsetHeight:l}=s,{innerWidth:u,innerHeight:d}=window,{top:f,left:p}=n.getBoundingClientRect();p+o+c>u-5?r.value=p-c+5:r.value=p+o,f+l>d-5?i.value=d-l:i.value=f+5}});return function(t,n){return e.apply(this,arguments)}}(),x=(e,t,n,r)=>e.map(e=>(e.children&&(e.children=x(e.children,t,n,r)),e.label&&typeof e.label==`function`&&(e.label=e.label(r,t,n)),e.tips&&typeof e.tips==`function`&&(e.tips=e.tips(r,t,n)),e.icon&&typeof e.icon==`function`&&(e.icon=e.icon(r,t,n)),e.hidden&&typeof e.hidden==`function`&&(e.hidden=e.hidden(r,t,n)),e.disabled&&typeof e.disabled==`function`&&(e.disabled=e.disabled(r,t,n)),e)),S=function(){var n=D(function*(n=0,r=0){if(u.value=document.elementFromPoint(n-1,r-1),e.menuHiddenFn?l.value=!e.menuHiddenFn(e.params,u.value,e.el):l.value=!0,!l.value)return;d.value=j(e.menuList),d.value=x(d.value,u.value,e.el,e.params),yield t();let{innerWidth:i,innerHeight:a}=window,o=g.value.offsetHeight,f=e.menuWidth||200;c.value=n+f+1>i?i-f-5:n+1,s.value=r+o+1>a?a-o-5:r+1});return function(){return n.apply(this,arguments)}}(),C=()=>{l.value=!1},w=f(()=>e.useLongPressInMobile&&`ontouchstart`in window?`touchstart`:`mousedown`),T=e=>{g.value&&!g.value.contains(e.currentTarget)&&(l.value=!1,document.oncontextmenu=null)};return p(()=>e.injectCloseListener,e=>{e?document.addEventListener(w.value,T):document.removeEventListener(w.value,T)},{immediate:!0}),y(()=>{document.removeEventListener(w.value,T)}),{subLeft:r,subTop:i,hoverFlag:a,menuTop:s,menuLeft:c,showMenu:l,clickDomEl:u,calcMenuList:d,arrowSize:h,hasSubMenu:m,MenuWrapper:g,handleMenuItemClick:_,handleSubMenuItemClick:v,handleMenuMouseEnter:b,show:S,close:C,clickEventKey:w}}}),N=[`onMouseenter`],P={key:0,class:`__menu__item-icon`},F=[`innerHTML`],I={class:`__menu__item-label`},L={class:`__menu__item-tips`},R={class:`__menu__item-arrow-after`},z={key:0,class:`__menu__item-icon`},B=[`innerHTML`],V={class:`__menu__sub__item-label`},H={class:`__menu__sub__item-tips`};function U(e,t,o,d,f,p){return c(),a(u,{to:`body`,disabled:!e.appendToBody},[e.showMenu?(c(),S(`div`,{key:0,ref:`MenuWrapper`,class:s([`__menu__wrapper`,e.customClass]),style:i({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(c(!0),S(g,null,l(e.calcMenuList,(t,o)=>(c(),S(g,null,[!t.hidden&&!t.line?(c(),S(`div`,w({key:o,class:[`__menu__item`,t.disabled&&`disabled`,t.customClass]},{[r(e.clickEventKey)]:v(n=>e.handleMenuItemClick(t,n),[`stop`])},{onMouseenter:n=>e.handleMenuMouseEnter(n,t)}),[e.hasIcon?(c(),S(`div`,P,[e.iconType===`font-icon`?h((c(),S(`i`,{key:0,class:s(t.icon)},null,2)),[[m,t.icon]]):e.iconType===`svg-icon`?h((c(),S(`div`,{key:1,class:`__menu__item-icon-svg`,innerHTML:t.icon},null,8,F)),[[m,t.icon]]):e.iconType===`vnode-icon`?(c(),a(x(t.icon),{key:2})):n(`v-if`,!0)])):n(`v-if`,!0),C(`span`,I,b(t.label),1),C(`span`,L,b(t.tips||``),1),e.hasSubMenu?(c(),S(`span`,{key:1,class:s([`__menu__item-arrow`,{show:e.hasSubMenu&&t.children}]),style:i({width:e.arrowSize+`px`,height:e.arrowSize+`px`})},[h(C(`span`,R,null,512),[[m,e.hasSubMenu&&t.children]])],6)):n(`v-if`,!0),t.children&&t.children.length>0&&!t.disabled?h((c(),S(`div`,{key:2,class:`__menu__sub__wrapper`,style:i({width:`${e.menuWidth}px`,top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(c(!0),S(g,null,l(t.children,(t,i)=>(c(),S(g,null,[!t.hidden&&!t.line?(c(),S(`div`,w({key:i,class:[`__menu__sub__item`,t.disabled&&`disabled`,t.customClass]},{[r(e.clickEventKey)]:v(n=>e.handleSubMenuItemClick(t,n),[`stop`])}),[e.hasIcon?(c(),S(`div`,z,[e.iconType===`font-icon`?h((c(),S(`i`,{key:0,class:s(t.icon)},null,2)),[[m,t.icon]]):e.iconType===`svg-icon`?h((c(),S(`div`,{key:1,class:`__menu__item-icon-svg`,innerHTML:t.icon},null,8,B)),[[m,t.icon]]):e.iconType===`vnode-icon`?(c(),a(x(t.icon),{key:2})):n(`v-if`,!0)])):n(`v-if`,!0),C(`span`,V,b(t.label),1),C(`span`,H,b(t.tips||``),1)],16)):n(`v-if`,!0),t.line?(c(),S(`div`,{key:i,class:`__menu__line`})):n(`v-if`,!0)],64))),256))],4)),[[m,e.hoverFlag]]):n(`v-if`,!0)],16,N)):n(`v-if`,!0),!t.hidden&&t.line?(c(),S(`div`,{key:o,class:`__menu__line`})):n(`v-if`,!0)],64))),256))],6)):n(`v-if`,!0)],8,[`disabled`])}function W(e,t){t===void 0&&(t={});var n=t.insertAt;if(!(!e||typeof document>`u`)){var r=document.head||document.getElementsByTagName(`head`)[0],i=document.createElement(`style`);i.type=`text/css`,n===`top`&&r.firstChild?r.insertBefore(i,r.firstChild):r.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}W(`.__menu__mask[data-v-3d21bc0a] {
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
}`),M.render=U,M.__scopeId=`data-v-3d21bc0a`,M.__file=`packages/mouse-menu/mouse-menu.vue`;function G(e,t,n){let r=document.createElement(e);return r.setAttribute(`class`,t),n&&(r.innerText=n),r}M.install=e=>{e.component(M.name,M)};function K(e){var t;let n=`__mouse__menu__container`,r;r=document.querySelector(`.${n}`)?document.querySelector(`.${n}`):G(`div`,n);let i=_(M,e);return d(i,r),document.body.appendChild(r),(t=i.component)==null?void 0:t.proxy}T();function q(){let e=o(O(A,!0)),t=[{label:`ID`,prop:`id`},{label:`日期`,prop:`date`},{label:`姓名`,prop:`name`}],n={menuList:[{label:({id:e})=>`ID为：${e}`,disabled:!0},{label:`修改`,tips:`Edit`,fn:t=>k(`您修改了第 ${e.value.findIndex(e=>e.id===t.id)+1} 行，数据为：${JSON.stringify(t)}`,{type:`success`})}]};function r(e,t,r){r.preventDefault();let{x:i,y:a}=r;K(E({el:r.currentTarget,params:e,menuWrapperCss:{background:`var(--el-bg-color)`},menuItemCss:{labelColor:`var(--el-text-color)`,hoverLabelColor:`var(--el-color-primary)`,hoverTipsColor:`var(--el-color-primary)`}},n)).show(i,a)}return{columns:t,dataList:e,showMouseMenu:r}}export{q as t};