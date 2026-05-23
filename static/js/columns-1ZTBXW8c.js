import{Ar as e,Cr as t,D as n,Er as r,Jr as i,Mr as a,Nr as o,Oi as s,Or as c,Rr as l,Tr as u,ai as d,as as f,br as p,es as m,fs as h,hi as g,is as _,jr as v,kr as y,li as b,ns as x,os as S,pt as C,qr as w,ri as T,rs as E,ss as D,ti as O,vi as k,zr as A}from"./index-DYLbQH3m.js";import{n as j}from"./data-CJME33Y5.js";var M=function(e){let t=Array.isArray(e)?[]:{};if(e&&typeof e==`object`)for(let n in e)e.hasOwnProperty(n)&&(e[n]&&typeof e[n]==`object`?t[n]=M(e[n]):t[n]=e[n]);return t},N=A({name:`MouseMenu`,props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:`font-icon`},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:[`open`,`close`],expose:[`show`,`close`,`showMenu`],setup(e,{emit:t}){let n=s(0),r=s(0),a=s(!1),o=s(0),c=s(0),l=s(!1),u=s(null),d=s([]),p=y(()=>e.menuList.some(e=>e.children&&e.children.length>0)),m=s(10),h=s();g(l,function(){var n=f(function*(n){if(n){var r;yield i();let n=h.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(t=>{n.style.setProperty(`--menu-${t}`,e.menuWrapperCss&&e.menuWrapperCss[t])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(t=>{n.style.setProperty(`--menu-item-${t}`,e.menuItemCss&&e.menuItemCss[t])});let a=(r=e.menuItemCss)==null||(r=r.arrowSize)==null?void 0:r.match(/\d+/);a?m.value=~~a[0]||10:m.value=10,n.style.setProperty(`--menu-item-arrowRealSize`,m.value/2+`px`),t(`open`,e.params,u.value,e.el)}else t(`close`,e.params,u.value,e.el)});return function(e){return n.apply(this,arguments)}}());let _=(t,n)=>{t.disabled||t.fn&&typeof t.fn==`function`&&t.fn(e.params,u.value,e.el,n)===!1||(l.value=!1)},v=(t,n)=>{if(!t.disabled){if(t.fn&&typeof t.fn==`function`&&!t.disabled){if(t.fn(e.params,u.value,e.el,n)===!1)return;a.value=!1}l.value=!1}},b=function(){var e=f(function*(e,t){if(t.children&&!t.disabled){a.value=!0,yield i();let t=e.currentTarget;if(!t)return;let{offsetWidth:o}=t,s=t.querySelector(`.__menu__sub__wrapper`);if(!s)return;let{offsetWidth:c,offsetHeight:l}=s,{innerWidth:u,innerHeight:d}=window,{top:f,left:p}=t.getBoundingClientRect();p+o+c>u-5?n.value=p-c+5:n.value=p+o,f+l>d-5?r.value=d-l:r.value=f+5}});return function(t,n){return e.apply(this,arguments)}}(),x=(e,t,n,r)=>e.map(e=>(e.children&&(e.children=x(e.children,t,n,r)),e.label&&typeof e.label==`function`&&(e.label=e.label(r,t,n)),e.tips&&typeof e.tips==`function`&&(e.tips=e.tips(r,t,n)),e.icon&&typeof e.icon==`function`&&(e.icon=e.icon(r,t,n)),e.hidden&&typeof e.hidden==`function`&&(e.hidden=e.hidden(r,t,n)),e.disabled&&typeof e.disabled==`function`&&(e.disabled=e.disabled(r,t,n)),e)),S=function(){var t=f(function*(t=0,n=0){if(u.value=document.elementFromPoint(t-1,n-1),e.menuHiddenFn?l.value=!e.menuHiddenFn(e.params,u.value,e.el):l.value=!0,!l.value)return;d.value=M(e.menuList),d.value=x(d.value,u.value,e.el,e.params),yield i();let{innerWidth:r,innerHeight:a}=window,s=h.value.offsetHeight,f=e.menuWidth||200;c.value=t+f+1>r?r-f-5:t+1,o.value=n+s+1>a?a-s-5:n+1});return function(){return t.apply(this,arguments)}}(),C=()=>{l.value=!1},w=y(()=>e.useLongPressInMobile&&`ontouchstart`in window?`touchstart`:`mousedown`),T=e=>{h.value&&!h.value.contains(e.currentTarget)&&(l.value=!1,document.oncontextmenu=null)};return g(()=>e.injectCloseListener,e=>{e?document.addEventListener(w.value,T):document.removeEventListener(w.value,T)},{immediate:!0}),O(()=>{document.removeEventListener(w.value,T)}),{subLeft:n,subTop:r,hoverFlag:a,menuTop:o,menuLeft:c,showMenu:l,clickDomEl:u,calcMenuList:d,arrowSize:m,hasSubMenu:p,MenuWrapper:h,handleMenuItemClick:_,handleSubMenuItemClick:v,handleMenuMouseEnter:b,show:S,close:C,clickEventKey:w}}}),P=[`onMouseenter`],F={key:0,class:`__menu__item-icon`},I=[`innerHTML`],L={class:`__menu__item-label`},R={class:`__menu__item-tips`},z={class:`__menu__item-arrow-after`},B={key:0,class:`__menu__item-icon`},V=[`innerHTML`],H={class:`__menu__sub__item-label`},U={class:`__menu__sub__item-tips`};function W(n,i,s,l,f,p){return T(),v(c,{to:`body`,disabled:!n.appendToBody},[n.showMenu?(T(),o(`div`,{key:0,ref:`MenuWrapper`,class:m([`__menu__wrapper`,n.customClass]),style:x({width:`${n.menuWidth}px`,top:`${n.menuTop}px`,left:`${n.menuLeft}px`})},[(T(!0),o(r,null,d(n.calcMenuList,(i,s)=>(T(),o(r,null,[!i.hidden&&!i.line?(T(),o(`div`,w({key:s,class:[`__menu__item`,i.disabled&&`disabled`,i.customClass]},{[_(n.clickEventKey)]:u(e=>n.handleMenuItemClick(i,e),[`stop`])},{onMouseenter:e=>n.handleMenuMouseEnter(e,i)}),[n.hasIcon?(T(),o(`div`,F,[n.iconType===`font-icon`?k((T(),o(`i`,{key:0,class:m(i.icon)},null,2)),[[t,i.icon]]):n.iconType===`svg-icon`?k((T(),o(`div`,{key:1,class:`__menu__item-icon-svg`,innerHTML:i.icon},null,8,I)),[[t,i.icon]]):n.iconType===`vnode-icon`?(T(),v(b(i.icon),{key:2})):a(`v-if`,!0)])):a(`v-if`,!0),e(`span`,L,E(i.label),1),e(`span`,R,E(i.tips||``),1),n.hasSubMenu?(T(),o(`span`,{key:1,class:m([`__menu__item-arrow`,{show:n.hasSubMenu&&i.children}]),style:x({width:n.arrowSize+`px`,height:n.arrowSize+`px`})},[k(e(`span`,z,null,512),[[t,n.hasSubMenu&&i.children]])],6)):a(`v-if`,!0),i.children&&i.children.length>0&&!i.disabled?k((T(),o(`div`,{key:2,class:`__menu__sub__wrapper`,style:x({width:`${n.menuWidth}px`,top:`${n.subTop}px`,left:`${n.subLeft}px`})},[(T(!0),o(r,null,d(i.children,(i,s)=>(T(),o(r,null,[!i.hidden&&!i.line?(T(),o(`div`,w({key:s,class:[`__menu__sub__item`,i.disabled&&`disabled`,i.customClass]},{[_(n.clickEventKey)]:u(e=>n.handleSubMenuItemClick(i,e),[`stop`])}),[n.hasIcon?(T(),o(`div`,B,[n.iconType===`font-icon`?k((T(),o(`i`,{key:0,class:m(i.icon)},null,2)),[[t,i.icon]]):n.iconType===`svg-icon`?k((T(),o(`div`,{key:1,class:`__menu__item-icon-svg`,innerHTML:i.icon},null,8,V)),[[t,i.icon]]):n.iconType===`vnode-icon`?(T(),v(b(i.icon),{key:2})):a(`v-if`,!0)])):a(`v-if`,!0),e(`span`,H,E(i.label),1),e(`span`,U,E(i.tips||``),1)],16)):a(`v-if`,!0),i.line?(T(),o(`div`,{key:s,class:`__menu__line`})):a(`v-if`,!0)],64))),256))],4)),[[t,n.hoverFlag]]):a(`v-if`,!0)],16,P)):a(`v-if`,!0),!i.hidden&&i.line?(T(),o(`div`,{key:s,class:`__menu__line`})):a(`v-if`,!0)],64))),256))],6)):a(`v-if`,!0)],8,[`disabled`])}function G(e,t){t===void 0&&(t={});var n=t.insertAt;if(!(!e||typeof document>`u`)){var r=document.head||document.getElementsByTagName(`head`)[0],i=document.createElement(`style`);i.type=`text/css`,n===`top`&&r.firstChild?r.insertBefore(i,r.firstChild):r.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}G(`.__menu__mask[data-v-3d21bc0a] {
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
}`),N.render=W,N.__scopeId=`data-v-3d21bc0a`,N.__file=`packages/mouse-menu/mouse-menu.vue`;function K(e,t,n){let r=document.createElement(e);return r.setAttribute(`class`,t),n&&(r.innerText=n),r}N.install=e=>{e.component(N.name,N)};function q(e){var t;let n=`__mouse__menu__container`,r;r=document.querySelector(`.${n}`)?document.querySelector(`.${n}`):K(`div`,n);let i=l(N,e);return p(i,r),document.body.appendChild(r),(t=i.component)==null?void 0:t.proxy}var J=h({useColumns:()=>Y});D();function Y(){let e=s(C(j,!0)),t=[{label:`ID`,prop:`id`},{label:`日期`,prop:`date`},{label:`姓名`,prop:`name`}],r={menuList:[{label:({id:e})=>`ID为：${e}`,disabled:!0},{label:`修改`,tips:`Edit`,fn:t=>n(`您修改了第 ${e.value.findIndex(e=>e.id===t.id)+1} 行，数据为：${JSON.stringify(t)}`,{type:`success`})}]};function i(e,t,n){n.preventDefault();let{x:i,y:a}=n;q(S({el:n.currentTarget,params:e,menuWrapperCss:{background:`var(--el-bg-color)`},menuItemCss:{labelColor:`var(--el-text-color)`,hoverLabelColor:`var(--el-color-primary)`,hoverTipsColor:`var(--el-color-primary)`}},r)).show(i,a)}return{columns:t,dataList:e,showMouseMenu:i}}export{Y as n,J as t};