var I=(l,m,s)=>new Promise((u,f)=>{var p=a=>{try{c(s.next(a))}catch(i){f(i)}},o=a=>{try{c(s.throw(a))}catch(i){f(i)}},c=a=>a.done?u(a.value):Promise.resolve(a.value).then(p,o);c((s=s.apply(l,m)).next())});import{aj as j,r,o as C,i as F,b as _,du as x,d3 as R,dE as z,a5 as q,U as N,O as P,q as H}from"./index-24ofiFkH.js";import{_ as U}from"./form.vue_vue_type_script_setup_true_lang-Uem8APuC.js";import{g as V}from"./system-PoLpIYgZ.js";import{u as A}from"./hooks-o0Wnnn16.js";import"./index-Qi7I1i8p.js";function X(){const l=j({name:"",status:null}),m=r(),s=r([]),u=r(!0),{tagStyle:f}=A(),p=[{label:"部门名称",prop:"name",width:180,align:"left"},{label:"排序",prop:"sort",minWidth:70},{label:"状态",prop:"status",minWidth:100,cellRenderer:({row:t,props:e})=>F(_("el-tag"),{size:e.size,style:f.value(t.status)},{default:()=>[t.status===1?"启用":"停用"]})},{label:"创建时间",minWidth:200,prop:"createTime",formatter:({createTime:t})=>x(t).format("YYYY-MM-DD HH:mm:ss")},{label:"备注",prop:"remark",minWidth:320},{label:"操作",fixed:"right",width:160,slot:"operation"}];function o(t){}function c(t){t&&(t.resetFields(),a())}function a(){return I(this,null,function*(){u.value=!0;const{data:t}=yield V();let e=t;R(l.name)||(e=e.filter(n=>n.name.includes(l.name))),R(l.status)||(e=e.filter(n=>n.status===l.status)),s.value=z(e),setTimeout(()=>{u.value=!1},500)})}function i(t){if(!t||!t.length)return;const e=[];for(let n=0;n<t.length;n++)t[n].disabled=t[n].status===0,i(t[n].children),e.push(t[n]);return e}function M(t="新增",e){var n,d,h,g,b,D,v,y;q({title:`${t}部门`,props:{formInline:{higherDeptOptions:i(N(s.value)),parentId:(n=e==null?void 0:e.parentId)!=null?n:0,name:(d=e==null?void 0:e.name)!=null?d:"",principal:(h=e==null?void 0:e.principal)!=null?h:"",phone:(g=e==null?void 0:e.phone)!=null?g:"",email:(b=e==null?void 0:e.email)!=null?b:"",sort:(D=e==null?void 0:e.sort)!=null?D:0,status:(v=e==null?void 0:e.status)!=null?v:1,remark:(y=e==null?void 0:e.remark)!=null?y:""}},width:"40%",draggable:!0,fullscreenIcon:!0,closeOnClickModal:!1,contentRenderer:()=>P(U,{ref:m}),beforeSure:(S,{options:T})=>{const W=m.value.getRef(),Y=T.props.formInline;function k(){H(`您${t}了部门名称为${Y.name}的这条数据`,{type:"success"}),S(),a()}W.validate($=>{$&&k()})}})}function O(t){H(`您删除了部门名称为${t.name}的这条数据`,{type:"success"}),a()}return C(()=>{a()}),{form:l,loading:u,columns:p,dataList:s,onSearch:a,resetForm:c,openDialog:M,handleDelete:O,handleSelectionChange:o}}export{X as useDept};