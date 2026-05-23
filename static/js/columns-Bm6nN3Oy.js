import{Ei as e,Oi as t,_t as n,ei as r,fs as i,gi as a,os as o,pt as s,ss as c}from"./index-DYLbQH3m.js";import{t as l}from"./data-CJME33Y5.js";var u=i({useColumns:()=>d});c();function d(){let i=t([]),c=t(!0),u=t(`no`),d=t(`nohide`),f=t(`default`),p=t(`right`),m=[{type:`selection`,align:`left`,reserveSelection:!0,hide:()=>u.value===`no`},{label:`日期`,prop:`date`,hide:()=>d.value===`hideDate`},{label:`姓名`,prop:`name`,hide:()=>d.value===`hideName`},{label:`地址`,prop:`address`,hide:()=>d.value===`hideAddress`}],h=e({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:`right`,background:!0,size:`default`}),g=e({text:`正在加载第一页...`,viewBox:`-10, -10, 50, 50`,spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function _(e){h.size=e}function v(e){}function y(e){g.text=`正在加载第${e}页...`,c.value=!0,n(600).then(()=>{c.value=!1})}return a(()=>{h.align=p.value}),r(()=>{n(600).then(()=>{let e=[];Array.from({length:6}).forEach(()=>{e.push(s(l,!0))}),e.flat(1/0).forEach((e,t)=>{i.value.push(o({id:t},e))}),h.total=i.value.length,c.value=!1})}),{loading:c,columns:m,dataList:i,select:u,hideVal:d,tableSize:f,pagination:h,loadingConfig:g,paginationAlign:p,onChange:_,onSizeChange:v,onCurrentChange:y}}export{d as n,u as t};