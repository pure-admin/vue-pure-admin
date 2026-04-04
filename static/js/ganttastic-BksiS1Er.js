import{A as e,B as t,C as n,F as r,K as i,Kt as a,O as o,Ot as s,Q as c,S as l,St as u,Wt as d,X as f,Y as p,Z as m,_ as h,at as g,b as _,ct as v,en as y,h as b,j as x,jt as S,k as C,mt as w,n as T,p as E,qt as D,r as O,ut as k,w as A,x as j,yt as M,z as N}from"./vue.runtime.esm-bundler-7ocrn71d.js";import{n as P,t as F}from"./objectSpread2-Ct4-21PI.js";import{t as I}from"./asyncToGenerator-DL1V6A25.js";import{Mt as L}from"./index-r1RzYCK_.js";var R=y(L(),1);P();var z=typeof globalThis<`u`?globalThis:typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:{},B={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){var e=`day`;return function(t,n,r){var i=function(t){return t.add(4-t.isoWeekday(),e)},a=n.prototype;a.isoWeekYear=function(){return i(this).year()},a.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),e);var n,a,o,s,c=i(this),l=(n=this.isoWeekYear(),a=this.$u,o=(a?r.utc:r)().year(n).startOf(`year`),s=4-o.isoWeekday(),o.isoWeekday()>4&&(s+=7),o.add(s,e));return c.diff(l,`week`)+1},a.isoWeekday=function(e){return this.$utils().u(e)?this.day()||7:this.day(this.day()%7?e:e-7)};var o=a.startOf;a.startOf=function(e,t){var n=this.$utils(),r=!!n.u(t)||t;return n.p(e)===`isoweek`?r?this.date(this.date()-(this.isoWeekday()-1)).startOf(`day`):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf(`day`):o.bind(this)(e,t)}}})})(B),B.exports;var V={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){return function(e,t){t.prototype.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)}}})})(V),V.exports;var ee={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){return function(e,t){t.prototype.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)}}})})(ee),ee.exports;var te={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){return function(e,t,n){t.prototype.isBetween=function(e,t,r,i){var a=n(e),o=n(t),s=(i=i||`()`)[0]===`(`,c=i[1]===`)`;return(s?this.isAfter(a,r):!this.isBefore(a,r))&&(c?this.isBefore(o,r):!this.isAfter(o,r))||(s?this.isBefore(a,r):!this.isAfter(a,r))&&(c?this.isAfter(o,r):!this.isBefore(o,r))}}})})(te),te.exports;var ne={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){var e=`week`,t=`year`;return function(n,r,i){var a=r.prototype;a.week=function(n){if(n===void 0&&(n=null),n!==null)return this.add(7*(n-this.week()),`day`);var r=this.$locale().yearStart||1;if(this.month()===11&&this.date()>25){var a=i(this).startOf(t).add(1,t).date(r),o=i(this).endOf(e);if(a.isBefore(o))return 1}var s=i(this).startOf(t).date(r).startOf(e).subtract(1,`millisecond`),c=this.diff(s,e,!0);return c<0?i(this).startOf(`week`).week():Math.ceil(c)},a.weeks=function(e){return e===void 0&&(e=null),this.week(e)}}})})(ne),ne.exports;var re={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){return function(e,t,n){var r=t.prototype,i=r.format;n.en.ordinal=function(e){var t=[`th`,`st`,`nd`,`rd`],n=e%100;return`[`+e+(t[(n-20)%10]||t[n]||t[0])+`]`},r.format=function(e){var t=this,n=this.$locale();if(!this.isValid())return i.bind(this)(e);var r=this.$utils(),a=(e||`YYYY-MM-DDTHH:mm:ssZ`).replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(e){switch(e){case`Q`:return Math.ceil((t.$M+1)/3);case`Do`:return n.ordinal(t.$D);case`gggg`:return t.weekYear();case`GGGG`:return t.isoWeekYear();case`wo`:return n.ordinal(t.week(),`W`);case`w`:case`ww`:return r.s(t.week(),e===`w`?1:2,`0`);case`W`:case`WW`:return r.s(t.isoWeek(),e===`W`?1:2,`0`);case`k`:case`kk`:return r.s(String(t.$H===0?24:t.$H),e===`k`?1:2,`0`);case`X`:return Math.floor(t.$d.getTime()/1e3);case`x`:return t.$d.getTime();case`z`:return`[`+t.offsetName()+`]`;case`zzz`:return`[`+t.offsetName(`long`)+`]`;default:return e}});return i.bind(this)(a)}}})})(re),re.exports;var ie={exports:{}};(function(e,t){(function(t,n){e.exports=n()})(z,function(){var e={LTS:`h:mm:ss A`,LT:`h:mm A`,L:`MM/DD/YYYY`,LL:`MMMM D, YYYY`,LLL:`MMMM D, YYYY h:mm A`,LLLL:`dddd, MMMM D, YYYY h:mm A`},t=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,n=/\d\d/,r=/\d\d?/,i=/\d*[^-_:/,()\s\d]+/,a={},o=function(e){return(e=+e)+(e>68?1900:2e3)},s=function(e){return function(t){this[e]=+t}},c=[/[+-]\d\d:?(\d\d)?|Z/,function(e){(this.zone||(this.zone={})).offset=function(e){if(!e||e===`Z`)return 0;var t=e.match(/([+-]|\d\d)/g),n=60*t[1]+(+t[2]||0);return n===0?0:t[0]===`+`?-n:n}(e)}],l=function(e){var t=a[e];return t&&(t.indexOf?t:t.s.concat(t.f))},u=function(e,t){var n,r=a.meridiem;if(r){for(var i=1;i<=24;i+=1)if(e.indexOf(r(i,0,t))>-1){n=i>12;break}}else n=e===(t?`pm`:`PM`);return n},d={A:[i,function(e){this.afternoon=u(e,!1)}],a:[i,function(e){this.afternoon=u(e,!0)}],S:[/\d/,function(e){this.milliseconds=100*e}],SS:[n,function(e){this.milliseconds=10*e}],SSS:[/\d{3}/,function(e){this.milliseconds=+e}],s:[r,s(`seconds`)],ss:[r,s(`seconds`)],m:[r,s(`minutes`)],mm:[r,s(`minutes`)],H:[r,s(`hours`)],h:[r,s(`hours`)],HH:[r,s(`hours`)],hh:[r,s(`hours`)],D:[r,s(`day`)],DD:[n,s(`day`)],Do:[i,function(e){var t=a.ordinal;if(this.day=e.match(/\d+/)[0],t)for(var n=1;n<=31;n+=1)t(n).replace(/\[|\]/g,``)===e&&(this.day=n)}],M:[r,s(`month`)],MM:[n,s(`month`)],MMM:[i,function(e){var t=l(`months`),n=(l(`monthsShort`)||t.map(function(e){return e.slice(0,3)})).indexOf(e)+1;if(n<1)throw Error();this.month=n%12||n}],MMMM:[i,function(e){var t=l(`months`).indexOf(e)+1;if(t<1)throw Error();this.month=t%12||t}],Y:[/[+-]?\d+/,s(`year`)],YY:[n,function(e){this.year=o(e)}],YYYY:[/\d{4}/,s(`year`)],Z:c,ZZ:c};function f(n){for(var r=n,i=a&&a.formats,o=(n=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(t,n,r){var a=r&&r.toUpperCase();return n||i[r]||e[r]||i[a].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(e,t,n){return t||n.slice(1)})})).match(t),s=o.length,c=0;c<s;c+=1){var l=o[c],u=d[l],f=u&&u[0],p=u&&u[1];o[c]=p?{regex:f,parser:p}:l.replace(/^\[|\]$/g,``)}return function(e){for(var t={},n=0,r=0;n<s;n+=1){var i=o[n];if(typeof i==`string`)r+=i.length;else{var a=i.regex,c=i.parser,l=e.slice(r),u=a.exec(l)[0];c.call(t,u),e=e.replace(u,``)}}return function(e){var t=e.afternoon;if(t!==void 0){var n=e.hours;t?n<12&&(e.hours+=12):n===12&&(e.hours=0),delete e.afternoon}}(t),t}}return function(e,t,n){n.p.customParseFormat=!0,e&&e.parseTwoDigitYear&&(o=e.parseTwoDigitYear);var r=t.prototype,i=r.parse;r.parse=function(e){var t=e.date,r=e.utc,o=e.args;this.$u=r;var s=o[1];if(typeof s==`string`){var c=o[2]===!0,l=o[3]===!0,u=c||l,d=o[2];l&&(d=o[2]),a=this.$locale(),!c&&d&&(a=n.Ls[d]),this.$d=function(e,t,n){try{if([`x`,`X`].indexOf(t)>-1)return new Date((t===`X`?1e3:1)*e);var r=f(t)(e),i=r.year,a=r.month,o=r.day,s=r.hours,c=r.minutes,l=r.seconds,u=r.milliseconds,d=r.zone,p=new Date,m=o||(i||a?1:p.getDate()),h=i||p.getFullYear(),g=0;i&&!a||(g=a>0?a-1:p.getMonth());var _=s||0,v=c||0,y=l||0,b=u||0;return d?new Date(Date.UTC(h,g,m,_,v,y,b+60*d.offset*1e3)):n?new Date(Date.UTC(h,g,m,_,v,y,b)):new Date(h,g,m,_,v,y,b)}catch(e){return new Date(``)}}(t,s,r),this.init(),d&&d!==!0&&(this.$L=this.locale(d).$L),u&&t!=this.format(s)&&(this.$d=new Date(``)),a={}}else if(s instanceof Array)for(var p=s.length,m=1;m<=p;m+=1){o[1]=s[m-1];var h=n.apply(this,o);if(h.isValid()){this.$d=h.$d,this.$L=h.$L,this.init();break}m===p&&(this.$d=new Date(``))}else i.call(this,e)}}})})(ie),ie.exports;var ae=Symbol(`CHART_ROWS_KEY`),oe=Symbol(`CONFIG_KEY`),se=Symbol(`EMIT_BAR_EVENT_KEY`),H=Symbol(`BAR_CONTAINER_KEY`);function U(){let e=r(oe);if(!e)throw Error(`Failed to inject config!`);return e}var W=`YYYY-MM-DD HH:mm`;function G(e=U()){let{chartStart:t,chartEnd:n,barStart:r,barEnd:i,dateFormat:a}=e,o=_(()=>c(t.value)),s=_(()=>c(n.value)),c=(e,t)=>{let n;if(t!==void 0&&typeof e!=`string`&&!(e instanceof Date)&&(n=t===`start`?e[r.value]:e[i.value]),typeof e==`string`)n=e;else if(e instanceof Date)return(0,R.default)(e);let o=a.value||W;return(0,R.default)(n,o,!0)};return{chartStartDayjs:o,chartEndDayjs:s,toDayjs:c,format:(e,t)=>t===!1?e instanceof Date?e:(0,R.default)(e).toDate():(typeof e==`string`||e instanceof Date?c(e):e).format(t)}}function K(){let{precision:e}=U(),{chartStartDayjs:t,chartEndDayjs:n}=G(),r=_(()=>{switch(e==null?void 0:e.value){case`hour`:return`day`;case`day`:return`month`;case`date`:case`week`:return`month`;case`month`:return`year`;default:throw Error(`Precision prop incorrect. Must be one of the following: 'hour', 'day', 'date', 'week', 'month'`)}}),i=_(()=>{switch(e.value){case`date`:return`day`;case`week`:return`isoWeek`;default:return e.value}}),a={hour:`HH`,date:`DD.MMM`,day:`DD.MMM`,week:`WW`,month:`MMMM YYYY`,year:`YYYY`};return{timeaxisUnits:_(()=>{let o=[],s=[],c=n.value.diff(t.value,`minutes`,!0),l=r.value,u=i.value,d=t.value,f=t.value;for(;f.isSameOrBefore(n.value);){let t=f.endOf(u),r=t.isAfter(n.value)?n.value.diff(f,`minutes`,!0)/c*100:t.diff(f,`minutes`,!0)/c*100;s.push({label:f.format(a[e==null?void 0:e.value]),value:String(f),date:f.toDate(),width:String(r)+`%`}),f=t.add(1,u===`isoWeek`?`week`:u).startOf(u)}for(;d.isSameOrBefore(n.value);){let e=d.endOf(l),t=e.isAfter(n.value)?n.value.diff(d,`minutes`,!0)/c*100:e.diff(d,`minutes`,!0)/c*100;o.push({label:d.format(a[l]),value:String(d),date:d.toDate(),width:String(t)+`%`}),d=e.add(1,l).startOf(l)}return{upperUnits:o,lowerUnits:s}})}}var ce={class:`g-grid-container`},le=e({__name:`GGanttGrid`,props:{highlightedUnits:{}},setup(e){let{colors:t}=U(),{timeaxisUnits:n}=K();return(e,r)=>(p(),A(`div`,ce,[(p(!0),A(b,null,m(S(n).lowerUnits,({label:n,value:r,width:i})=>{var o;return p(),A(`div`,{key:n,class:`g-grid-line`,style:a({width:i,background:(o=e.highlightedUnits)!=null&&o.includes(Number(r))?S(t).hoverHighlight:void 0})},null,4)}),128))]))}});function q(){let e=r(ae);if(!e)throw Error(`Failed to inject getChartRows!`);return e}var ue={class:`g-label-column-rows`},de=e({__name:`GGanttLabelColumn`,setup(e){let{font:t,colors:n,labelColumnTitle:r,rowHeight:i}=U(),o=q();return(e,s)=>(p(),A(`div`,{class:`g-label-column`,style:a({fontFamily:S(t),color:S(n).text})},[c(e.$slots,`label-column-title`,{},()=>[j(`div`,{class:`g-label-column-header`,style:a({background:S(n).primary})},D(S(r)),5)]),j(`div`,ue,[(p(!0),A(b,null,m(S(o)(),({label:t},r)=>(p(),A(`div`,{key:`${t}_${r}`,class:`g-label-column-row`,style:a({background:r%2==0?S(n).ternary:S(n).quartenary,height:`${S(i)}px`})},[c(e.$slots,`label-column-row`,{label:t},()=>[j(`span`,null,D(t),1)])],4))),128))])],4))}}),fe={class:`g-timeaxis`},pe={class:`g-timeunits-container`},me={class:`g-timeunits-container`},he=e({__name:`GGanttTimeaxis`,setup(e){let{precision:t,colors:r}=U(),{timeaxisUnits:i}=K();return(e,s)=>(p(),A(`div`,fe,[j(`div`,pe,[(p(!0),A(b,null,m(S(i).upperUnits,({label:t,value:n,date:i,width:s},l)=>(p(),A(`div`,{key:t,class:`g-upper-timeunit`,style:a({background:l%2==0?S(r).primary:S(r).secondary,color:S(r).text,width:s})},[c(e.$slots,`upper-timeunit`,{label:t,value:n,date:i},()=>[o(D(t),1)])],4))),128))]),j(`div`,me,[(p(!0),A(b,null,m(S(i).lowerUnits,({label:i,value:s,date:l,width:u},d)=>(p(),A(`div`,{key:i,class:`g-timeunit`,style:a({background:d%2==0?S(r).ternary:S(r).quartenary,color:S(r).text,flexDirection:S(t)===`hour`?`column`:`row`,alignItems:S(t)===`hour`?``:`center`,width:u})},[c(e.$slots,`timeunit`,{label:i,value:s,date:l},()=>[o(D(i),1)]),S(t)===`hour`?(p(),A(`div`,{key:0,class:`g-timeaxis-hour-pin`,style:a({background:S(r).text})},null,4)):n(``,!0)],4))),128))])]))}}),ge=`cadetblue`,_e=e({__name:`GGanttBarTooltip`,props:{bar:{},modelValue:{type:Boolean}},setup(e){let r=e,i={hour:`HH:mm`,day:`DD. MMM HH:mm`,date:`DD. MMMM YYYY`,month:`DD. MMMM YYYY`,week:`DD. MMMM YYYY (WW)`},{bar:d}=s(r),{precision:f,font:m,barStart:g,barEnd:y,rowHeight:b}=U(),x=u(`0px`),w=u(`0px`);v(()=>r.bar,I(function*(){var e;yield t();let n=((e=d==null?void 0:d.value)==null?void 0:e.ganttBarConfig.id)||``;if(!n)return;let r=document.getElementById(n),{top:i,left:a}=(r==null?void 0:r.getBoundingClientRect())||{top:0,left:0},o=Math.max(a,10);x.value=`${i+b.value-10}px`,w.value=`${o}px`}),{deep:!0,immediate:!0});let E=_(()=>{var e,t;return((t=(e=d==null?void 0:d.value)==null?void 0:e.ganttBarConfig.style)==null?void 0:t.background)||ge}),{toDayjs:O}=G(),M=_(()=>{var e;return(e=d.value)==null?void 0:e[g.value]}),N=_(()=>{var e;return(e=d.value)==null?void 0:e[y.value]}),P=_(()=>{if(!(d!=null&&d.value))return``;let e=i[f.value];return`${O(M.value).format(e)} \u2013 ${O(N.value).format(e)}`});return(e,t)=>(p(),l(h,{to:`body`},[C(T,{name:`g-fade`,mode:`out-in`},{default:k(()=>[e.modelValue?(p(),A(`div`,{key:0,class:`g-gantt-tooltip`,style:a({top:x.value,left:w.value,fontFamily:S(m)})},[j(`div`,{class:`g-gantt-tooltip-color-dot`,style:a({background:E.value})},null,4),c(e.$slots,`default`,{bar:S(d),barStart:M.value,barEnd:N.value},()=>[o(D(P.value),1)])],4)):n(``,!0)]),_:3})]))}});function J(e=U()){let{dateFormat:t,chartSize:n}=e,{chartStartDayjs:r,chartEndDayjs:i,toDayjs:a,format:o}=G(e),s=_(()=>i.value.diff(r.value,`minutes`));return{mapTimeToPosition:e=>{let t=n.width.value||0,i=a(e).diff(r.value,`minutes`,!0);return Math.ceil(i/s.value*t)},mapPositionToTime:e=>{let i=e/(n.width.value||0)*s.value;return o(r.value.add(i,`minutes`),t.value)}}}var ve=e({__name:`GGanttCurrentTime`,setup(e){let{mapTimeToPosition:t}=J(),n=u((0,R.default)()),{colors:r,dateFormat:i,currentTimeLabel:s}=U(),l=_(()=>{let e=i.value||`YYYY-MM-DD HH:mm`;return t((0,R.default)(n.value,e).format(e))});return(e,t)=>(p(),A(`div`,{class:`g-grid-current-time`,style:a({left:`${l.value}px`})},[j(`div`,{class:`g-grid-current-time-marker`,style:a({border:`1px dashed ${S(r).markerCurrentTime}`})},null,4),j(`span`,{class:`g-grid-current-time-text`,style:a({color:S(r).markerCurrentTime})},[c(e.$slots,`current-time-label`,{},()=>[o(D(S(s)),1)])],4)],4))}}),ye,Y=typeof window<`u`;Y&&(ye=window==null?void 0:window.navigator)!=null&&ye.userAgent&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function be(e){return typeof e==`function`?e():S(e)}function xe(e){return e}function Se(e){return w()?(M(e),!0):!1}function Ce(e,n=!0){x()?i(e):n?e():t(e)}function we(e){var t;let n=be(e);return(t=n==null?void 0:n.$el)==null?n:t}var Te=Y?window:void 0;Y&&window.document,Y&&window.navigator,Y&&window.location;function Ee(e,t=!1){let n=u(),r=()=>n.value=!!e();return r(),Ce(r,t),n}var X=typeof globalThis<`u`?globalThis:typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:{},Z=`__vueuse_ssr_handlers__`;X[Z]=X[Z]||{},X[Z];var De=Object.getOwnPropertySymbols,Oe=Object.prototype.hasOwnProperty,ke=Object.prototype.propertyIsEnumerable,Ae=(e,t)=>{var n={};for(var r in e)Oe.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&De)for(var r of De(e))t.indexOf(r)<0&&ke.call(e,r)&&(n[r]=e[r]);return n};function je(e,t,n={}){let r=n,{window:i=Te}=r,a=Ae(r,[`window`]),o,s=Ee(()=>i&&`ResizeObserver`in i),c=()=>{o&&(o.disconnect(),o=void 0)},l=v(()=>we(e),e=>{c(),s.value&&i&&e&&(o=new ResizeObserver(t),o.observe(e,a))},{immediate:!0,flush:`post`}),u=()=>{c(),l()};return Se(u),{isSupported:s,stop:u}}function Me(e,t={width:0,height:0},n={}){let r=u(t.width),i=u(t.height);return je(e,([e])=>{r.value=e.contentRect.width,i.value=e.contentRect.height},n),v(()=>we(e),e=>{r.value=e?t.width:0,i.value=e?t.height:0}),{width:r,height:i}}var Ne;(function(e){e.UP=`UP`,e.RIGHT=`RIGHT`,e.DOWN=`DOWN`,e.LEFT=`LEFT`,e.NONE=`NONE`})(Ne||(Ne={}));var Pe=Object.defineProperty,Fe=Object.getOwnPropertySymbols,Ie=Object.prototype.hasOwnProperty,Le=Object.prototype.propertyIsEnumerable,Re=(e,t,n)=>t in e?Pe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;((e,t)=>{for(var n in t||(t={}))Ie.call(t,n)&&Re(e,n,t[n]);if(Fe)for(var n of Fe(t))Le.call(t,n)&&Re(e,n,t[n]);return e})({linear:xe},{easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]});var Q={default:{primary:`#eeeeee`,secondary:`#E0E0E0`,ternary:`#F5F5F5`,quartenary:`#ededed`,hoverHighlight:`rgba(204, 216, 219, 0.5)`,markerCurrentTime:`#000`,text:`#404040`,background:`white`},creamy:{primary:`#ffe8d9`,secondary:`#fcdcc5`,ternary:`#fff6f0`,quartenary:`#f7ece6`,hoverHighlight:`rgba(230, 221, 202, 0.5)`,markerCurrentTime:`#000`,text:`#542d05`,background:`white`},crimson:{primary:`#a82039`,secondary:`#c41238`,ternary:`#db4f56`,quartenary:`#ce5f64`,hoverHighlight:`rgba(196, 141, 141, 0.5)`,markerCurrentTime:`#000`,text:`white`,background:`white`},dark:{primary:`#404040`,secondary:`#303030`,ternary:`#353535`,quartenary:`#383838`,hoverHighlight:`rgba(159, 160, 161, 0.5)`,markerCurrentTime:`#fff`,text:`white`,background:`#525252`,toast:`#1f1f1f`},flare:{primary:`#e08a38`,secondary:`#e67912`,ternary:`#5e5145`,quartenary:`#665648`,hoverHighlight:`rgba(196, 141, 141, 0.5)`,markerCurrentTime:`#000`,text:`white`,background:`white`},fuchsia:{primary:`#de1d5a`,secondary:`#b50b41`,ternary:`#ff7da6`,quartenary:`#f2799f`,hoverHighlight:`rgba(196, 141, 141, 0.5)`,markerCurrentTime:`#000`,text:`white`,background:`white`},grove:{primary:`#3d9960`,secondary:`#288542`,ternary:`#72b585`,quartenary:`#65a577`,hoverHighlight:`rgba(160, 219, 171, 0.5)`,markerCurrentTime:`#000`,text:`white`,background:`white`},"material-blue":{primary:`#0D47A1`,secondary:`#1565C0`,ternary:`#42a5f5`,quartenary:`#409fed`,hoverHighlight:`rgba(110, 165, 196, 0.5)`,markerCurrentTime:`#000`,text:`white`,background:`white`},sky:{primary:`#b5e3ff`,secondary:`#a1d6f7`,ternary:`#d6f7ff`,quartenary:`#d0edf4`,hoverHighlight:`rgba(193, 202, 214, 0.5)`,markerCurrentTime:`#000`,text:`#022c47`,background:`white`},slumber:{primary:`#2a2f42`,secondary:`#2f3447`,ternary:`#35394d`,quartenary:`#2c3044`,hoverHighlight:`rgba(179, 162, 127, 0.5)`,markerCurrentTime:`#fff`,text:`#ffe0b3`,background:`#38383b`,toast:`#1f1f1f`},vue:{primary:`#258a5d`,secondary:`#41B883`,ternary:`#35495E`,quartenary:`#2a3d51`,hoverHighlight:`rgba(160, 219, 171, 0.5)`,markerCurrentTime:`#000`,text:`white`,background:`white`}},ze={class:`g-gantt-rows-container`},Be=e({__name:`GGanttChart`,props:{chartStart:{},chartEnd:{},precision:{default:`day`},barStart:{},barEnd:{},currentTime:{type:Boolean},currentTimeLabel:{default:``},dateFormat:{type:[String,Boolean],default:W},width:{default:`100%`},hideTimeaxis:{type:Boolean,default:!1},colorScheme:{default:`default`},grid:{type:Boolean,default:!1},pushOnOverlap:{type:Boolean,default:!1},noOverlap:{type:Boolean,default:!1},rowHeight:{default:40},highlightedUnits:{default:()=>[]},font:{default:`inherit`},labelColumnTitle:{default:``},labelColumnWidth:{default:`150px`}},emits:[`click-bar`,`mousedown-bar`,`mouseup-bar`,`dblclick-bar`,`mouseenter-bar`,`mouseleave-bar`,`dragstart-bar`,`drag-bar`,`dragend-bar`,`contextmenu-bar`],setup(e,{emit:t}){let r=e,{width:i,font:o,colorScheme:m}=s(r),h=g(),v=_(()=>typeof m.value==`string`?Q[m.value]||Q.default:m.value),y=()=>{var e;let t=(e=h.default)==null?void 0:e.call(h),n=[];return t&&t.forEach(e=>{var t;if((t=e.props)!=null&&t.bars){let{label:t,bars:r}=e.props;n.push({label:t,bars:r})}else Array.isArray(e.children)&&e.children.forEach(e=>{var t;let r=e;if((t=r==null?void 0:r.props)!=null&&t.bars){let{label:e,bars:t}=r.props;n.push({label:e,bars:t})}})}),n},b=u(!1),x=u(!1),w=u(void 0),T,E=e=>{T&&clearTimeout(T),T=setTimeout(()=>{b.value=!0},800),w.value=e},D=()=>{clearTimeout(T),b.value=!1},O=(e,n,r,i)=>{switch(e.type){case`click`:t(`click-bar`,{bar:n,e,datetime:r});break;case`mousedown`:t(`mousedown-bar`,{bar:n,e,datetime:r});break;case`mouseup`:t(`mouseup-bar`,{bar:n,e,datetime:r});break;case`dblclick`:t(`dblclick-bar`,{bar:n,e,datetime:r});break;case`mouseenter`:E(n),t(`mouseenter-bar`,{bar:n,e});break;case`mouseleave`:D(),t(`mouseleave-bar`,{bar:n,e});break;case`dragstart`:x.value=!0,t(`dragstart-bar`,{bar:n,e});break;case`drag`:t(`drag-bar`,{bar:n,e});break;case`dragend`:x.value=!1,t(`dragend-bar`,{bar:n,e,movedBars:i});break;case`contextmenu`:t(`contextmenu-bar`,{bar:n,e,datetime:r});break}},M=u(null),N=Me(M);return f(ae,y),f(oe,F(F({},s(r)),{},{colors:v,chartSize:N})),f(se,O),(e,t)=>(p(),A(`div`,null,[j(`div`,{class:d([{"labels-in-column":!!e.labelColumnTitle}])},[e.labelColumnTitle?(p(),l(de,{key:0,style:a({width:e.labelColumnWidth})},{"label-column-title":k(()=>[c(e.$slots,`label-column-title`)]),"label-column-row":k(({label:t})=>[c(e.$slots,`label-column-row`,{label:t})]),_:3},8,[`style`])):n(``,!0),j(`div`,{ref_key:`ganttChart`,ref:M,class:d([`g-gantt-chart`,{"with-column":e.labelColumnTitle}]),style:a({width:S(i),background:v.value.background,fontFamily:S(o)})},[e.hideTimeaxis?n(``,!0):(p(),l(he,{key:0},{"upper-timeunit":k(({label:t,value:n,date:r})=>[c(e.$slots,`upper-timeunit`,{label:t,value:n,date:r})]),timeunit:k(({label:t,value:n,date:r})=>[c(e.$slots,`timeunit`,{label:t,value:n,date:r})]),_:3})),e.grid?(p(),l(le,{key:1,"highlighted-units":e.highlightedUnits},null,8,[`highlighted-units`])):n(``,!0),e.currentTime?(p(),l(ve,{key:2},{"current-time-label":k(()=>[c(e.$slots,`current-time-label`)]),_:3})):n(``,!0),j(`div`,ze,[c(e.$slots,`default`)])],6)],2),C(_e,{"model-value":b.value||x.value,bar:w.value},{default:k(()=>[c(e.$slots,`bar-tooltip`,{bar:w.value})]),_:3},8,[`model-value`,`bar`])]))}});function Ve(e,t=()=>null,n=()=>null,r=U()){let{barStart:i,barEnd:a,pushOnOverlap:o}=r,s=u(!1),c=0,l,{mapPositionToTime:d}=J(r),{toDayjs:f}=G(r),p=t=>{let n=document.getElementById(e.ganttBarConfig.id);if(n){switch(c=t.clientX-(n.getBoundingClientRect().left||0),t.target.className){case`g-gantt-bar-handle-left`:document.body.style.cursor=`ew-resize`,l=g;break;case`g-gantt-bar-handle-right`:document.body.style.cursor=`ew-resize`,l=_;break;default:l=h}s.value=!0,window.addEventListener(`mousemove`,l),window.addEventListener(`mouseup`,y)}},m=()=>{var t;let n=document.getElementById(e.ganttBarConfig.id);return{barElement:n,barContainer:(t=n==null?void 0:n.closest(`.g-gantt-row-bars-container`))==null?void 0:t.getBoundingClientRect()}},h=n=>{let{barElement:r,barContainer:o}=m();if(!r||!o)return;let s=r.getBoundingClientRect().width,l=n.clientX-o.left-c,u=l+s;v(l,u)||(e[i.value]=d(l),e[a.value]=d(u),t(n,e))},g=n=>{let{barElement:r,barContainer:a}=m();if(!r||!a)return;let o=d(n.clientX-a.left);f(o).isSameOrAfter(f(e,`end`))||(e[i.value]=o,t(n,e))},_=n=>{let{barElement:r,barContainer:i}=m();if(!r||!i)return;let o=d(n.clientX-i.left);f(o).isSameOrBefore(f(e,`start`))||(e[a.value]=o,t(n,e))},v=(t,n)=>{if(!o.value)return!1;let r=e.ganttBarConfig.dragLimitLeft,i=e.ganttBarConfig.dragLimitRight;return t&&r!=null&&t<r||n&&i!=null&&n>i},y=t=>{s.value=!1,document.body.style.cursor=``,window.removeEventListener(`mousemove`,l),window.removeEventListener(`mouseup`,y),n(t,e)};return{isDragging:s,initDrag:p}}function He(){let e=r(se);if(!e)throw Error(`Failed to inject emitBarEvent!`);return e}function Ue(){let e=U(),t=q(),n=He(),{pushOnOverlap:r,barStart:i,barEnd:a,noOverlap:o,dateFormat:s}=e,c=new Map,{toDayjs:l,format:u}=G(),d=(t,r)=>{let{initDrag:i}=Ve(t,p,v,e);n(F(F({},r),{},{type:`dragstart`}),t),i(r),y(t)},f=(r,i)=>{let a=r.ganttBarConfig.bundle;a!=null&&(t().forEach(t=>{t.bars.forEach(t=>{if(t.ganttBarConfig.bundle===a){let{initDrag:n}=Ve(t,p,t===r?v:()=>null,e);n(i),y(t)}})}),n(F(F({},i),{},{type:`dragstart`}),r))},p=(e,t)=>{n(F(F({},e),{},{type:`drag`}),t),m(t)},m=e=>{if(!(r!=null&&r.value))return;let t=e,{overlapBar:n,overlapType:o}=h(t);for(;n;){y(n);let e=l(t[i.value]),r=l(t[a.value]),c=l(n[i.value]),d=l(n[a.value]),f;switch(o){case`left`:f=d.diff(e,`minutes`,!0),n[a.value]=u(t[i.value],s.value),n[i.value]=u(c.subtract(f,`minutes`),s.value);break;case`right`:f=r.diff(c,`minutes`,!0),n[i.value]=u(r,s.value),n[a.value]=u(d.add(f,`minutes`),s.value);break;default:console.warn(`Vue-Ganttastic: One bar is inside of the other one! This should never occur while push-on-overlap is active!`);return}n&&(o===`left`||o===`right`)&&g(n,f,o),t=n,{overlapBar:n,overlapType:o}=h(n)}},h=e=>{var n,r;let o,s,c,u=(r=(n=t().find(t=>t.bars.includes(e)))==null?void 0:n.bars)==null?[]:r,d=l(e[i.value]),f=l(e[a.value]);return{overlapBar:u.find(t=>{if(t===e)return!1;let n=l(t[i.value]),r=l(t[a.value]);return o=d.isBetween(n,r),s=f.isBetween(n,r),c=n.isBetween(d,f)||r.isBetween(d,f),o||s||c}),overlapType:o?`left`:s?`right`:c?`between`:null}},g=(e,n,r)=>{y(e),e.ganttBarConfig.bundle&&t().forEach(t=>{t.bars.forEach(t=>{t.ganttBarConfig.bundle===e.ganttBarConfig.bundle&&t!==e&&(y(t),_(t,n,r))})})},_=(e,t,n)=>{switch(n){case`left`:e[i.value]=u(l(e,`start`).subtract(t,`minutes`),s.value),e[a.value]=u(l(e,`end`).subtract(t,`minutes`),s.value);break;case`right`:e[i.value]=u(l(e,`start`).add(t,`minutes`),s.value),e[a.value]=u(l(e,`end`).add(t,`minutes`),s.value)}m(e)},v=(e,t)=>{b(),n(F(F({},e),{},{type:`dragend`}),t,void 0,new Map(c)),c.clear()},y=e=>{if(!c.has(e)){let t=e[i.value],n=e[a.value];c.set(e,{oldStart:t,oldEnd:n})}},b=()=>{if(r.value||!o.value)return;let e=!1;c.forEach((t,n)=>{let{overlapBar:r}=h(n);r!=null&&(e=!0)}),e&&c.forEach(({oldStart:e,oldEnd:t},n)=>{n[i.value]=e,n[a.value]=t})};return{initDragOfBar:d,initDragOfBundle:f}}function We(){let{pushOnOverlap:e}=U(),t=q(),n=e=>{let n=[];return e!=null&&t().forEach(t=>{t.bars.forEach(t=>{t.ganttBarConfig.bundle===e&&n.push(t)})}),n},r=t=>{if(!(!e.value||t.ganttBarConfig.pushOnOverlap===!1)){for(let e of[`left`,`right`]){let r=e,{gapDistanceSoFar:a,bundleBarsAndGapDist:o}=i(t,0,r),s=a,c=o;if(!c)continue;for(let e=0;e<c.length;e++){let t=c[e].bar,a=c[e].gapDistance;n(t.ganttBarConfig.bundle).filter(e=>e!==t).forEach(e=>{let t=i(e,a,r),n=t.gapDistanceSoFar,o=t.bundleBarsAndGapDist;n!=null&&(!s||n<s)&&(s=n),o.forEach(e=>{c.find(t=>t.bar===e.bar)||c.push(e)})})}let l=document.getElementById(t.ganttBarConfig.id);s!=null&&r===`left`?t.ganttBarConfig.dragLimitLeft=l.offsetLeft-s:s!=null&&r===`right`&&(t.ganttBarConfig.dragLimitRight=l.offsetLeft+l.offsetWidth+s)}n(t.ganttBarConfig.bundle).forEach(e=>{e.ganttBarConfig.dragLimitLeft=t.ganttBarConfig.dragLimitLeft,e.ganttBarConfig.dragLimitRight=t.ganttBarConfig.dragLimitRight})}},i=(e,t=0,n)=>{let r=e.ganttBarConfig.bundle?[{bar:e,gapDistance:t}]:[],i=e,o=a(i,n);if(n===`left`)for(;o;){let e=document.getElementById(i.ganttBarConfig.id),n=document.getElementById(o.ganttBarConfig.id),s=n.offsetLeft+n.offsetWidth;if(t+=e.offsetLeft-s,o.ganttBarConfig.immobile)return{gapDistanceSoFar:t,bundleBarsAndGapDist:r};o.ganttBarConfig.bundle&&r.push({bar:o,gapDistance:t}),i=o,o=a(o,`left`)}if(n===`right`)for(;o;){let e=document.getElementById(i.ganttBarConfig.id),n=document.getElementById(o.ganttBarConfig.id),s=e.offsetLeft+e.offsetWidth;if(t+=n.offsetLeft-s,o.ganttBarConfig.immobile)return{gapDistanceSoFar:t,bundleBarsAndGapDist:r};o.ganttBarConfig.bundle&&r.push({bar:o,gapDistance:t}),i=o,o=a(o,`right`)}return{gapDistanceSoFar:null,bundleBarsAndGapDist:r}},a=(e,n)=>{var r,i;let a=document.getElementById(e.ganttBarConfig.id),o=(i=(r=t().find(t=>t.bars.includes(e)))==null?void 0:r.bars)==null?[]:i,s=[];return s=n===`left`?o.filter(e=>{let t=document.getElementById(e.ganttBarConfig.id);return t&&t.offsetLeft<a.offsetLeft&&e.ganttBarConfig.pushOnOverlap!==!1}):o.filter(e=>{let t=document.getElementById(e.ganttBarConfig.id);return t&&t.offsetLeft>a.offsetLeft&&e.ganttBarConfig.pushOnOverlap!==!1}),s.length>0?s.reduce((e,t)=>{let n=document.getElementById(e.ganttBarConfig.id),r=document.getElementById(t.ganttBarConfig.id);return Math.abs(n.offsetLeft-a.offsetLeft)<Math.abs(r.offsetLeft-a.offsetLeft)?e:t},s[0]):null};return{setDragLimitsOfGanttBar:r}}var Ge=[`id`],Ke={class:`g-gantt-bar-label`},qe=[`innerHTML`],Je=j(`div`,{class:`g-gantt-bar-handle-left`},null,-1),Ye=j(`div`,{class:`g-gantt-bar-handle-right`},null,-1),Xe=e({__name:`GGanttBar`,props:{bar:{}},setup(e){let t=e,o=He(),l=U(),{rowHeight:f}=l,{bar:m}=s(t),{mapTimeToPosition:h,mapPositionToTime:g}=J(),{initDragOfBar:y,initDragOfBundle:x}=Ue(),{setDragLimitsOfGanttBar:C}=We(),w=u(!1),T=_(()=>m.value.ganttBarConfig);function E(e){T.value.bundle==null?y(m.value,e):x(m.value,e),w.value=!0}let O=()=>{C(m.value),!T.value.immobile&&(window.addEventListener(`mousemove`,E,{once:!0}),window.addEventListener(`mouseup`,()=>{window.removeEventListener(`mousemove`,E),w.value=!1},{once:!0}))},k=r(H),M=e=>{var t;e.preventDefault(),e.type===`mousedown`&&O();let n=(t=k==null?void 0:k.value)==null?void 0:t.getBoundingClientRect();if(!n)return;let r=g(e.clientX-n.left);o(e,m.value,r)},{barStart:N,barEnd:P,width:I,chartStart:L,chartEnd:R,chartSize:z}=l,B=u(0),V=u(0);return i(()=>{v([m,I,L,R,z.width],()=>{B.value=h(m.value[N.value]),V.value=h(m.value[P.value])},{deep:!0,immediate:!0})}),(e,t)=>(p(),A(`div`,{id:T.value.id,class:d([`g-gantt-bar`,T.value.class||``]),style:a(F(F({},T.value.style),{},{position:`absolute`,top:`${S(f)*.1}px`,left:`${B.value}px`,width:`${V.value-B.value}px`,height:`${S(f)*.8}px`,zIndex:w.value?3:2})),onMousedown:M,onClick:M,onDblclick:M,onMouseenter:M,onMouseleave:M,onContextmenu:M},[j(`div`,Ke,[c(e.$slots,`default`,{bar:S(m)},()=>[j(`div`,null,D(T.value.label||``),1),T.value.html?(p(),A(`div`,{key:0,innerHTML:T.value.html},null,8,qe)):n(``,!0)])]),T.value.hasHandles?(p(),A(b,{key:0},[Je,Ye],64)):n(``,!0)],46,Ge))}}),Ze=e({__name:`GGanttRow`,props:{label:{},bars:{},highlightOnHover:{type:Boolean}},emits:[`drop`],setup(e,{emit:t}){let r=e,{rowHeight:i,colors:d,labelColumnTitle:h}=U(),{highlightOnHover:g}=s(r),v=u(!1),y=_(()=>({height:`${i.value}px`,background:g!=null&&g.value&&v.value?d.value.hoverHighlight:null})),{mapPositionToTime:x}=J(),w=u(null);f(H,w);let T=e=>{var n;let r=(n=w.value)==null?void 0:n.getBoundingClientRect();if(!r){console.error(`Vue-Ganttastic: failed to find bar container element for row.`);return}t(`drop`,{e,datetime:x(e.clientX-r.left)})},M=e=>!e||/^\s*$/.test(e);return(e,t)=>(p(),A(`div`,{class:`g-gantt-row`,style:a(y.value),onDragover:t[0]||(t[0]=E(e=>v.value=!0,[`prevent`])),onDragleave:t[1]||(t[1]=e=>v.value=!1),onDrop:t[2]||(t[2]=e=>T(e)),onMouseover:t[3]||(t[3]=e=>v.value=!0),onMouseleave:t[4]||(t[4]=e=>v.value=!1)},[!M(e.label)&&!S(h)?(p(),A(`div`,{key:0,class:`g-gantt-row-label`,style:a({background:S(d).primary,color:S(d).text})},[c(e.$slots,`label`,{},()=>[o(D(e.label),1)])],4)):n(``,!0),j(`div`,N({ref_key:`barContainer`,ref:w,class:`g-gantt-row-bars-container`},e.$attrs),[C(O,{name:`bar-transition`,tag:`div`},{default:k(()=>[(p(!0),A(b,null,m(e.bars,t=>(p(),l(Xe,{key:t.ganttBarConfig.id,bar:t},{default:k(()=>[c(e.$slots,`bar-label`,{bar:t})]),_:2},1032,[`bar`]))),128))]),_:3})],16)],36))}});function $(e,t=`top`){if(!e||typeof document>`u`)return;let n=document.head,r=document.createElement(`style`);t===`top`&&n.firstChild?n.insertBefore(r,n.firstChild):n.appendChild(r),r.appendChild(document.createTextNode(e))}$(`
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
`,`top`),$(`
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
`,`top`),$(`
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
`,`top`),$(`
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
`,`top`),$(`
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
`,`top`),$(`
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
`,`top`),$(`
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
`,`top`),$(`
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
`,`top`);var Qe=e({__name:`index`,setup(e){let t=u([[{week:`星期一`,beginDate:`06:00`,endDate:`22:00`,ganttBarConfig:{id:`0`,hasHandles:!0,label:`需求收集和分析  负责人：小张`,style:{background:`#e96560`}}}],[{week:`星期二`,beginDate:`09:00`,endDate:`18:00`,ganttBarConfig:{id:`1`,hasHandles:!0,label:`系统设计  负责人：小强`,style:{background:`#5ccfa3`}}}],[{week:`星期三`,beginDate:`07:00`,endDate:`20:00`,ganttBarConfig:{id:`2`,hasHandles:!0,label:`编码实现  负责人：老李`,style:{background:`#77d6fa`}}}],[{week:`星期四`,beginDate:`06:00`,endDate:`21:00`,ganttBarConfig:{id:`3`,hasHandles:!0,label:`编码实现  负责人：小明`,style:{color:`#fff`,background:`#1b2a47`}}}],[{week:`星期五`,beginDate:`05:00`,endDate:`19:00`,ganttBarConfig:{id:`4`,hasHandles:!0,label:`内部测试  负责人：小雪`,style:{background:`#5ccfa3`}}}],[{week:`星期六`,beginDate:`10:00`,endDate:`22:00`,ganttBarConfig:{id:`5`,hasHandles:!0,label:`系统优化和文档整理  负责人：小欣`,style:{background:`#f8bc45`}}}],[{week:`星期天`,beginDate:`04:00`,endDate:`23:59`,ganttBarConfig:{id:`6`,immobile:!1,hasHandles:!1,label:`部署和上线  负责人：老王`,style:{background:`#f3953d`}}}]]);function n(){let e=new Date,t=e.getDay(),n=new Date(e);n.setDate(e.getDate()-t+1);let r=new Date(n);r.setDate(n.getDate()+6);let i=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`;return{currentWeekStart:i(n),currentWeekEnd:i(r)}}let r=n();return(e,n)=>(p(),l(S(Be),{"chart-start":`00:00`,"chart-end":`23:59`,precision:`hour`,"date-format":`HH:mm`,"bar-start":`beginDate`,"bar-end":`endDate`,grid:``},{"upper-timeunit":k(()=>[j(`h1`,null,D(`${S(r).currentWeekStart} / ${S(r).currentWeekEnd}`),1)]),default:k(()=>[(p(!0),A(b,null,m(t.value,(e,t)=>(p(),l(S(Ze),{key:t,bars:e,label:e[0].week,"highlight-on-hover":``},null,8,[`bars`,`label`]))),128))]),_:1}))}});export{Qe as default};