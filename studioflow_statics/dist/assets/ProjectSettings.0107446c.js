import{a as D}from"./asyncComputed.a7dbdd76.js";import{b as t,ee as T,e$ as B,d as y,e as E,ej as x,f as p,o as j,c as F,w as l,u as n,aG as u,dd as S,db as N,dc as c,a as v,e9 as g,cz as U,dh as V,bL as H,aW as R,cy as $,ea as q,Y as z,S as G}from"./index.dc88667e.js";import"./gateway.bfbb9203.js";import{a as C}from"./project.568dddce.js";import"./tables.fa3afaf8.js";import{S as L}from"./SaveButton.65252b10.js";import{a as h}from"./index.bf15584e.js";import{A as M}from"./index.bec01af1.js";import"./popupNotifcation.07f02947.js";import"./record.360cbd9f.js";import"./string.e754d5d0.js";import"./UnsavedChangesHandler.fe0c5cec.js";import"./ExclamationCircleOutlined.2f5e763a.js";(function(){try{var r=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},o=new Error().stack;o&&(r._sentryDebugIds=r._sentryDebugIds||{},r._sentryDebugIds[o]="b0f65e88-4016-44a0-aeb6-98cc074432e1",r._sentryDebugIdIdentifier="sentry-dbid-b0f65e88-4016-44a0-aeb6-98cc074432e1")}catch{}})();function _(r){for(var o=1;o<arguments.length;o++){var e=arguments[o]!=null?Object(arguments[o]):{},a=Object.keys(e);typeof Object.getOwnPropertySymbols=="function"&&(a=a.concat(Object.getOwnPropertySymbols(e).filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable}))),a.forEach(function(i){W(r,i,e[i])})}return r}function W(r,o,e){return o in r?Object.defineProperty(r,o,{value:e,enumerable:!0,configurable:!0,writable:!0}):r[o]=e,r}var m=function(o,e){var a=_({},o,e.attrs);return t(T,_({},a,{icon:B}),null)};m.displayName="CopyOutlined";m.inheritAttrs=!1;const Y=m,J=y({__name:"SubdomainEditor",props:{project:{}},emits:["change-subdomain"],setup(r,{emit:o}){const e=r,a=E(void 0),i=x.exports.debounce(async()=>{try{const{available:s}=await e.project.checkSubdomain();a.value=s?"available":"unavailable"}catch{a.value=void 0}},500);function d(){if(!e.project.hasChangesDeep("subdomain")){a.value=void 0;return}e.project.subdomain?(a.value="loading",i()):a.value="invalid"}const b=p(()=>a.value!=="available"||!e.project.hasChangesDeep("subdomain")),w=async()=>{await navigator.clipboard.writeText(e.project.getUrl())},A=p(()=>{switch(a.value){case"invalid":return"error";case"loading":return"validating";case"available":return"success";case"unavailable":return"error";default:return}}),k=p(()=>{switch(a.value){case"loading":return"Checking availability...";case"available":return"Available";case"unavailable":return"Unavailable";case"invalid":return"Invalid subdomain";default:return}}),O=()=>{const s=C.formatSubdomain(e.project.subdomain);o("change-subdomain",s),d()};function P(){e.project.resetChanges(),a.value=void 0}return(s,f)=>(j(),F(n(M),{direction:"vertical"},{default:l(()=>[t(n(S),{level:2},{default:l(()=>[u("Subdomain")]),_:1}),t(n(N),null,{default:l(()=>[u(" Every project in Abstra Cloud comes with a default subdomain, which will appear on all shared project links. ")]),_:1}),t(n(h),null,{default:l(()=>[t(n(c),null,{default:l(()=>[u("Forms available at:")]),_:1}),t(n(c),{code:""},{default:l(()=>[v("span",null,g(s.project.getUrl("[PATH]")),1)]),_:1})]),_:1}),t(n(h),null,{default:l(()=>[t(n(c),null,{default:l(()=>[u("Hooks available at:")]),_:1}),t(n(c),{code:""},{default:l(()=>[v("span",null,g(s.project.getUrl("_hooks/[PATH]")),1)]),_:1})]),_:1}),t(n($),null,{default:l(()=>[t(n(U),{"validate-status":A.value,help:k.value,"has-feedback":""},{default:l(()=>[t(n(V),{gap:"middle"},{default:l(()=>[t(n(H),{value:s.project.subdomain,type:"text",loading:a.value==="loading",onBlur:O,onChange:f[0]||(f[0]=I=>o("change-subdomain",I.target.value))},{addonBefore:l(()=>[u("https://")]),addonAfter:l(()=>[u(".abstra.app/")]),_:1},8,["value","loading"]),t(n(R),{placement:"top",title:"Copy"},{default:l(()=>[t(n(Y),{color:"red",onClick:w})]),_:1})]),_:1})]),_:1},8,["validate-status","help"]),t(L,{model:s.project,disabled:b.value,onError:P},null,8,["model","disabled"])]),_:1})]),_:1}))}}),Q={key:0,class:"project-settings"},de=y({__name:"ProjectSettings",setup(r){const e=q().params.projectId,{result:a}=D(()=>C.get(e)),i=d=>{a.value.subdomain=d};return(d,b)=>n(a)?(j(),z("div",Q,[t(n(S),null,{default:l(()=>[u("Project Settings")]),_:1}),t(J,{project:n(a),onChangeSubdomain:i},null,8,["project"])])):G("",!0)}});export{de as default};
//# sourceMappingURL=ProjectSettings.0107446c.js.map
