(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"33W7":function(e){e.exports=JSON.parse('{"label:theme":{"en":"Theme","de":"Farbschema"},"label:theme-light":{"en":"light","de":"hell"},"label:theme-auto-detect":{"en":"auto detect","de":"automatisch"},"label:theme-dark":{"en":"dark","de":"dunkel"}}')},ZoBO:function(e){e.exports=JSON.parse('{"seo:title":{"en":"AGE Online Settings","de":"AGE Online Einstellungen"},"seo:description":{"en":"Set your personal AGE Online preferences.","de":"Konfigurieren Sie AGE Online nach Ihren Wünschen."},"page:heading":{"en":"Settings","de":"Einstellungen"}}')},b804:function(e,t,a){"use strict";a.r(t);var r=a("jZnR"),n=a("TuTm"),o=a("dJc8"),i=a("ERkP"),l=a.n(i),c=a("M/1d"),s=a("lyBt"),u=a("190V"),d=a("dhU7"),m=a("fGyu"),b=a("zygG"),v=a("HbGN"),p=a("cxan"),h=a("7O4Y"),f=a("rU8s"),g=a("80sO");var x=a("N79G"),y=a("zYMZ");function O(e){return e&&e.ownerDocument||document}var E=a("b1vU"),w=a("SyNz"),k=a("xOTp");var j=Object(o.a)((function(e){return{thumb:{"&$open":{"& $offset":{transform:"scale(1) translateY(-10px)"}}},open:{},offset:Object(p.a)({zIndex:1},e.typography.body2,{fontSize:e.typography.pxToRem(12),lineHeight:1.2,transition:e.transitions.create(["transform"],{duration:e.transitions.duration.shortest}),top:-34,transformOrigin:"bottom center",transform:"scale(0)",position:"absolute"}),circle:{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:"50% 50% 50% 0",backgroundColor:"currentColor",transform:"rotate(-45deg)"},label:{color:e.palette.primary.contrastText,transform:"rotate(45deg)"}}}),{name:"PrivateValueLabel"})((function(e){var t=e.children,a=e.classes,r=e.className,n=e.open,o=e.value,l=e.valueLabelDisplay;return"off"===l?t:i.cloneElement(t,{className:Object(h.a)(t.props.className,(n||"on"===l)&&a.open,a.thumb)},i.createElement("span",{className:Object(h.a)(a.offset,r)},i.createElement("span",{className:a.circle},i.createElement("span",{className:a.label},o))))}));function L(e,t){return e-t}function S(e,t,a){return Math.min(Math.max(t,e),a)}function C(e,t){return e.reduce((function(e,a,r){var n=Math.abs(t-a);return null===e||n<e.distance||n===e.distance?{distance:n,index:r}:e}),null).index}function A(e,t){if(void 0!==t.current&&e.changedTouches){for(var a=0;a<e.changedTouches.length;a+=1){var r=e.changedTouches[a];if(r.identifier===t.current)return{x:r.clientX,y:r.clientY}}return!1}return{x:e.clientX,y:e.clientY}}function T(e,t,a){return 100*(e-t)/(a-t)}function R(e,t,a){var r=Math.round((e-a)/t)*t+a;return Number(r.toFixed(function(e){if(Math.abs(e)<1){var t=e.toExponential().split("e-"),a=t[0].split(".")[1];return(a?a.length:0)+parseInt(t[1],10)}var r=e.toString().split(".")[1];return r?r.length:0}(t)))}function N(e){var t=e.values,a=e.source,r=e.newValue,n=e.index;if(t[n]===r)return a;var o=t.slice();return o[n]=r,o}function V(e){var t=e.sliderRef,a=e.activeIndex,r=e.setActive;t.current.contains(document.activeElement)&&Number(document.activeElement.getAttribute("data-index"))===a||t.current.querySelector('[role="slider"][data-index="'.concat(a,'"]')).focus(),r&&r(a)}var M={horizontal:{offset:function(e){return{left:"".concat(e,"%")}},leap:function(e){return{width:"".concat(e,"%")}}},"horizontal-reverse":{offset:function(e){return{right:"".concat(e,"%")}},leap:function(e){return{width:"".concat(e,"%")}}},vertical:{offset:function(e){return{bottom:"".concat(e,"%")}},leap:function(e){return{height:"".concat(e,"%")}}}},z=function(e){return e},$=i.forwardRef((function(e,t){var a=e["aria-label"],r=e["aria-labelledby"],n=e["aria-valuetext"],o=e.classes,l=e.className,c=e.color,s=void 0===c?"primary":c,u=e.component,d=void 0===u?"span":u,x=e.defaultValue,$=e.disabled,I=void 0!==$&&$,D=e.getAriaLabel,P=e.getAriaValueText,B=e.marks,F=void 0!==B&&B,H=e.max,G=void 0===H?100:H,U=e.min,Y=void 0===U?0:U,J=e.name,W=e.onChange,Z=e.onChangeCommitted,K=e.onMouseDown,X=e.orientation,_=void 0===X?"horizontal":X,q=e.scale,Q=void 0===q?z:q,ee=e.step,te=void 0===ee?1:ee,ae=e.ThumbComponent,re=void 0===ae?"span":ae,ne=e.track,oe=void 0===ne?"normal":ne,ie=e.value,le=e.ValueLabelComponent,ce=void 0===le?j:le,se=e.valueLabelDisplay,ue=void 0===se?"off":se,de=e.valueLabelFormat,me=void 0===de?z:de,be=Object(v.a)(e,["aria-label","aria-labelledby","aria-valuetext","classes","className","color","component","defaultValue","disabled","getAriaLabel","getAriaValueText","marks","max","min","name","onChange","onChangeCommitted","onMouseDown","orientation","scale","step","ThumbComponent","track","value","ValueLabelComponent","valueLabelDisplay","valueLabelFormat"]),ve=Object(f.a)()||g.a,pe=i.useRef(),he=i.useState(-1),fe=he[0],ge=he[1],xe=i.useState(-1),ye=xe[0],Oe=xe[1],Ee=function(e){var t=e.controlled,a=e.default,r=(e.name,e.state,i.useRef(void 0!==t).current),n=i.useState(a),o=n[0],l=n[1];return[r?t:o,i.useCallback((function(e){r||l(e)}),[])]}({controlled:ie,default:x,name:"Slider"}),we=Object(b.a)(Ee,2),ke=we[0],je=we[1],Le=Array.isArray(ke),Se=Le?ke.slice().sort(L):[ke];Se=Se.map((function(e){return S(e,Y,G)}));var Ce=!0===F&&null!==te?Object(m.a)(Array(Math.floor((G-Y)/te)+1)).map((function(e,t){return{value:Y+te*t}})):F||[],Ae=Object(y.a)(),Te=Ae.isFocusVisible,Re=Ae.onBlurVisible,Ne=Ae.ref,Ve=i.useState(-1),Me=Ve[0],ze=Ve[1],$e=i.useRef(),Ie=Object(w.a)(Ne,$e),De=Object(w.a)(t,Ie),Pe=Object(E.a)((function(e){var t=Number(e.currentTarget.getAttribute("data-index"));Te(e)&&ze(t),Oe(t)})),Be=Object(E.a)((function(){-1!==Me&&(ze(-1),Re()),Oe(-1)})),Fe=Object(E.a)((function(e){var t=Number(e.currentTarget.getAttribute("data-index"));Oe(t)})),He=Object(E.a)((function(){Oe(-1)})),Ge="rtl"===ve.direction,Ue=Object(E.a)((function(e){var t,a=Number(e.currentTarget.getAttribute("data-index")),r=Se[a],n=(G-Y)/10,o=Ce.map((function(e){return e.value})),i=o.indexOf(r),l=Ge?"ArrowLeft":"ArrowRight",c=Ge?"ArrowRight":"ArrowLeft";switch(e.key){case"Home":t=Y;break;case"End":t=G;break;case"PageUp":te&&(t=r+n);break;case"PageDown":te&&(t=r-n);break;case l:case"ArrowUp":t=te?r+te:o[i+1]||o[o.length-1];break;case c:case"ArrowDown":t=te?r-te:o[i-1]||o[0];break;default:return}if(e.preventDefault(),te&&(t=R(t,te,Y)),t=S(t,Y,G),Le){var s=t;t=N({values:Se,source:ke,newValue:t,index:a}).sort(L),V({sliderRef:$e,activeIndex:t.indexOf(s)})}je(t),ze(a),W&&W(e,t),Z&&Z(e,t)})),Ye=i.useRef(),Je=_;Ge&&"vertical"!==_&&(Je+="-reverse");var We=function(e){var t,a,r=e.finger,n=e.move,o=void 0!==n&&n,i=e.values,l=e.source,c=$e.current.getBoundingClientRect(),s=c.width,u=c.height,d=c.bottom,m=c.left;if(t=0===Je.indexOf("vertical")?(d-r.y)/u:(r.x-m)/s,-1!==Je.indexOf("-reverse")&&(t=1-t),a=function(e,t,a){return(a-t)*e+t}(t,Y,G),te)a=R(a,te,Y);else{var b=Ce.map((function(e){return e.value}));a=b[C(b,a)]}a=S(a,Y,G);var v=0;if(Le){var p=a;v=(a=N({values:i,source:l,newValue:a,index:v=o?Ye.current:C(i,a)}).sort(L)).indexOf(p),Ye.current=v}return{newValue:a,activeIndex:v}},Ze=Object(E.a)((function(e){var t=A(e,pe);if(t){var a=We({finger:t,move:!0,values:Se,source:ke}),r=a.newValue,n=a.activeIndex;V({sliderRef:$e,activeIndex:n,setActive:ge}),je(r),W&&W(e,r)}})),Ke=Object(E.a)((function(e){var t=A(e,pe);if(t){var a=We({finger:t,values:Se,source:ke}).newValue;ge(-1),"touchend"===e.type&&Oe(-1),Z&&Z(e,a),pe.current=void 0;var r=O($e.current);r.removeEventListener("mousemove",Ze),r.removeEventListener("mouseup",Ke),r.removeEventListener("touchmove",Ze),r.removeEventListener("touchend",Ke)}})),Xe=Object(E.a)((function(e){e.preventDefault();var t=e.changedTouches[0];null!=t&&(pe.current=t.identifier);var a=A(e,pe),r=We({finger:a,values:Se,source:ke}),n=r.newValue,o=r.activeIndex;V({sliderRef:$e,activeIndex:o,setActive:ge}),je(n),W&&W(e,n);var i=O($e.current);i.addEventListener("touchmove",Ze),i.addEventListener("touchend",Ke)}));i.useEffect((function(){var e=$e.current;e.addEventListener("touchstart",Xe);var t=O(e);return function(){e.removeEventListener("touchstart",Xe),t.removeEventListener("mousemove",Ze),t.removeEventListener("mouseup",Ke),t.removeEventListener("touchmove",Ze),t.removeEventListener("touchend",Ke)}}),[Ke,Ze,Xe]);var _e=Object(E.a)((function(e){K&&K(e),e.preventDefault();var t=A(e,pe),a=We({finger:t,values:Se,source:ke}),r=a.newValue,n=a.activeIndex;V({sliderRef:$e,activeIndex:n,setActive:ge}),je(r),W&&W(e,r);var o=O($e.current);o.addEventListener("mousemove",Ze),o.addEventListener("mouseup",Ke)})),qe=T(Le?Se[0]:Y,Y,G),Qe=T(Se[Se.length-1],Y,G)-qe,et=Object(p.a)({},M[Je].offset(qe),M[Je].leap(Qe));return i.createElement(d,Object(p.a)({ref:De,className:Object(h.a)(o.root,o["color".concat(Object(k.a)(s))],l,I&&o.disabled,Ce.length>0&&Ce.some((function(e){return e.label}))&&o.marked,!1===oe&&o.trackFalse,"vertical"===_&&o.vertical,"inverted"===oe&&o.trackInverted),onMouseDown:_e},be),i.createElement("span",{className:o.rail}),i.createElement("span",{className:o.track,style:et}),i.createElement("input",{value:Se.join(","),name:J,type:"hidden"}),Ce.map((function(e,t){var a,r=T(e.value,Y,G),n=M[Je].offset(r);return a=!1===oe?-1!==Se.indexOf(e.value):"normal"===oe&&(Le?e.value>=Se[0]&&e.value<=Se[Se.length-1]:e.value<=Se[0])||"inverted"===oe&&(Le?e.value<=Se[0]||e.value>=Se[Se.length-1]:e.value>=Se[0]),i.createElement(i.Fragment,{key:e.value},i.createElement("span",{style:n,"data-index":t,className:Object(h.a)(o.mark,a&&o.markActive)}),null!=e.label?i.createElement("span",{"aria-hidden":!0,"data-index":t,style:n,className:Object(h.a)(o.markLabel,a&&o.markLabelActive)},e.label):null)})),Se.map((function(e,t){var l=T(e,Y,G),c=M[Je].offset(l);return i.createElement(ce,{key:t,valueLabelFormat:me,valueLabelDisplay:ue,className:o.valueLabel,value:"function"==typeof me?me(Q(e),t):me,index:t,open:ye===t||fe===t||"on"===ue,disabled:I},i.createElement(re,{className:Object(h.a)(o.thumb,o["thumbColor".concat(Object(k.a)(s))],fe===t&&o.active,I&&o.disabled,Me===t&&o.focusVisible),tabIndex:I?null:0,role:"slider",style:c,"data-index":t,"aria-label":D?D(t):a,"aria-labelledby":r,"aria-orientation":_,"aria-valuemax":Q(G),"aria-valuemin":Q(Y),"aria-valuenow":Q(e),"aria-valuetext":P?P(Q(e),t):n,onKeyDown:Ue,onFocus:Pe,onBlur:Be,onMouseOver:Fe,onMouseLeave:He}))})))})),I=Object(o.a)((function(e){return{root:{height:2,width:"100%",boxSizing:"content-box",padding:"13px 0",display:"inline-block",position:"relative",cursor:"pointer",touchAction:"none",color:e.palette.primary.main,WebkitTapHighlightColor:"transparent","&$disabled":{pointerEvents:"none",cursor:"default",color:e.palette.grey[400]},"&$vertical":{width:2,height:"100%",padding:"0 13px"},"@media (pointer: coarse)":{padding:"20px 0","&$vertical":{padding:"0 20px"}},"@media print":{colorAdjust:"exact"}},colorPrimary:{},colorSecondary:{color:e.palette.secondary.main},marked:{marginBottom:20,"&$vertical":{marginBottom:"auto",marginRight:20}},vertical:{},disabled:{},rail:{display:"block",position:"absolute",width:"100%",height:2,borderRadius:1,backgroundColor:"currentColor",opacity:.38,"$vertical &":{height:"100%",width:2}},track:{display:"block",position:"absolute",height:2,borderRadius:1,backgroundColor:"currentColor","$vertical &":{width:2}},trackFalse:{"& $track":{display:"none"}},trackInverted:{"& $track":{backgroundColor:"light"===e.palette.type?Object(x.d)(e.palette.primary.main,.62):Object(x.a)(e.palette.primary.main,.5)},"& $rail":{opacity:1}},thumb:{position:"absolute",width:12,height:12,marginLeft:-6,marginTop:-5,boxSizing:"border-box",borderRadius:"50%",outline:0,backgroundColor:"currentColor",display:"flex",alignItems:"center",justifyContent:"center",transition:e.transitions.create(["box-shadow"],{duration:e.transitions.duration.shortest}),"&::after":{position:"absolute",content:'""',borderRadius:"50%",left:-15,top:-15,right:-15,bottom:-15},"&$focusVisible,&:hover":{boxShadow:"0px 0px 0px 8px ".concat(Object(x.b)(e.palette.primary.main,.16)),"@media (hover: none)":{boxShadow:"none"}},"&$active":{boxShadow:"0px 0px 0px 14px ".concat(Object(x.b)(e.palette.primary.main,.16))},"&$disabled":{width:8,height:8,marginLeft:-4,marginTop:-3,"&:hover":{boxShadow:"none"}},"$vertical &":{marginLeft:-5,marginBottom:-6},"$vertical &$disabled":{marginLeft:-3,marginBottom:-4}},thumbColorPrimary:{},thumbColorSecondary:{"&$focusVisible,&:hover":{boxShadow:"0px 0px 0px 8px ".concat(Object(x.b)(e.palette.secondary.main,.16))},"&$active":{boxShadow:"0px 0px 0px 14px ".concat(Object(x.b)(e.palette.secondary.main,.16))}},active:{},focusVisible:{},valueLabel:{left:"calc(-50% - 4px)"},mark:{position:"absolute",width:2,height:2,borderRadius:1,backgroundColor:"currentColor"},markActive:{backgroundColor:e.palette.background.paper,opacity:.8},markLabel:Object(p.a)({},e.typography.body2,{color:e.palette.text.secondary,position:"absolute",top:26,transform:"translateX(-50%)",whiteSpace:"nowrap","$vertical &":{top:"auto",left:26,transform:"translateY(50%)"},"@media (pointer: coarse)":{top:40,"$vertical &":{left:31}}}),markLabelActive:{color:e.palette.text.primary}}}),{name:"MuiSlider"})($),D=a("fZCc"),P=Object(D.a)(l.a.createElement("path",{d:"M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"}),"Palette"),B=Object(D.a)(l.a.createElement("path",{d:"M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"}),"Brightness7"),F=Object(D.a)(l.a.createElement("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"Search"),H=Object(D.a)(l.a.createElement("path",{d:"M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"}),"Brightness4"),G=a("FYWF"),U=a("lC3Y"),Y=a("33W7");const J=Object(o.a)({root:{height:8},thumb:{height:16,width:16,marginTop:-4,marginLeft:-8,"&:focus, &:hover, &$active":{boxShadow:"inherit"}},mark:{display:"none"},markLabel:{paddingTop:4},track:{height:8,borderRadius:4},rail:{height:8,borderRadius:4}})(I),W=Object(r.a)({themeSelection:{display:"flex",alignItems:"center","& > :first-child":{fontSize:"50px",marginRight:"35px"},"& > :last-child":{width:"100px"}}});class Z extends i.Component{render(){const{classes:e,i18n:t,themePreference:a,preferTheme:r}=this.props;return l.a.createElement("div",{className:e.themeSelection},l.a.createElement(P,{id:"theme-label","aria-label":t.translate("label:theme")}),l.a.createElement(J,{value:X(a),onChange:(e,t)=>{const n=function(e){switch(e){case 0:return U.a.LIGHT;case 1:return U.a.AUTO_DETECT;case 2:return U.a.DARK;default:throw new Error("unexpected slider value: "+Object(d.b)(e))}}(t);n!==a&&r(n)},color:"primary","aria-labelledby":"theme-label",min:0,max:2,marks:_(t),step:1,track:!1}))}}const K=Object(o.a)(W)(Object(G.b)("theme-selection",Y)(Z));function X(e){switch(e){case U.a.LIGHT:return 0;case U.a.AUTO_DETECT:return 1;case U.a.DARK:return 2;default:return Object(u.a)(e)}}function _(e){return[{value:0,label:l.a.createElement(B,{"aria-label":e.translate("label:theme-light")})},{value:1,label:l.a.createElement(F,{"aria-label":e.translate("label:theme-auto-detect")})},{value:2,label:l.a.createElement(H,{"aria-label":e.translate("label:theme-dark")})}]}var q=a("I1PM"),Q=a("ZoBO");const ee=Object(r.a)({main:{display:"flex",flexDirection:"column",alignItems:"center"}});class te extends c.a{constructor(e){super(e);const{themePreference:t}=e.appStateManager.appState;this.state={themePreference:t}}componentDidMount(){this.unsubscribeOnUnmount(this.props.appStateManager.appState$("themePreference").subscribe(({themePreference:e})=>this.setState({themePreference:e})))}render(){const{props:{classes:e,i18n:t,appStateManager:a},state:{themePreference:r}}=this;return l.a.createElement(n.a,{component:"main",className:e.main,elevation:0},l.a.createElement(s.a,{i18n:t}),l.a.createElement("h1",null,t.translate("page:heading")),l.a.createElement(K,{themePreference:r,preferTheme:e=>{a.setThemePreference(e)}}))}}const ae=Object(G.b)("settings-page",Q)(Object(o.a)(ee)(Object(q.b)(te)));t.default=ae}}]);