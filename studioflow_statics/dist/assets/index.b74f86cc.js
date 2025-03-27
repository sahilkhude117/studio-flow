import{d as D,ai as L,bU as j,b as o,al as v,av as z,at as re,dq as ie,bo as se,bR as ce,ad as ae,ae as te,U as C,dr as de,ap as ne,aD as W,az as ue,ce as ge,bz as be,aQ as le,ds as me,ao as Z,af as pe,R as fe,dt as ve,f as he,aj as Se,am as ye,bF as A,aR as Oe,du as $e,bM as Ce,bP as _e}from"./index.dc88667e.js";import"./index.04a5bd8d.js";import{A as He}from"./index.bec01af1.js";import{A as we}from"./Avatar.533b5f4a.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},a=new Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="5ad67069-6441-4024-8c8c-92a87bb7db05",e._sentryDebugIdIdentifier="sentry-dbid-5ad67069-6441-4024-8c8c-92a87bb7db05")}catch{}})();var xe=globalThis&&globalThis.__rest||function(e,a){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&a.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(e);n<r.length;n++)a.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(t[r[n]]=e[r[n]]);return t};const Pe=()=>({prefixCls:String,href:String,separator:z.any,dropdownProps:re(),overlay:z.any,onClick:ie()}),M=D({compatConfig:{MODE:3},name:"ABreadcrumbItem",inheritAttrs:!1,__ANT_BREADCRUMB_ITEM:!0,props:Pe(),slots:Object,setup(e,a){let{slots:t,attrs:r,emit:n}=a;const{prefixCls:s}=L("breadcrumb",e),h=(b,f)=>{const p=j(t,e,"overlay");return p?o(ce,v(v({},e.dropdownProps),{},{overlay:p,placement:"bottom"}),{default:()=>[o("span",{class:`${f}-overlay-link`},[b,o(se,null,null)])]}):b},S=b=>{n("click",b)};return()=>{var b;const f=(b=j(t,e,"separator"))!==null&&b!==void 0?b:"/",p=j(t,e),{class:u,style:g}=r,d=xe(r,["class","style"]);let m;return e.href!==void 0?m=o("a",v({class:`${s.value}-link`,onClick:S},d),[p]):m=o("span",v({class:`${s.value}-link`,onClick:S},d),[p]),m=h(m,s.value),p!=null?o("li",{class:u,style:g},[m,f&&o("span",{class:`${s.value}-separator`},[f])]):null}}}),Ae=e=>{const{componentCls:a,iconCls:t}=e;return{[a]:C(C({},ne(e)),{color:e.breadcrumbBaseColor,fontSize:e.breadcrumbFontSize,[t]:{fontSize:e.breadcrumbIconFontSize},ol:{display:"flex",flexWrap:"wrap",margin:0,padding:0,listStyle:"none"},a:C({color:e.breadcrumbLinkColor,transition:`color ${e.motionDurationMid}`,padding:`0 ${e.paddingXXS}px`,borderRadius:e.borderRadiusSM,height:e.lineHeight*e.fontSize,display:"inline-block",marginInline:-e.marginXXS,"&:hover":{color:e.breadcrumbLinkColorHover,backgroundColor:e.colorBgTextHover}},de(e)),["li:last-child"]:{color:e.breadcrumbLastItemColor,[`& > ${a}-separator`]:{display:"none"}},[`${a}-separator`]:{marginInline:e.breadcrumbSeparatorMargin,color:e.breadcrumbSeparatorColor},[`${a}-link`]:{[`
          > ${t} + span,
          > ${t} + a
        `]:{marginInlineStart:e.marginXXS}},[`${a}-overlay-link`]:{borderRadius:e.borderRadiusSM,height:e.lineHeight*e.fontSize,display:"inline-block",padding:`0 ${e.paddingXXS}px`,marginInline:-e.marginXXS,[`> ${t}`]:{marginInlineStart:e.marginXXS,fontSize:e.fontSizeIcon},"&:hover":{color:e.breadcrumbLinkColorHover,backgroundColor:e.colorBgTextHover,a:{color:e.breadcrumbLinkColorHover}},a:{"&:hover":{backgroundColor:"transparent"}}},[`&${e.componentCls}-rtl`]:{direction:"rtl"}})}},Te=ae("Breadcrumb",e=>{const a=te(e,{breadcrumbBaseColor:e.colorTextDescription,breadcrumbFontSize:e.fontSize,breadcrumbIconFontSize:e.fontSize,breadcrumbLinkColor:e.colorTextDescription,breadcrumbLinkColorHover:e.colorText,breadcrumbLastItemColor:e.colorText,breadcrumbSeparatorMargin:e.marginXS,breadcrumbSeparatorColor:e.colorTextDescription});return[Ae(a)]}),Be=()=>({prefixCls:String,routes:{type:Array},params:z.any,separator:z.any,itemRender:{type:Function}});function Re(e,a){if(!e.breadcrumbName)return null;const t=Object.keys(a).join("|");return e.breadcrumbName.replace(new RegExp(`:(${t})`,"g"),(n,s)=>a[s]||n)}function K(e){const{route:a,params:t,routes:r,paths:n}=e,s=r.indexOf(a)===r.length-1,h=Re(a,t);return s?o("span",null,[h]):o("a",{href:`#/${n.join("/")}`},[h])}const T=D({compatConfig:{MODE:3},name:"ABreadcrumb",inheritAttrs:!1,props:Be(),slots:Object,setup(e,a){let{slots:t,attrs:r}=a;const{prefixCls:n,direction:s}=L("breadcrumb",e),[h,S]=Te(n),b=(u,g)=>(u=(u||"").replace(/^\//,""),Object.keys(g).forEach(d=>{u=u.replace(`:${d}`,g[d])}),u),f=(u,g,d)=>{const m=[...u],y=b(g||"",d);return y&&m.push(y),m},p=u=>{let{routes:g=[],params:d={},separator:m,itemRender:y=K}=u;const _=[];return g.map(O=>{const H=b(O.path,d);H&&_.push(H);const $=[..._];let l=null;O.children&&O.children.length&&(l=o(be,{items:O.children.map(c=>({key:c.path||c.breadcrumbName,label:y({route:c,params:d,routes:g,paths:f($,c.path,d)})}))},null));const i={separator:m};return l&&(i.overlay=l),o(M,v(v({},i),{},{key:H||O.breadcrumbName}),{default:()=>[y({route:O,params:d,routes:g,paths:$})]})})};return()=>{var u;let g;const{routes:d,params:m={}}=e,y=W(j(t,e)),_=(u=j(t,e,"separator"))!==null&&u!==void 0?u:"/",O=e.itemRender||t.itemRender||K;d&&d.length>0?g=p({routes:d,params:m,separator:_,itemRender:O}):y.length&&(g=y.map(($,l)=>(ue(typeof $.type=="object"&&($.type.__ANT_BREADCRUMB_ITEM||$.type.__ANT_BREADCRUMB_SEPARATOR)),ge($,{separator:_,key:l}))));const H={[n.value]:!0,[`${n.value}-rtl`]:s.value==="rtl",[`${r.class}`]:!!r.class,[S.value]:!0};return h(o("nav",v(v({},r),{},{class:H}),[o("ol",null,[g])]))}}});var Ie=globalThis&&globalThis.__rest||function(e,a){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&a.indexOf(r)<0&&(t[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(e);n<r.length;n++)a.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(t[r[n]]=e[r[n]]);return t};const je=()=>({prefixCls:String}),G=D({compatConfig:{MODE:3},name:"ABreadcrumbSeparator",__ANT_BREADCRUMB_SEPARATOR:!0,inheritAttrs:!1,props:je(),setup(e,a){let{slots:t,attrs:r}=a;const{prefixCls:n}=L("breadcrumb",e);return()=>{var s;const{separator:h,class:S}=r,b=Ie(r,["separator","class"]),f=W((s=t.default)===null||s===void 0?void 0:s.call(t));return o("span",v({class:[`${n.value}-separator`,S]},b),[f.length>0?f:"/"])}}});T.Item=M;T.Separator=G;T.install=function(e){return e.component(T.name,T),e.component(M.name,M),e.component(G.name,G),e};var ze={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"arrow-left",theme:"outlined"};const Me=ze;function k(e){for(var a=1;a<arguments.length;a++){var t=arguments[a]!=null?Object(arguments[a]):{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),r.forEach(function(n){De(e,n,t[n])})}return e}function De(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}var q=function(a,t){var r=k({},a,t.attrs);return o(le,k({},r,{icon:Me}),null)};q.displayName="ArrowLeftOutlined";q.inheritAttrs=!1;const Le=q;var Ee={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"}}]},name:"arrow-right",theme:"outlined"};const Ne=Ee;function ee(e){for(var a=1;a<arguments.length;a++){var t=arguments[a]!=null?Object(arguments[a]):{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),r.forEach(function(n){Xe(e,n,t[n])})}return e}function Xe(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}var Q=function(a,t){var r=ee({},a,t.attrs);return o(le,ee({},r,{icon:Ne}),null)};Q.displayName="ArrowRightOutlined";Q.inheritAttrs=!1;const Fe=Q,Ue=e=>{const{componentCls:a,antCls:t}=e;return{[a]:C(C({},ne(e)),{position:"relative",padding:`${e.pageHeaderPaddingVertical}px ${e.pageHeaderPadding}px`,backgroundColor:e.colorBgContainer,[`&${a}-ghost`]:{backgroundColor:e.pageHeaderGhostBg},["&.has-footer"]:{paddingBottom:0},[`${a}-back`]:{marginRight:e.marginMD,fontSize:e.fontSizeLG,lineHeight:1,["&-button"]:C(C({},me(e)),{color:e.pageHeaderBackColor,cursor:"pointer"})},[`${t}-divider-vertical`]:{height:"14px",margin:`0 ${e.marginSM}`,verticalAlign:"middle"},[`${t}-breadcrumb + &-heading`]:{marginTop:e.marginXS},[`${a}-heading`]:{display:"flex",justifyContent:"space-between",["&-left"]:{display:"flex",alignItems:"center",margin:`${e.marginXS/2}px 0`,overflow:"hidden"},["&-title"]:C({marginRight:e.marginSM,marginBottom:0,color:e.colorTextHeading,fontWeight:600,fontSize:e.pageHeaderHeadingTitle,lineHeight:`${e.controlHeight}px`},Z),[`${t}-avatar`]:{marginRight:e.marginSM},["&-sub-title"]:C({marginRight:e.marginSM,color:e.colorTextDescription,fontSize:e.pageHeaderHeadingSubTitle,lineHeight:e.lineHeight},Z),["&-extra"]:{margin:`${e.marginXS/2}px 0`,whiteSpace:"nowrap",["> *"]:{marginLeft:e.marginSM,whiteSpace:"unset"},["> *:first-child"]:{marginLeft:0}}},[`${a}-content`]:{paddingTop:e.pageHeaderContentPaddingVertical},[`${a}-footer`]:{marginTop:e.marginMD,[`${t}-tabs`]:{[`> ${t}-tabs-nav`]:{margin:0,["&::before"]:{border:"none"}},[`${t}-tabs-tab`]:{paddingTop:e.paddingXS,paddingBottom:e.paddingXS,fontSize:e.pageHeaderTabFontSize}}},[`${a}-compact ${a}-heading`]:{flexWrap:"wrap"},[`&${e.componentCls}-rtl`]:{direction:"rtl"}})}},Ve=ae("PageHeader",e=>{const a=te(e,{pageHeaderPadding:e.paddingLG,pageHeaderPaddingVertical:e.paddingMD,pageHeaderPaddingBreadcrumb:e.paddingSM,pageHeaderContentPaddingVertical:e.paddingSM,pageHeaderBackColor:e.colorTextBase,pageHeaderGhostBg:"transparent",pageHeaderHeadingTitle:e.fontSizeHeading4,pageHeaderHeadingSubTitle:e.fontSize,pageHeaderTabFontSize:e.fontSizeLG});return[Ue(a)]}),Ge=()=>({backIcon:A(),prefixCls:String,title:A(),subTitle:A(),breadcrumb:z.object,tags:A(),footer:A(),extra:A(),avatar:re(),ghost:{type:Boolean,default:void 0},onBack:Function}),We=D({compatConfig:{MODE:3},name:"APageHeader",inheritAttrs:!1,props:Ge(),slots:Object,setup(e,a){let{emit:t,slots:r,attrs:n}=a;const{prefixCls:s,direction:h,pageHeader:S}=L("page-header",e),[b,f]=Ve(s),p=fe(!1),u=ve(),g=l=>{let{width:i}=l;u.value||(p.value=i<768)},d=he(()=>{var l,i,c;return(c=(l=e.ghost)!==null&&l!==void 0?l:(i=S==null?void 0:S.value)===null||i===void 0?void 0:i.ghost)!==null&&c!==void 0?c:!0}),m=()=>{var l,i,c;return(c=(l=e.backIcon)!==null&&l!==void 0?l:(i=r.backIcon)===null||i===void 0?void 0:i.call(r))!==null&&c!==void 0?c:h.value==="rtl"?o(Fe,null,null):o(Le,null,null)},y=l=>!l||!e.onBack?null:o(_e,{componentName:"PageHeader",children:i=>{let{back:c}=i;return o("div",{class:`${s.value}-back`},[o(Ce,{onClick:w=>{t("back",w)},class:`${s.value}-back-button`,"aria-label":c},{default:()=>[l]})])}},null),_=()=>{var l;return e.breadcrumb?o(T,e.breadcrumb,null):(l=r.breadcrumb)===null||l===void 0?void 0:l.call(r)},O=()=>{var l,i,c,w,x,B,E,N,X;const{avatar:F}=e,R=(l=e.title)!==null&&l!==void 0?l:(i=r.title)===null||i===void 0?void 0:i.call(r),I=(c=e.subTitle)!==null&&c!==void 0?c:(w=r.subTitle)===null||w===void 0?void 0:w.call(r),U=(x=e.tags)!==null&&x!==void 0?x:(B=r.tags)===null||B===void 0?void 0:B.call(r),V=(E=e.extra)!==null&&E!==void 0?E:(N=r.extra)===null||N===void 0?void 0:N.call(r),P=`${s.value}-heading`,J=R||I||U||V;if(!J)return null;const oe=m(),Y=y(oe);return o("div",{class:P},[(Y||F||J)&&o("div",{class:`${P}-left`},[Y,F?o(we,F,null):(X=r.avatar)===null||X===void 0?void 0:X.call(r),R&&o("span",{class:`${P}-title`,title:typeof R=="string"?R:void 0},[R]),I&&o("span",{class:`${P}-sub-title`,title:typeof I=="string"?I:void 0},[I]),U&&o("span",{class:`${P}-tags`},[U])]),V&&o("span",{class:`${P}-extra`},[o(He,null,{default:()=>[V]})])])},H=()=>{var l,i;const c=(l=e.footer)!==null&&l!==void 0?l:Oe((i=r.footer)===null||i===void 0?void 0:i.call(r));return $e(c)?null:o("div",{class:`${s.value}-footer`},[c])},$=l=>o("div",{class:`${s.value}-content`},[l]);return()=>{var l,i;const c=((l=e.breadcrumb)===null||l===void 0?void 0:l.routes)||r.breadcrumb,w=e.footer||r.footer,x=W((i=r.default)===null||i===void 0?void 0:i.call(r)),B=Se(s.value,{"has-breadcrumb":c,"has-footer":w,[`${s.value}-ghost`]:d.value,[`${s.value}-rtl`]:h.value==="rtl",[`${s.value}-compact`]:p.value},n.class,f.value);return b(o(ye,{onResize:g},{default:()=>[o("div",v(v({},n),{},{class:B}),[_(),O(),x.length?$(x):null,H()])]}))}}}),Ke=pe(We);export{M as A,T as B,G as a,Ke as b};
//# sourceMappingURL=index.b74f86cc.js.map
