const l={class:"dark:text-white"},V=Vue.defineComponent({name:"Menu2",__name:"index",setup(s){const e=Vue.ref(""),{t}=VueI18n.useI18n();return(a,n)=>{const u=Vue.resolveComponent("el-input");return Vue.openBlock(),Vue.createElementBlock("div",l,[Vue.createElementVNode("p",null,Vue.toDisplayString(Vue.unref(t)("menus.hsmenu2")),1),Vue.createVNode(u,{modelValue:e.value,"onUpdate:modelValue":n[0]||(n[0]=o=>e.value=o)},null,8,["modelValue"])])}}});export{V as default};