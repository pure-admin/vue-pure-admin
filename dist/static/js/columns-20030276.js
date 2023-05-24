import{t as m}from"./data-9ed8da17.js";import{r as e,ag as r,aX as v,a as b,aA as u,J as A}from"./index-4d06789b.js";function S(){const o=e([]),t=e(!0),n=e("nohide"),f=e("default"),h=e(!1),s=e("right"),c=[{label:"日期",prop:"date",hide:()=>n.value==="hideDate"},{label:"姓名",prop:"name",hide:()=>n.value==="hideName"},{label:"地址",prop:"address",hide:()=>n.value==="hideAddress"}],l=r({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0,small:!1}),i=r({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function g(a){l.small=a}function d(a){}function p(a){i.text=`正在加载第${a}页...`,t.value=!0,u(600).then(()=>{t.value=!1})}return v(()=>{l.align=s.value}),b(()=>{u(600).then(()=>{const a=[];Array.from({length:6}).forEach(()=>{a.push(A(m,!0))}),o.value=a.flat(1/0),l.total=o.value.length,t.value=!1})}),{loading:t,columns:c,dataList:o,hideVal:n,tableSize:f,pagination:l,loadingConfig:i,paginationAlign:s,paginationSmall:h,onChange:g,onSizeChange:d,onCurrentChange:p}}export{S as useColumns};
