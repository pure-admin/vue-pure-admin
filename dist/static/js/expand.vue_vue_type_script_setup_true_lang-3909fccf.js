import{c as _}from"./data-9af24e22.js";import{d as b,r,a as c,o as h,i as f,f as i,h as l,w as v,e as a,t as s,u as x}from"./index-42b0cfe4.js";const V={class:"m-4"},y={class:"mb-2"},C={class:"mb-2"},B={class:"mb-2"},N={class:"mb-4"},S=a("h3",null,"Family",-1),D=b({__name:"expand",setup(k){const o=r(!1),d=r(!1),m=[{type:"expand",slot:"expand"},{label:"日期",prop:"date"},{label:"姓名",prop:"name"}],u=[{label:"Name",prop:"name"},{label:"State",prop:"state"},{label:"City",prop:"city"},{label:"Address",prop:"address"},{label:"Zip",prop:"zip"}];return(w,t)=>{const n=c("el-switch"),p=c("pure-table");return h(),f("div",null,[i(" switch parent border: "),l(n,{modelValue:o.value,"onUpdate:modelValue":t[0]||(t[0]=e=>o.value=e)},null,8,["modelValue"]),i(" switch child border: "),l(n,{modelValue:d.value,"onUpdate:modelValue":t[1]||(t[1]=e=>d.value=e)},null,8,["modelValue"]),l(p,{data:x(_),columns:m,border:o.value},{expand:v(({row:e})=>[a("div",V,[a("p",y,"State: "+s(e.state),1),a("p",C,"City: "+s(e.city),1),a("p",B,"Address: "+s(e.address),1),a("p",N,"Zip: "+s(e.zip),1),S,l(p,{data:e.family,columns:u,border:d.value},null,8,["data","border"])])]),_:1},8,["data","border"])])}}});export{D as _};