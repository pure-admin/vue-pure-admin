import{bq as B,D as f,bw as U,bp as W,$ as I,r as L,aJ as $,a2 as q,bx as K,J as X,by as H,L as S,bz as Y,bk as Z,bA as ee,b7 as te,E as ne,ao as oe,o as k,i as x,e as p}from"./index.js";import{u as b}from"./epTheme.js";import{u as ae}from"./app.js";function ue(){const{$storage:t,$config:e}=B(),o=()=>{U().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=W),t.locale||(t.locale={locale:(e==null?void 0:e.Locale)??"zh"},I().locale.value=(e==null?void 0:e.Locale)??"zh"),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"default",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1})},n=f(()=>t==null?void 0:t.layout.layout),a=f(()=>t.layout);return{layout:n,layoutTheme:a,initStorage:o}}const M={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/Users/zhangyi/Desktop/aa/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@3.1.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-default",varsContent:`
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
      `}]},le="/vue-pure-admin/",re="assets";function P(t){let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e}function D(t,e,o){let n=[t.toString(16),e.toString(16),o.toString(16)];for(let a=0;a<3;a++)n[a].length==1&&(n[a]=`0${n[a]}`);return`#${n.join("")}`}function se(t,e){let o=P(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return D(o[0],o[1],o[2])}function fe(t,e){let o=P(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return D(o[0],o[1],o[2])}function _(t){return`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`}function z({scopeName:t,multipleScopeVars:e}){const o=Array.isArray(e)&&e.length?e:M.multipleScopeVars;let n=document.documentElement.className;new RegExp(_(t)).test(n)||(o.forEach(a=>{n=n.replace(new RegExp(_(a.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))}function E({id:t,href:e}){const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o}function ie(t){const e={scopeName:"theme-default",customLinkHref:s=>s,...t},o=e.themeLinkTagId||M.themeLinkTagId;let n=document.getElementById(o);const a=e.customLinkHref(`${le.replace(/\/$/,"")}${`/${re}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const s=E({id:o,href:a});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),z(e)};return}n=E({id:o,href:a}),z(e),document[(e.themeLinkTagInjectTo||M.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)}function _e(){var v;const{layoutTheme:t,layout:e}=ue(),o=L([{color:"#1b2a47",themeColor:"default"},{color:"#ffffff",themeColor:"light"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#fadb14",themeColor:"yellow"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"},{color:"#eb2f96",themeColor:"pink"},{color:"#722ed1",themeColor:"saucePurple"}]),{$storage:n}=B(),a=L((v=n==null?void 0:n.layout)==null?void 0:v.darkMode),s=document.documentElement;function c(l=$().Theme??"default"){var r,m;if(t.value.theme=l,ie({scopeName:`layout-theme-${l}`}),n.layout={layout:e.value,theme:l,darkMode:a.value,sidebarStatus:(r=n.layout)==null?void 0:r.sidebarStatus,epThemeColor:(m=n.layout)==null?void 0:m.epThemeColor},l==="default"||l==="light")d($().EpThemeColor);else{const T=o.value.find(y=>y.themeColor===l);d(T.color)}}function h(l,r,m){document.documentElement.style.setProperty(`--el-color-primary-${l}-${r}`,a.value?se(m,r/10):fe(m,r/10))}const d=l=>{b().setEpThemeColor(l),document.documentElement.style.setProperty("--el-color-primary",l);for(let r=1;r<=2;r++)h("dark",r,l);for(let r=1;r<=9;r++)h("light",r,l)};function g(){b().epTheme==="light"&&a.value?c("default"):c(b().epTheme),a.value?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}return{body:s,dataTheme:a,layoutTheme:t,themeColors:o,dataThemeChange:g,setEpThemeColor:d,setLayoutThemeColor:c}}function ce(t){return{all:t=t||new Map,on:function(e,o){var n=t.get(e);n?n.push(o):t.set(e,[o])},off:function(e,o){var n=t.get(e);n&&(o?n.splice(n.indexOf(o)>>>0,1):t.set(e,[]))},emit:function(e,o){var n=t.get(e);n&&n.slice().map(function(a){a(o)}),(n=t.get("*"))&&n.slice().map(function(a){a(e,o)})}}}const N=ce(),de="/vue-pure-admin/static/jpg/user.jpg",me="当前路由配置不正确，请检查配置";function he(){var w;const t=ae(),e=q().options.routes,{wholeMenus:o}=K(X()),n=((w=$())==null?void 0:w.TooltipEffect)??"light",a=f(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),s=f(()=>{var u;return(u=H())==null?void 0:u.username}),c=f(()=>(u,i)=>({background:u===i?b().epThemeColor:"",color:u===i?"#f4f4f5":"#000"})),h=f(()=>(u,i)=>u===i?"":"dark:hover:!text-primary"),d=f(()=>s.value?{marginRight:"10px"}:""),g=f(()=>!t.getSidebarStatus),v=f(()=>t.getDevice),{$storage:l,$config:r}=B(),m=f(()=>{var u;return(u=l==null?void 0:l.layout)==null?void 0:u.layout}),T=f(()=>r.Title);function y(u){const i=$().Title;i?document.title=`${S(u.title)} | ${i}`:document.title=S(u.title)}function R(){H().logOut()}function j(){var u;Y.push((u=Z())==null?void 0:u.path)}function O(){N.emit("openPanel")}function V(){t.toggleSideBar()}function F(u){u==null||u.handleResize()}function G(u){var A;if(!u.children)return console.error(me);const i=/^http(s?):\/\//,C=(A=u.children[0])==null?void 0:A.path;return i.test(C)?u.path+"/"+C:C}function J(u){o.value.length===0||Q(u)||N.emit("changLayoutRoute",u)}function Q(u){return ee.includes(u)}return{title:T,device:v,layout:m,logout:R,routers:e,$storage:l,backTopMenu:j,onPanel:O,getDivStyle:a,changeTitle:y,toggleSideBar:V,menuSelect:J,handleResize:F,resolvePath:G,isCollapse:g,pureApp:t,username:s,userAvatar:de,avatarsStyle:d,tooltipEffect:n,getDropdownItemStyle:c,getDropdownItemClass:h}}function ze(t){const{$storage:e,changeTitle:o,handleResize:n}=he(),{locale:a,t:s}=I(),c=te();function h(){e.locale={locale:"zh"},a.value="zh",t&&n(t.value)}function d(){e.locale={locale:"en"},a.value="en",t&&n(t.value)}return ne(()=>a.value,()=>{o(c.meta)}),oe(()=>{var g;a.value=((g=e.locale)==null?void 0:g.locale)??"zh"}),{t:s,route:c,locale:a,translationCh:h,translationEn:d}}const ge={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},pe=p("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),ve=[pe];function be(t,e){return k(),x("svg",ge,ve)}const Ee={render:be},$e={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Te=p("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),ye=p("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"},null,-1),Ce=[Te,ye];function Me(t,e){return k(),x("svg",$e,Ce)}const Ne={render:Me},Be={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},ke=p("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),xe=p("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981z"},null,-1),we=[ke,xe];function Ae(t,e){return k(),x("svg",Be,we)}const Ie={render:Ae};export{ze as a,_e as b,Ie as c,Ne as d,N as e,ue as f,Ee as g,ie as t,he as u};
