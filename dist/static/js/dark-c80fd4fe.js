import{a4 as w,a8 as U,a3 as W,u as Z,k as x,a9 as A,t as _,aa as q,Z as S,ab as J}from"./index-1d030a9b.js";import{u as K}from"./app-e916d62a.js";import{u as B}from"./epTheme-1792fc8c.js";function X(){const{$storage:t,$config:e}=w(),u=()=>{var s,c,h,f,g,i,r,l,m,p,v,y,C;U().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=W),t.locale||(t.locale={locale:(s=e==null?void 0:e.Locale)!=null?s:"zh"},VueI18n.useI18n().locale.value=(c=e==null?void 0:e.Locale)!=null?c:"zh"),t.layout||(t.layout={layout:(h=e==null?void 0:e.Layout)!=null?h:"vertical",theme:(f=e==null?void 0:e.Theme)!=null?f:"default",darkMode:(g=e==null?void 0:e.DarkMode)!=null?g:!1,sidebarStatus:(i=e==null?void 0:e.SidebarStatus)!=null?i:!0,epThemeColor:(r=e==null?void 0:e.EpThemeColor)!=null?r:"#409EFF"}),t.configure||(t.configure={grey:(l=e==null?void 0:e.Grey)!=null?l:!1,weak:(m=e==null?void 0:e.Weak)!=null?m:!1,hideTabs:(p=e==null?void 0:e.HideTabs)!=null?p:!1,showLogo:(v=e==null?void 0:e.ShowLogo)!=null?v:!0,showModel:(y=e==null?void 0:e.ShowModel)!=null?y:"smart",multiTagsCache:(C=e==null?void 0:e.MultiTagsCache)!=null?C:!1})},n=Vue.computed(()=>t==null?void 0:t.layout.layout),a=Vue.computed(()=>t.layout);return{layout:n,layoutTheme:a,initStorage:u}}const z="\u5F53\u524D\u8DEF\u7531\u914D\u7F6E\u4E0D\u6B63\u786E\uFF0C\u8BF7\u68C0\u67E5\u914D\u7F6E";function Y(){var E,H;const t=K(),e=VueRouter.useRouter().options.routes,{wholeMenus:u}=Pinia.storeToRefs(Z()),n=(H=(E=x())==null?void 0:E.TooltipEffect)!=null?H:"light",a=Vue.computed(()=>{var o;return(o=A())==null?void 0:o.username}),s=Vue.computed(()=>(o,d)=>({background:o===d?B().epThemeColor:"",color:o===d?"#f4f4f5":"#000"})),c=Vue.computed(()=>(o,d)=>o===d?"":"dark:hover:!text-primary"),h=Vue.computed(()=>a.value?{marginRight:"10px"}:""),f=Vue.computed(()=>!t.getSidebarStatus),g=Vue.computed(()=>t.getDevice),{$storage:i,$config:r}=w(),l=Vue.computed(()=>{var o;return(o=i==null?void 0:i.layout)==null?void 0:o.layout}),m=Vue.computed(()=>r.Title);function p(o){const d=x().Title;d?document.title=`${_(o.title)} | ${d}`:document.title=_(o.title)}function v(){A().logOut()}function y(){q.push("/welcome")}function C(){S.emit("openPanel")}function F(){t.toggleSideBar()}function j(o){o==null||o.handleResize()}function O(o){var b;if(!o.children)return console.error(z);const d=/^http(s?):\/\//,$=(b=o.children[0])==null?void 0:b.path;return d.test($)?o.path+"/"+$:$}function G(o,d){if(u.value.length===0||Q(o))return;let $="";const b=o.lastIndexOf("/");b>0&&($=o.slice(0,b));function M(k,L){return L?L.map(T=>{T.path===k?T.redirect?M(T.redirect,T.children):S.emit("changLayoutRoute",{indexPath:k,parentPath:$}):T.children&&M(k,T.children)}):console.error(z)}M(o,d)}function Q(o){return J.includes(o)}return{title:m,device:g,layout:l,logout:v,routers:e,$storage:i,backHome:y,onPanel:C,changeTitle:p,toggleSideBar:F,menuSelect:G,handleResize:j,resolvePath:O,isCollapse:f,pureApp:t,username:a,avatarsStyle:h,tooltipEffect:n,getDropdownItemStyle:s,getDropdownItemClass:c}}function Ce(t){const{$storage:e,changeTitle:u,handleResize:n}=Y(),{locale:a,t:s}=VueI18n.useI18n(),c=VueRouter.useRoute();function h(){e.locale={locale:"zh"},a.value="zh",t&&n(t.value)}function f(){e.locale={locale:"en"},a.value="en",t&&n(t.value)}return Vue.watch(()=>a.value,()=>{u(c.meta)}),{t:s,route:c,locale:a,translationCh:h,translationEn:f}}const ee={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},te=Vue.createElementVNode("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),ne=[te];function ue(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",ee,ne)}const Be={render:ue},V={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/Users/zhangyi/Desktop/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@3.0.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
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
      `}]},oe="/vue-pure-admin/",ae="assets";function P(t){let e=t.replace("#","").match(/../g);for(let u=0;u<3;u++)e[u]=parseInt(e[u],16);return e}function R(t,e,u){let n=[t.toString(16),e.toString(16),u.toString(16)];for(let a=0;a<3;a++)n[a].length==1&&(n[a]=`0${n[a]}`);return`#${n.join("")}`}function le(t,e){let u=P(t);for(let n=0;n<3;n++)u[n]=Math.floor(u[n]*(1-e));return R(u[0],u[1],u[2])}function re(t,e){let u=P(t);for(let n=0;n<3;n++)u[n]=Math.floor((255-u[n])*e+u[n]);return R(u[0],u[1],u[2])}function N(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function I({scopeName:t,multipleScopeVars:e}){const u=Array.isArray(e)&&e.length?e:V.multipleScopeVars;let n=document.documentElement.className;new RegExp(N(t)).test(n)||(u.forEach(a=>{n=n.replace(new RegExp(N(a.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function D({id:t,href:e}){const u=document.createElement("link");return u.rel="stylesheet",u.href=e,u.id=t,u}function se(t){const e={scopeName:"theme-default",customLinkHref:s=>s,...t},u=e.themeLinkTagId||V.themeLinkTagId;let n=document.getElementById(u);const a=e.customLinkHref(`${oe.replace(/\/$/,"")}${`/${ae}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${u}_old`;const s=D({id:u,href:a});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),I(e)};return}n=D({id:u,href:a}),I(e),document[(e.themeLinkTagInjectTo||V.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function Me(){var i;const{layoutTheme:t,layout:e}=X(),u=Vue.ref([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=w(),a=Vue.ref((i=n==null?void 0:n.layout)==null?void 0:i.darkMode),s=document.documentElement;function c(r="default"){var l,m;if(t.value.theme=r,se({scopeName:`layout-theme-${r}`}),n.layout={layout:e.value,theme:r,darkMode:a.value,sidebarStatus:(l=n.layout)==null?void 0:l.sidebarStatus,epThemeColor:(m=n.layout)==null?void 0:m.epThemeColor},r==="default"||r==="light")f(x().EpThemeColor);else{const p=u.value.find(v=>v.themeColor===r);f(p.color)}}function h(r,l,m){document.documentElement.style.setProperty(`--el-color-primary-${r}-${l}`,a.value?le(m,l/10):re(m,l/10))}const f=r=>{B().setEpThemeColor(r),document.documentElement.style.setProperty("--el-color-primary",r);for(let l=1;l<=2;l++)h("dark",l,r);for(let l=1;l<=9;l++)h("light",l,r)};function g(){B().epTheme==="light"&&a.value?c("default"):c(B().epTheme),a.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:s,dataTheme:a,layoutTheme:t,themeColors:u,dataThemeChange:g,setEpThemeColor:f,setLayoutThemeColor:c}}const ce={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},de=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),fe=Vue.createElementVNode("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),ie=[de,fe];function me(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",ce,ie)}const ke={render:me},he={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ge=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),pe=Vue.createElementVNode("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),ve=[ge,pe];function $e(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",he,ve)}const xe={render:$e};export{Ce as a,Me as b,xe as c,ke as d,X as e,Be as g,se as t,Y as u};
