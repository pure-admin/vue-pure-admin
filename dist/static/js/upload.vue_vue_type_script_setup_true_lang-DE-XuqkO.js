import{d as D,r,k as v,v as I,z as u,e as l,x as d,m,j as _,g as t,u as f,a3 as N,f as V,K as h,t as c,cY as b}from"./index-DftJury9.js";import{R as j}from"./index-B9BgcYOF.js";const P={"element-loading-background":"transparent"},A={class:"w-[18vw]"},E={class:"mt-1 text-center"},J={class:"flex flex-wrap justify-center items-center text-center"},K={key:1,class:"mt-1"},F=D({__name:"upload",props:{imgSrc:String},emits:["cropper"],setup(g,{expose:w,emit:k}){const x=g,C=k,e=r(),p=r(),y=r(),o=r(!1),s=r("");function R({base64:i,blob:n,info:a}){e.value=a,s.value=i,C("cropper",{base64:i,blob:n,info:a})}function S(){p.value.hide()}return w({hidePopover:S}),(i,n)=>{const a=v("el-image"),B=v("el-popover"),z=I("loading");return u((l(),d("div",P,[m(B,{ref_key:"popoverRef",ref:p,visible:o.value,placement:"right",width:"18vw"},{reference:_(()=>[t("div",A,[m(f(j),{ref_key:"refCropper",ref:y,src:x.imgSrc,circled:"",onCropper:R,onReadied:n[0]||(n[0]=Y=>o.value=!0)},null,8,["src"]),u(t("p",E," 温馨提示：右键上方裁剪区可开启功能菜单 ",512),[[N,o.value]])])]),default:_(()=>[t("div",J,[s.value?(l(),V(a,{key:0,src:s.value,"preview-src-list":Array.of(s.value),fit:"cover"},null,8,["src","preview-src-list"])):h("",!0),e.value?(l(),d("div",K,[t("p",null," 图像大小："+c(parseInt(e.value.width))+" × "+c(parseInt(e.value.height))+"像素 ",1),t("p",null," 文件大小："+c(f(b)(e.value.size))+"（"+c(e.value.size)+" 字节） ",1)])):h("",!0)])]),_:1},8,["visible"])])),[[z,!o.value]])}}});export{F as _};