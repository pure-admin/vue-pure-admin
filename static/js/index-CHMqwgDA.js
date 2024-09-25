var Ze=Object.defineProperty,Je=Object.defineProperties;var et=Object.getOwnPropertyDescriptors;var Be=Object.getOwnPropertySymbols;var tt=Object.prototype.hasOwnProperty,at=Object.prototype.propertyIsEnumerable;var Ce=(e,o,a)=>o in e?Ze(e,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[o]=a,X=(e,o)=>{for(var a in o||(o={}))tt.call(o,a)&&Ce(e,a,o[a]);if(Be)for(var a of Be(o))at.call(o,a)&&Ce(e,a,o[a]);return e},K=(e,o)=>Je(e,et(o));var Me=(e,o,a)=>new Promise((i,f)=>{var s=n=>{try{r(a.next(n))}catch(t){f(t)}},l=n=>{try{r(a.throw(n))}catch(t){f(t)}},r=n=>n.done?i(n.value):Promise.resolve(n.value).then(s,l);r((a=a.apply(e,o)).next())});import{d as U,b3 as ne,aY as rt,p as W,a as L,b6 as ue,f as O,k as Y,g as $,b as P,w as R,Q as G,s as H,j as F,v as we,u as B,i as xe,h as ie,t as N,F as Z,l as ae,K as nt,a3 as it,q as ot,ba as de,n as ce,y as Ge,dU as lt,T as st,aX as re,m as Ie,b8 as ut,b9 as dt,Z as ct}from"./index-B0Z6rV6K.js";var J=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},ft={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){var a="day";return function(i,f,s){var l=function(t){return t.add(4-t.isoWeekday(),a)},r=f.prototype;r.isoWeekYear=function(){return l(this).year()},r.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),a);var u,d,g,p,x=l(this),m=(u=this.isoWeekYear(),d=this.$u,g=(d?s.utc:s)().year(u).startOf("year"),p=4-g.isoWeekday(),g.isoWeekday()>4&&(p+=7),g.add(p,a));return x.diff(m,"week")+1},r.isoWeekday=function(t){return this.$utils().u(t)?this.day()||7:this.day(this.day()%7?t:t-7)};var n=r.startOf;r.startOf=function(t,u){var d=this.$utils(),g=!!d.u(u)||u;return d.p(t)==="isoweek"?g?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):n.bind(this)(t,u)}}})})(ft);var gt={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){return function(a,i){i.prototype.isSameOrBefore=function(f,s){return this.isSame(f,s)||this.isBefore(f,s)}}})})(gt);var ht={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){return function(a,i){i.prototype.isSameOrAfter=function(f,s){return this.isSame(f,s)||this.isAfter(f,s)}}})})(ht);var mt={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){return function(a,i,f){i.prototype.isBetween=function(s,l,r,n){var t=f(s),u=f(l),d=(n=n||"()")[0]==="(",g=n[1]===")";return(d?this.isAfter(t,r):!this.isBefore(t,r))&&(g?this.isBefore(u,r):!this.isAfter(u,r))||(d?this.isBefore(t,r):!this.isAfter(t,r))&&(g?this.isAfter(u,r):!this.isBefore(u,r))}}})})(mt);var pt={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){var a="week",i="year";return function(f,s,l){var r=s.prototype;r.week=function(n){if(n===void 0&&(n=null),n!==null)return this.add(7*(n-this.week()),"day");var t=this.$locale().yearStart||1;if(this.month()===11&&this.date()>25){var u=l(this).startOf(i).add(1,i).date(t),d=l(this).endOf(a);if(u.isBefore(d))return 1}var g=l(this).startOf(i).date(t).startOf(a).subtract(1,"millisecond"),p=this.diff(g,a,!0);return p<0?l(this).startOf("week").week():Math.ceil(p)},r.weeks=function(n){return n===void 0&&(n=null),this.week(n)}}})})(pt);var bt={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){return function(a,i,f){var s=i.prototype,l=s.format;f.en.ordinal=function(r){var n=["th","st","nd","rd"],t=r%100;return"["+r+(n[(t-20)%10]||n[t]||n[0])+"]"},s.format=function(r){var n=this,t=this.$locale();if(!this.isValid())return l.bind(this)(r);var u=this.$utils(),d=(r||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(g){switch(g){case"Q":return Math.ceil((n.$M+1)/3);case"Do":return t.ordinal(n.$D);case"gggg":return n.weekYear();case"GGGG":return n.isoWeekYear();case"wo":return t.ordinal(n.week(),"W");case"w":case"ww":return u.s(n.week(),g==="w"?1:2,"0");case"W":case"WW":return u.s(n.isoWeek(),g==="W"?1:2,"0");case"k":case"kk":return u.s(String(n.$H===0?24:n.$H),g==="k"?1:2,"0");case"X":return Math.floor(n.$d.getTime()/1e3);case"x":return n.$d.getTime();case"z":return"["+n.offsetName()+"]";case"zzz":return"["+n.offsetName("long")+"]";default:return g}});return l.bind(this)(d)}}})})(bt);var vt={exports:{}};(function(e,o){(function(a,i){e.exports=i()})(J,function(){var a={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},i=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,f=/\d\d/,s=/\d\d?/,l=/\d*[^-_:/,()\s\d]+/,r={},n=function(m){return(m=+m)+(m>68?1900:2e3)},t=function(m){return function(b){this[m]=+b}},u=[/[+-]\d\d:?(\d\d)?|Z/,function(m){(this.zone||(this.zone={})).offset=function(b){if(!b||b==="Z")return 0;var D=b.match(/([+-]|\d\d)/g),h=60*D[1]+(+D[2]||0);return h===0?0:D[0]==="+"?-h:h}(m)}],d=function(m){var b=r[m];return b&&(b.indexOf?b:b.s.concat(b.f))},g=function(m,b){var D,h=r.meridiem;if(h){for(var y=1;y<=24;y+=1)if(m.indexOf(h(y,0,b))>-1){D=y>12;break}}else D=m===(b?"pm":"PM");return D},p={A:[l,function(m){this.afternoon=g(m,!1)}],a:[l,function(m){this.afternoon=g(m,!0)}],S:[/\d/,function(m){this.milliseconds=100*+m}],SS:[f,function(m){this.milliseconds=10*+m}],SSS:[/\d{3}/,function(m){this.milliseconds=+m}],s:[s,t("seconds")],ss:[s,t("seconds")],m:[s,t("minutes")],mm:[s,t("minutes")],H:[s,t("hours")],h:[s,t("hours")],HH:[s,t("hours")],hh:[s,t("hours")],D:[s,t("day")],DD:[f,t("day")],Do:[l,function(m){var b=r.ordinal,D=m.match(/\d+/);if(this.day=D[0],b)for(var h=1;h<=31;h+=1)b(h).replace(/\[|\]/g,"")===m&&(this.day=h)}],M:[s,t("month")],MM:[f,t("month")],MMM:[l,function(m){var b=d("months"),D=(d("monthsShort")||b.map(function(h){return h.slice(0,3)})).indexOf(m)+1;if(D<1)throw new Error;this.month=D%12||D}],MMMM:[l,function(m){var b=d("months").indexOf(m)+1;if(b<1)throw new Error;this.month=b%12||b}],Y:[/[+-]?\d+/,t("year")],YY:[f,function(m){this.year=n(m)}],YYYY:[/\d{4}/,t("year")],Z:u,ZZ:u};function x(m){var b,D;b=m,D=r&&r.formats;for(var h=(m=b.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(M,T,E){var S=E&&E.toUpperCase();return T||D[E]||a[E]||D[S].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(_,I,j){return I||j.slice(1)})})).match(i),y=h.length,k=0;k<y;k+=1){var c=h[k],w=p[c],v=w&&w[0],C=w&&w[1];h[k]=C?{regex:v,parser:C}:c.replace(/^\[|\]$/g,"")}return function(M){for(var T={},E=0,S=0;E<y;E+=1){var _=h[E];if(typeof _=="string")S+=_.length;else{var I=_.regex,j=_.parser,q=M.slice(S),ee=I.exec(q)[0];j.call(T,ee),M=M.replace(ee,"")}}return function(V){var A=V.afternoon;if(A!==void 0){var te=V.hours;A?te<12&&(V.hours+=12):te===12&&(V.hours=0),delete V.afternoon}}(T),T}}return function(m,b,D){D.p.customParseFormat=!0,m&&m.parseTwoDigitYear&&(n=m.parseTwoDigitYear);var h=b.prototype,y=h.parse;h.parse=function(k){var c=k.date,w=k.utc,v=k.args;this.$u=w;var C=v[1];if(typeof C=="string"){var M=v[2]===!0,T=v[3]===!0,E=M||T,S=v[2];T&&(S=v[2]),r=this.$locale(),!M&&S&&(r=D.Ls[S]),this.$d=function(q,ee,V){try{if(["x","X"].indexOf(ee)>-1)return new Date((ee==="X"?1e3:1)*q);var A=x(ee)(q),te=A.year,le=A.month,Pe=A.day,Qe=A.hours,Ve=A.minutes,Xe=A.seconds,Ke=A.milliseconds,De=A.zone,ge=new Date,he=Pe||(te||le?1:ge.getDate()),me=te||ge.getFullYear(),se=0;te&&!le||(se=le>0?le-1:ge.getMonth());var pe=Qe||0,be=Ve||0,ve=Xe||0,ye=Ke||0;return De?new Date(Date.UTC(me,se,he,pe,be,ve,ye+60*De.offset*1e3)):V?new Date(Date.UTC(me,se,he,pe,be,ve,ye)):new Date(me,se,he,pe,be,ve,ye)}catch(ra){return new Date("")}}(c,C,w),this.init(),S&&S!==!0&&(this.$L=this.locale(S).$L),E&&c!=this.format(C)&&(this.$d=new Date("")),r={}}else if(C instanceof Array)for(var _=C.length,I=1;I<=_;I+=1){v[1]=C[I-1];var j=D.apply(this,v);if(j.isValid()){this.$d=j.$d,this.$L=j.$L,this.init();break}I===_&&(this.$d=new Date(""))}else y.call(this,k)}}})})(vt);const We=Symbol("CHART_ROWS_KEY"),ze=Symbol("CONFIG_KEY"),je=Symbol("EMIT_BAR_EVENT_KEY"),Ae=Symbol("BAR_CONTAINER_KEY");function z(){const e=de(ze);if(!e)throw Error("Failed to inject config!");return e}const Re="YYYY-MM-DD HH:mm";function oe(e=z()){const{chartStart:o,chartEnd:a,barStart:i,barEnd:f,dateFormat:s}=e,l=W(()=>n(o.value)),r=W(()=>n(a.value)),n=(t,u)=>{let d;if(u!==void 0&&typeof t!="string"&&!(t instanceof Date)&&(d=u==="start"?t[i.value]:t[f.value]),typeof t=="string")d=t;else if(t instanceof Date)return re(t);const g=s.value||Re;return re(d,g,!0)};return{chartStartDayjs:l,chartEndDayjs:r,toDayjs:n,format:(t,u)=>u===!1?t instanceof Date?t:re(t).toDate():(typeof t=="string"||t instanceof Date?n(t):t).format(u)}}function Fe(){const{precision:e}=z(),{chartStartDayjs:o,chartEndDayjs:a}=oe(),i=W(()=>{switch(e==null?void 0:e.value){case"hour":return"day";case"day":return"month";case"date":case"week":return"month";case"month":return"year";default:throw new Error("Precision prop incorrect. Must be one of the following: 'hour', 'day', 'date', 'week', 'month'")}}),f=W(()=>{switch(e.value){case"date":return"day";case"week":return"isoWeek";default:return e.value}}),s={hour:"HH",date:"DD.MMM",day:"DD.MMM",week:"WW",month:"MMMM YYYY",year:"YYYY"};return{timeaxisUnits:W(()=>{const l=[],r=[],n=a.value.diff(o.value,"minutes",!0),t=i.value,u=f.value;let d=o.value,g=o.value;for(;g.isSameOrBefore(a.value);){const p=g.endOf(u),x=p.isAfter(a.value)?a.value.diff(g,"minutes",!0)/n*100:p.diff(g,"minutes",!0)/n*100;r.push({label:g.format(s[e==null?void 0:e.value]),value:String(g),date:g.toDate(),width:String(x)+"%"}),g=p.add(1,u==="isoWeek"?"week":u).startOf(u)}for(;d.isSameOrBefore(a.value);){const p=d.endOf(t),x=p.isAfter(a.value)?a.value.diff(d,"minutes",!0)/n*100:p.diff(d,"minutes",!0)/n*100;l.push({label:d.format(s[t]),value:String(d),date:d.toDate(),width:String(x)+"%"}),d=p.add(1,t).startOf(t)}return{upperUnits:l,lowerUnits:r}})}}const yt={class:"g-grid-container"},wt=U({__name:"GGanttGrid",props:{highlightedUnits:{}},setup(e){const{colors:o}=z(),{timeaxisUnits:a}=Fe();return(i,f)=>(O(),Y("div",yt,[(O(!0),Y(Z,null,ae(B(a).lowerUnits,({label:s,value:l,width:r})=>{var n;return O(),Y("div",{key:s,class:"g-grid-line",style:H({width:r,background:(n=i.highlightedUnits)!=null&&n.includes(Number(l))?B(o).hoverHighlight:void 0})},null,4)}),128))]))}});function ke(){const e=de(We);if(!e)throw Error("Failed to inject getChartRows!");return e}const xt={class:"g-label-column-rows"},kt=U({__name:"GGanttLabelColumn",setup(e){const{font:o,colors:a,labelColumnTitle:i,rowHeight:f}=z(),s=ke();return(l,r)=>(O(),Y("div",{class:"g-label-column",style:H({fontFamily:B(o),color:B(a).text})},[G(l.$slots,"label-column-title",{},()=>[$("div",{class:"g-label-column-header",style:H({background:B(a).primary})},N(B(i)),5)]),$("div",xt,[(O(!0),Y(Z,null,ae(B(s)(),({label:n},t)=>(O(),Y("div",{key:`${n}_${t}`,class:"g-label-column-row",style:H({background:t%2===0?B(a).ternary:B(a).quartenary,height:`${B(f)}px`})},[G(l.$slots,"label-column-row",{label:n},()=>[$("span",null,N(n),1)])],4))),128))])],4))}}),Dt={class:"g-timeaxis"},Bt={class:"g-timeunits-container"},Ct={class:"g-timeunits-container"},Mt=U({__name:"GGanttTimeaxis",setup(e){const{precision:o,colors:a}=z(),{timeaxisUnits:i}=Fe();return(f,s)=>(O(),Y("div",Dt,[$("div",Bt,[(O(!0),Y(Z,null,ae(B(i).upperUnits,({label:l,value:r,date:n,width:t},u)=>(O(),Y("div",{key:l,class:"g-upper-timeunit",style:H({background:u%2===0?B(a).primary:B(a).secondary,color:B(a).text,width:t})},[G(f.$slots,"upper-timeunit",{label:l,value:r,date:n},()=>[ie(N(l),1)])],4))),128))]),$("div",Ct,[(O(!0),Y(Z,null,ae(B(i).lowerUnits,({label:l,value:r,date:n,width:t},u)=>(O(),Y("div",{key:l,class:"g-timeunit",style:H({background:u%2===0?B(a).ternary:B(a).quartenary,color:B(a).text,flexDirection:B(o)==="hour"?"column":"row",alignItems:B(o)==="hour"?"":"center",width:t})},[G(f.$slots,"timeunit",{label:l,value:r,date:n},()=>[ie(N(l),1)]),B(o)==="hour"?(O(),Y("div",{key:0,class:"g-timeaxis-hour-pin",style:H({background:B(a).text})},null,4)):F("",!0)],4))),128))])]))}}),Ot="cadetblue",Tt=U({__name:"GGanttBarTooltip",props:{bar:{},modelValue:{type:Boolean}},setup(e){const o=e,a={hour:"HH:mm",day:"DD. MMM HH:mm",date:"DD. MMMM YYYY",month:"DD. MMMM YYYY",week:"DD. MMMM YYYY (WW)"},{bar:i}=ne(o),{precision:f,font:s,barStart:l,barEnd:r,rowHeight:n}=z(),t=L("0px"),u=L("0px");ce(()=>o.bar,()=>Me(this,null,function*(){var b;yield Ge();const D=((b=i==null?void 0:i.value)==null?void 0:b.ganttBarConfig.id)||"";if(!D)return;const h=document.getElementById(D),{top:y,left:k}=(h==null?void 0:h.getBoundingClientRect())||{top:0,left:0},c=Math.max(k,10);t.value=`${y+n.value-10}px`,u.value=`${c}px`}),{deep:!0,immediate:!0});const d=W(()=>{var b,D;return((D=(b=i==null?void 0:i.value)==null?void 0:b.ganttBarConfig.style)==null?void 0:D.background)||Ot}),{toDayjs:g}=oe(),p=W(()=>{var b;return(b=i.value)==null?void 0:b[l.value]}),x=W(()=>{var b;return(b=i.value)==null?void 0:b[r.value]}),m=W(()=>{if(!(i!=null&&i.value))return"";const b=a[f.value],D=g(p.value).format(b),h=g(x.value).format(b);return`${D} – ${h}`});return(b,D)=>(O(),P(st,{to:"body"},[xe(lt,{name:"g-fade",mode:"out-in"},{default:R(()=>[b.modelValue?(O(),Y("div",{key:0,class:"g-gantt-tooltip",style:H({top:t.value,left:u.value,fontFamily:B(s)})},[$("div",{class:"g-gantt-tooltip-color-dot",style:H({background:d.value})},null,4),G(b.$slots,"default",{bar:B(i),barStart:p.value,barEnd:x.value},()=>[ie(N(m.value),1)])],4)):F("",!0)]),_:3})]))}});function fe(e=z()){const{dateFormat:o,chartSize:a}=e,{chartStartDayjs:i,chartEndDayjs:f,toDayjs:s,format:l}=oe(e),r=W(()=>f.value.diff(i.value,"minutes"));return{mapTimeToPosition:n=>{const t=a.width.value||0,u=s(n).diff(i.value,"minutes",!0);return Math.ceil(u/r.value*t)},mapPositionToTime:n=>{const t=a.width.value||0,u=n/t*r.value;return l(i.value.add(u,"minutes"),o.value)}}}const Et=U({__name:"GGanttCurrentTime",setup(e){const{mapTimeToPosition:o}=fe(),a=L(re()),{colors:i,dateFormat:f,currentTimeLabel:s}=z(),l=W(()=>{const r=f.value||"YYYY-MM-DD HH:mm";return o(re(a.value,r).format(r))});return(r,n)=>(O(),Y("div",{class:"g-grid-current-time",style:H({left:`${l.value}px`})},[$("div",{class:"g-grid-current-time-marker",style:H({border:`1px dashed ${B(i).markerCurrentTime}`})},null,4),$("span",{class:"g-grid-current-time-text",style:H({color:B(i).markerCurrentTime})},[G(r.$slots,"current-time-label",{},()=>[ie(N(B(s)),1)])],4)],4))}});var Oe;const Ne=typeof window<"u";Ne&&((Oe=window==null?void 0:window.navigator)!=null&&Oe.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function Yt(e){return typeof e=="function"?e():B(e)}function St(e){return e}function _t(e){return ut()?(dt(e),!0):!1}function Lt(e,o=!0){ct()?Ie(e):o?e():Ge(e)}function Ue(e){var o;const a=Yt(e);return(o=a==null?void 0:a.$el)!=null?o:a}const $t=Ne?window:void 0;function Ht(e,o=!1){const a=L(),i=()=>a.value=!!e();return i(),Lt(i,o),a}const Te=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Ee="__vueuse_ssr_handlers__";Te[Ee]=Te[Ee]||{};var Ye=Object.getOwnPropertySymbols,Gt=Object.prototype.hasOwnProperty,It=Object.prototype.propertyIsEnumerable,Wt=(e,o)=>{var a={};for(var i in e)Gt.call(e,i)&&o.indexOf(i)<0&&(a[i]=e[i]);if(e!=null&&Ye)for(var i of Ye(e))o.indexOf(i)<0&&It.call(e,i)&&(a[i]=e[i]);return a};function zt(e,o,a={}){const i=a,{window:f=$t}=i,s=Wt(i,["window"]);let l;const r=Ht(()=>f&&"ResizeObserver"in f),n=()=>{l&&(l.disconnect(),l=void 0)},t=ce(()=>Ue(e),d=>{n(),r.value&&f&&d&&(l=new ResizeObserver(o),l.observe(d,s))},{immediate:!0,flush:"post"}),u=()=>{n(),t()};return _t(u),{isSupported:r,stop:u}}function jt(e,o={width:0,height:0},a={}){const i=L(o.width),f=L(o.height);return zt(e,([s])=>{i.value=s.contentRect.width,f.value=s.contentRect.height},a),ce(()=>Ue(e),s=>{i.value=s?o.width:0,f.value=s?o.height:0}),{width:i,height:f}}var Se;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Se||(Se={}));var At=Object.defineProperty,_e=Object.getOwnPropertySymbols,Rt=Object.prototype.hasOwnProperty,Ft=Object.prototype.propertyIsEnumerable,Le=(e,o,a)=>o in e?At(e,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[o]=a,Nt=(e,o)=>{for(var a in o||(o={}))Rt.call(o,a)&&Le(e,a,o[a]);if(_e)for(var a of _e(o))Ft.call(o,a)&&Le(e,a,o[a]);return e};const Ut={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Nt({linear:St},Ut);const $e={default:{primary:"#eeeeee",secondary:"#E0E0E0",ternary:"#F5F5F5",quartenary:"#ededed",hoverHighlight:"rgba(204, 216, 219, 0.5)",markerCurrentTime:"#000",text:"#404040",background:"white"},creamy:{primary:"#ffe8d9",secondary:"#fcdcc5",ternary:"#fff6f0",quartenary:"#f7ece6",hoverHighlight:"rgba(230, 221, 202, 0.5)",markerCurrentTime:"#000",text:"#542d05",background:"white"},crimson:{primary:"#a82039",secondary:"#c41238",ternary:"#db4f56",quartenary:"#ce5f64",hoverHighlight:"rgba(196, 141, 141, 0.5)",markerCurrentTime:"#000",text:"white",background:"white"},dark:{primary:"#404040",secondary:"#303030",ternary:"#353535",quartenary:"#383838",hoverHighlight:"rgba(159, 160, 161, 0.5)",markerCurrentTime:"#fff",text:"white",background:"#525252",toast:"#1f1f1f"},flare:{primary:"#e08a38",secondary:"#e67912",ternary:"#5e5145",quartenary:"#665648",hoverHighlight:"rgba(196, 141, 141, 0.5)",markerCurrentTime:"#000",text:"white",background:"white"},fuchsia:{primary:"#de1d5a",secondary:"#b50b41",ternary:"#ff7da6",quartenary:"#f2799f",hoverHighlight:"rgba(196, 141, 141, 0.5)",markerCurrentTime:"#000",text:"white",background:"white"},grove:{primary:"#3d9960",secondary:"#288542",ternary:"#72b585",quartenary:"#65a577",hoverHighlight:"rgba(160, 219, 171, 0.5)",markerCurrentTime:"#000",text:"white",background:"white"},"material-blue":{primary:"#0D47A1",secondary:"#1565C0",ternary:"#42a5f5",quartenary:"#409fed",hoverHighlight:"rgba(110, 165, 196, 0.5)",markerCurrentTime:"#000",text:"white",background:"white"},sky:{primary:"#b5e3ff",secondary:"#a1d6f7",ternary:"#d6f7ff",quartenary:"#d0edf4",hoverHighlight:"rgba(193, 202, 214, 0.5)",markerCurrentTime:"#000",text:"#022c47",background:"white"},slumber:{primary:"#2a2f42",secondary:"#2f3447",ternary:"#35394d",quartenary:"#2c3044",hoverHighlight:"rgba(179, 162, 127, 0.5)",markerCurrentTime:"#fff",text:"#ffe0b3",background:"#38383b",toast:"#1f1f1f"},vue:{primary:"#258a5d",secondary:"#41B883",ternary:"#35495E",quartenary:"#2a3d51",hoverHighlight:"rgba(160, 219, 171, 0.5)",markerCurrentTime:"#000",text:"white",background:"white"}},qt={class:"g-gantt-rows-container"},Pt=U({__name:"GGanttChart",props:{chartStart:{},chartEnd:{},precision:{default:"day"},barStart:{},barEnd:{},currentTime:{type:Boolean},currentTimeLabel:{default:""},dateFormat:{type:[String,Boolean],default:Re},width:{default:"100%"},hideTimeaxis:{type:Boolean,default:!1},colorScheme:{default:"default"},grid:{type:Boolean,default:!1},pushOnOverlap:{type:Boolean,default:!1},noOverlap:{type:Boolean,default:!1},rowHeight:{default:40},highlightedUnits:{default:()=>[]},font:{default:"inherit"},labelColumnTitle:{default:""},labelColumnWidth:{default:"150px"}},emits:["click-bar","mousedown-bar","mouseup-bar","dblclick-bar","mouseenter-bar","mouseleave-bar","dragstart-bar","drag-bar","dragend-bar","contextmenu-bar"],setup(e,{emit:o}){const a=e,{width:i,font:f,colorScheme:s}=ne(a),l=rt(),r=W(()=>typeof s.value!="string"?s.value:$e[s.value]||$e.default),n=()=>{var h;const y=(h=l.default)==null?void 0:h.call(l),k=[];return y&&y.forEach(c=>{var w;if((w=c.props)!=null&&w.bars){const{label:v,bars:C}=c.props;k.push({label:v,bars:C})}else Array.isArray(c.children)&&c.children.forEach(v=>{var C;const M=v;if((C=M==null?void 0:M.props)!=null&&C.bars){const{label:T,bars:E}=M.props;k.push({label:T,bars:E})}})}),k},t=L(!1),u=L(!1),d=L(void 0);let g;const p=h=>{g&&clearTimeout(g),g=setTimeout(()=>{t.value=!0},800),d.value=h},x=()=>{clearTimeout(g),t.value=!1},m=(h,y,k,c)=>{switch(h.type){case"click":o("click-bar",{bar:y,e:h,datetime:k});break;case"mousedown":o("mousedown-bar",{bar:y,e:h,datetime:k});break;case"mouseup":o("mouseup-bar",{bar:y,e:h,datetime:k});break;case"dblclick":o("dblclick-bar",{bar:y,e:h,datetime:k});break;case"mouseenter":p(y),o("mouseenter-bar",{bar:y,e:h});break;case"mouseleave":x(),o("mouseleave-bar",{bar:y,e:h});break;case"dragstart":u.value=!0,o("dragstart-bar",{bar:y,e:h});break;case"drag":o("drag-bar",{bar:y,e:h});break;case"dragend":u.value=!1,o("dragend-bar",{bar:y,e:h,movedBars:c});break;case"contextmenu":o("contextmenu-bar",{bar:y,e:h,datetime:k});break}},b=L(null),D=jt(b);return ue(We,n),ue(ze,K(X({},ne(a)),{colors:r,chartSize:D})),ue(je,m),(h,y)=>(O(),Y("div",null,[$("div",{class:we([{"labels-in-column":!!h.labelColumnTitle}])},[h.labelColumnTitle?(O(),P(kt,{key:0,style:H({width:h.labelColumnWidth})},{"label-column-title":R(()=>[G(h.$slots,"label-column-title")]),"label-column-row":R(({label:k})=>[G(h.$slots,"label-column-row",{label:k})]),_:3},8,["style"])):F("",!0),$("div",{ref_key:"ganttChart",ref:b,class:we(["g-gantt-chart",{"with-column":h.labelColumnTitle}]),style:H({width:B(i),background:r.value.background,fontFamily:B(f)})},[h.hideTimeaxis?F("",!0):(O(),P(Mt,{key:0},{"upper-timeunit":R(({label:k,value:c,date:w})=>[G(h.$slots,"upper-timeunit",{label:k,value:c,date:w})]),timeunit:R(({label:k,value:c,date:w})=>[G(h.$slots,"timeunit",{label:k,value:c,date:w})]),_:3})),h.grid?(O(),P(wt,{key:1,"highlighted-units":h.highlightedUnits},null,8,["highlighted-units"])):F("",!0),h.currentTime?(O(),P(Et,{key:2},{"current-time-label":R(()=>[G(h.$slots,"current-time-label")]),_:3})):F("",!0),$("div",qt,[G(h.$slots,"default")])],6)],2),xe(Tt,{"model-value":t.value||u.value,bar:d.value},{default:R(()=>[G(h.$slots,"bar-tooltip",{bar:d.value})]),_:3},8,["model-value","bar"])]))}});function He(e,o=()=>null,a=()=>null,i=z()){const{barStart:f,barEnd:s,pushOnOverlap:l}=i,r=L(!1);let n=0,t;const{mapPositionToTime:u}=fe(i),{toDayjs:d}=oe(i),g=y=>{const k=document.getElementById(e.ganttBarConfig.id);if(k){switch(n=y.clientX-(k.getBoundingClientRect().left||0),y.target.className){case"g-gantt-bar-handle-left":document.body.style.cursor="ew-resize",t=m;break;case"g-gantt-bar-handle-right":document.body.style.cursor="ew-resize",t=b;break;default:t=x}r.value=!0,window.addEventListener("mousemove",t),window.addEventListener("mouseup",h)}},p=()=>{var y;const k=document.getElementById(e.ganttBarConfig.id),c=(y=k==null?void 0:k.closest(".g-gantt-row-bars-container"))==null?void 0:y.getBoundingClientRect();return{barElement:k,barContainer:c}},x=y=>{const{barElement:k,barContainer:c}=p();if(!k||!c)return;const w=k.getBoundingClientRect().width,v=y.clientX-c.left-n,C=v+w;D(v,C)||(e[f.value]=u(v),e[s.value]=u(C),o(y,e))},m=y=>{const{barElement:k,barContainer:c}=p();if(!k||!c)return;const w=y.clientX-c.left,v=u(w);d(v).isSameOrAfter(d(e,"end"))||(e[f.value]=v,o(y,e))},b=y=>{const{barElement:k,barContainer:c}=p();if(!k||!c)return;const w=y.clientX-c.left,v=u(w);d(v).isSameOrBefore(d(e,"start"))||(e[s.value]=v,o(y,e))},D=(y,k)=>{if(!l.value)return!1;const c=e.ganttBarConfig.dragLimitLeft,w=e.ganttBarConfig.dragLimitRight;return y&&c!=null&&y<c||k&&w!=null&&k>w},h=y=>{r.value=!1,document.body.style.cursor="",window.removeEventListener("mousemove",t),window.removeEventListener("mouseup",h),a(y,e)};return{isDragging:r,initDrag:g}}function qe(){const e=de(je);if(!e)throw Error("Failed to inject emitBarEvent!");return e}function Qt(){const e=z(),o=ke(),a=qe(),{pushOnOverlap:i,barStart:f,barEnd:s,noOverlap:l,dateFormat:r}=e,n=new Map,{toDayjs:t,format:u}=oe(),d=(c,w)=>{const{initDrag:v}=He(c,p,h,e);a(K(X({},w),{type:"dragstart"}),c),v(w),y(c)},g=(c,w)=>{const v=c.ganttBarConfig.bundle;v!=null&&(o().forEach(C=>{C.bars.forEach(M=>{if(M.ganttBarConfig.bundle===v){const T=M===c?h:()=>null,{initDrag:E}=He(M,p,T,e);E(w),y(M)}})}),a(K(X({},w),{type:"dragstart"}),c))},p=(c,w)=>{a(K(X({},c),{type:"drag"}),w),x(w)},x=c=>{if(!(i!=null&&i.value))return;let w=c,{overlapBar:v,overlapType:C}=m(w);for(;v;){y(v);const M=t(w[f.value]),T=t(w[s.value]),E=t(v[f.value]),S=t(v[s.value]);let _;switch(C){case"left":_=S.diff(M,"minutes",!0),v[s.value]=u(w[f.value],r.value),v[f.value]=u(E.subtract(_,"minutes"),r.value);break;case"right":_=T.diff(E,"minutes",!0),v[f.value]=u(T,r.value),v[s.value]=u(S.add(_,"minutes"),r.value);break;default:console.warn("Vue-Ganttastic: One bar is inside of the other one! This should never occur while push-on-overlap is active!");return}v&&(C==="left"||C==="right")&&b(v,_,C),w=v,{overlapBar:v,overlapType:C}=m(v)}},m=c=>{var w,v;let C,M,T;const E=(v=(w=o().find(I=>I.bars.includes(c)))==null?void 0:w.bars)!=null?v:[],S=t(c[f.value]),_=t(c[s.value]);return{overlapBar:E.find(I=>{if(I===c)return!1;const j=t(I[f.value]),q=t(I[s.value]);return C=S.isBetween(j,q),M=_.isBetween(j,q),T=j.isBetween(S,_)||q.isBetween(S,_),C||M||T}),overlapType:C?"left":M?"right":T?"between":null}},b=(c,w,v)=>{y(c),c.ganttBarConfig.bundle&&o().forEach(C=>{C.bars.forEach(M=>{M.ganttBarConfig.bundle===c.ganttBarConfig.bundle&&M!==c&&(y(M),D(M,w,v))})})},D=(c,w,v)=>{switch(v){case"left":c[f.value]=u(t(c,"start").subtract(w,"minutes"),r.value),c[s.value]=u(t(c,"end").subtract(w,"minutes"),r.value);break;case"right":c[f.value]=u(t(c,"start").add(w,"minutes"),r.value),c[s.value]=u(t(c,"end").add(w,"minutes"),r.value)}x(c)},h=(c,w)=>{k();const v=K(X({},c),{type:"dragend"});a(v,w,void 0,new Map(n)),n.clear()},y=c=>{if(!n.has(c)){const w=c[f.value],v=c[s.value];n.set(c,{oldStart:w,oldEnd:v})}},k=()=>{if(i.value||!l.value)return;let c=!1;n.forEach((w,v)=>{const{overlapBar:C}=m(v);C!=null&&(c=!0)}),c&&n.forEach(({oldStart:w,oldEnd:v},C)=>{C[f.value]=w,C[s.value]=v})};return{initDragOfBar:d,initDragOfBundle:g}}function Vt(){const{pushOnOverlap:e}=z(),o=ke(),a=l=>{const r=[];return l!=null&&o().forEach(n=>{n.bars.forEach(t=>{t.ganttBarConfig.bundle===l&&r.push(t)})}),r},i=l=>{if(!(!e.value||l.ganttBarConfig.pushOnOverlap===!1)){for(const r of["left","right"]){const n=r,{gapDistanceSoFar:t,bundleBarsAndGapDist:u}=f(l,0,n);let d=t;const g=u;if(!g)continue;for(let x=0;x<g.length;x++){const m=g[x].bar,b=g[x].gapDistance;a(m.ganttBarConfig.bundle).filter(D=>D!==m).forEach(D=>{const h=f(D,b,n),y=h.gapDistanceSoFar,k=h.bundleBarsAndGapDist;y!=null&&(!d||y<d)&&(d=y),k.forEach(c=>{g.find(w=>w.bar===c.bar)||g.push(c)})})}const p=document.getElementById(l.ganttBarConfig.id);d!=null&&n==="left"?l.ganttBarConfig.dragLimitLeft=p.offsetLeft-d:d!=null&&n==="right"&&(l.ganttBarConfig.dragLimitRight=p.offsetLeft+p.offsetWidth+d)}a(l.ganttBarConfig.bundle).forEach(r=>{r.ganttBarConfig.dragLimitLeft=l.ganttBarConfig.dragLimitLeft,r.ganttBarConfig.dragLimitRight=l.ganttBarConfig.dragLimitRight})}},f=(l,r=0,n)=>{const t=l.ganttBarConfig.bundle?[{bar:l,gapDistance:r}]:[];let u=l,d=s(u,n);if(n==="left")for(;d;){const g=document.getElementById(u.ganttBarConfig.id),p=document.getElementById(d.ganttBarConfig.id),x=p.offsetLeft+p.offsetWidth;if(r+=g.offsetLeft-x,d.ganttBarConfig.immobile)return{gapDistanceSoFar:r,bundleBarsAndGapDist:t};d.ganttBarConfig.bundle&&t.push({bar:d,gapDistance:r}),u=d,d=s(d,"left")}if(n==="right")for(;d;){const g=document.getElementById(u.ganttBarConfig.id),p=document.getElementById(d.ganttBarConfig.id),x=g.offsetLeft+g.offsetWidth;if(r+=p.offsetLeft-x,d.ganttBarConfig.immobile)return{gapDistanceSoFar:r,bundleBarsAndGapDist:t};d.ganttBarConfig.bundle&&t.push({bar:d,gapDistance:r}),u=d,d=s(d,"right")}return{gapDistanceSoFar:null,bundleBarsAndGapDist:t}},s=(l,r)=>{var n,t;const u=document.getElementById(l.ganttBarConfig.id),d=(t=(n=o().find(p=>p.bars.includes(l)))==null?void 0:n.bars)!=null?t:[];let g=[];return r==="left"?g=d.filter(p=>{const x=document.getElementById(p.ganttBarConfig.id);return x&&x.offsetLeft<u.offsetLeft&&p.ganttBarConfig.pushOnOverlap!==!1}):g=d.filter(p=>{const x=document.getElementById(p.ganttBarConfig.id);return x&&x.offsetLeft>u.offsetLeft&&p.ganttBarConfig.pushOnOverlap!==!1}),g.length>0?g.reduce((p,x)=>{const m=document.getElementById(p.ganttBarConfig.id),b=document.getElementById(x.ganttBarConfig.id),D=Math.abs(m.offsetLeft-u.offsetLeft),h=Math.abs(b.offsetLeft-u.offsetLeft);return D<h?p:x},g[0]):null};return{setDragLimitsOfGanttBar:i}}const Xt=["id"],Kt={class:"g-gantt-bar-label"},Zt=["innerHTML"],Jt=$("div",{class:"g-gantt-bar-handle-left"},null,-1),ea=$("div",{class:"g-gantt-bar-handle-right"},null,-1),ta=U({__name:"GGanttBar",props:{bar:{}},setup(e){const o=e,a=qe(),i=z(),{rowHeight:f}=i,{bar:s}=ne(o),{mapTimeToPosition:l,mapPositionToTime:r}=fe(),{initDragOfBar:n,initDragOfBundle:t}=Qt(),{setDragLimitsOfGanttBar:u}=Vt(),d=L(!1),g=W(()=>s.value.ganttBarConfig);function p(M){g.value.bundle!=null?t(s.value,M):n(s.value,M),d.value=!0}const x=()=>{u(s.value),!g.value.immobile&&(window.addEventListener("mousemove",p,{once:!0}),window.addEventListener("mouseup",()=>{window.removeEventListener("mousemove",p),d.value=!1},{once:!0}))},m=de(Ae),b=M=>{var T;M.preventDefault(),M.type==="mousedown"&&x();const E=(T=m==null?void 0:m.value)==null?void 0:T.getBoundingClientRect();if(!E)return;const S=r(M.clientX-E.left);a(M,s.value,S)},{barStart:D,barEnd:h,width:y,chartStart:k,chartEnd:c,chartSize:w}=i,v=L(0),C=L(0);return Ie(()=>{ce([s,y,k,c,w.width],()=>{v.value=l(s.value[D.value]),C.value=l(s.value[h.value])},{deep:!0,immediate:!0})}),(M,T)=>(O(),Y("div",{id:g.value.id,class:we(["g-gantt-bar",g.value.class||""]),style:H(K(X({},g.value.style),{position:"absolute",top:`${B(f)*.1}px`,left:`${v.value}px`,width:`${C.value-v.value}px`,height:`${B(f)*.8}px`,zIndex:d.value?3:2})),onMousedown:b,onClick:b,onDblclick:b,onMouseenter:b,onMouseleave:b,onContextmenu:b},[$("div",Kt,[G(M.$slots,"default",{bar:B(s)},()=>[$("div",null,N(g.value.label||""),1),g.value.html?(O(),Y("div",{key:0,innerHTML:g.value.html},null,8,Zt)):F("",!0)])]),g.value.hasHandles?(O(),Y(Z,{key:0},[Jt,ea],64)):F("",!0)],46,Xt))}}),aa=U({__name:"GGanttRow",props:{label:{},bars:{},highlightOnHover:{type:Boolean}},emits:["drop"],setup(e,{emit:o}){const a=e,{rowHeight:i,colors:f,labelColumnTitle:s}=z(),{highlightOnHover:l}=ne(a),r=L(!1),n=W(()=>({height:`${i.value}px`,background:l!=null&&l.value&&r.value?f.value.hoverHighlight:null})),{mapPositionToTime:t}=fe(),u=L(null);ue(Ae,u);const d=p=>{var x;const m=(x=u.value)==null?void 0:x.getBoundingClientRect();if(!m){console.error("Vue-Ganttastic: failed to find bar container element for row.");return}const b=p.clientX-m.left,D=t(b);o("drop",{e:p,datetime:D})},g=p=>!p||/^\s*$/.test(p);return(p,x)=>(O(),Y("div",{class:"g-gantt-row",style:H(n.value),onDragover:x[0]||(x[0]=ot(m=>r.value=!0,["prevent"])),onDragleave:x[1]||(x[1]=m=>r.value=!1),onDrop:x[2]||(x[2]=m=>d(m)),onMouseover:x[3]||(x[3]=m=>r.value=!0),onMouseleave:x[4]||(x[4]=m=>r.value=!1)},[!g(p.label)&&!B(s)?(O(),Y("div",{key:0,class:"g-gantt-row-label",style:H({background:B(f).primary,color:B(f).text})},[G(p.$slots,"label",{},()=>[ie(N(p.label),1)])],4)):F("",!0),$("div",it({ref_key:"barContainer",ref:u,class:"g-gantt-row-bars-container"},p.$attrs),[xe(nt,{name:"bar-transition",tag:"div"},{default:R(()=>[(O(!0),Y(Z,null,ae(p.bars,m=>(O(),P(ta,{key:m.ganttBarConfig.id,bar:m},{default:R(()=>[G(p.$slots,"bar-label",{bar:m})]),_:2},1032,["bar"]))),128))]),_:3})],16)],36))}});function Q(e,o="top"){if(!e||typeof document>"u")return;const a=document.head,i=document.createElement("style");o==="top"&&a.firstChild?a.insertBefore(i,a.firstChild):a.appendChild(i),i.appendChild(document.createTextNode(e))}Q(`
.g-gantt-chart {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  border-radius: 5px;
}
.with-column {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.g-gantt-rows-container {
  position: relative;
}
.labels-in-column {
  display: flex;
  flex-direction: row;
}
`,"top");Q(`
.g-gantt-row {
  width: 100%;
  transition: background 0.4s;
  position: relative;
}
.g-gantt-row > .g-gantt-row-bars-container {
  position: relative;
  border-top: 1px solid #eaeaea;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
}
.g-gantt-row-label {
  position: absolute;
  top: 0;
  left: 0px;
  padding: 0px 8px;
  display: flex;
  align-items: center;
  height: 60%;
  min-height: 20px;
  font-size: 0.8em;
  font-weight: bold;
  border-bottom-right-radius: 6px;
  background: #f2f2f2;
  z-index: 3;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.6);
}
.bar-transition-leave-active,
.bar-transition-enter-active {
  transition: all 0.2s;
}
.bar-transition-enter-from,
.bar-transition-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
`,"top");Q(`
.g-grid-container {
  position: absolute;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.g-grid-line {
  width: 1px;
  height: 100%;
  border-left: 1px solid #eaeaea;
}
`,"top");Q(`
.g-label-column {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: rgb(64, 64, 64);
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  font-size: 0.9em;
}
.g-label-column-header {
  width: 100%;
  height: 80px;
  min-height: 80px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
}
.g-label-column-rows {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 5px;
}
.g-label-column-row {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0.1rem 0.3rem;
  overflow: hidden;
  white-space: normal;
  box-sizing: border-box;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.g-label-column-row:last-child {
  border-bottom-left-radius: 5px;
}
`,"top");Q(`
.g-timeaxis {
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: white;
  z-index: 4;
  display: flex;
  flex-direction: column;
}
.g-timeunits-container {
  display: flex;
  width: 100%;
  height: 50%;
}
.g-timeunit {
  height: 100%;
  font-size: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.g-upper-timeunit {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.g-timeaxis-hour-pin {
  width: 1px;
  height: 10px;
}
`,"top");Q(`
.g-gantt-tooltip {
  position: fixed;
  background: black;
  color: white;
  z-index: 4;
  font-size: 0.85em;
  padding: 5px;
  border-radius: 3px;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}
.g-gantt-tooltip:before {
  content: "";
  position: absolute;
  top: 0;
  left: 10%;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-bottom-color: black;
  border-top: 0;
  margin-left: -5px;
  margin-top: -5px;
}
.g-gantt-tooltip-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-right: 4px;
}
.g-fade-enter-active,
.g-fade-leave-active {
  transition: opacity 0.3s ease;
}
.g-fade-enter-from,
.g-fade-leave-to {
  opacity: 0;
}
`,"top");Q(`
.g-grid-current-time {
  position: absolute;
  height: 100%;
  display: flex;
  z-index: 5;
}
.g-grid-current-time-marker {
  width: 0px;
  height: calc(100% - 2px);
  display: flex;
}
.g-grid-current-time-text {
  font-size: x-small;
}
`,"top");Q(`
.g-gantt-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: cadetblue;
  overflow: hidden;
}
.g-gantt-bar-label {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 14px 0 14px; /* 14px is the width of the handle */
  display: flex;
  justify-content: center;
  align-items: center;
}
.g-gantt-bar-label > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.g-gantt-bar-handle-left,
.g-gantt-bar-handle-right {
  position: absolute;
  width: 10px;
  height: 100%;
  background: white;
  opacity: 0.7;
  border-radius: 0px;
  cursor: ew-resize;
  top: 0;
}
.g-gantt-bar-handle-left {
  left: 0;
}
.g-gantt-bar-handle-right {
  right: 0;
}
.g-gantt-bar-label img {
  pointer-events: none;
}
`,"top");const oa=U({__name:"index",setup(e){const o=L([[{week:"星期一",beginDate:"06:00",endDate:"22:00",ganttBarConfig:{id:"0",hasHandles:!0,label:"需求收集和分析  负责人：小张",style:{background:"#e96560"}}}],[{week:"星期二",beginDate:"09:00",endDate:"18:00",ganttBarConfig:{id:"1",hasHandles:!0,label:"系统设计  负责人：小强",style:{background:"#5ccfa3"}}}],[{week:"星期三",beginDate:"07:00",endDate:"20:00",ganttBarConfig:{id:"2",hasHandles:!0,label:"编码实现  负责人：老李",style:{background:"#77d6fa"}}}],[{week:"星期四",beginDate:"06:00",endDate:"21:00",ganttBarConfig:{id:"3",hasHandles:!0,label:"编码实现  负责人：小明",style:{color:"#fff",background:"#1b2a47"}}}],[{week:"星期五",beginDate:"05:00",endDate:"19:00",ganttBarConfig:{id:"4",hasHandles:!0,label:"内部测试  负责人：小雪",style:{background:"#5ccfa3"}}}],[{week:"星期六",beginDate:"10:00",endDate:"22:00",ganttBarConfig:{id:"5",hasHandles:!0,label:"系统优化和文档整理  负责人：小欣",style:{background:"#f8bc45"}}}],[{week:"星期天",beginDate:"04:00",endDate:"23:59",ganttBarConfig:{id:"6",immobile:!1,hasHandles:!1,label:"部署和上线  负责人：老王",style:{background:"#f3953d"}}}]]);function a(){const f=new Date,s=f.getDay(),l=new Date(f);l.setDate(f.getDate()-s+1);const r=new Date(l);r.setDate(l.getDate()+6);const n=d=>{const g=d.getFullYear(),p=String(d.getMonth()+1).padStart(2,"0"),x=String(d.getDate()).padStart(2,"0");return`${g}-${p}-${x}`},t=n(l),u=n(r);return{currentWeekStart:t,currentWeekEnd:u}}const i=a();return(f,s)=>(O(),P(B(Pt),{"chart-start":"00:00","chart-end":"23:59",precision:"hour","date-format":"HH:mm","bar-start":"beginDate","bar-end":"endDate",grid:""},{"upper-timeunit":R(()=>[$("h1",null,N(`${B(i).currentWeekStart} / ${B(i).currentWeekEnd}`),1)]),default:R(()=>[(O(!0),Y(Z,null,ae(o.value,(l,r)=>(O(),P(B(aa),{key:r,bars:l,label:l[0].week,"highlight-on-hover":""},null,8,["bars","label"]))),128))]),_:1}))}});export{oa as default};
