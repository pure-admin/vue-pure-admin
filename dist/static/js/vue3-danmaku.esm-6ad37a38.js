import{_ as G}from"./_vue_commonjs-external-02441c5a.js";var e=G;function J(u,r,m="modelValue",o){return e.computed({get:()=>u[m],set:l=>{r(`update:${m}`,o?o(l):l)}})}var S=e.defineComponent({components:{},props:{danmus:{type:Array,required:!0,default:()=>[]},channels:{type:Number,default:0},autoplay:{type:Boolean,default:!0},loop:{type:Boolean,default:!1},useSlot:{type:Boolean,default:!1},debounce:{type:Number,default:100},speeds:{type:Number,default:200},randomChannel:{type:Boolean,default:!1},fontSize:{type:Number,default:18},top:{type:Number,default:4},right:{type:Number,default:0},isSuspend:{type:Boolean,default:!1},extraStyle:{type:String,default:""}},emits:["list-end","play-end","update:danmus"],setup(u,{emit:r,slots:m}){let o=e.ref(document.createElement("div")),l=e.ref(document.createElement("div"));const g=e.ref(0),L=e.ref(0);let y=0;const w=e.ref(0),x=e.ref(0),c=e.ref(0),C=e.ref(!1),p=e.ref(!1),h=e.ref({}),i=J(u,r,"danmus"),d=e.reactive({channels:e.computed(()=>u.channels||w.value),autoplay:e.computed(()=>u.autoplay),loop:e.computed(()=>u.loop),useSlot:e.computed(()=>u.useSlot),debounce:e.computed(()=>u.debounce),randomChannel:e.computed(()=>u.randomChannel)}),f=e.reactive({height:e.computed(()=>x.value),fontSize:e.computed(()=>u.fontSize),speeds:e.computed(()=>u.speeds),top:e.computed(()=>u.top),right:e.computed(()=>u.right)});e.onMounted(()=>{N()}),e.onBeforeUnmount(()=>{$()});function N(){B(),u.isSuspend&&T(),d.autoplay&&E()}function B(){g.value=o.value.offsetWidth,L.value=o.value.offsetHeight}function E(){p.value=!1,y||(y=setInterval(()=>_(),d.debounce))}function _(){if(!p.value&&i.value.length)if(c.value>i.value.length-1){const a=l.value.children.length;d.loop&&a<c.value&&(r("list-end"),c.value=0,b())}else b()}function b(a){const s=d.loop?c.value%i.value.length:c.value,n=a||i.value[s];let t=document.createElement("div");d.useSlot?t=z(n,s).$el:(t.innerHTML=n,t.setAttribute("style",u.extraStyle),t.style.fontSize=`${f.fontSize}px`,t.style.lineHeight=`${f.fontSize}px`),t.classList.add("dm"),l.value.appendChild(t),t.style.opacity="0",e.nextTick(()=>{f.height||(x.value=t.offsetHeight),d.channels||(w.value=Math.floor(L.value/(f.height+f.top)));let v=D(t);if(v>=0){const k=t.offsetWidth,U=f.height;t.classList.add("move"),t.style.opacity="1";const F=g.value/f.speeds;t.style.animationDuration=`${F}s`,t.style.top=v*(U+f.top)+"px",t.style.width=k+f.right+"px",t.style.setProperty("--dm-left-offset",`-${g.value}px`),t.dataset.index=`${s}`,t.addEventListener("animationend",()=>{Number(t.dataset.index)===i.value.length-1&&!d.loop&&r("play-end",t.dataset.index),l.value&&l.value.removeChild(t)}),c.value++}else l.value.removeChild(t)})}function z(a,s){return e.createApp({render(){return e.h("div",{},[m.dm&&m.dm({danmu:a,index:s})])}}).mount(document.createElement("div"))}function D(a){let s=[...Array(d.channels).keys()];d.randomChannel&&(s=s.sort(()=>.5-Math.random()));for(let n of s){const t=h.value[n];if(t&&t.length)for(let v=0;v<t.length;v++){const k=W(t[v])-10;if(k<=(a.offsetWidth-t[v].offsetWidth)*.88||k<=0)break;if(v===t.length-1)return h.value[n].push(a),a.addEventListener("animationend",()=>h.value[n].splice(0,1)),n%d.channels}else return h.value[n]=[a],a.addEventListener("animationend",()=>h.value[n].splice(0,1)),n%d.channels}return-1}function W(a){const s=a.offsetWidth||parseInt(a.style.width),n=a.getBoundingClientRect().right||l.value.getBoundingClientRect().right+s;return l.value.getBoundingClientRect().right-n}function H(){clearInterval(y),y=0}function T(){let a=[];l.value.addEventListener("mousemove",s=>{let n=s.target;n.className.includes("dm")||(n=n.closest(".dm")||n),n.className.includes("dm")&&(n.classList.add("pause"),a.push(n))}),l.value.addEventListener("mouseout",s=>{let n=s.target;n.className.includes("dm")||(n=n.closest(".dm")||n),n.className.includes("dm")&&(n.classList.remove("pause"),a.forEach(t=>{t.classList.remove("pause")}),a=[])})}function $(){H(),c.value=0}function A(){x.value=0,N()}function I(){h.value={},l.value.innerHTML="",p.value=!0,C.value=!1,$()}function M(){p.value=!0}function R(a){if(c.value===i.value.length)return i.value.push(a),i.value.length-1;{const s=c.value%i.value.length;return i.value.splice(s,0,a),s+1}}function V(a){return i.value.push(a),i.value.length-1}function X(){return!p.value}function P(){C.value=!1}function j(){C.value=!0}function q(){B();const a=l.value.getElementsByClassName("dm");for(let s=0;s<a.length;s++)a[s].style.setProperty("--dm-left-offset",`-${g}px`)}return{container:o,dmContainer:l,hidden:C,paused:p,danmuList:i,getPlayState:X,resize:q,play:E,pause:M,stop:I,show:P,hide:j,reset:A,add:R,push:V,insert:b}}});const K={ref:"container",class:"vue-danmaku"};function O(u,r,m,o,l,g){return e.openBlock(),e.createBlock("div",K,[e.createVNode("div",{ref:"dmContainer",class:["danmus",{show:!u.hidden},{paused:u.paused}]},null,2),e.renderSlot(u.$slots,"default")],512)}function Q(u,r){r===void 0&&(r={});var m=r.insertAt;if(!(!u||typeof document>"u")){var o=document.head||document.getElementsByTagName("head")[0],l=document.createElement("style");l.type="text/css",m==="top"&&o.firstChild?o.insertBefore(l,o.firstChild):o.appendChild(l),l.styleSheet?l.styleSheet.cssText=u:l.appendChild(document.createTextNode(u))}}var Y=`.vue-danmaku {
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
  right: 0;
  font-size: 20px;
  color: #ddd;
  white-space: pre;
  transform: translateX(100%);
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
    transform: translateX(100%);
  }
  to {
    transform: translateX(var(--dm-left-offset));
  }
}
@-webkit-keyframes moveLeft {
  from {
    -webkit-transform: translateX(100%);
  }
  to {
    -webkit-transform: translateX(var(--dm-left-offset));
  }
}`;Q(Y);S.render=O;S.__file="src/lib/Danmaku.vue";var Z=S;const te=Z;export{te as V};
