import{d as C,r as V,c as y,w as b,b as _,g as B,h as a,i as t,t as L,j as e,u as o,N as d,s as N}from"./index-OPODCVBK.js";import{d as m}from"./home-filled-ZzezfvKu.js";import{u as p}from"./hooks-1h8d6Jpv.js";import{R as s}from"./index-cDkY2umO.js";const E=a("div",{class:"card-header"},[a("span",{class:"font-medium"},"分段控制器")],-1),I={class:"mb-2"},R={class:"text-primary"},S=a("p",{class:"mb-2"},"禁用",-1),W=a("p",{class:"mb-2"},"设置图标",-1),$=a("p",{class:"mb-2"},"只设置图标",-1),k=a("p",{class:"mb-2"},"自定义渲染",-1),D=a("p",{class:"mb-2"},"change事件",-1),A=C({name:"Segmented",__name:"index",setup(O){const i=V(4),r=[{label:"周一"},{label:"周二"},{label:"周三"},{label:"周四"},{label:"周五"}],h=[{label:"周一"},{label:"周二"},{label:"周三",disabled:!0},{label:"周四"},{label:"周五",disabled:!0}],v=[{label:"周一",icon:m},{label:"周二"},{label:"周三",icon:"terminalWindowLine"},{label:"周四",icon:"streamline-emojis:airplane"},{label:"周五",icon:"streamline-emojis:2"}],f=[{icon:m},{icon:"terminalWindowLine"},{icon:"streamline-emojis:cow-face"},{icon:"streamline-emojis:airplane"},{icon:"streamline-emojis:2"}],x=[{label:()=>e("div",null,[d(p(m),{class:"m-auto w-[20px] h-[20px]"}),e("p",null,[t("周一")])])},{label:()=>e("div",null,[d(p("terminalWindowLine"),{class:"m-auto w-[20px] h-[20px]"}),e("p",null,[t("周二")])])},{label:()=>e("div",null,[d(p("streamline-emojis:cow-face"),{class:"m-auto w-[20px] h-[20px]"}),e("p",null,[t("周三")])])}],w=[{label:"周一",value:1},{label:"周二",value:2},{label:"周三",value:3}];function g({index:u,option:n}){const{label:l,value:c}=n;N(`当前选中项索引为：${u}，名字为${l}，值为${c}`,{type:"success"})}return(u,n)=>{const l=_("el-divider"),c=_("el-card");return B(),y(c,{shadow:"never"},{header:b(()=>[E]),default:b(()=>[a("p",I,[t(" 基础用法（v-model）"),a("span",R,L(r[i.value].label),1)]),e(o(s),{modelValue:i.value,"onUpdate:modelValue":n[0]||(n[0]=j=>i.value=j),options:r},null,8,["modelValue"]),e(l),S,e(o(s),{options:h}),e(l),W,e(o(s),{options:v}),e(l),$,e(o(s),{options:f}),e(l),k,e(o(s),{options:x}),e(l),D,e(o(s),{options:w,onChange:g})]),_:1})}}});export{A as default};