import{a9 as x,ad as U,a8 as W,u as q,x as T,ae as H,t as L,af as J,a4 as K,a5 as A,ag as X}from"./index-28562d9d.js";import{u as Y}from"./app-52ac5493.js";import{u as $}from"./epTheme-75b4f2ea.js";function Z(){const{$storage:t,$config:e}=x(),o=()=>{U().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=W),t.locale||(t.locale={locale:(e==null?void 0:e.Locale)??"zh"},VueI18n.useI18n().locale.value=(e==null?void 0:e.Locale)??"zh"),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"default",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1})},n=Vue.computed(()=>t==null?void 0:t.layout.layout),a=Vue.computed(()=>t.layout);return{layout:n,layoutTheme:a,initStorage:o}}const S="当前路由配置不正确，请检查配置";function ee(){var w;const t=Y(),e=VueRouter.useRouter().options.routes,{wholeMenus:o}=Pinia.storeToRefs(q()),n=((w=T())==null?void 0:w.TooltipEffect)??"light",a=Vue.computed(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),s=Vue.computed(()=>{var u;return(u=H())==null?void 0:u.username}),d=Vue.computed(()=>(u,c)=>({background:u===c?$().epThemeColor:"",color:u===c?"#f4f4f5":"#000"})),m=Vue.computed(()=>(u,c)=>u===c?"":"dark:hover:!text-primary"),f=Vue.computed(()=>s.value?{marginRight:"10px"}:""),b=Vue.computed(()=>!t.getSidebarStatus),v=Vue.computed(()=>t.getDevice),{$storage:l,$config:r}=x(),i=Vue.computed(()=>{var u;return(u=l==null?void 0:l.layout)==null?void 0:u.layout}),y=Vue.computed(()=>r.Title);function C(u){const c=T().Title;c?document.title=`${L(u.title)} | ${c}`:document.title=L(u.title)}function P(){H().logOut()}function R(){J.push(K().path)}function D(){A.emit("openPanel")}function j(){t.toggleSideBar()}function O(u){u==null||u.handleResize()}function F(u){var p;if(!u.children)return console.error(S);const c=/^http(s?):\/\//,h=(p=u.children[0])==null?void 0:p.path;return c.test(h)?u.path+"/"+h:h}function G(u,c){if(o.value.length===0||Q(u))return;let h="";const p=u.lastIndexOf("/");p>0&&(h=u.slice(0,p));function M(B,V){return V?V.map(g=>{g.path===B?g.redirect?M(g.redirect,g.children):A.emit("changLayoutRoute",{indexPath:B,parentPath:h}):g.children&&M(B,g.children)}):console.error(S)}M(u,c)}function Q(u){return X.includes(u)}return{title:y,device:v,layout:i,logout:P,routers:e,$storage:l,backTopMenu:R,onPanel:D,getDivStyle:a,changeTitle:C,toggleSideBar:j,menuSelect:G,handleResize:O,resolvePath:F,isCollapse:b,pureApp:t,username:s,avatarsStyle:f,tooltipEffect:n,getDropdownItemStyle:d,getDropdownItemClass:m}}function Me(t){const{$storage:e,changeTitle:o,handleResize:n}=ee(),{locale:a,t:s}=VueI18n.useI18n(),d=VueRouter.useRoute();function m(){e.locale={locale:"zh"},a.value="zh",t&&n(t.value)}function f(){e.locale={locale:"en"},a.value="en",t&&n(t.value)}return Vue.watch(()=>a.value,()=>{o(d.meta)}),{t:s,route:d,locale:a,translationCh:m,translationEn:f}}const te={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},ne=Vue.createElementVNode("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),oe=[ne];function ue(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",te,oe)}const Be={render:ue},k={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/Users/zhangyi/Desktop/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@3.0.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
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
      `}]},ae="/vue-pure-admin/",le="assets";function N(t){let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e}function I(t,e,o){let n=[t.toString(16),e.toString(16),o.toString(16)];for(let a=0;a<3;a++)n[a].length==1&&(n[a]=`0${n[a]}`);return`#${n.join("")}`}function re(t,e){let o=N(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return I(o[0],o[1],o[2])}function se(t,e){let o=N(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return I(o[0],o[1],o[2])}function _(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function E({scopeName:t,multipleScopeVars:e}){const o=Array.isArray(e)&&e.length?e:k.multipleScopeVars;let n=document.documentElement.className;new RegExp(_(t)).test(n)||(o.forEach(a=>{n=n.replace(new RegExp(_(a.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function z({id:t,href:e}){const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o}function ce(t){const e={scopeName:"theme-default",customLinkHref:s=>s,...t},o=e.themeLinkTagId||k.themeLinkTagId;let n=document.getElementById(o);const a=e.customLinkHref(`${ae.replace(/\/$/,"")}${`/${le}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const s=z({id:o,href:a});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),E(e)};return}n=z({id:o,href:a}),E(e),document[(e.themeLinkTagInjectTo||k.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function ke(){var v;const{layoutTheme:t,layout:e}=Z(),o=Vue.ref([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=x(),a=Vue.ref((v=n==null?void 0:n.layout)==null?void 0:v.darkMode),s=document.documentElement;function d(l=T().Theme??"default"){var r,i;if(t.value.theme=l,ce({scopeName:`layout-theme-${l}`}),n.layout={layout:e.value,theme:l,darkMode:a.value,sidebarStatus:(r=n.layout)==null?void 0:r.sidebarStatus,epThemeColor:(i=n.layout)==null?void 0:i.epThemeColor},l==="default"||l==="light")f(T().EpThemeColor);else{const y=o.value.find(C=>C.themeColor===l);f(y.color)}}function m(l,r,i){document.documentElement.style.setProperty(`--el-color-primary-${l}-${r}`,a.value?re(i,r/10):se(i,r/10))}const f=l=>{$().setEpThemeColor(l),document.documentElement.style.setProperty("--el-color-primary",l);for(let r=1;r<=2;r++)m("dark",r,l);for(let r=1;r<=9;r++)m("light",r,l)};function b(){$().epTheme==="light"&&a.value?d("default"):d($().epTheme),a.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:s,dataTheme:a,layoutTheme:t,themeColors:o,dataThemeChange:b,setEpThemeColor:f,setLayoutThemeColor:d}}const de={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},fe=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),ie=Vue.createElementVNode("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),me=[fe,ie];function he(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",de,me)}const xe={render:he},ge={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},pe=Vue.createElementVNode("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),ve=Vue.createElementVNode("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),$e=[pe,ve];function Te(t,e){return Vue.openBlock(),Vue.createElementBlock("svg",ge,$e)}const we={render:Te};export{Me as a,ke as b,we as c,xe as d,Z as e,Be as g,ce as t,ee as u};
