(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"151F":function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var n=a("ERkP"),i=a.n(n),r=a("Vgyk");function o({i18n:e}){const t=e.locale,a=e.translationKeyExists("seo:title")?e.translate("seo:title"):e.translate("page:heading"),n=e.translate("seo:description");if(!a)throw new Error("SEO title / page title missing");if(!n)throw new Error("SEO description missing");return i.a.createElement(r.a,{htmlAttributes:{lang:t},title:a,meta:l({lang:t,author:"Christoph Sprenger",description:n,title:a})})}function l(e){const{lang:t,author:a,description:n,title:i}=e;return[{name:"description",content:n},{property:"og:title",content:i},{property:"og:description",content:n},{property:"og:type",content:"website"},{property:"og:locale",content:t},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:a},{name:"twitter:title",content:i},{name:"twitter:description",content:n}]}},"2l/u":function(e,t,a){"use strict";a.r(t);var n=a("BSc8"),i=a.t(n,2),r=a("jZnR"),o=a("TuTm"),l=a("HCes"),s=a("yUsM"),c=a("dJc8"),p=a("ERkP"),m=a.n(p),d=a("fZCc"),h=Object(d.a)(m.a.createElement("path",{d:"M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"}),"GitHub"),u=a("u7Yt"),b=a("Bcrs"),y=a("5ykq"),g=a("151F"),f=a("2f5X");class v extends p.Component{render(){const{classes:e,i18n:t,siteApi:a}=this.props,{committedOn:n,hash:r,shortHash:c,branch:p}=i,d={...b.a,licensesLink:m.a.createElement("a",Object.assign({href:a.assetUrl("age-online.licenses.txt"),"aria-label":t.translate("third-party:link-label")},y.a),t.translate("third-party:link"))},u={...b.a,commitLink:m.a.createElement("a",Object.assign({href:"https://github.com/c-sp/age-online/tree/"+r,"aria-label":t.translate("link:commit")},y.a),c),commitDate:m.a.createElement("span",{style:{whiteSpace:"nowrap"}},t.formatDate(new Date(1e3*parseInt(n,10)),{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",timeZoneName:"short"})),branchLink:m.a.createElement("a",Object.assign({href:"https://github.com/c-sp/age-online/tree/"+p,"aria-label":t.translate("link:branch")},y.a),p)};return m.a.createElement(o.a,{component:"main",className:e.main,elevation:0},m.a.createElement(g.a,{i18n:t}),m.a.createElement("h1",null,t.translate("heading")),m.a.createElement("div",{className:e.text},t.translate("text1",b.a)),m.a.createElement("div",{className:e.text},t.translate("text2",b.a)),m.a.createElement("div",{className:e.repo},m.a.createElement("a",Object.assign({href:"https://github.com/c-sp/age-online","aria-label":t.translate("link:repo")},y.a),m.a.createElement(l.a,{"aria-label":t.translate("link:repo"),color:"primary"},m.a.createElement(h,{fontSize:"large"}))),m.a.createElement(s.a,{component:"div",variant:"caption"},t.translate("commit",u))),m.a.createElement(s.a,{component:"div",variant:"caption"},t.translate("third-party",d)))}}const E=Object(b.b)("about-page",u)(Object(c.a)(e=>Object(r.a)({main:{minHeight:"100%",padding:e.spacing(2),textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center","& > :nth-child(n+2)":{marginTop:e.spacing(3)}},text:{maxWidth:"30em"},repo:{display:"flex",alignItems:"center",justifyContent:"center","& svg":{display:"block"},"& > :last-child":{textAlign:"left"}}}))(Object(f.b)(v)));t.default=E},BSc8:function(e){e.exports=JSON.parse('{"shortHash":"962c1d1","hash":"962c1d121ba070c359747ebb02265fb1868310e4","subject":"auto-pause emulation on suspended AudioContext","sanitizedSubject":"auto-pause-emulation-on-suspended-AudioContext","body":"","authoredOn":"1603825544","committedOn":"1603825544","author":{"name":"Christoph Sprenger","email":"66515552+c-sp@users.noreply.github.com"},"committer":{"name":"Christoph Sprenger","email":"66515552+c-sp@users.noreply.github.com"},"notes":"","branch":"master","tags":[]}')},TuTm:function(e,t,a){"use strict";var n=a("HbGN"),i=a("cxan"),r=a("ERkP"),o=a("7O4Y"),l=a("dJc8"),s=r.forwardRef((function(e,t){var a=e.classes,l=e.className,s=e.component,c=void 0===s?"div":s,p=e.square,m=void 0!==p&&p,d=e.elevation,h=void 0===d?1:d,u=e.variant,b=void 0===u?"elevation":u,y=Object(n.a)(e,["classes","className","component","square","elevation","variant"]);return r.createElement(c,Object(i.a)({className:Object(o.a)(a.root,l,"outlined"===b?a.outlined:a["elevation".concat(h)],!m&&a.rounded),ref:t},y))}));t.a=Object(l.a)((function(e){var t={};return e.shadows.forEach((function(e,a){t["elevation".concat(a)]={boxShadow:e}})),Object(i.a)({root:{backgroundColor:e.palette.background.paper,color:e.palette.text.primary,transition:e.transitions.create("box-shadow")},rounded:{borderRadius:e.shape.borderRadius},outlined:{border:"1px solid ".concat(e.palette.divider)}},t)}),{name:"MuiPaper"})(s)},u7Yt:function(e){e.exports=JSON.parse('{"seo:title":{"en":"About AGE","de":"Über AGE"},"seo:description":{"en":"information about AGE Online including repository links","de":"Informationen zu AGE Online und Repository Links"},"heading":{"en":"About AGE","de":"Über AGE"},"text1":{"en":"AGE - Another Gameboy Emulator lets you run Gameboy roms in your Browser.","de":"Mit AGE - Another Gameboy Emulator können Gameboy Roms im Browser abgespielt werden."},"text2":{"en":"AGE does not provide any Gameboy roms by itself. Game state (for roms with battery-supported ram) is saved and loaded automatically by the browser.","de":"AGE stellt selber keine Gameboy Roms zur Verfügung. Der jeweilige Spielstand (für Roms mit Batterie-gestütztem Ram) wird über den Browser automatisch gespeichert und geladen."},"third-party":{"en":"AGE makes use of {licensesLink}.","de":"AGE verwendet {licensesLink}."},"third-party:link":{"en":"third party software","de":"Fremdsoftware"},"third-party:link-label":{"en":"third party software licenses","de":"Fremdsoftware Lizenzen"},"commit":{"en":"deployed commit: {commitLink}{br}({commitDate}){br}branch: {branchLink}","de":"aktiver Commit: {commitLink}{br}({commitDate}){br}Branch: {branchLink}"},"link:repo":{"en":"AGE Online on GitHub","de":"AGE Online auf GitHub"},"link:commit":{"en":"GitHub link to deployed AGE Online commit","de":"GitHub Link zum installierten AGE Online Commit"},"link:branch":{"en":"GitHub link to deployed AGE Online branch","de":"GitHub Link zum installierten AGE Online Branch"}}')},yUsM:function(e,t,a){"use strict";var n=a("cxan"),i=a("HbGN"),r=a("ERkP"),o=a("7O4Y"),l=a("dJc8"),s=a("xOTp"),c={h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",h6:"h6",subtitle1:"h6",subtitle2:"h6",body1:"p",body2:"p"},p=r.forwardRef((function(e,t){var a=e.align,l=void 0===a?"inherit":a,p=e.classes,m=e.className,d=e.color,h=void 0===d?"initial":d,u=e.component,b=e.display,y=void 0===b?"initial":b,g=e.gutterBottom,f=void 0!==g&&g,v=e.noWrap,E=void 0!==v&&v,k=e.paragraph,w=void 0!==k&&k,O=e.variant,x=void 0===O?"body1":O,G=e.variantMapping,A=void 0===G?c:G,j=Object(i.a)(e,["align","classes","className","color","component","display","gutterBottom","noWrap","paragraph","variant","variantMapping"]),S=u||(w?"p":A[x]||c[x])||"span";return r.createElement(S,Object(n.a)({className:Object(o.a)(p.root,m,"inherit"!==x&&p[x],"initial"!==h&&p["color".concat(Object(s.a)(h))],E&&p.noWrap,f&&p.gutterBottom,w&&p.paragraph,"inherit"!==l&&p["align".concat(Object(s.a)(l))],"initial"!==y&&p["display".concat(Object(s.a)(y))]),ref:t},j))}));t.a=Object(l.a)((function(e){return{root:{margin:0},body2:e.typography.body2,body1:e.typography.body1,caption:e.typography.caption,button:e.typography.button,h1:e.typography.h1,h2:e.typography.h2,h3:e.typography.h3,h4:e.typography.h4,h5:e.typography.h5,h6:e.typography.h6,subtitle1:e.typography.subtitle1,subtitle2:e.typography.subtitle2,overline:e.typography.overline,srOnly:{position:"absolute",height:1,width:1,overflow:"hidden"},alignLeft:{textAlign:"left"},alignCenter:{textAlign:"center"},alignRight:{textAlign:"right"},alignJustify:{textAlign:"justify"},noWrap:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},gutterBottom:{marginBottom:"0.35em"},paragraph:{marginBottom:16},colorInherit:{color:"inherit"},colorPrimary:{color:e.palette.primary.main},colorSecondary:{color:e.palette.secondary.main},colorTextPrimary:{color:e.palette.text.primary},colorTextSecondary:{color:e.palette.text.secondary},colorError:{color:e.palette.error.main},displayInline:{display:"inline"},displayBlock:{display:"block"}}}),{name:"MuiTypography"})(p)}}]);