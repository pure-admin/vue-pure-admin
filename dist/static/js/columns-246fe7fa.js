import{t as c}from"./data-e9fe60c1.js";import{ap as l,n as g}from"./index-4b813511.js";function h(){const a=Vue.ref([]),t=Vue.ref(!0),o=Vue.ref("right"),i=[{label:"\u65E5\u671F",prop:"date"},{label:"\u59D3\u540D",prop:"name"},{label:"\u5730\u5740",prop:"address"}],n=Vue.reactive({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0}),r=Vue.reactive({text:"\u6B63\u5728\u52A0\u8F7D\u7B2C\u4E00\u9875...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function u(e){}function s(e){r.text=`\u6B63\u5728\u52A0\u8F7D\u7B2C${e}\u9875...`,t.value=!0,l(600).then(()=>{t.value=!1})}return Vue.watchEffect(()=>{n.align=o.value}),Vue.onMounted(()=>{l(600).then(()=>{const e=[];Array.from({length:6}).forEach(()=>{e.push(g(c,!0))}),a.value=e.flat(1/0),n.total=a.value.length,t.value=!1})}),{loading:t,columns:i,dataList:a,pagination:n,loadingConfig:r,paginationAlign:o,onSizeChange:u,onCurrentChange:s}}export{h as useColumns};
