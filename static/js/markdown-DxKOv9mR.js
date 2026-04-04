import{$ as e,A as t,O as n,S as r,St as i,Y as a,k as o,qt as s,ut as c,x as l}from"./vue.runtime.esm-bundler-7ocrn71d.js";import{n as u,t as d}from"./objectSpread2-Ct4-21PI.js";import{t as f}from"./Vditor-An7KKUzR.js";u();var p={class:`card-header`},m={class:`font-medium`},h={class:`mb-2!`},g={class:`text-red-500`},_=t(d(d({},{name:`Markdown`}),{},{__name:`index`,setup(t){let u=i(`
\`\`\`ts
function sayHello(): void {
	console.log("Hello, World!");
}
sayHello();
\`\`\`
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
`);return(t,i)=>{let d=e(`el-link`),_=e(`el-card`);return a(),r(_,{shadow:`never`},{header:c(()=>[l(`div`,p,[l(`span`,m,[i[2]||(i[2]=n(` Markdown组件，采用开源的 `,-1)),o(d,{href:`https://b3log.org/vditor/`,target:`_blank`,style:{margin:`0 4px 5px`,"font-size":`16px`}},{default:c(()=>[...i[1]||(i[1]=[n(` Vditor `,-1)])]),_:1})])]),o(d,{class:`mt-2`,href:`https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/markdown`,target:`_blank`},{default:c(()=>[...i[3]||(i[3]=[n(` 代码位置 src/views/markdown `,-1)])]),_:1})]),default:c(()=>[l(`h1`,h,[i[4]||(i[4]=n(` 双向绑定：`,-1)),l(`span`,g,s(u.value),1)]),o(f,{modelValue:u.value,"onUpdate:modelValue":i[0]||(i[0]=e=>u.value=e),options:{height:560,outline:{enable:!0,position:`right`}}},null,8,[`modelValue`])]),_:1})}}}));export{_ as default};