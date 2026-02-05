import{_ as m}from"./Vditor.vue_vue_type_script_setup_true_lang-DVeemDta.js";import{d as p,a as u,b as _,w as o,f as t,g as s,t as f,e as n,k as c,l as r}from"./index-x27QZ00Q.js";const g={class:"card-header"},k={class:"font-medium"},v={class:"mb-2!"},x={class:"text-red-500"},y=p({name:"Markdown",__name:"index",setup(b){const a=c(`
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
`);return(w,e)=>{const l=r("el-link"),d=r("el-card");return u(),_(d,{shadow:"never"},{header:o(()=>[t("div",g,[t("span",k,[e[2]||(e[2]=s(" Markdown组件，采用开源的 ",-1)),n(l,{href:"https://b3log.org/vditor/",target:"_blank",style:{margin:"0 4px 5px","font-size":"16px"}},{default:o(()=>[...e[1]||(e[1]=[s(" Vditor ",-1)])]),_:1})])]),n(l,{class:"mt-2",href:"https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/markdown",target:"_blank"},{default:o(()=>[...e[3]||(e[3]=[s(" 代码位置 src/views/markdown ",-1)])]),_:1})]),default:o(()=>[t("h1",v,[e[4]||(e[4]=s(" 双向绑定：",-1)),t("span",x,f(a.value),1)]),n(m,{modelValue:a.value,"onUpdate:modelValue":e[0]||(e[0]=i=>a.value=i),options:{height:560,outline:{enable:!0,position:"right"}}},null,8,["modelValue"])]),_:1})}}});export{y as default};
