import{Ei as e,Oi as t,_t as n,ei as r,fs as i,os as a,pt as o,ss as s}from"./index-DYLbQH3m.js";import{t as c}from"./data-CJME33Y5.js";var l=i({useColumns:()=>u});s();function u(){let i=t([]),s=t(!0),l=[{label:`日期`,prop:`date`},{label:`姓名`,prop:`name`},{label:`地址`,prop:`address`}],u=e({pageSize:20,currentPage:1,pageSizes:[20,40,60],total:0,align:`right`,background:!0,size:`default`}),d=e({text:`正在加载第一页...`,viewBox:`-10, -10, 50, 50`,spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `}),f={offsetBottom:110};function p(e){}function m(e){d.text=`正在加载第${e}页...`,s.value=!0,n(600).then(()=>{s.value=!1})}return r(()=>{n(600).then(()=>{let e=[];Array.from({length:6}).forEach(()=>{e.push(o(c,!0))}),e.flat(1/0).forEach((e,t)=>{i.value.push(a({id:t},e))}),u.total=i.value.length,s.value=!1})}),{loading:s,columns:l,dataList:i,pagination:u,loadingConfig:d,adaptiveConfig:f,onSizeChange:p,onCurrentChange:m}}export{u as n,l as t};