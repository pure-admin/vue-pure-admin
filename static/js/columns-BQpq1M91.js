var x=Object.defineProperty;var u=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var c=(t,e,a)=>e in t?x(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a,h=(t,e)=>{for(var a in e||(e={}))A.call(e,a)&&c(t,a,e[a]);if(u)for(var a of u(e))S.call(e,a)&&c(t,a,e[a]);return t};import{t as w}from"./data-EFikKXxQ.js";import{a as l,r as f,N as y,m as L,aP as d,a6 as k}from"./index-B0Z6rV6K.js";function N(){const t=l([]),e=l(!0),a=l("no"),o=l("nohide"),g=l("default"),s=l("right"),p=[{type:"selection",align:"left",reserveSelection:!0,hide:()=>a.value==="no"},{label:"日期",prop:"date",hide:()=>o.value==="hideDate"},{label:"姓名",prop:"name",hide:()=>o.value==="hideName"},{label:"地址",prop:"address",hide:()=>o.value==="hideAddress"}],i=f({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0,size:"default"}),r=f({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function v(n){i.size=n}function m(n){}function b(n){r.text=`正在加载第${n}页...`,e.value=!0,d(600).then(()=>{e.value=!1})}return y(()=>{i.align=s.value}),L(()=>{d(600).then(()=>{const n=[];Array.from({length:6}).forEach(()=>{n.push(k(w,!0))}),n.flat(1/0).forEach((z,C)=>{t.value.push(h({id:C},z))}),i.total=t.value.length,e.value=!1})}),{loading:e,columns:p,dataList:t,select:a,hideVal:o,tableSize:g,pagination:i,loadingConfig:r,paginationAlign:s,onChange:v,onSizeChange:m,onCurrentChange:b}}export{N as useColumns};
