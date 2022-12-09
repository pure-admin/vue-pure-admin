import{M as U,ag as W,ah as q,ai as J,ac as w,aj as K,ab as X,d as Y,r as x,ak as A,g as _,al as Z,a8 as S,am as ee}from"./index-00a34d45.js";import{u as te}from"./app-161c05c5.js";import{u as B}from"./epTheme-36d88d77.js";function ne(t){return function(e,u,n){var o=Object(e);if(!U(e)){var s=W(u);e=q(e),u=function(f){return s(o[f],f,o)}}var d=t(e,u,n);return d>-1?o[s?e[d]:d]:void 0}}var ue=ne(J);const oe=ue;function ae(){const{$storage:t,$config:e}=w(),u=()=>{var s,d,f,i,g,m,r,l,h,p,T,y,C;K().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=X),t.locale||(t.locale={locale:(s=e==null?void 0:e.Locale)!=null?s:"zh"},VueI18n.useI18n().locale.value=(d=e==null?void 0:e.Locale)!=null?d:"zh"),t.layout||(t.layout={layout:(f=e==null?void 0:e.Layout)!=null?f:"vertical",theme:(i=e==null?void 0:e.Theme)!=null?i:"default",darkMode:(g=e==null?void 0:e.DarkMode)!=null?g:!1,sidebarStatus:(m=e==null?void 0:e.SidebarStatus)!=null?m:!0,epThemeColor:(r=e==null?void 0:e.EpThemeColor)!=null?r:"#409EFF"}),t.configure||(t.configure={grey:(l=e==null?void 0:e.Grey)!=null?l:!1,weak:(h=e==null?void 0:e.Weak)!=null?h:!1,hideTabs:(p=e==null?void 0:e.HideTabs)!=null?p:!1,showLogo:(T=e==null?void 0:e.ShowLogo)!=null?T:!0,showModel:(y=e==null?void 0:e.ShowModel)!=null?y:"smart",multiTagsCache:(C=e==null?void 0:e.MultiTagsCache)!=null?C:!1})},n=Vue.computed(()=>t==null?void 0:t.layout.layout),o=Vue.computed(()=>t.layout);return{layout:n,layoutTheme:o,initStorage:u}}const z="\u5F53\u524D\u8DEF\u7531\u914D\u7F6E\u4E0D\u6B63\u786E\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E";function le(){var E,H;const t=te(),e=VueRouter.useRouter().options.routes,{wholeMenus:u}=Pinia.storeToRefs(Y()),n=(H=(E=x())==null?void 0:E.TooltipEffect)!=null?H:"light",o=Vue.computed(()=>{var a;return(a=A())==null?void 0:a.username}),s=Vue.computed(()=>(a,c)=>({background:a===c?B().epThemeColor:"",color:a===c?"#f4f4f5":"#000"})),d=Vue.computed(()=>(a,c)=>a===c?"":"dark:hover:!text-primary"),f=Vue.computed(()=>o.value?{marginRight:"10px"}:""),i=Vue.computed(()=>!t.getSidebarStatus),g=Vue.computed(()=>t.getDevice),{$storage:m,$config:r}=w(),l=Vue.computed(()=>{var a;return(a=m==null?void 0:m.layout)==null?void 0:a.layout}),h=Vue.computed(()=>r.Title);function p(a){const c=x().Title;c?document.title=`${_(a.title)} | ${c}`:document.title=_(a.title)}function T(){A().logOut()}function y(){Z.push("/welcome")}function C(){S.emit("openPanel")}function F(){t.toggleSideBar()}function j(a){a==null||a.handleResize()}function O(a){var b;if(!a.children)return console.error(z);const c=/^http(s?):\/\//,v=(b=a.children[0])==null?void 0:b.path;return c.test(v)?a.path+"/"+v:v}function G(a,c){if(u.value.length===0||Q(a))return;let v="";const b=a.lastIndexOf("/");b>0&&(v=a.slice(0,b));function M(k,L){return L?L.map($=>{$.path===k?$.redirect?M($.redirect,$.children):S.emit("changLayoutRoute",{indexPath:k,parentPath:v}):$.children&&M(k,$.children)}):console.error(z)}M(a,c)}function Q(a){return ee.includes(a)}return{title:h,device:g,layout:l,logout:T,routers:e,$storage:m,backHome:y,onPanel:C,changeTitle:p,toggleSideBar:F,menuSelect:G,handleResize:j,resolvePath:O,isCollapse:i,pureApp:t,username:o,avatarsStyle:f,tooltipEffect:n,getDropdownItemStyle:s,getDropdownItemClass:d}}function Ee(t){const{$storage:e,changeTitle:u,handleResize:n}=le(),{locale:o,t:s}=VueI18n.useI18n(),d=VueRouter.useRoute();function f(){e.locale={locale:"zh"},o.value="zh",t&&n(t.value)}function i(){e.locale={locale:"en"},o.value="en",t&&n(t.value)}return Vue.watch(()=>o.value,()=>{u(d.meta)}),{t:s,route:d,locale:o,translationCh:f,translationEn:i}}const re={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},se=Vue.createElementVNode("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),de=[se];function fe(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",re,de)}const He={render:fe},V={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"head",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/Users/zhangyi/Desktop/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@2.4.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #001529 !default;
        $menuHover: #4091f7 !default;
        $subMenuBg: #0f0303 !default;
        $subMenuActiveBg: #4091f7 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #002140 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-light",varsContent:`
        $subMenuActiveText: #409eff !default;
        $menuBg: #fff !default;
        $menuHover: #e0ebf6 !default;
        $subMenuBg: #fff !default;
        $subMenuActiveBg: #e0ebf6 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #fff !default;
        $menuTitleHover: #000 !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-dusk",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2a0608 !default;
        $menuHover: #e13c39 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #e13c39 !default;
        $menuText: rgb(254 254 254 / 65.1%) !default;
        $sidebarLogo: #42090c !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e13c39 !default;
      `},{scopeName:"layout-theme-volcano",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2b0e05 !default;
        $menuHover: #e85f33 !default;
        $subMenuBg: #0f0603 !default;
        $subMenuActiveBg: #e85f33 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #441708 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e85f33 !default;
      `},{scopeName:"layout-theme-yellow",varsContent:`
        $subMenuActiveText: #d25f00 !default;
        $menuBg: #2b2503 !default;
        $menuHover: #f6da4d !default;
        $subMenuBg: #0f0603 !default;
        $subMenuActiveBg: #f6da4d !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #443b05 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #f6da4d !default;
      `},{scopeName:"layout-theme-mingQing",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #032121 !default;
        $menuHover: #59bfc1 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #59bfc1 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #053434 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #59bfc1 !default;
      `},{scopeName:"layout-theme-auroraGreen",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #0b1e15 !default;
        $menuHover: #60ac80 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #60ac80 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #112f21 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #60ac80 !default;
      `},{scopeName:"layout-theme-pink",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #28081a !default;
        $menuHover: #d84493 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #d84493 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #3f0d29 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #d84493 !default;
      `},{scopeName:"layout-theme-saucePurple",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #130824 !default;
        $menuHover: #693ac9 !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #693ac9 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #1f0c38 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #693ac9 !default;
      `}]},ce="/vue-pure-admin/",ie="assets";function P(t){let e=t.replace("#","").match(/../g);for(let u=0;u<3;u++)e[u]=parseInt(e[u],16);return e}function R(t,e,u){let n=[t.toString(16),e.toString(16),u.toString(16)];for(let o=0;o<3;o++)n[o].length==1&&(n[o]=`0${n[o]}`);return`#${n.join("")}`}function me(t,e){let u=P(t);for(let n=0;n<3;n++)u[n]=Math.floor(u[n]*(1-e));return R(u[0],u[1],u[2])}function he(t,e){let u=P(t);for(let n=0;n<3;n++)u[n]=Math.floor((255-u[n])*e+u[n]);return R(u[0],u[1],u[2])}function I(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function N({scopeName:t,multipleScopeVars:e}){const u=Array.isArray(e)&&e.length?e:V.multipleScopeVars;let n=document.documentElement.className;new RegExp(I(t)).test(n)||(u.forEach(o=>{n=n.replace(new RegExp(I(o.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function D({id:t,href:e}){const u=document.createElement("link");return u.rel="stylesheet",u.href=e,u.id=t,u}function ge(t){const e={scopeName:"theme-default",customLinkHref:s=>s,...t},u=e.themeLinkTagId||V.themeLinkTagId;let n=document.getElementById(u);const o=e.customLinkHref(`/${ce}/${ie}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,""));if(n){n.id=`${u}_old`;const s=D({id:u,href:o});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),N(e)};return}n=D({id:u,href:o}),N(e),document[(e.themeLinkTagInjectTo||V.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function Le(){var m;const{layoutTheme:t,layout:e}=ae(),u=Vue.ref([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=w(),o=Vue.ref((m=n==null?void 0:n.layout)==null?void 0:m.darkMode),s=document.documentElement;function d(r="default"){var l,h;if(t.value.theme=r,ge({scopeName:`layout-theme-${r}`}),n.layout={layout:e.value,theme:r,darkMode:o.value,sidebarStatus:(l=n.layout)==null?void 0:l.sidebarStatus,epThemeColor:(h=n.layout)==null?void 0:h.epThemeColor},r==="default"||r==="light")i(x().EpThemeColor);else{const p=oe(u.value,{themeColor:r});i(p.color)}}function f(r,l,h){document.documentElement.style.setProperty(`--el-color-primary-${r}-${l}`,o.value?me(h,l/10):he(h,l/10))}const i=r=>{B().setEpThemeColor(r),document.documentElement.style.setProperty("--el-color-primary",r);for(let l=1;l<=2;l++)f("dark",l,r);for(let l=1;l<=9;l++)f("light",l,r)};function g(){B().epTheme==="light"&&o.value?d("default"):d(B().epTheme),o.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:s,dataTheme:o,layoutTheme:t,themeColors:u,dataThemeChange:g,setEpThemeColor:i,setLayoutThemeColor:d}}const pe={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ve=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),$e=Vue.createElementVNode("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),be=[ve,$e];function Te(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",pe,be)}const Ae={render:Te},ye={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Ce=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Be=Vue.createElementVNode("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),Me=[Ce,Be];function ke(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",ye,Me)}const _e={render:ke};export{Ee as a,Le as b,_e as c,Ae as d,ae as e,He as g,ge as t,le as u};
