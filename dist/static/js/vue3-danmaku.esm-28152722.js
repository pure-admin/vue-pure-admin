function U(u,d,m="modelValue",s){return Vue.computed({get:()=>u[m],set:a=>{d(`update:${m}`,s?s(a):a)}})}var $=Vue.defineComponent({components:{},props:{danmus:{type:Array,required:!0,default:()=>[]},channels:{type:Number,default:0},autoplay:{type:Boolean,default:!0},loop:{type:Boolean,default:!1},useSlot:{type:Boolean,default:!1},debounce:{type:Number,default:100},speeds:{type:Number,default:200},randomChannel:{type:Boolean,default:!1},fontSize:{type:Number,default:18},top:{type:Number,default:4},right:{type:Number,default:0},isSuspend:{type:Boolean,default:!1},extraStyle:{type:String,default:""}},emits:["list-end","play-end","update:danmus"],setup(u,{emit:d,slots:m}){let s=Vue.ref(document.createElement("div")),a=Vue.ref(document.createElement("div"));const f=Vue.ref(0),k=Vue.ref(0);let g=0;const S=Vue.ref(0),C=Vue.ref(0),c=Vue.ref(0),V=Vue.ref(!1),p=Vue.ref(!1),h=Vue.ref({}),o=U(u,d,"danmus"),i=Vue.reactive({channels:Vue.computed(()=>u.channels||S.value),autoplay:Vue.computed(()=>u.autoplay),loop:Vue.computed(()=>u.loop),useSlot:Vue.computed(()=>u.useSlot),debounce:Vue.computed(()=>u.debounce),randomChannel:Vue.computed(()=>u.randomChannel)}),r=Vue.reactive({height:Vue.computed(()=>C.value),fontSize:Vue.computed(()=>u.fontSize),speeds:Vue.computed(()=>u.speeds),top:Vue.computed(()=>u.top),right:Vue.computed(()=>u.right)});Vue.onMounted(()=>{b()}),Vue.onBeforeUnmount(()=>{L()});function b(){w(),u.isSuspend&&_(),i.autoplay&&E()}function w(){f.value=s.value.offsetWidth,k.value=s.value.offsetHeight}function E(){p.value=!1,g||(g=setInterval(()=>N(),i.debounce))}function N(){if(!p.value&&o.value.length)if(c.value>o.value.length-1){const n=a.value.children.length;i.loop&&n<c.value&&(d("list-end"),c.value=0,x())}else x()}function x(n){const l=i.loop?c.value%o.value.length:c.value,t=n||o.value[l];let e=document.createElement("div");i.useSlot?e=B(t,l).$el:(e.innerHTML=t,e.setAttribute("style",u.extraStyle),e.style.fontSize=`${r.fontSize}px`,e.style.lineHeight=`${r.fontSize}px`),e.classList.add("dm"),a.value.appendChild(e),e.style.opacity="0",Vue.nextTick(()=>{r.height||(C.value=e.offsetHeight),i.channels||(S.value=Math.floor(k.value/(r.height+r.top)));let v=z(e);if(v>=0){const y=e.offsetWidth,q=r.height;e.classList.add("move"),e.dataset.index=`${l}`,e.style.opacity="1",e.style.top=v*(q+r.top)+"px",e.style.width=y+r.right+"px",e.style.setProperty("--dm-scroll-width",`-${f.value+y}px`),e.style.left=`${f.value}px`,e.style.animationDuration=`${f.value/r.speeds}s`,e.addEventListener("animationend",()=>{Number(e.dataset.index)===o.value.length-1&&!i.loop&&d("play-end",e.dataset.index),a.value&&a.value.removeChild(e)}),c.value++}else a.value.removeChild(e)})}function B(n,l){return Vue.createApp({render(){return Vue.h("div",{},[m.dm&&m.dm({danmu:n,index:l})])}}).mount(document.createElement("div"))}function z(n){let l=[...Array(i.channels).keys()];i.randomChannel&&(l=l.sort(()=>.5-Math.random()));for(let t of l){const e=h.value[t];if(e&&e.length)for(let v=0;v<e.length;v++){const y=W(e[v])-10;if(y<=(n.offsetWidth-e[v].offsetWidth)*.88||y<=0)break;if(v===e.length-1)return h.value[t].push(n),n.addEventListener("animationend",()=>h.value[t].splice(0,1)),t%i.channels}else return h.value[t]=[n],n.addEventListener("animationend",()=>h.value[t].splice(0,1)),t%i.channels}return-1}function W(n){const l=n.offsetWidth||parseInt(n.style.width),t=n.getBoundingClientRect().right||a.value.getBoundingClientRect().right+l;return a.value.getBoundingClientRect().right-t}function D(){clearInterval(g),g=0}function _(){let n=[];a.value.addEventListener("mousemove",l=>{let t=l.target;t.className.includes("dm")||(t=t.closest(".dm")||t),t.className.includes("dm")&&(t.classList.add("pause"),n.push(t))}),a.value.addEventListener("mouseout",l=>{let t=l.target;t.className.includes("dm")||(t=t.closest(".dm")||t),t.className.includes("dm")&&(t.classList.remove("pause"),n.forEach(e=>{e.classList.remove("pause")}),n=[])})}function L(){D(),c.value=0}function H(){C.value=0,b()}function T(){h.value={},a.value.innerHTML="",p.value=!0,V.value=!1,L()}function A(){p.value=!0}function I(n){if(c.value===o.value.length)return o.value.push(n),o.value.length-1;{const l=c.value%o.value.length;return o.value.splice(l,0,n),l+1}}function M(n){return o.value.push(n),o.value.length-1}function R(){return!p.value}function X(){V.value=!1}function P(){V.value=!0}function j(){w();const n=a.value.getElementsByClassName("dm");for(let l=0;l<n.length;l++){const t=n[l];t.style.setProperty("--dm-scroll-width",`-${f.value+t.offsetWidth}px`),t.style.left=`${f.value}px`,t.style.animationDuration=`${f.value/r.speeds}s`}}return{container:s,dmContainer:a,hidden:V,paused:p,danmuList:o,getPlayState:R,resize:j,play:E,pause:A,stop:T,show:X,hide:P,reset:H,add:I,push:M,insert:x}}});const F={ref:"container",class:"vue-danmaku"};function G(u,d,m,s,a,f){return Vue.openBlock(),Vue.createElementBlock("div",F,[Vue.createElementVNode("div",{ref:"dmContainer",class:Vue.normalizeClass(["danmus",{show:!u.hidden},{paused:u.paused}])},null,2),Vue.renderSlot(u.$slots,"default")],512)}function J(u,d){d===void 0&&(d={});var m=d.insertAt;if(!(!u||typeof document>"u")){var s=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",m==="top"&&s.firstChild?s.insertBefore(a,s.firstChild):s.appendChild(a),a.styleSheet?a.styleSheet.cssText=u:a.appendChild(document.createTextNode(u))}}var K=`.vue-danmaku {
  position: relative;
  overflow: hidden;
}
.vue-danmaku .danmus {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.vue-danmaku .danmus.show {
  opacity: 1;
}
.vue-danmaku .danmus.paused .dm.move {
  animation-play-state: paused;
}
.vue-danmaku .danmus .dm {
  position: absolute;
  font-size: 20px;
  color: #ddd;
  white-space: pre;
  transform: translateX(0);
  transform-style: preserve-3d;
}
.vue-danmaku .danmus .dm.move {
  will-change: transform;
  animation-name: moveLeft;
  animation-timing-function: linear;
  animation-play-state: running;
}
.vue-danmaku .danmus .dm.pause {
  animation-play-state: paused;
  z-index: 10;
}
@keyframes moveLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--dm-scroll-width));
  }
}
@-webkit-keyframes moveLeft {
  from {
    -webkit-transform: translateX(0);
  }
  to {
    -webkit-transform: translateX(var(--dm-scroll-width));
  }
}`;J(K);$.render=G;$.__file="src/lib/Danmaku.vue";export{$ as s};
