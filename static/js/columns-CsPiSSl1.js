import{K as e,St as t,bt as n,lt as r}from"./vue.runtime.esm-bundler-7ocrn71d.js";import{n as i,t as a}from"./objectSpread2-Ct4-21PI.js";import{f as o,s}from"./dist-Cnc1TxCH.js";import{t as c}from"./data-DVDkOd1J.js";i();function l(){let i=t([]),l=t(!0),u=t(`no`),d=t(`nohide`),f=t(`default`),p=t(`right`),m=[{type:`selection`,align:`left`,reserveSelection:!0,hide:()=>u.value===`no`},{label:`日期`,prop:`date`,hide:()=>d.value===`hideDate`},{label:`姓名`,prop:`name`,hide:()=>d.value===`hideName`},{label:`地址`,prop:`address`,hide:()=>d.value===`hideAddress`}],h=n({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:`right`,background:!0,size:`default`}),g=n({text:`正在加载第一页...`,viewBox:`-10, -10, 50, 50`,spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function _(e){h.size=e}function v(e){}function y(e){g.text=`正在加载第${e}页...`,l.value=!0,o(600).then(()=>{l.value=!1})}return r(()=>{h.align=p.value}),e(()=>{o(600).then(()=>{let e=[];Array.from({length:6}).forEach(()=>{e.push(s(c,!0))}),e.flat(1/0).forEach((e,t)=>{i.value.push(a({id:t},e))}),h.total=i.value.length,l.value=!1})}),{loading:l,columns:m,dataList:i,select:u,hideVal:d,tableSize:f,pagination:h,loadingConfig:g,paginationAlign:p,onChange:_,onSizeChange:v,onCurrentChange:y}}export{l as t};