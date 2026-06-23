import{r as e}from"./rolldown-runtime-DMcso9tT.js";import{K as t,St as n,bt as r,lt as i}from"./vue.runtime.esm-bundler-tJfJiBfC.js";import{aa as a,dt as o,ht as s,oa as c}from"./index-ClyXQiAs.js";import{t as l}from"./data-DVgARcuh.js";var u=e({useColumns:()=>d});c();function d(){let e=n([]),c=n(!0),u=n(`no`),d=n(`nohide`),f=n(`default`),p=n(`right`),m=[{type:`selection`,align:`left`,reserveSelection:!0,hide:()=>u.value===`no`},{label:`日期`,prop:`date`,hide:()=>d.value===`hideDate`},{label:`姓名`,prop:`name`,hide:()=>d.value===`hideName`},{label:`地址`,prop:`address`,hide:()=>d.value===`hideAddress`}],h=r({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:`right`,background:!0,size:`default`}),g=r({text:`正在加载第一页...`,viewBox:`-10, -10, 50, 50`,spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function _(e){h.size=e}function v(e){}function y(e){g.text=`正在加载第${e}页...`,c.value=!0,s(600).then(()=>{c.value=!1})}return i(()=>{h.align=p.value}),t(()=>{s(600).then(()=>{let t=[];Array.from({length:6}).forEach(()=>{t.push(o(l,!0))}),t.flat(1/0).forEach((t,n)=>{e.value.push(a({id:n},t))}),h.total=e.value.length,c.value=!1})}),{loading:c,columns:m,dataList:e,select:u,hideVal:d,tableSize:f,pagination:h,loadingConfig:g,paginationAlign:p,onChange:_,onSizeChange:v,onCurrentChange:y}}export{d as n,u as t};