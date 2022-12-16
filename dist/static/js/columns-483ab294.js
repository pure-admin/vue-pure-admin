import{t as g}from"./data-cc5c031c.js";import{ae as r,b as p}from"./index-1d030a9b.js";function V(){const l=Vue.ref([]),a=Vue.ref(!0),t=Vue.ref("nohide"),u=Vue.ref("default"),s=Vue.ref(!1),o=Vue.ref("right"),f=[{label:"\u65E5\u671F",prop:"date",hide:()=>t.value==="hideDate"},{label:"\u59D3\u540D",prop:"name",hide:()=>t.value==="hideName"},{label:"\u5730\u5740",prop:"address",hide:()=>t.value==="hideAddress"}],n=Vue.reactive({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0,small:!1}),i=Vue.reactive({text:"\u6B63\u5728\u52A0\u8F7D\u7B2C\u4E00\u9875...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function c(e){n.small=e}function h(e){}function d(e){i.text=`\u6B63\u5728\u52A0\u8F7D\u7B2C${e}\u9875...`,a.value=!0,r(600).then(()=>{a.value=!1})}return Vue.watchEffect(()=>{n.align=o.value}),Vue.onMounted(()=>{r(600).then(()=>{const e=[];Array.from({length:6}).forEach(()=>{e.push(p(g,!0))}),l.value=e.flat(1/0),n.total=l.value.length,a.value=!1})}),{loading:a,columns:f,dataList:l,hideVal:t,tableSize:u,pagination:n,loadingConfig:i,paginationAlign:o,paginationSmall:s,onChange:c,onSizeChange:h,onCurrentChange:d}}export{V as useColumns};
