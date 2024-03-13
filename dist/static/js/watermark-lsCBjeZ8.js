import{d as W,r as v,g as f,o as y,n as L,a as B,c as N,w as o,b as s,e as U,f as d,h as a,i as l,u as r}from"./index-rTCDY4Cw.js";const F={class:"card-header"},M={class:"font-medium"},T=d("span",null," 请输入要创建水印的值：",-1),z=d("span",null,"请选择要创建水印的颜色：",-1),j=W({name:"WaterMark",__name:"watermark",setup(A){const _=v(),k=v(),c=v("#409EFF"),u=v("vue-pure-admin"),{setWatermark:i,clear:g}=f(),{setWatermark:p,clear:w}=f(_),{setWatermark:C}=f(k);return y(()=>{L(()=>{C("无法删除的水印",{forever:!0,width:180,height:70})})}),B(()=>{g()}),(E,e)=>{const h=s("el-link"),x=s("el-input"),V=s("el-color-picker"),m=s("el-space"),n=s("el-button"),b=s("el-divider"),$=s("el-card");return U(),N($,{shadow:"never"},{header:o(()=>[d("div",F,[d("span",M,[a(" 页面水印 "),l(h,{href:"https://pure-admin-utils.netlify.app/hooks/useWatermark/useWatermark",target:"_blank",style:{margin:"0 5px 4px 0","font-size":"16px"}},{default:o(()=>[a(" （查看更详细的使用文档） ")]),_:1})])])]),default:o(()=>[l(m,{wrap:"",class:"!mb-2"},{default:o(()=>[T,l(x,{modelValue:u.value,"onUpdate:modelValue":e[0]||(e[0]=t=>u.value=t),class:"mr-4",style:{width:"200px"},clearable:""},null,8,["modelValue"]),z,l(V,{modelValue:c.value,"onUpdate:modelValue":e[1]||(e[1]=t=>c.value=t),"show-alpha":""},null,8,["modelValue"])]),_:1}),l(m,{wrap:""},{default:o(()=>[l(n,{plain:"",onClick:e[2]||(e[2]=t=>r(i)(u.value,{color:c.value}))},{default:o(()=>[a(" 创建整页水印 ")]),_:1}),l(n,{plain:"",onClick:e[3]||(e[3]=t=>r(i)(u.value,{gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}]}))},{default:o(()=>[a(" 创建整页渐变水印 ")]),_:1}),l(n,{plain:"",onClick:e[4]||(e[4]=t=>r(i)(u.value,{rotate:0,gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}]}))},{default:o(()=>[a(" 创建整页渐变且水平90度的水印 ")]),_:1}),l(n,{plain:"",onClick:e[5]||(e[5]=t=>r(i)(u.value,{gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}],shadowConfig:[20]}))},{default:o(()=>[a(" 创建整页渐变且有阴影的水印 ")]),_:1}),l(n,{plain:"",onClick:e[6]||(e[6]=t=>r(i)(u.value,{globalAlpha:.15,gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}]}))},{default:o(()=>[a(" 创建整页高透明渐变水印 ")]),_:1}),l(n,{plain:"",onClick:r(g)},{default:o(()=>[a("清除整页水印")]),_:1},8,["onClick"])]),_:1}),l(b),d("div",{ref_key:"local",ref:_,class:"w-1/2 h-[200px] border border-sky-500"},null,512),l(m,{wrap:"",class:"mt-6"},{default:o(()=>[l(n,{plain:"",onClick:e[7]||(e[7]=t=>r(p)("局部水印",{color:c.value,width:140,height:65}))},{default:o(()=>[a(" 创建局部水印 ")]),_:1}),l(n,{plain:"",onClick:e[8]||(e[8]=t=>r(p)("局部水印",{width:140,height:65,gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}]}))},{default:o(()=>[a(" 创建局部渐变水印 ")]),_:1}),l(n,{plain:"",onClick:e[9]||(e[9]=t=>r(p)("局部水印",{width:140,height:65,rotate:0,gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}]}))},{default:o(()=>[a(" 创建局部渐变且水平90度的水印 ")]),_:1}),l(n,{plain:"",onClick:e[10]||(e[10]=t=>r(p)("局部水印",{width:140,height:65,gradient:[{value:0,color:"magenta"},{value:.5,color:"blue"},{value:1,color:"red"}],shadowConfig:[20]}))},{default:o(()=>[a(" 创建局部渐变且有阴影的水印 ")]),_:1}),l(n,{plain:"",onClick:r(w)},{default:o(()=>[a("清除局部水印")]),_:1},8,["onClick"])]),_:1}),l(b),d("div",{ref_key:"preventLocal",ref:k,class:"w-1/2 h-[200px] border border-indigo-500"},null,512)]),_:1})}}});export{j as default};