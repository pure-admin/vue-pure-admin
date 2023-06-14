import{t as h}from"./data-f4df056d.js";import{r as s,ai as l,k as d,aD as r,H as m}from"./index-0b3c812b.js";function C(){const e=s([]),a=s(!0),i=[{label:"日期",prop:"date"},{label:"姓名",prop:"name"},{label:"地址",prop:"address"}],n=l({pageSize:20,currentPage:1,pageSizes:[20,40,60],total:0,align:"right",background:!0,small:!1}),o=l({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `}),u={offsetBottom:110};function f(t){}function p(t){o.text=`正在加载第${t}页...`,a.value=!0,r(600).then(()=>{a.value=!1})}return d(()=>{r(600).then(()=>{const t=[];Array.from({length:6}).forEach(()=>{t.push(m(h,!0))}),t.flat(1/0).forEach((c,g)=>{e.value.push({id:g,...c})}),n.total=e.value.length,a.value=!1})}),{loading:a,columns:i,dataList:e,pagination:n,loadingConfig:o,adaptiveConfig:u,onSizeChange:f,onCurrentChange:p}}export{C as useColumns};
