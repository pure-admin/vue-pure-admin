import{t as C}from"./data-f4df056d.js";import{r as a,ai as u,aZ as S,k as x,aD as c,H as A}from"./index-0b3c812b.js";function y(){const o=a([]),t=a(!0),s=a("no"),n=a("nohide"),f=a("default"),h=a(!1),i=a("right"),d=[{type:"selection",align:"left",reserveSelection:!0,hide:()=>s.value==="no"},{label:"日期",prop:"date",hide:()=>n.value==="hideDate"},{label:"姓名",prop:"name",hide:()=>n.value==="hideName"},{label:"地址",prop:"address",hide:()=>n.value==="hideAddress"}],l=u({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0,small:!1}),r=u({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function g(e){l.small=e}function p(e){}function v(e){r.text=`正在加载第${e}页...`,t.value=!0,c(600).then(()=>{t.value=!1})}return S(()=>{l.align=i.value}),x(()=>{c(600).then(()=>{const e=[];Array.from({length:6}).forEach(()=>{e.push(A(C,!0))}),e.flat(1/0).forEach((m,b)=>{o.value.push({id:b,...m})}),l.total=o.value.length,t.value=!1})}),{loading:t,columns:d,dataList:o,select:s,hideVal:n,tableSize:f,pagination:l,loadingConfig:r,paginationAlign:i,paginationSmall:h,onChange:g,onSizeChange:p,onCurrentChange:v}}export{y as useColumns};
