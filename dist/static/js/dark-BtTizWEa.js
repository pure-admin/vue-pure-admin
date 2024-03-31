var ae=Object.defineProperty;var R=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,ue=Object.prototype.propertyIsEnumerable;var D=(t,e,o)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,F=(t,e)=>{for(var o in e||(e={}))le.call(e,o)&&D(t,o,e[o]);if(R)for(var o of R(e))ue.call(e,o)&&D(t,o,e[o]);return t};import{fE as _,p as g,fH as re,fD as W,Z as Q,a as H,aw as B,fI as se,au as ce,ft as j,fJ as J,fK as ie,ai as fe,fL as de,fM as me,ac as he,fN as G,fw as ge,fC as ve,af as O,fz as pe,fO as Te,ah as be,n as ye,a3 as $e,f as E,k as z,g as S}from"./index-BOXClPvw.js";import{u as K}from"./app-XrmSSlid.js";import{u as w}from"./epTheme-Nkqi2LqT.js";import{e as Z}from"./mitt-E5P-NQ8u.js";import{u as Ce}from"./user-DNtD0Fqa.js";const Ke={width:24,height:24,body:'<path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16ZM11 7h2v2h-2V7Zm0 4h2v6h-2v-6Z"/>'};function Me(){const{$storage:t,$config:e}=_(),o=()=>{var s,T,d,m,v,f,C,M,p,y,u,r,i,h,c,$,k;re().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=W),t.locale||(t.locale={locale:(s=e==null?void 0:e.Locale)!=null?s:"zh"},Q().locale.value=(T=e==null?void 0:e.Locale)!=null?T:"zh"),t.layout||(t.layout={layout:(d=e==null?void 0:e.Layout)!=null?d:"vertical",theme:(m=e==null?void 0:e.Theme)!=null?m:"light",darkMode:(v=e==null?void 0:e.DarkMode)!=null?v:!1,sidebarStatus:(f=e==null?void 0:e.SidebarStatus)!=null?f:!0,epThemeColor:(C=e==null?void 0:e.EpThemeColor)!=null?C:"#409EFF",themeColor:(M=e==null?void 0:e.Theme)!=null?M:"light",overallStyle:(p=e==null?void 0:e.OverallStyle)!=null?p:"light"}),t.configure||(t.configure={grey:(y=e==null?void 0:e.Grey)!=null?y:!1,weak:(u=e==null?void 0:e.Weak)!=null?u:!1,hideTabs:(r=e==null?void 0:e.HideTabs)!=null?r:!1,hideFooter:(i=e.HideFooter)!=null?i:!0,showLogo:(h=e==null?void 0:e.ShowLogo)!=null?h:!0,showModel:(c=e==null?void 0:e.ShowModel)!=null?c:"smart",multiTagsCache:($=e==null?void 0:e.MultiTagsCache)!=null?$:!1,stretch:(k=e==null?void 0:e.Stretch)!=null?k:!1})},n=g(()=>t==null?void 0:t.layout.layout),l=g(()=>t.layout);return{layout:n,layoutTheme:l,initStorage:o}}const A={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/Users/zhangyi/Desktop/vue-pure-admin/node_modules/.pnpm/@pureadmin+theme@3.2.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-light",varsContent:`
        $subMenuActiveText: #000000d9 !default;
        $menuBg: #fff !default;
        $menuHover: #f6f6f6 !default;
        $subMenuBg: #fff !default;
        $subMenuActiveBg: #e0ebf6 !default;
        $menuText: rgb(0 0 0 / 60%) !default;
        $sidebarLogo: #fff !default;
        $menuTitleHover: #000 !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-default",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #001529 !default;
        $menuHover: rgb(64 145 247 / 15%) !default;
        $subMenuBg: #0f0303 !default;
        $subMenuActiveBg: #4091f7 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #002140 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-saucePurple",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #130824 !default;
        $menuHover: rgb(105 58 201 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #693ac9 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #1f0c38 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #693ac9 !default;
      `},{scopeName:"layout-theme-pink",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #28081a !default;
        $menuHover: rgb(216 68 147 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #d84493 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #3f0d29 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #d84493 !default;
      `},{scopeName:"layout-theme-dusk",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2a0608 !default;
        $menuHover: rgb(225 60 57 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #e13c39 !default;
        $menuText: rgb(254 254 254 / 65.1%) !default;
        $sidebarLogo: #42090c !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e13c39 !default;
      `},{scopeName:"layout-theme-volcano",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2b0e05 !default;
        $menuHover: rgb(232 95 51 / 15%) !default;
        $subMenuBg: #0f0603 !default;
        $subMenuActiveBg: #e85f33 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #441708 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e85f33 !default;
      `},{scopeName:"layout-theme-mingQing",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #032121 !default;
        $menuHover: rgb(89 191 193 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #59bfc1 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #053434 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #59bfc1 !default;
      `},{scopeName:"layout-theme-auroraGreen",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #0b1e15 !default;
        $menuHover: rgb(96 172 128 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #60ac80 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #112f21 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #60ac80 !default;
      `}]},ke="/vue-pure-admin/",Be="assets",X=t=>{let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e},Y=(t,e,o)=>{let n=[t.toString(16),e.toString(16),o.toString(16)];for(let l=0;l<3;l++)n[l].length==1&&(n[l]=`0${n[l]}`);return`#${n.join("")}`},Se=(t,e)=>{let o=X(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return Y(o[0],o[1],o[2])},we=(t,e)=>{let o=X(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return Y(o[0],o[1],o[2])},V=t=>`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`,q=({scopeName:t,multipleScopeVars:e})=>{const o=Array.isArray(e)&&e.length?e:A.multipleScopeVars;let n=document.documentElement.className;new RegExp(V(t)).test(n)||(o.forEach(l=>{n=n.replace(new RegExp(V(l.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))},U=({id:t,href:e})=>{const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o},xe=t=>{const e=F({scopeName:"theme-default",customLinkHref:s=>s},t),o=e.themeLinkTagId||A.themeLinkTagId;let n=document.getElementById(o);const l=e.customLinkHref(`${ke.replace(/\/$/,"")}${`/${Be}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const s=U({id:o,href:l});n.nextSibling?n.parentNode.insertBefore(s,n.nextSibling):n.parentNode.appendChild(s),s.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),q(e)};return}n=U({id:o,href:l}),q(e),document[(e.themeLinkTagInjectTo||A.themeLinkTagInjectTo||"").replace("-prepend","")].appendChild(n)};function Xe(){var p,y;const{layoutTheme:t,layout:e}=Me(),o=H([{color:"#ffffff",themeColor:"light"},{color:"#1b2a47",themeColor:"default"},{color:"#722ed1",themeColor:"saucePurple"},{color:"#eb2f96",themeColor:"pink"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"}]),{$storage:n}=_(),l=H((p=n==null?void 0:n.layout)==null?void 0:p.darkMode),s=H((y=n==null?void 0:n.layout)==null?void 0:y.overallStyle),T=document.documentElement;function d(u,r,i){const h=i||document.body;let{className:c}=h;c=c.replace(r,"").trim(),h.className=u?`${c} ${r}`:c}function m(u=(i=>(i=B().Theme)!=null?i:"light")(),r=!0){var c,$;t.value.theme=u,xe({scopeName:`layout-theme-${u}`});const h=n.layout.themeColor;if(n.layout={layout:e.value,theme:u,darkMode:l.value,sidebarStatus:(c=n.layout)==null?void 0:c.sidebarStatus,epThemeColor:($=n.layout)==null?void 0:$.epThemeColor,themeColor:r?u:h,overallStyle:s.value},u==="default"||u==="light")f(B().EpThemeColor);else{const k=o.value.find(x=>x.themeColor===u);f(k.color)}}function v(u,r,i){document.documentElement.style.setProperty(`--el-color-primary-${u}-${r}`,l.value?Se(i,r/10):we(i,r/10))}const f=u=>{w().setEpThemeColor(u),document.documentElement.style.setProperty("--el-color-primary",u);for(let r=1;r<=2;r++)v("dark",r,u);for(let r=1;r<=9;r++)v("light",r,u)};function C(u){s.value=u,w().epTheme==="light"&&l.value?m("default",!1):m(w().epTheme,!1),l.value?document.documentElement.classList.add("dark"):(n.layout.themeColor==="light"&&m("light",!1),document.documentElement.classList.remove("dark"))}function M(){se(),ce().clear();const{Grey:u,Weak:r,MultiTagsCache:i,EpThemeColor:h,Layout:c}=B();K().setLayout(c),f(h),j().multiTagsCacheChange(i),d(u,"html-grey",document.querySelector("html")),d(r,"html-weakness",document.querySelector("html")),J.push("/login"),j().handleTags("equal",[...W]),ie()}return{body:T,dataTheme:l,overallStyle:s,layoutTheme:t,themeColors:o,onReset:M,toggleClass:d,dataThemeChange:C,setEpThemeColor:f,setLayoutThemeColor:m}}const Le="当前路由配置不正确，请检查配置";function He(){var N,I;const t=K(),e=fe().options.routes,{isFullscreen:o,toggle:n}=de(),{wholeMenus:l}=me(he()),s=(I=(N=B())==null?void 0:N.TooltipEffect)!=null?I:"light",T=g(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),d=g(()=>{var a;return(a=G())==null?void 0:a.username}),m=g(()=>(a,b)=>({background:a===b?w().epThemeColor:"",color:a===b?"#f4f4f5":"#000"})),v=g(()=>(a,b)=>a===b?"":"dark:hover:!text-primary"),f=g(()=>d.value?{marginRight:"10px"}:""),C=g(()=>!t.getSidebarStatus),M=g(()=>t.getDevice),{$storage:p,$config:y}=_(),u=g(()=>{var a;return(a=p==null?void 0:p.layout)==null?void 0:a.layout}),r=g(()=>y.Title);function i(a){const b=B().Title;b?document.title=`${O(a.title)} | ${b}`:document.title=O(a.title)}function h(){G().logOut()}function c(){var a;J.push((a=pe())==null?void 0:a.path)}function $(){Z.emit("openPanel")}function k(){t.toggleSideBar()}function x(a){a==null||a.handleResize()}function ee(a){var P;if(!a.children)return console.error(Le);const b=/^http(s?):\/\//,L=(P=a.children[0])==null?void 0:P.path;return b.test(L)?a.path+"/"+L:L}function te(a){l.value.length===0||oe(a)||Z.emit("changLayoutRoute",a)}function oe(a){return Te.includes(a)}function ne(){return new URL("/vue-pure-admin/logo.svg",import.meta.url).href}return{title:r,device:M,layout:u,logout:h,routers:e,$storage:p,isFullscreen:o,Fullscreen:ge,ExitFullscreen:ve,toggle:n,backTopMenu:c,onPanel:$,getDivStyle:T,changeTitle:i,toggleSideBar:k,menuSelect:te,handleResize:x,resolvePath:ee,getLogo:ne,isCollapse:C,pureApp:t,username:d,userAvatar:Ce,avatarsStyle:f,tooltipEffect:s,getDropdownItemStyle:m,getDropdownItemClass:v}}function Ye(t){const{$storage:e,changeTitle:o,handleResize:n}=He(),{locale:l,t:s}=Q(),T=be();function d(){e.locale={locale:"zh"},l.value="zh",t&&n(t.value)}function m(){e.locale={locale:"en"},l.value="en",t&&n(t.value)}return ye(()=>l.value,()=>{o(T.meta)}),$e(()=>{var v,f;l.value=(f=(v=e.locale)==null?void 0:v.locale)!=null?f:"zh"}),{t:s,route:T,locale:l,translationCh:d,translationEn:m}}const Ae={xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em","aria-hidden":"true",class:"globalization",viewBox:"0 0 512 512"},_e=S("path",{fill:"currentColor",d:"m478.33 433.6-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362 368 281.65 401.17 362zm-66.99-19.08a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"},null,-1),Ee=[_e];function ze(t,e){return E(),z("svg",Ae,[...Ee])}const et={render:ze},Ne={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Ie=S("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Pe=S("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"},null,-1),Re=[Ie,Pe];function De(t,e){return E(),z("svg",Ne,[...Re])}const tt={render:De},Fe={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},je=S("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Ge=S("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981"},null,-1),Oe=[je,Ge];function Ze(t,e){return E(),z("svg",Fe,[...Oe])}const ot={render:Ze};export{Ye as a,Xe as b,tt as c,Ke as d,ot as e,Me as f,et as g,xe as t,He as u};
