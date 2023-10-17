import{di as B,G as d,dn as U,dh as W,a1 as I,r as H,aF as T,a4 as q,dp as K,E as X,dq as L,K as S,dr as J,dc as Y,ds as ee,c$ as te,X as ne,ar as oe,g as k,n as x,h as v}from"./index.js";import{u as $}from"./epTheme.js";import{e as _}from"./mitt.js";import{u as ae}from"./app.js";const _e={width:24,height:24,body:'<path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16ZM11 7h2v2h-2V7Zm0 4h2v6h-2v-6Z"/>'};function ue(){const{$storage:t,$config:e}=B(),o=()=>{U().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=W),t.locale||(t.locale={locale:(e==null?void 0:e.Locale)??"zh"},I().locale.value=(e==null?void 0:e.Locale)??"zh"),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"default",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,hideFooter:e.HideFooter??!1,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1})},n=d(()=>t==null?void 0:t.layout.layout),u=d(()=>t.layout);return{layout:n,layoutTheme:u,initStorage:o}}const M={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/Users/zhangyi/Desktop/aa/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@3.1.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
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
      `}]},le="/vue-pure-admin/",re="assets";function P(t){let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e}function D(t,e,o){let n=[t.toString(16),e.toString(16),o.toString(16)];for(let u=0;u<3;u++)n[u].length==1&&(n[u]=`0${n[u]}`);return`#${n.join("")}`}function se(t,e){let o=P(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return D(o[0],o[1],o[2])}function de(t,e){let o=P(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return D(o[0],o[1],o[2])}function z(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function E({scopeName:t,multipleScopeVars:e}){const o=Array.isArray(e)&&e.length?e:M.multipleScopeVars;let n=document.documentElement.className;new RegExp(z(t)).test(n)||(o.forEach(u=>{n=n.replace(new RegExp(z(u.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function N({id:t,href:e}){const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o}function fe(t){const e={scopeName:"theme-default",customLinkHref:s=>s,...t},o=e.themeLinkTagId||M.themeLinkTagId;let n=document.getElementById(o);const u=e.customLinkHref(`${le.replace(/\/$/,"")}${`/${re}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const s=N({id:o,href:u});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),E(e)};return}n=N({id:o,href:u}),E(e),document[(e.themeLinkTagInjectTo||M.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function ze(){var p;const{layoutTheme:t,layout:e}=ue(),o=H([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=B(),u=H((p=n==null?void 0:n.layout)==null?void 0:p.darkMode),s=document.documentElement;function c(l=T().Theme??"default"){var r,m;if(t.value.theme=l,fe({scopeName:`layout-theme-${l}`}),n.layout={layout:e.value,theme:l,darkMode:u.value,sidebarStatus:(r=n.layout)==null?void 0:r.sidebarStatus,epThemeColor:(m=n.layout)==null?void 0:m.epThemeColor},l==="default"||l==="light")i(T().EpThemeColor);else{const b=o.value.find(y=>y.themeColor===l);i(b.color)}}function h(l,r,m){document.documentElement.style.setProperty(`--el-color-primary-${l}-${r}`,u.value?se(m,r/10):de(m,r/10))}const i=l=>{$().setEpThemeColor(l),document.documentElement.style.setProperty("--el-color-primary",l);for(let r=1;r<=2;r++)h("dark",r,l);for(let r=1;r<=9;r++)h("light",r,l)};function g(){$().epTheme==="light"&&u.value?c("default"):c($().epTheme),u.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:s,dataTheme:u,layoutTheme:t,themeColors:o,dataThemeChange:g,setEpThemeColor:i,setLayoutThemeColor:c}}const ce="/vue-pure-admin/static/jpg/user.jpg",ie="当前路由配置不正确，请检查配置";function me(){var w;const t=ae(),e=q().options.routes,{wholeMenus:o}=K(X()),n=((w=T())==null?void 0:w.TooltipEffect)??"light",u=d(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),s=d(()=>{var a;return(a=L())==null?void 0:a.username}),c=d(()=>(a,f)=>({background:a===f?$().epThemeColor:"",color:a===f?"#f4f4f5":"#000"})),h=d(()=>(a,f)=>a===f?"":"dark:hover:!text-primary"),i=d(()=>s.value?{marginRight:"10px"}:""),g=d(()=>!t.getSidebarStatus),p=d(()=>t.getDevice),{$storage:l,$config:r}=B(),m=d(()=>{var a;return(a=l==null?void 0:l.layout)==null?void 0:a.layout}),b=d(()=>r.Title);function y(a){const f=T().Title;f?document.title=`${S(a.title)} | ${f}`:document.title=S(a.title)}function R(){L().logOut()}function j(){var a;J.push((a=Y())==null?void 0:a.path)}function F(){_.emit("openPanel")}function V(){t.toggleSideBar()}function G(a){a==null||a.handleResize()}function Z(a){var A;if(!a.children)return console.error(ie);const f=/^http(s?):\/\//,C=(A=a.children[0])==null?void 0:A.path;return f.test(C)?a.path+"/"+C:C}function O(a){o.value.length===0||Q(a)||_.emit("changLayoutRoute",a)}function Q(a){return ee.includes(a)}return{title:b,device:p,layout:m,logout:R,routers:e,$storage:l,backTopMenu:j,onPanel:F,getDivStyle:u,changeTitle:y,toggleSideBar:V,menuSelect:O,handleResize:G,resolvePath:Z,isCollapse:g,pureApp:t,username:s,userAvatar:ce,avatarsStyle:i,tooltipEffect:n,getDropdownItemStyle:c,getDropdownItemClass:h}}function Ee(t){const{$storage:e,changeTitle:o,handleResize:n}=me(),{locale:u,t:s}=I(),c=te();function h(){e.locale={locale:"zh"},u.value="zh",t&&n(t.value)}function i(){e.locale={locale:"en"},u.value="en",t&&n(t.value)}return ne(()=>u.value,()=>{o(c.meta)}),oe(()=>{var g;u.value=((g=e.locale)==null?void 0:g.locale)??"zh"}),{t:s,route:c,locale:u,translationCh:h,translationEn:i}}const he={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},ge=v("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),ve=[ge];function pe(t,e){return k(),x("svg",he,ve)}const Ne={render:pe},$e={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Te=v("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),be=v("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),ye=[Te,be];function Ce(t,e){return k(),x("svg",$e,ye)}const Ie={render:Ce},Me={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Be=v("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),ke=v("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),xe=[Be,ke];function we(t,e){return k(),x("svg",Me,xe)}const Pe={render:we};export{Ee as a,ze as b,Ie as c,_e as d,Pe as e,ue as f,Ne as g,fe as t,me as u};
