import{K as e,St as t,bt as n}from"./vue.runtime.esm-bundler-7ocrn71d.js";import{n as r,t as i}from"./objectSpread2-Ct4-21PI.js";import{f as a,s as o}from"./dist-Cnc1TxCH.js";import{t as s}from"./data-DVDkOd1J.js";r();function c(){let r=t([]),c=t(!0),l=[{label:`日期`,prop:`date`},{label:`姓名`,prop:`name`},{label:`地址`,prop:`address`}],u=n({pageSize:20,currentPage:1,pageSizes:[20,40,60],total:0,align:`right`,background:!0,size:`default`}),d=n({text:`正在加载第一页...`,viewBox:`-10, -10, 50, 50`,spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `}),f={offsetBottom:110};function p(e){}function m(e){d.text=`正在加载第${e}页...`,c.value=!0,a(600).then(()=>{c.value=!1})}return e(()=>{a(600).then(()=>{let e=[];Array.from({length:6}).forEach(()=>{e.push(o(s,!0))}),e.flat(1/0).forEach((e,t)=>{r.value.push(i({id:t},e))}),u.total=r.value.length,c.value=!1})}),{loading:c,columns:l,dataList:r,pagination:u,loadingConfig:d,adaptiveConfig:f,onSizeChange:p,onCurrentChange:m}}export{c as t};