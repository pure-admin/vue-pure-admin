import{useColumns as r}from"./columns-e5493833.js";const p=Vue.defineComponent({__name:"index",setup(c){const{columns:e,dataList:o,exportExcel:t}=r();return(l,a)=>{const n=Vue.resolveComponent("el-button"),u=Vue.resolveComponent("pure-table");return Vue.openBlock(),Vue.createElementBlock("div",null,[Vue.createVNode(n,{type:"primary",onClick:Vue.unref(t),class:"mb-[20px] float-right"},{default:Vue.withCtx(()=>[Vue.createTextVNode(" 导出 ")]),_:1},8,["onClick"]),Vue.createVNode(u,{"row-key":"id",border:"",data:Vue.unref(o),columns:Vue.unref(e)},null,8,["data","columns"])])}}});export{p as _};