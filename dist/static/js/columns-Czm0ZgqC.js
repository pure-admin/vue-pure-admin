var v=Object.defineProperty;var l=Object.getOwnPropertySymbols;var C=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var r=(e,a,t)=>a in e?v(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,i=(e,a)=>{for(var t in a||(a={}))C.call(a,t)&&r(e,t,a[t]);if(l)for(var t of l(a))b.call(a,t)&&r(e,t,a[t]);return e};import{t as x}from"./data-4R3p4wXg.js";import{a as u,r as f,m as L,d2 as p,a9 as w}from"./index-CiYMlfUr.js";function M(){const e=u([]),a=u(!0),t=[{label:"日期",prop:"date"},{label:"姓名",prop:"name"},{label:"地址",prop:"address"}],o=f({pageSize:20,currentPage:1,pageSizes:[20,40,60],total:0,align:"right",background:!0,small:!1}),s=f({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `}),c={offsetBottom:110};function g(n){}function h(n){s.text=`正在加载第${n}页...`,a.value=!0,p(600).then(()=>{a.value=!1})}return L(()=>{p(600).then(()=>{const n=[];Array.from({length:6}).forEach(()=>{n.push(w(x))}),n.flat(1/0).forEach((d,m)=>{e.value.push(i({id:m},d))}),o.total=e.value.length,a.value=!1})}),{loading:a,columns:t,dataList:e,pagination:o,loadingConfig:s,adaptiveConfig:c,onSizeChange:g,onCurrentChange:h}}export{M as useColumns};
