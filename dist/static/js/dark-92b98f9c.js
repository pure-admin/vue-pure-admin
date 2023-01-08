import{a as B}from"./index-4b83e049.js";import{e as H}from"./mitt-7f99bbc0.js";import{r as x}from"./index-8c77f9cd.js";import{a as Q,o as A,c as L,r as U,q as W}from"./index-cd980a4b.js";import{u as q}from"./app-29e8e368.js";import{u as $}from"./epTheme-80ea1c2b.js";import{a as J,r as K}from"./multiTags-d9cd5aad.js";function X(){const{$storage:t,$config:e}=x(),o=()=>{J().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=K),t.locale||(t.locale={locale:(e==null?void 0:e.Locale)??"zh"},VueI18n.useI18n().locale.value=(e==null?void 0:e.Locale)??"zh"),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"default",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1})},n=Vue.computed(()=>t==null?void 0:t.layout.layout),a=Vue.computed(()=>t.layout);return{layout:n,layoutTheme:a,initStorage:o}}const _="当前路由配置不正确，请检查配置";function Y(){var V;const t=q(),e=VueRouter.useRouter().options.routes,{wholeMenus:o}=Pinia.storeToRefs(Q()),n=((V=B())==null?void 0:V.TooltipEffect)??"light",a=Vue.computed(()=>{var u;return(u=A())==null?void 0:u.username}),s=Vue.computed(()=>(u,c)=>({background:u===c?$().epThemeColor:"",color:u===c?"#f4f4f5":"#000"})),d=Vue.computed(()=>(u,c)=>u===c?"":"dark:hover:!text-primary"),h=Vue.computed(()=>a.value?{marginRight:"10px"}:""),f=Vue.computed(()=>!t.getSidebarStatus),T=Vue.computed(()=>t.getDevice),{$storage:i,$config:r}=x(),l=Vue.computed(()=>{var u;return(u=i==null?void 0:i.layout)==null?void 0:u.layout}),m=Vue.computed(()=>r.Title);function b(u){const c=B().Title;c?document.title=`${L(u.title)} | ${c}`:document.title=L(u.title)}function y(){A().logOut()}function P(){U.push("/welcome")}function R(){H.emit("openPanel")}function D(){t.toggleSideBar()}function j(u){u==null||u.handleResize()}function O(u){var v;if(!u.children)return console.error(_);const c=/^http(s?):\/\//,p=(v=u.children[0])==null?void 0:v.path;return c.test(p)?u.path+"/"+p:p}function F(u,c){if(o.value.length===0||G(u))return;let p="";const v=u.lastIndexOf("/");v>0&&(p=u.slice(0,v));function C(M,w){return w?w.map(g=>{g.path===M?g.redirect?C(g.redirect,g.children):H.emit("changLayoutRoute",{indexPath:M,parentPath:p}):g.children&&C(M,g.children)}):console.error(_)}C(u,c)}function G(u){return W.includes(u)}return{title:m,device:T,layout:l,logout:y,routers:e,$storage:i,backHome:P,onPanel:R,changeTitle:b,toggleSideBar:D,menuSelect:F,handleResize:j,resolvePath:O,isCollapse:f,pureApp:t,username:a,avatarsStyle:h,tooltipEffect:n,getDropdownItemStyle:s,getDropdownItemClass:d}}function ke(t){const{$storage:e,changeTitle:o,handleResize:n}=Y(),{locale:a,t:s}=VueI18n.useI18n(),d=VueRouter.useRoute();function h(){e.locale={locale:"zh"},a.value="zh",t&&n(t.value)}function f(){e.locale={locale:"en"},a.value="en",t&&n(t.value)}return Vue.watch(()=>a.value,()=>{o(d.meta)}),{t:s,route:d,locale:a,translationCh:h,translationEn:f}}const Z={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},ee=Vue.createElementVNode("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),te=[ee];function ne(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",Z,te)}const xe={render:ne},k={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"C:/Users/Administrator/Desktop/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@3.0.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
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
      `}]},oe="/vue-pure-admin/",ue="assets";function z(t){let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e}function I(t,e,o){let n=[t.toString(16),e.toString(16),o.toString(16)];for(let a=0;a<3;a++)n[a].length==1&&(n[a]=`0${n[a]}`);return`#${n.join("")}`}function ae(t,e){let o=z(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return I(o[0],o[1],o[2])}function le(t,e){let o=z(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return I(o[0],o[1],o[2])}function S(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function E({scopeName:t,multipleScopeVars:e}){const o=Array.isArray(e)&&e.length?e:k.multipleScopeVars;let n=document.documentElement.className;new RegExp(S(t)).test(n)||(o.forEach(a=>{n=n.replace(new RegExp(S(a.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function N({id:t,href:e}){const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o}function re(t){const e={scopeName:"theme-default",customLinkHref:s=>s,...t},o=e.themeLinkTagId||k.themeLinkTagId;let n=document.getElementById(o);const a=e.customLinkHref(`${oe.replace(/\/$/,"")}${`/${ue}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const s=N({id:o,href:a});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),E(e)};return}n=N({id:o,href:a}),E(e),document[(e.themeLinkTagInjectTo||k.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function Ve(){var i;const{layoutTheme:t,layout:e}=X(),o=Vue.ref([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=x(),a=Vue.ref((i=n==null?void 0:n.layout)==null?void 0:i.darkMode),s=document.documentElement;function d(r="default"){var l,m;if(t.value.theme=r,re({scopeName:`layout-theme-${r}`}),n.layout={layout:e.value,theme:r,darkMode:a.value,sidebarStatus:(l=n.layout)==null?void 0:l.sidebarStatus,epThemeColor:(m=n.layout)==null?void 0:m.epThemeColor},r==="default"||r==="light")f(B().EpThemeColor);else{const b=o.value.find(y=>y.themeColor===r);f(b.color)}}function h(r,l,m){document.documentElement.style.setProperty(`--el-color-primary-${r}-${l}`,a.value?ae(m,l/10):le(m,l/10))}const f=r=>{$().setEpThemeColor(r),document.documentElement.style.setProperty("--el-color-primary",r);for(let l=1;l<=2;l++)h("dark",l,r);for(let l=1;l<=9;l++)h("light",l,r)};function T(){$().epTheme==="light"&&a.value?d("default"):d($().epTheme),a.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:s,dataTheme:a,layoutTheme:t,themeColors:o,dataThemeChange:T,setEpThemeColor:f,setLayoutThemeColor:d}}const se={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ce=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),de=Vue.createElementVNode("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),fe=[ce,de];function ie(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",se,fe)}const we={render:ie},me={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},he=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),pe=Vue.createElementVNode("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),ge=[he,pe];function ve(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",me,ge)}const He={render:ve};export{ke as a,Ve as b,He as c,we as d,X as e,xe as g,re as t,Y as u};
