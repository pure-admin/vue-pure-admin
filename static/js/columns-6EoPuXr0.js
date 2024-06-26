var ae=Object.defineProperty;var N=Object.getOwnPropertySymbols;var ie=Object.prototype.hasOwnProperty,_e=Object.prototype.propertyIsEnumerable;var A=(e,t,n)=>t in e?ae(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,R=(e,t)=>{for(var n in t||(t={}))ie.call(t,n)&&A(e,n,t[n]);if(N)for(var n of N(t))_e.call(t,n)&&A(e,n,t[n]);return e};var $=(e,t,n)=>new Promise((r,u)=>{var y=a=>{try{d(n.next(a))}catch(v){u(v)}},_=a=>{try{d(n.throw(a))}catch(v){u(v)}},d=a=>a.done?r(a.value):Promise.resolve(a.value).then(y,_);d((n=n.apply(e,t)).next())});import{a as oe}from"./data-Buzjdn8h.js";import{d as ue,a as p,p as j,n as D,y as q,o as re,f as c,b as K,k as b,F as M,l as V,a5 as J,fP as Q,q as U,B as z,a2 as L,v as H,W as se,j as f,g as S,t as T,s as O,T as de,i as le,fQ as me,a8 as ce,L as be}from"./index-CocNYPzQ.js";const G=function(e){let t=Array.isArray(e)?[]:{};if(e&&typeof e=="object")for(let n in e)e.hasOwnProperty(n)&&(e[n]&&typeof e[n]=="object"?t[n]=G(e[n]):t[n]=e[n]);return t};var g=ue({name:"MouseMenu",props:{appendToBody:{type:Boolean,default:!0},menuWidth:{type:Number,default:200},menuList:{type:Array,required:!0},menuHiddenFn:{type:Function},hasIcon:{type:Boolean,default:!1},iconType:{type:String,default:"font-icon"},menuWrapperCss:Object,menuItemCss:Object,el:{type:Object,required:!0},params:{type:[String,Number,Array,Object]},useLongPressInMobile:Boolean,longPressDuration:Number,longPressPreventDefault:[Function,Boolean],injectCloseListener:{type:Boolean,default:!0},customClass:String,disabled:{type:Function}},emits:["open","close"],setup(e,{emit:t}){const n=p(0),r=p(0),u=p(!1),y=p(0),_=p(0),d=p(!1),a=p(null),v=p([]),W=j(()=>e.menuList.some(o=>o.children&&o.children.length>0)),k=p(10),w=p();D(d,o=>$(this,null,function*(){var s,l;if(o){yield q();let m=w.value;e.menuWrapperCss&&Object.keys(e.menuWrapperCss).map(h=>{m.style.setProperty(`--menu-${h}`,e.menuWrapperCss&&e.menuWrapperCss[h])}),e.menuItemCss&&Object.keys(e.menuItemCss).map(h=>{m.style.setProperty(`--menu-item-${h}`,e.menuItemCss&&e.menuItemCss[h])});let i=(l=(s=e.menuItemCss)==null?void 0:s.arrowSize)==null?void 0:l.match(/\d+/);i?k.value=~~i[0]||10:k.value=10,m.style.setProperty("--menu-item-arrowRealSize",k.value/2+"px"),t("open",e.params,a.value,e.el)}else t("close",e.params,a.value,e.el)}));const X=(o,s)=>{o.disabled||(o.fn&&typeof o.fn=="function"&&o.fn(e.params,a.value,e.el,s),d.value=!1)},Y=(o,s)=>{o.disabled||(o.fn&&typeof o.fn=="function"&&!o.disabled&&(o.fn(e.params,a.value,e.el,s),u.value=!1),d.value=!1)},Z=(o,s)=>{if(s.children&&!s.disabled){u.value=!0;const l=o.currentTarget;if(!l)return;const{offsetWidth:m}=l,i=l.querySelector(".__menu__sub__wrapper");if(!i)return;const{offsetWidth:h,offsetHeight:C}=i,{innerWidth:te,innerHeight:E}=window,{top:I,left:B}=l.getBoundingClientRect();B+m+h>te-5?n.value=B-h+5:n.value=B+m,I+C>E-5?r.value=E-C:r.value=I+5}},P=(o,s,l,m)=>o.map(i=>(i.children&&(i.children=P(i.children,s,l,m)),i.label&&typeof i.label=="function"&&(i.label=i.label(m,s,l)),i.tips&&typeof i.tips=="function"&&(i.tips=i.tips(m,s,l)),i.icon&&typeof i.icon=="function"&&(i.icon=i.icon(m,s,l)),i.hidden&&typeof i.hidden=="function"&&(i.hidden=i.hidden(m,s,l)),i.disabled&&typeof i.disabled=="function"&&(i.disabled=i.disabled(m,s,l)),i)),ee=(o=0,s=0)=>$(this,null,function*(){if(a.value=document.elementFromPoint(o-1,s-1),e.menuHiddenFn?d.value=!e.menuHiddenFn(e.params,a.value,e.el):d.value=!0,!d.value)return;v.value=G(e.menuList),v.value=P(v.value,a.value,e.el,e.params),yield q();const{innerWidth:l,innerHeight:m}=window,h=w.value.offsetHeight,C=e.menuWidth||200;_.value=o+C+1>l?l-C-5:o+1,y.value=s+h+1>m?m-h-5:s+1}),ne=()=>{d.value=!1},x=j(()=>e.useLongPressInMobile&&"ontouchstart"in window?"touchstart":"mousedown"),F=o=>{w.value&&!w.value.contains(o.currentTarget)&&(d.value=!1,document.oncontextmenu=null)};return D(()=>e.injectCloseListener,o=>{o?document.addEventListener(x.value,F):document.removeEventListener(x.value,F)},{immediate:!0}),re(()=>{document.removeEventListener(x.value,F)}),{subLeft:n,subTop:r,hoverFlag:u,menuTop:y,menuLeft:_,showMenu:d,clickDomEl:a,calcMenuList:v,arrowSize:k,hasSubMenu:W,MenuWrapper:w,handleMenuItemClick:X,handleSubMenuItemClick:Y,handleMenuMouseEnter:Z,show:ee,close:ne,clickEventKey:x}}});const ve=["onMouseenter"],he={key:0,class:"__menu__item-icon"},pe=["innerHTML"],fe={class:"__menu__item-label"},ye={class:"__menu__item-tips"},ge={class:"__menu__item-arrow-after"},we={class:"__menu__sub__item-label"},Ce={class:"__menu__sub__item-tips"};function Se(e,t,n,r,u,y){return c(),K(de,{to:"body",disabled:!e.appendToBody},[e.showMenu?(c(),b("div",{key:0,ref:"MenuWrapper",class:H(["__menu__wrapper",e.customClass]),style:O({width:`${e.menuWidth}px`,top:`${e.menuTop}px`,left:`${e.menuLeft}px`})},[(c(!0),b(M,null,V(e.calcMenuList,(_,d)=>(c(),b(M,null,[!_.hidden&&!_.line?(c(),b("div",J({key:d,class:["__menu__item",_.disabled&&"disabled",_.customClass]},{[Q(e.clickEventKey)]:U(a=>e.handleMenuItemClick(_,a),["stop"])},{onMouseenter:a=>e.handleMenuMouseEnter(a,_)}),[e.hasIcon?(c(),b("div",he,[e.iconType==="font-icon"?z((c(),b("i",{key:0,class:H(_.icon)},null,2)),[[L,_.icon]]):e.iconType==="svg-icon"?z((c(),b("div",{key:1,class:"__menu__item-icon-svg",innerHTML:_.icon},null,8,pe)),[[L,_.icon]]):e.iconType==="vnode-icon"?(c(),K(se(_.icon),{key:2})):f("v-if",!0)])):f("v-if",!0),S("span",fe,T(_.label),1),S("span",ye,T(_.tips||""),1),e.hasSubMenu?(c(),b("span",{key:1,class:H(["__menu__item-arrow",{show:e.hasSubMenu&&_.children}]),style:O({width:e.arrowSize+"px",height:e.arrowSize+"px"})},[z(S("span",ge,null,512),[[L,e.hasSubMenu&&_.children]])],6)):f("v-if",!0),_.children&&_.children.length>0?z((c(),b("div",{key:2,class:"__menu__sub__wrapper",style:O({top:`${e.subTop}px`,left:`${e.subLeft}px`})},[(c(!0),b(M,null,V(_.children,(a,v)=>(c(),b(M,null,[!a.hidden&&!a.line?(c(),b("div",J({key:v,class:["__menu__sub__item",a.disabled&&"disabled",a.customClass]},{[Q(e.clickEventKey)]:U(W=>e.handleSubMenuItemClick(a,W),["stop"])}),[S("span",we,T(a.label),1),S("span",Ce,T(a.tips||""),1)],16)):f("v-if",!0),a.line?(c(),b("div",{key:v,class:"__menu__line"})):f("v-if",!0)],64))),256))],4)),[[L,e.hoverFlag]]):f("v-if",!0)],16,ve)):f("v-if",!0),!_.hidden&&_.line?(c(),b("div",{key:d,class:"__menu__line"})):f("v-if",!0)],64))),256))],6)):f("v-if",!0)],8,["disabled"])}function ke(e,t){t===void 0&&(t={});var n=t.insertAt;if(typeof document!="undefined"){var r=document.head||document.getElementsByTagName("head")[0],u=document.createElement("style");u.type="text/css",n==="top"&&r.firstChild?r.insertBefore(u,r.firstChild):r.appendChild(u),u.styleSheet?u.styleSheet.cssText=e:u.appendChild(document.createTextNode(e))}}var xe=`.__menu__mask[data-v-3d21bc0a] {
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
}`;ke(xe);g.render=Se;g.__scopeId="data-v-3d21bc0a";g.__file="packages/mouse-menu/mouse-menu.vue";function Me(e,t,n){let r=document.createElement(e);return r.setAttribute("class",t),r}g.install=e=>{e.component(g.name,g)};function ze(e){var u;const t="__mouse__menu__container";let n;document.querySelector(`.${t}`)?n=document.querySelector(`.${t}`):n=Me("div",t);const r=le(g,e);return me(r,n),document.body.appendChild(n),(u=r.component)==null?void 0:u.proxy}function Fe(){const e=p(ce(oe,!0)),t=[{label:"ID",prop:"id"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"}],n={menuList:[{label:({id:u})=>`ID为：${u}`,disabled:!0},{label:"修改",tips:"Edit",fn:u=>be(`您修改了第 ${e.value.findIndex(y=>y.id===u.id)+1} 行，数据为：${JSON.stringify(u)}`,{type:"success"})}]};function r(u,y,_){_.preventDefault();const{x:d,y:a}=_;ze(R({el:_.currentTarget,params:u,menuWrapperCss:{background:"var(--el-bg-color)"},menuItemCss:{labelColor:"var(--el-text-color)",hoverLabelColor:"var(--el-color-primary)",hoverTipsColor:"var(--el-color-primary)"}},n)).show(d,a)}return{columns:t,dataList:e,showMouseMenu:r}}export{Fe as useColumns};
