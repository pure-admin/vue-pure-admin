import{t as h}from"./data2.js";import{r as l,al as s,a as d,aB as r,K as m}from"./index.js";function C(){const e=l([]),t=l(!0),i=[{label:"日期",prop:"date"},{label:"姓名",prop:"name"},{label:"地址",prop:"address"}],n=s({pageSize:20,currentPage:1,pageSizes:[20,40,60],total:0,align:"right",background:!0,small:!1}),o=s({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `}),u={offsetBottom:110};function f(a){}function p(a){o.text=`正在加载第${a}页...`,t.value=!0,r(600).then(()=>{t.value=!1})}return d(()=>{r(600).then(()=>{const a=[];Array.from({length:6}).forEach(()=>{a.push(m(h,!0))}),a.flat(1/0).forEach((c,g)=>{e.value.push({id:g,...c})}),n.total=e.value.length,t.value=!1})}),{loading:t,columns:i,dataList:e,pagination:n,loadingConfig:o,adaptiveConfig:u,onSizeChange:f,onCurrentChange:p}}export{C as useColumns};
