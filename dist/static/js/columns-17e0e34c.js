import{t as g}from"./data-11b60b52.js";import{I as r,d as p}from"./index-8c77f9cd.js";function V(){const l=Vue.ref([]),a=Vue.ref(!0),t=Vue.ref("nohide"),u=Vue.ref("default"),s=Vue.ref(!1),o=Vue.ref("right"),f=[{label:"日期",prop:"date",hide:()=>t.value==="hideDate"},{label:"姓名",prop:"name",hide:()=>t.value==="hideName"},{label:"地址",prop:"address",hide:()=>t.value==="hideAddress"}],n=Vue.reactive({pageSize:10,currentPage:1,pageSizes:[10,15,20],total:0,align:"right",background:!0,small:!1}),i=Vue.reactive({text:"正在加载第一页...",viewBox:"-10, -10, 50, 50",spinner:`
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `});function c(e){n.small=e}function h(e){}function d(e){i.text=`正在加载第${e}页...`,a.value=!0,r(600).then(()=>{a.value=!1})}return Vue.watchEffect(()=>{n.align=o.value}),Vue.onMounted(()=>{r(600).then(()=>{const e=[];Array.from({length:6}).forEach(()=>{e.push(p(g,!0))}),l.value=e.flat(1/0),n.total=l.value.length,a.value=!1})}),{loading:a,columns:f,dataList:l,hideVal:t,tableSize:u,pagination:n,loadingConfig:i,paginationAlign:o,paginationSmall:s,onChange:c,onSizeChange:h,onCurrentChange:d}}export{V as useColumns};
