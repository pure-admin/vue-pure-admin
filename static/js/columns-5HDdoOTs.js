var S=Object.defineProperty;var u=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var c=(a,e,t)=>e in a?S(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,h=(a,e)=>{for(var t in e||(e={}))x.call(e,t)&&c(a,t,e[t]);if(u)for(var t of u(e))A.call(e,t)&&c(a,t,e[t]);return a};import{t as w}from"./data-B7TqVcoE.js";import{M as y,m as L,aS as f,a8 as M,l,r as d}from"./index-ChQ6eMdI.js";function B(){const a=l([]),e=l(!0),t=l("no"),o=l("nohide"),g=l("default"),s=l("right"),p=[{type:"selection",align:"left",reserveSelection:!0,hide:()=>t.value==="no"},{label:"日期",prop:"date",hide:()=>o.value==="hideDate"},{label:"姓名",prop:"name",hide:()=>o.value==="hideName"},{label:"地址",prop:"address",hide:()=>o.value==="hideAddress"}],i=d({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0,size:"default"}),r=d({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function v(n){i.size=n}function m(n){}function b(n){r.text=`正在加载第${n}页...`,e.value=!0,f(600).then(()=>{e.value=!1})}return y(()=>{i.align=s.value}),L(()=>{f(600).then(()=>{const n=[];Array.from({length:6}).forEach(()=>{n.push(M(w,!0))}),n.flat(1/0).forEach((z,C)=>{a.value.push(h({id:C},z))}),i.total=a.value.length,e.value=!1})}),{loading:e,columns:p,dataList:a,select:t,hideVal:o,tableSize:g,pagination:i,loadingConfig:r,paginationAlign:s,onChange:v,onSizeChange:m,onCurrentChange:b}}export{B as useColumns};
