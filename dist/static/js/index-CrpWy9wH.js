var X=Object.defineProperty;var y=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var o=(l,s,t)=>s in l?X(l,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[s]=t,R=(l,s)=>{for(var t in s||(s={}))p.call(s,t)&&o(l,t,s[t]);if(y)for(var t of y(s))C.call(s,t)&&o(l,t,s[t]);return l};import{u as S}from"./hooks-BrA6Nm13.js";import{d as A,r as d,as as L,$ as q,d5 as k,R as z,c_ as B,w as N,m as r,q as f,z as _,v as T,ae as M,M as V,X as W}from"./index-DftJury9.js";const j={options:{type:Array,default:()=>[]},modelValue:{type:void 0,require:!1,default:"0"},block:{type:Boolean,default:!1}},E=A({name:"ReSegmented",props:j,emits:["change","update:modelValue"],setup(l,{emit:s}){const t=d(0),b=d(0),{isDark:g}=L(),i=d(!1),c=d(-1),m=d(""),v=q(),n=k(l.modelValue)?z(l,"modelValue"):d(0);function D({option:e,index:a},u){e.disabled||(u.preventDefault(),k(l.modelValue)?s("update:modelValue",a):n.value=a,m.value="",s("change",{index:a,option:e}))}function I({option:e,index:a},u){u.preventDefault(),c.value=a,e.disabled||n.value===a?m.value="":m.value=g.value?"#1f1f1f":"rgba(0, 0, 0, 0.06)"}function $(e,a){a.preventDefault(),c.value=-1}function h(e=n.value){f(()=>{var u;const a=(u=v==null?void 0:v.proxy)==null?void 0:u.$refs[`labelRef${e}`];t.value=a.clientWidth,b.value=a.offsetLeft,i.value=!0})}l.block&&B(".pure-segmented",()=>{f(()=>{h(n.value)})}),N(()=>n.value,e=>{f(()=>{h(e)})},{deep:!0,immediate:!0});const w=()=>l.options.map((e,a)=>r("label",{ref:`labelRef${a}`,class:["pure-segmented-item",(e==null?void 0:e.disabled)&&"pure-segmented-item-disabled"],style:{background:c.value===a?m.value:"",color:!e.disabled&&(n.value===a||c.value===a)?g.value?"rgba(255, 255, 255, 0.85)":"rgba(0,0,0,.88)":""},onMouseenter:u=>I({option:e,index:a},u),onMouseleave:u=>$({option:e,index:a},u),onClick:u=>D({option:e,index:a},u)},[r("input",{type:"radio",name:"segmented"},null),_(r("div",{class:"pure-segmented-item-label"},[e.icon&&!M(e.label)?r("span",{class:"pure-segmented-item-icon",style:{marginRight:e.label?"6px":0}},[V(S(e.icon,R({},e==null?void 0:e.iconAttrs)))]):null,e.label?M(e.label)?V(e.label):r("span",null,[e.label]):null]),[[T("tippy"),{content:e==null?void 0:e.tip,zIndex:41e3}]])]));return()=>r("div",{class:["pure-segmented",l.block?"pure-segmented-block":""]},[r("div",{class:"pure-segmented-group"},[r("div",{class:"pure-segmented-item-selected",style:{width:`${t.value}px`,transform:`translateX(${b.value}px)`,display:i.value?"block":"none"}},null),w()])])}}),J=W(E);export{J as R};