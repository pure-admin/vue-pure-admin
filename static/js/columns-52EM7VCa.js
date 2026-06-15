import{r as e}from"./rolldown-runtime-DMcso9tT.js";import{t}from"./asyncToGenerator-D9SLB-m1.js";import{A as n,B as r,C as i,Jt as a,Kt as o,S as s,St as c,Wt as l,Y as u,Z as d,_ as f,a as p,b as m,ct as h,d as g,dt as _,h as v,k as y,p as b,q as x,qt as S,tt as C,w,x as T,z as E}from"./vue.runtime.esm-bundler-DIu5y9Tj.js";import{D,aa as O,dt as k,oa as A}from"./index-DaYJcm4a.js";import{n as j}from"./data-DEhvIHVF.js";var M=function(e){let t=Array.isArray(e)?[]:{};if(e&&typeof e==`object`)for(let n in e)e.hasOwnProperty(n)&&(e[n]&&typeof e[n]==`object`?t[n]=M(e[n]):t[n]=e[n]);return t},N=n({name:`MouseMenu`,props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:`font-icon`},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:[`open`,`close`],expose:[`show`,`close`,`showMenu`],setup(e,{emit:n}){let i=c(0),a=c(0),o=c(!1),s=c(0),l=c(0),u=c(!1),d=c(null),f=c([]),p=m(()=>e.menuList.some(e=>e.children&&e.children.length>0)),g=c(10),_=c();h(u,function(){var i=t(function*(t){if(t){var i;yield r();let t=_.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(n=>{t.style.setProperty(`--menu-${n}`,e.menuWrapperCss&&e.menuWrapperCss[n])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(n=>{t.style.setProperty(`--menu-item-${n}`,e.menuItemCss&&e.menuItemCss[n])});let a=(i=e.menuItemCss)==null||(i=i.arrowSize)==null?void 0:i.match(/\d+/);a?g.value=~~a[0]||10:g.value=10,t.style.setProperty(`--menu-item-arrowRealSize`,g.value/2+`px`),n(`open`,e.params,d.value,e.el)}else n(`close`,e.params,d.value,e.el)});return function(e){return i.apply(this,arguments)}}());let v=(t,n)=>{t.disabled||t.fn&&typeof t.fn==`function`&&t.fn(e.params,d.value,e.el,n)===!1||(u.value=!1)},y=(t,n)=>{if(!t.disabled){if(t.fn&&typeof t.fn==`function`&&!t.disabled){if(t.fn(e.params,d.value,e.el,n)===!1)return;o.value=!1}u.value=!1}},b=function(){var e=t(function*(e,t){if(t.children&&!t.disabled){o.value=!0,yield r();let t=e.currentTarget;if(!t)return;let{offsetWidth:n}=t,s=t.querySelector(`.__menu__sub__wrapper`);if(!s)return;let{offsetWidth:c,offsetHeight:l}=s,{innerWidth:u,innerHeight:d}=window,{top:f,left:p}=t.getBoundingClientRect();p+n+c>u-5?i.value=p-c+5:i.value=p+n,f+l>d-5?a.value=d-l:a.value=f+5}});return function(t,n){return e.apply(this,arguments)}}(),S=(e,t,n,r)=>e.map(e=>(e.children&&(e.children=S(e.children,t,n,r)),e.label&&typeof e.label==`function`&&(e.label=e.label(r,t,n)),e.tips&&typeof e.tips==`function`&&(e.tips=e.tips(r,t,n)),e.icon&&typeof e.icon==`function`&&(e.icon=e.icon(r,t,n)),e.hidden&&typeof e.hidden==`function`&&(e.hidden=e.hidden(r,t,n)),e.disabled&&typeof e.disabled==`function`&&(e.disabled=e.disabled(r,t,n)),e)),C=function(){var n=t(function*(t=0,n=0){if(d.value=document.elementFromPoint(t-1,n-1),e.menuHiddenFn?u.value=!e.menuHiddenFn(e.params,d.value,e.el):u.value=!0,!u.value)return;f.value=M(e.menuList),f.value=S(f.value,d.value,e.el,e.params),yield r();let{innerWidth:i,innerHeight:a}=window,o=_.value.offsetHeight,c=e.menuWidth||200;l.value=t+c+1>i?i-c-5:t+1,s.value=n+o+1>a?a-o-5:n+1});return function(){return n.apply(this,arguments)}}(),w=()=>{u.value=!1},T=m(()=>e.useLongPressInMobile&&`ontouchstart`in window?`touchstart`:`mousedown`),E=e=>{_.value&&!_.value.contains(e.currentTarget)&&(u.value=!1,document.oncontextmenu=null)};return h(()=>e.injectCloseListener,e=>{e?document.addEventListener(T.value,E):document.removeEventListener(T.value,E)},{immediate:!0}),x(()=>{document.removeEventListener(T.value,E)}),{subLeft:i,subTop:a,hoverFlag:o,menuTop:s,menuLeft:l,showMenu:u,clickDomEl:d,calcMenuList:f,arrowSize:g,hasSubMenu:p,MenuWrapper:_,handleMenuItemClick:v,handleSubMenuItemClick:y,handleMenuMouseEnter:b,show:C,close:w,clickEventKey:T}}}),P=[`onMouseenter`],F={key:0,class:`__menu__item-icon`},I=[`innerHTML`],L={class:`__menu__item-label`},R={class:`__menu__item-tips`},z={class:`__menu__item-arrow-after`},B={key:0,class:`__menu__item-icon`},V=[`innerHTML`],H={class:`__menu__sub__item-label`},U={class:`__menu__sub__item-tips`};function W(e,t,n,r,c,p){return u(),s(f,{to:`body`,disabled:!e.appendToBody},[e.showMenu?(u(),w(`div`,{key:0,ref:`MenuWrapper`,class:l([`__menu__wrapper`,e.customClass]),style:o({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(u(!0),w(v,null,d(e.calcMenuList,(t,n)=>(u(),w(v,null,[!t.hidden&&!t.line?(u(),w(`div`,E({key:n,class:[`__menu__item`,t.disabled&&`disabled`,t.customClass]},{[a(e.clickEventKey)]:b(n=>e.handleMenuItemClick(t,n),[`stop`])},{onMouseenter:n=>e.handleMenuMouseEnter(n,t)}),[e.hasIcon?(u(),w(`div`,F,[e.iconType===`font-icon`?_((u(),w(`i`,{key:0,class:l(t.icon)},null,2)),[[g,t.icon]]):e.iconType===`svg-icon`?_((u(),w(`div`,{key:1,class:`__menu__item-icon-svg`,innerHTML:t.icon},null,8,I)),[[g,t.icon]]):e.iconType===`vnode-icon`?(u(),s(C(t.icon),{key:2})):i(`v-if`,!0)])):i(`v-if`,!0),T(`span`,L,S(t.label),1),T(`span`,R,S(t.tips||``),1),e.hasSubMenu?(u(),w(`span`,{key:1,class:l([`__menu__item-arrow`,{show:e.hasSubMenu&&t.children}]),style:o({width:e.arrowSize+`px`,height:e.arrowSize+`px`})},[_(T(`span`,z,null,512),[[g,e.hasSubMenu&&t.children]])],6)):i(`v-if`,!0),t.children&&t.children.length>0&&!t.disabled?_((u(),w(`div`,{key:2,class:`__menu__sub__wrapper`,style:o({width:`${e.menuWidth}px`,top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(u(!0),w(v,null,d(t.children,(t,n)=>(u(),w(v,null,[!t.hidden&&!t.line?(u(),w(`div`,E({key:n,class:[`__menu__sub__item`,t.disabled&&`disabled`,t.customClass]},{[a(e.clickEventKey)]:b(n=>e.handleSubMenuItemClick(t,n),[`stop`])}),[e.hasIcon?(u(),w(`div`,B,[e.iconType===`font-icon`?_((u(),w(`i`,{key:0,class:l(t.icon)},null,2)),[[g,t.icon]]):e.iconType===`svg-icon`?_((u(),w(`div`,{key:1,class:`__menu__item-icon-svg`,innerHTML:t.icon},null,8,V)),[[g,t.icon]]):e.iconType===`vnode-icon`?(u(),s(C(t.icon),{key:2})):i(`v-if`,!0)])):i(`v-if`,!0),T(`span`,H,S(t.label),1),T(`span`,U,S(t.tips||``),1)],16)):i(`v-if`,!0),t.line?(u(),w(`div`,{key:n,class:`__menu__line`})):i(`v-if`,!0)],64))),256))],4)),[[g,e.hoverFlag]]):i(`v-if`,!0)],16,P)):i(`v-if`,!0),!t.hidden&&t.line?(u(),w(`div`,{key:n,class:`__menu__line`})):i(`v-if`,!0)],64))),256))],6)):i(`v-if`,!0)],8,[`disabled`])}function G(e,t){t===void 0&&(t={});var n=t.insertAt;if(!(!e||typeof document>`u`)){var r=document.head||document.getElementsByTagName(`head`)[0],i=document.createElement(`style`);i.type=`text/css`,n===`top`&&r.firstChild?r.insertBefore(i,r.firstChild):r.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}G(`.__menu__mask[data-v-3d21bc0a] {
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
}`),N.render=W,N.__scopeId=`data-v-3d21bc0a`,N.__file=`packages/mouse-menu/mouse-menu.vue`;function K(e,t,n){let r=document.createElement(e);return r.setAttribute(`class`,t),n&&(r.innerText=n),r}N.install=e=>{e.component(N.name,N)};function q(e){var t;let n=`__mouse__menu__container`,r;r=document.querySelector(`.${n}`)?document.querySelector(`.${n}`):K(`div`,n);let i=y(N,e);return p(i,r),document.body.appendChild(r),(t=i.component)==null?void 0:t.proxy}var J=e({useColumns:()=>Y});A();function Y(){let e=c(k(j,!0)),t=[{label:`ID`,prop:`id`},{label:`日期`,prop:`date`},{label:`姓名`,prop:`name`}],n={menuList:[{label:({id:e})=>`ID为：${e}`,disabled:!0},{label:`修改`,tips:`Edit`,fn:t=>D(`您修改了第 ${e.value.findIndex(e=>e.id===t.id)+1} 行，数据为：${JSON.stringify(t)}`,{type:`success`})}]};function r(e,t,r){r.preventDefault();let{x:i,y:a}=r;q(O({el:r.currentTarget,params:e,menuWrapperCss:{background:`var(--el-bg-color)`},menuItemCss:{labelColor:`var(--el-text-color)`,hoverLabelColor:`var(--el-color-primary)`,hoverTipsColor:`var(--el-color-primary)`}},n)).show(i,a)}return{columns:t,dataList:e,showMouseMenu:r}}export{Y as n,J as t};