var v=Object.defineProperty;var s=Object.getOwnPropertySymbols;var b=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var l=(e,t,a)=>t in e?v(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,i=(e,t)=>{for(var a in t||(t={}))b.call(t,a)&&l(e,a,t[a]);if(s)for(var a of s(t))C.call(t,a)&&l(e,a,t[a]);return e};import{t as x}from"./data-EFikKXxQ.js";import{a as u,r as f,m as z,aP as p,a6 as L}from"./index-B0Z6rV6K.js";function A(){const e=u([]),t=u(!0),a=[{label:"日期",prop:"date"},{label:"姓名",prop:"name"},{label:"地址",prop:"address"}],o=f({pageSize:20,currentPage:1,pageSizes:[20,40,60],total:0,align:"right",background:!0,size:"default"}),r=f({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `}),c={offsetBottom:110};function g(n){}function h(n){r.text=`正在加载第${n}页...`,t.value=!0,p(600).then(()=>{t.value=!1})}return z(()=>{p(600).then(()=>{const n=[];Array.from({length:6}).forEach(()=>{n.push(L(x,!0))}),n.flat(1/0).forEach((d,m)=>{e.value.push(i({id:m},d))}),o.total=e.value.length,t.value=!1})}),{loading:t,columns:a,dataList:e,pagination:o,loadingConfig:r,adaptiveConfig:c,onSizeChange:g,onCurrentChange:h}}export{A as useColumns};
