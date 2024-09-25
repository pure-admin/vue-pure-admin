var ie=Object.defineProperty;var j=Object.getOwnPropertySymbols;var _e=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var D=(e,a,n)=>a in e?ie(e,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[a]=n,q=(e,a)=>{for(var n in a||(a={}))_e.call(a,n)&&D(e,n,a[n]);if(j)for(var n of j(a))oe.call(a,n)&&D(e,n,a[n]);return e};var z=(e,a,n)=>new Promise((s,u)=>{var y=t=>{try{m(n.next(t))}catch(b){u(b)}},_=t=>{try{m(n.throw(t))}catch(b){u(b)}},m=t=>t.done?s(t.value):Promise.resolve(t.value).then(y,_);m((n=n.apply(e,a)).next())});import{a as ue}from"./data-EFikKXxQ.js";import{d as se,a as f,p as I,n as K,y as O,o as re,f as l,b as P,k as c,F as L,l as V,a3 as J,g2 as U,q as G,B as w,a0 as C,v as W,U as Q,j as p,g as M,t as F,s as E,T as le,i as de,g3 as me,a6 as ce,J as ve}from"./index-B0Z6rV6K.js";const X=function(e){let a=Array.isArray(e)?[]:{};if(e&&typeof e=="object")for(let n in e)e.hasOwnProperty(n)&&(e[n]&&typeof e[n]=="object"?a[n]=X(e[n]):a[n]=e[n]);return a};var g=se({name:"MouseMenu",props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:"font-icon"},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:["open","close"],expose:["show","close","showMenu"],setup(e,{emit:a}){const n=f(0),s=f(0),u=f(!1),y=f(0),_=f(0),m=f(!1),t=f(null),b=f([]),B=I(()=>e.menuList.some(o=>o.children&&o.children.length>0)),T=f(10),k=f();K(m,o=>z(this,null,function*(){var r,d;if(o){yield O();let v=k.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(h=>{v.style.setProperty(`--menu-${h}`,e.menuWrapperCss&&e.menuWrapperCss[h])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(h=>{v.style.setProperty(`--menu-item-${h}`,e.menuItemCss&&e.menuItemCss[h])});let i=(d=(r=e.menuItemCss)==null?void 0:r.arrowSize)==null?void 0:d.match(/\d+/);i?T.value=~~i[0]||10:T.value=10,v.style.setProperty("--menu-item-arrowRealSize",T.value/2+"px"),a("open",e.params,t.value,e.el)}else a("close",e.params,t.value,e.el)}));const Y=(o,r)=>{o.disabled||o.fn&&typeof o.fn=="function"&&o.fn(e.params,t.value,e.el,r)===!1||(m.value=!1)},Z=(o,r)=>{if(!o.disabled){if(o.fn&&typeof o.fn=="function"&&!o.disabled){if(o.fn(e.params,t.value,e.el,r)===!1)return;u.value=!1}m.value=!1}},ee=(o,r)=>z(this,null,function*(){if(r.children&&!r.disabled){u.value=!0,yield O();const d=o.currentTarget;if(!d)return;const{offsetWidth:v}=d,i=d.querySelector(".__menu__sub__wrapper");if(!i)return;const{offsetWidth:h,offsetHeight:S}=i,{innerWidth:ae,innerHeight:A}=window,{top:R,left:H}=d.getBoundingClientRect();H+v+h>ae-5?n.value=H-h+5:n.value=H+v,R+S>A-5?s.value=A-S:s.value=R+5}}),N=(o,r,d,v)=>o.map(i=>(i.children&&(i.children=N(i.children,r,d,v)),i.label&&typeof i.label=="function"&&(i.label=i.label(v,r,d)),i.tips&&typeof i.tips=="function"&&(i.tips=i.tips(v,r,d)),i.icon&&typeof i.icon=="function"&&(i.icon=i.icon(v,r,d)),i.hidden&&typeof i.hidden=="function"&&(i.hidden=i.hidden(v,r,d)),i.disabled&&typeof i.disabled=="function"&&(i.disabled=i.disabled(v,r,d)),i)),ne=(o=0,r=0)=>z(this,null,function*(){if(t.value=document.elementFromPoint(o-1,r-1),e.menuHiddenFn?m.value=!e.menuHiddenFn(e.params,t.value,e.el):m.value=!0,!m.value)return;b.value=X(e.menuList),b.value=N(b.value,t.value,e.el,e.params),yield O();const{innerWidth:d,innerHeight:v}=window,h=k.value.offsetHeight,S=e.menuWidth||200;_.value=o+S+1>d?d-S-5:o+1,y.value=r+h+1>v?v-h-5:r+1}),te=()=>{m.value=!1},x=I(()=>e.useLongPressInMobile&&"ontouchstart"in window?"touchstart":"mousedown"),$=o=>{k.value&&!k.value.contains(o.currentTarget)&&(m.value=!1,document.oncontextmenu=null)};return K(()=>e.injectCloseListener,o=>{o?document.addEventListener(x.value,$):document.removeEventListener(x.value,$)},{immediate:!0}),re(()=>{document.removeEventListener(x.value,$)}),{subLeft:n,subTop:s,hoverFlag:u,menuTop:y,menuLeft:_,showMenu:m,clickDomEl:t,calcMenuList:b,arrowSize:T,hasSubMenu:B,MenuWrapper:k,handleMenuItemClick:Y,handleSubMenuItemClick:Z,handleMenuMouseEnter:ee,show:ne,close:te,clickEventKey:x}}});const be=["onMouseenter"],he={key:0,class:"__menu__item-icon"},pe=["innerHTML"],fe={class:"__menu__item-label"},ye={class:"__menu__item-tips"},ge={class:"__menu__item-arrow-after"},we={key:0,class:"__menu__item-icon"},Ce=["innerHTML"],ke={class:"__menu__sub__item-label"},Se={class:"__menu__sub__item-tips"};function Me(e,a,n,s,u,y){return l(),P(le,{to:"body",disabled:!e.appendToBody},[e.showMenu?(l(),c("div",{key:0,ref:"MenuWrapper",class:W(["__menu__wrapper",e.customClass]),style:E({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(l(!0),c(L,null,V(e.calcMenuList,(_,m)=>(l(),c(L,null,[!_.hidden&&!_.line?(l(),c("div",J({key:m,class:["__menu__item",_.disabled&&"disabled",_.customClass]},{[U(e.clickEventKey)]:G(t=>e.handleMenuItemClick(_,t),["stop"])},{onMouseenter:t=>e.handleMenuMouseEnter(t,_)}),[e.hasIcon?(l(),c("div",he,[e.iconType==="font-icon"?w((l(),c("i",{key:0,class:W(_.icon)},null,2)),[[C,_.icon]]):e.iconType==="svg-icon"?w((l(),c("div",{key:1,class:"__menu__item-icon-svg",innerHTML:_.icon},null,8,pe)),[[C,_.icon]]):e.iconType==="vnode-icon"?(l(),P(Q(_.icon),{key:2})):p("v-if",!0)])):p("v-if",!0),M("span",fe,F(_.label),1),M("span",ye,F(_.tips||""),1),e.hasSubMenu?(l(),c("span",{key:1,class:W(["__menu__item-arrow",{show:e.hasSubMenu&&_.children}]),style:E({width:e.arrowSize+"px",height:e.arrowSize+"px"})},[w(M("span",ge,null,512),[[C,e.hasSubMenu&&_.children]])],6)):p("v-if",!0),_.children&&_.children.length>0?w((l(),c("div",{key:2,class:"__menu__sub__wrapper",style:E({width:`${e.menuWidth}px`,top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(l(!0),c(L,null,V(_.children,(t,b)=>(l(),c(L,null,[!t.hidden&&!t.line?(l(),c("div",J({key:b,class:["__menu__sub__item",t.disabled&&"disabled",t.customClass]},{[U(e.clickEventKey)]:G(B=>e.handleSubMenuItemClick(t,B),["stop"])}),[e.hasIcon?(l(),c("div",we,[e.iconType==="font-icon"?w((l(),c("i",{key:0,class:W(t.icon)},null,2)),[[C,t.icon]]):e.iconType==="svg-icon"?w((l(),c("div",{key:1,class:"__menu__item-icon-svg",innerHTML:t.icon},null,8,Ce)),[[C,t.icon]]):e.iconType==="vnode-icon"?(l(),P(Q(t.icon),{key:2})):p("v-if",!0)])):p("v-if",!0),M("span",ke,F(t.label),1),M("span",Se,F(t.tips||""),1)],16)):p("v-if",!0),t.line?(l(),c("div",{key:b,class:"__menu__line"})):p("v-if",!0)],64))),256))],4)),[[C,e.hoverFlag]]):p("v-if",!0)],16,be)):p("v-if",!0),!_.hidden&&_.line?(l(),c("div",{key:m,class:"__menu__line"})):p("v-if",!0)],64))),256))],6)):p("v-if",!0)],8,["disabled"])}function Te(e,a){a===void 0&&(a={});var n=a.insertAt;if(typeof document!="undefined"){var s=document.head||document.getElementsByTagName("head")[0],u=document.createElement("style");u.type="text/css",n==="top"&&s.firstChild?s.insertBefore(u,s.firstChild):s.appendChild(u),u.styleSheet?u.styleSheet.cssText=e:u.appendChild(document.createTextNode(e))}}var xe=`.__menu__mask[data-v-3d21bc0a] {
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
}`;Te(xe);g.render=Me;g.__scopeId="data-v-3d21bc0a";g.__file="packages/mouse-menu/mouse-menu.vue";function ze(e,a,n){let s=document.createElement(e);return s.setAttribute("class",a),s}g.install=e=>{e.component(g.name,g)};function Le(e){var u;const a="__mouse__menu__container";let n;document.querySelector(`.${a}`)?n=document.querySelector(`.${a}`):n=ze("div",a);const s=de(g,e);return me(s,n),document.body.appendChild(n),(u=s.component)==null?void 0:u.proxy}function $e(){const e=f(ce(ue,!0)),a=[{label:"ID",prop:"id"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"}],n={menuList:[{label:({id:u})=>`ID为：${u}`,disabled:!0},{label:"修改",tips:"Edit",fn:u=>ve(`您修改了第 ${e.value.findIndex(y=>y.id===u.id)+1} 行，数据为：${JSON.stringify(u)}`,{type:"success"})}]};function s(u,y,_){_.preventDefault();const{x:m,y:t}=_;Le(q({el:_.currentTarget,params:u,menuWrapperCss:{background:"var(--el-bg-color)"},menuItemCss:{labelColor:"var(--el-text-color)",hoverLabelColor:"var(--el-color-primary)",hoverTipsColor:"var(--el-color-primary)"}},n)).show(m,t)}return{columns:a,dataList:e,showMouseMenu:s}}export{$e as useColumns};
