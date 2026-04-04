import{F as e,j as t,jt as n}from"./vue.runtime.esm-bundler-7ocrn71d.js";import{n as r}from"./use-namespace-DCgB5FLc.js";import{F as i,P as a,U as o}from"./style-Da88BOzS.js";var s={prefix:Math.floor(Math.random()*1e4),current:0},c=Symbol(`elIdInjection`),l=()=>t()?e(c,s):s,u=e=>{let t=l();!i&&t===s&&o(`IdInjection`,`Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);let c=r();return a(()=>n(e)||`${c.value}-id-${t.prefix}-${t.current++}`)};export{l as n,u as t};