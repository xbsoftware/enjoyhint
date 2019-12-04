/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});
;var EnjoyHint = function (_options) {

    var $event_element;
    var that = this;

    var defaults = {

        onStart: function () {

        },

        onEnd: function () {

        },

        onSkip: function () {

        },

        onNext: function () {

        },

        container: 'body',

        animation_time: 800
    };

    var options = $.extend(defaults, _options);
    var data = [];
    var current_step = 0;

    $body = $(options.container);


    /********************* PRIVATE METHODS ***************************************/

    var init = function () {

        if ($('.enjoyhint')) {

            $('.enjoyhint').remove();
        }

        $body.enjoyhint({

            onNextClick: function () {

                nextStep();
            },

            onSkipClick: function () {

                options.onSkip();
                skipAll();
            },

            animation_time: options.animation_time
        });
    };

    var lockTouch = function(e) {

        e.preventDefault();
    };

    var destroyEnjoy = function () {
        options.onEnd();
        $body.enjoyhint('clear');
        $body.enjoyhint('hide');
        $body.css({'overflow':'auto'});
        $(document).off("touchmove", lockTouch);
    };

    that.clear = function(){

        var $nextBtn = $('.enjoyhint_next_btn');
        var $skipBtn = $('.enjoyhint_skip_btn');

        $nextBtn.removeClass(that.nextUserClass);
        $nextBtn.text("Next");
        $skipBtn.removeClass(that.skipUserClass);
        $skipBtn.text("Skip");
    };

    var stepAction = function () {

        if (!(data && data[current_step])) {
            destroyEnjoy();
            return;
        }

        options.onNext();

        var $enjoyhint = $('.enjoyhint');

        $enjoyhint.removeClass("enjoyhint-step-" + current_step);
        $enjoyhint.removeClass("enjoyhint-step-" + (current_step + 1));
        $enjoyhint.addClass("enjoyhint-step-" + (current_step + 1));

        var step_data = data[current_step];

        if (step_data.onBeforeStart && typeof step_data.onBeforeStart === 'function') {

            step_data.onBeforeStart();
        }

        var timeout = step_data.timeout || 0;

        setTimeout(function () {

            if (!step_data.selector) {

                for (var prop in step_data) {

                    if (step_data.hasOwnProperty(prop) && prop.split(" ")[1]) {

                        step_data.selector = prop.split(" ")[1];
                        var tempEvent = prop.split(" ")[0];

                        if (tempEvent === 'next' || tempEvent === 'auto' || tempEvent === 'custom') {

                            step_data.event_type = tempEvent;
                        } else {
                            step_data.event = tempEvent;
                        }

                        step_data.description = step_data[prop];
                    }
                }
            }

            setTimeout(function () {

                that.clear();
            }, 250);

            $body.scrollTo(step_data.selector, step_data.scrollAnimationSpeed || 250, {offset: -100});

            setTimeout(function () {

                var $element = $(step_data.selector);
                var event = makeEventName(step_data.event);

                $body.enjoyhint('show');
                $body.enjoyhint('hide_next');
                $event_element = $element;

                if (step_data.event_selector) {

                    $event_element = $(step_data.event_selector);
                }

                if (!step_data.event_type && step_data.event == "key") {

                    $element.keydown(function (event) {

                        if (event.which == step_data.keyCode) {

                            current_step++;
                            stepAction();
                        }
                    });
                }

                if (step_data.showNext == true) {

                    $body.enjoyhint('show_next');
                }

                if (step_data.showSkip == false) {

                    $body.enjoyhint('hide_skip');
                } else {

                    $body.enjoyhint('show_skip');
                }

                if (step_data.showSkip == true) {

                }

                if (step_data.nextButton) {

                    var $nextBtn = $('.enjoyhint_next_btn');

                    $nextBtn.addClass(step_data.nextButton.className || "");
                    $nextBtn.text(step_data.nextButton.text || "Next");
                    that.nextUserClass = step_data.nextButton.className;
                }

                if (step_data.skipButton) {

                    var $skipBtn = $('.enjoyhint_skip_btn');

                    $skipBtn.addClass(step_data.skipButton.className || "");
                    $skipBtn.text(step_data.skipButton.text || "Skip");
                    that.skipUserClass = step_data.skipButton.className;
                }

                if (step_data.event_type) {

                    switch (step_data.event_type) {

                        case 'auto':

                            $element[step_data.event]();

                            switch (step_data.event) {

                                case 'click':
                                    break;
                            }

                            current_step++;
                            stepAction();

                            return;
                            break;

                        case 'custom':

                            on(step_data.event, function () {

                                current_step++;
                                off(step_data.event);
                                stepAction();
                            });

                            break;

                        case 'next':

                            $body.enjoyhint('show_next');
                            break;
                    }

                } else {

                    $event_element.on(event, function (e) {

                        if (step_data.keyCode && e.keyCode != step_data.keyCode) {

                            return;
                        }

                        current_step++;
                        $(this).off(event);

                        stepAction(); // clicked
                    });
                }

                var updateShapeData = function () {
                    $element = $(step_data.selector);

                    var rect = $element[0].getBoundingClientRect();
                    var w = rect.width;
                    var h = rect.height;
                    var max_habarites = Math.max(w, h);
                    var radius = step_data.radius || Math.round(max_habarites / 2) + 5;
                    var offset = $element.offset();
                    var shape_margin = (step_data.margin !== undefined) ? step_data.margin : 10;

                    var coords = {
                        x: offset.left + Math.round(w / 2),
                        y: offset.top + Math.round(h / 2) - $(document).scrollTop()
                    };

                    var shape_data = {
                        enjoyHintElementSelector: step_data.selector,
                        center_x: coords.x,
                        center_y: coords.y,
                        text: step_data.description,
                        top: step_data.top,
                        bottom: step_data.bottom,
                        left: step_data.left,
                        right: step_data.right,
                        margin: step_data.margin,
                        scroll: step_data.scroll
                    };

                    if (step_data.shape && step_data.shape == 'circle') {

                        shape_data.shape = 'circle';
                        shape_data.radius = radius;
                    } else {

                        shape_data.radius = 0;
                        shape_data.width = w + shape_margin;
                        shape_data.height = h + shape_margin;
                    }
                    return shape_data;
                };
                var _shape_data = updateShapeData();

                $body.enjoyhint('render_label_with_shape', _shape_data, that.stop, updateShapeData);

                if (step_data.event == "next") {

                    $body.enjoyhint('disable_element_events');
                }
            }, step_data.scrollAnimationSpeed + 20 || 270);
        }, timeout);
    };

    var nextStep = function() {

        current_step++;
        stepAction();
    };

    var skipAll = function() {

        var step_data = data[current_step];
        var $element = $(step_data.selector);

        off(step_data.event);
        $element.off(makeEventName(step_data.event));
        $element.off(makeEventName(step_data.event), true);

        destroyEnjoy();
    };

    var makeEventName = function (name, is_custom) {

        return name + (is_custom ? 'custom' : '') + '.enjoy_hint';
    };

    var on = function (event_name, callback) {

        $body.on(makeEventName(event_name, true), callback);
    };

    var off = function (event_name) {

        $body.off(makeEventName(event_name, true));
    };


    /********************* PUBLIC METHODS ***************************************/

    $(window).on('resize.enjoy_hint_permanent', function() {

        if ($event_element[0]) {
            $body.enjoyhint('redo_events_near_rect', $event_element[0].getBoundingClientRect());
        }
    });

    that.stop = function() {

        skipAll();
    };

    that.reRunScript = function(cs) {

        current_step = cs;
        stepAction();
    };

    that.runScript = function () {
        $body.css({'overflow':'hidden'});
        $(document).on("touchmove",lockTouch);

        current_step = 0;
        options.onStart();
        stepAction();
    };

    that.resumeScript = function () {

        stepAction();
    };

    that.setCurrentStep = function(cs) {

        current_step = cs;
    };

    that.getCurrentStep = function () {

        return current_step;
    };

    that.trigger = function (event_name) {

        switch (event_name) {

            case 'next':

                nextStep();
                break;

            case 'skip':

                skipAll();
                break;

            // Trigger a custom event
            default:
                $body.trigger(makeEventName(event_name, true));
                break;
        }
    };

    that.setScript = function (_data) {

        if (_data) {

            data = _data;
        }
    };

    //support deprecated API methods
    that.set = function (_data) {

        that.setScript(_data);
    };

    that.setSteps = function (_data) {

        that.setScript(_data);
    };

    that.run = function () {

        that.runScript();
    };

    that.resume = function () {

        that.resumeScript();
    };

    init();
};
;CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {

    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

(function ($) {

    var that;

    var originalLabelLeft, originalLabelTop;
    var originalArrowLeft, originalArrowTop;
    var originalCenterX, originalCenterY;
    var originalSkipbuttonLeft, originalSkipbuttonTop;
    var prevWindowWidth, prevWindowHeight;
    var originalWidth = window.innerWidth, originalHeight = window.innerHeight;

    var methods = {

        init: function (options) {

            return this.each(function () {

                var defaults = {

                    onNextClick: function () {

                    },
                    onSkipClick: function () {

                    },

                    animation_time: 800
                };

                this.enjoyhint_obj = {};
                that = this.enjoyhint_obj;

                that.resetComponentStuff = function() {

                    originalLabelLeft = null;
                    originalLabelTop = null;
                    originalArrowLeft = null;
                    originalArrowTop = null;
                    originalCenterX = null;
                    originalCenterY = null;
                    originalSkipbuttonLeft = null;
                    originalSkipbuttonTop = null;
                    prevWindowWidth = null;
                    prevWindowHeight = null;
                    originalWidth = window.innerWidth;
                    originalHeight = window.innerHeight;
                };


                var $that = $(this);
                that.options = jQuery.extend(defaults, options);

                //general classes
                that.gcl = {

                    chooser: 'enjoyhint'
                };

                // classes
                that.cl = {

                    enjoy_hint: 'enjoyhint',
                    hide: 'enjoyhint_hide',
                    disable_events_element: 'enjoyhint_disable_events',
                    btn: 'enjoyhint_btn',
                    skip_btn: 'enjoyhint_skip_btn',
                    close_btn: 'enjoyhint_close_btn',
                    next_btn: 'enjoyhint_next_btn',
                    main_canvas: 'enjoyhint_canvas',
                    main_svg: 'enjoyhint_svg',
                    svg_wrapper: 'enjoyhint_svg_wrapper',
                    svg_transparent: 'enjoyhint_svg_transparent',
                    kinetic_container: 'kinetic_container'
                };

                function makeSVG(tag, attrs) {

                    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);

                    for (var k in attrs) {

                        el.setAttribute(k, attrs[k]);
                    }

                    return el;
                }


                // =======================================================================
                // ========================---- enjoyhint ----==============================
                // =======================================================================

                that.canvas_size = {

                    w: $(window).width()*1.4,
                    h: $(window).height()*1.4
                };

                var canvas_id = "enj_canvas";

                that.enjoyhint = $('<div>', {'class': that.cl.enjoy_hint + ' ' + that.cl.svg_transparent}).appendTo($that);
                that.enjoyhint_svg_wrapper = $('<div>', {'class': that.cl.svg_wrapper + ' ' + that.cl.svg_transparent}).appendTo(that.enjoyhint);
                that.$stage_container = $('<div id="' + that.cl.kinetic_container + '">').appendTo(that.enjoyhint);
                that.$canvas = $('<canvas id="' + canvas_id + '" width="' + that.canvas_size.w + '" height="' + that.canvas_size.h + '" class="' + that.cl.main_canvas + '">').appendTo(that.enjoyhint);
                that.$svg = $('<svg width="' + that.canvas_size.w + '" height="' + that.canvas_size.h + '" class="' + that.cl.main_canvas + ' ' + that.cl.main_svg + '">').appendTo(that.enjoyhint_svg_wrapper);

                var defs = $(makeSVG('defs'));
                var marker = $(makeSVG('marker', {id: "arrowMarker", viewBox: "0 0 36 21", refX: "21", refY: "10", markerUnits: "strokeWidth", orient: "auto", markerWidth: "16", markerHeight: "12"}));
                var polilyne = $(makeSVG('path', {style: "fill:none; stroke:rgb(255,255,255); stroke-width:2", d: "M0,0 c30,11 30,9 0,20"}));

                defs.append(marker.append(polilyne)).appendTo(that.$svg);

                that.kinetic_stage = new Kinetic.Stage({
                    container: that.cl.kinetic_container,
                    width: that.canvas_size.w,
                    height: that.canvas_size.h,
                    scaleX: 1
                });

                that.layer = new Kinetic.Layer();
                that.rect = new Kinetic.Rect({
                    fill: 'rgba(0,0,0,0.6)',
                    width: that.canvas_size.w,
                    height: that.canvas_size.h
                });

                var $top_dis_events = $('<div>', {'class': that.cl.disable_events_element}).appendTo(that.enjoyhint);
                var $bottom_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);
                var $left_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);
                var $right_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);
                that.$element_dis_events = $top_dis_events.clone().appendTo(that.enjoyhint);

                var stopPropagation = function(e) {

                    e.stopImmediatePropagation();
                };

                $("button").focusout(stopPropagation);
                $top_dis_events.click(stopPropagation);
                $bottom_dis_events.click(stopPropagation);
                $left_dis_events.click(stopPropagation);
                $right_dis_events.click(stopPropagation);
                that.$element_dis_events.click(stopPropagation);


                that.$skip_btn = $('<div>', {'class': that.cl.skip_btn}).appendTo(that.enjoyhint).html('Skip').click(function (e) {

                    that.hide();
                    that.options.onSkipClick();
                });
                that.$next_btn = $('<div>', {'class': that.cl.next_btn}).appendTo(that.enjoyhint).html('Next').click(function (e) {

                    that.options.onNextClick();
                });

                that.$close_btn = $('<div>', {'class': that.cl.close_btn}).appendTo(that.enjoyhint).html('').click(function (e) {

                    that.hide();
                    that.options.onSkipClick();
                });

                that.$canvas.mousedown(function (e) {

                    $('canvas').css({left: '4000px'});

                    var BottomElement = document.elementFromPoint(e.clientX, e.clientY);
                    $('canvas').css({left: '0px'});

                    $(BottomElement).click();

                    return false;
                });


                var circle_r = 0;
                var shape_init_shift = 130;

                that.shape = new Kinetic.Shape({
                    radius: circle_r,
                    center_x: -shape_init_shift,
                    center_y: -shape_init_shift,
                    width: 0,
                    height: 0,
                    sceneFunc: function (context) {

                        var ctx = this.getContext("2d")._context;
                        var pos = this.pos;
                        var def_comp = ctx.globalCompositeOperation;
                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.beginPath();

                        var x = this.attrs.center_x - Math.round(this.attrs.width / 2);
                        var y = this.attrs.center_y - Math.round(this.attrs.height / 2);
                        ctx.roundRect(x, y, this.attrs.width, this.attrs.height, this.attrs.radius);
                        ctx.fillStyle = "red";
                        ctx.fill();

                        ctx.globalCompositeOperation = def_comp;
                    }
                });

                that.shape.radius = circle_r;
                that.layer.add(that.rect);
                that.layer.add(that.shape);
                that.kinetic_stage.add(that.layer);

                $(window).on('resize.enjoy_hint', function() {
                    if (!($(that.stepData.enjoyHintElementSelector).is(":visible"))) {

                        that.stopFunction();
                        $(window).off('resize.enjoy_hint');
                        return;
                    }

                    var newWidth = window.innerWidth;
                    var newHeight = window.innerHeight;
                    that.kinetic_stage.setAttr('width', newWidth );
                    that.kinetic_stage.setAttr('height', newHeight );

                    that.rect = new Kinetic.Rect({
                        fill: 'rgba(0,0,0,0.6)',
                        width: newWidth,
                        height: newHeight
                    });

                    that.layer.removeChildren();
                    that.layer.add(that.rect);
                    that.layer.add(that.shape);
                    that.layer.draw();
                    that.kinetic_stage.draw();

                    that.renderLabelWithShape(that.updateShapeData());
                });

                var enjoyhint_elements = [
                    that.enjoyhint,
                    $top_dis_events,
                    $bottom_dis_events,
                    $left_dis_events,
                    $right_dis_events,
                    that.$element_dis_events
                ];

                that.show = function () {

                    that.enjoyhint.removeClass(that.cl.hide);
                };

                that.hide = function () {

                    that.enjoyhint.addClass(that.cl.hide);

                    var tween = new Kinetic.Tween({
                        node: that.shape,
                        duration: 0.002,
                        center_x: -shape_init_shift,
                        center_y: -shape_init_shift
                    });

                    tween.play();
                };

                that.hide();

                that.hideNextBtn = function () {

                    that.$next_btn.addClass(that.cl.hide);
                    that.nextBtn = "hide";
                };

                that.showNextBtn = function () {

                    that.$next_btn.removeClass(that.cl.hide);
                    that.nextBtn = "show";
                };

                that.hideSkipBtn = function () {

                    that.$skip_btn.addClass(that.cl.hide);
                };

                that.showSkipBtn = function () {

                    that.$skip_btn.removeClass(that.cl.hide);
                };

                that.disableEventsOfRect = function () {
                    that.$element_dis_events.show();
                };

                that.renderCircle = function (data) {

                    var r = data.r || 0;
                    var x = data.x || 0;
                    var y = data.y || 0;

                    var tween = new Kinetic.Tween({
                        node: that.shape,
                        duration: 0.2,
                        center_x: x,
                        center_y: y,
                        width: r * 2,
                        height: r * 2,
                        radius: r
                    });

                    tween.play();

                    var left = x - r;
                    var right = x + r;
                    var top = y - r;
                    var bottom = y + r;
                    var margin = 20;

                    return {
                        x: x,
                        y: y,
                        left: left,
                        right: right,
                        top: top,
                        bottom: bottom,
                        conn: {
                            left: {
                                x: left - margin,
                                y: y
                            },
                            right: {
                                x: right + margin,
                                y: y
                            },
                            top: {
                                x: x,
                                y: top - margin
                            },
                            bottom: {
                                x: x,
                                y: bottom + margin
                            }
                        }
                    };

                };

                that.renderRect = function (data, timeout) {

                    var r = data.r || 0;
                    var x = data.x || 0;
                    var y = data.y || 0;
                    var w = data.w || 0;
                    var h = data.h || 0;
                    var margin = 20;

                    var tween = new Kinetic.Tween({
                        node: that.shape,
                        duration: timeout,
                        center_x: x,
                        center_y: y,
                        width: w,
                        height: h,
                        radius: r
                    });

                    tween.play();

                    var half_w = Math.round(w / 2);
                    var half_h = Math.round(h / 2);
                    var left = x - half_w;
                    var right = x + half_w;
                    var top = y - half_h;
                    var bottom = y + half_h;

                    return {
                        x: x,
                        y: y,
                        left: left,
                        right: right,
                        top: top,
                        bottom: bottom,
                        conn: {
                            left: {
                                x: left - margin,
                                y: y
                            },
                            right: {
                                x: right + margin,
                                y: y
                            },
                            top: {
                                x: x,
                                y: top - margin
                            },
                            bottom: {
                                x: x,
                                y: bottom + margin
                            }
                        }
                    };
                };

                that.renderLabel = function (data) {

                    var x = data.x || 0;
                    that.originalElementX = x;
                    var y = data.y || 0;
                    var text = data.text || 0;

                    var label = that.getLabelElement({
                        x: x,
                        y: y,
                        text: data.text
                    });

                    var label_w = label.width();
                    var label_h = label.height();
                    var label_left = label.offset().left;
                    var label_right = label.offset().left + label_w;
                    var label_top = label.offset().top - $(document).scrollTop();
                    var label_bottom = label.offset().top + label_h;

                    var margin = 10;

                    var conn_left = {
                        x: label_left - margin,
                        y: label_top + Math.round(label_h / 2)
                    };

                    var conn_right = {
                        x: label_right + margin,
                        y: label_top + Math.round(label_h / 2)
                    };

                    var conn_top = {
                        x: label_left + Math.round(label_w / 2),
                        y: label_top - margin
                    };

                    var conn_bottom = {
                        x: label_left + Math.round(label_w / 2),
                        y: label_bottom + margin
                    };

                    label.detach();

                    setTimeout(function () {

                        $('#enjoyhint_label').remove();
                        label.appendTo(that.enjoyhint);
                    }, that.options.animation_time / 2);

                    return {
                        label: label,
                        left: label_left,
                        right: label_right,
                        top: label_top,
                        bottom: label_bottom,
                        conn: {
                            left: conn_left,
                            right: conn_right,
                            top: conn_top,
                            bottom: conn_bottom
                        }

                    };
                };

                that.renderArrow = function (data) {

                        var x_from = data.x_from || 0;
                        var y_from = data.y_from || 0;
                        var x_to = data.x_to || 0;
                        var y_to = data.y_to || 0;
                        var by_top_side = data.by_top_side;
                        var control_point_x = 0;
                        var control_point_y = 0;

                    if (window.innerWidth >= 640) {

                        if (by_top_side) {

                            if (y_from >= y_to) {

                                control_point_y = y_to;
                                control_point_x = x_from;
                            } else {

                                control_point_y = y_from;
                                control_point_x = x_to;
                            }
                        } else {

                            if (y_from >= y_to) {

                                control_point_y = y_from;
                                control_point_x = x_to;
                            } else {

                                control_point_y = y_to;
                                control_point_x = x_from;
                            }
                        }
                    }


                    var text = data.text || '';
                    that.enjoyhint.addClass(that.cl.svg_transparent);

                    setTimeout(function () {

                        $('#enjoyhint_arrpw_line').remove();

                        var d = 'M' + x_from + ',' + y_from + ' Q' + control_point_x + ',' + control_point_y + ' ' + x_to + ',' + y_to;
                        that.$svg.append(makeSVG('path', {style: "fill:none; stroke:rgb(255,255,255); stroke-width:3", 'marker-end': "url(#arrowMarker)", d: d, id: 'enjoyhint_arrpw_line'}));
                        that.enjoyhint.removeClass(that.cl.svg_transparent);

                    }, that.options.animation_time / 2);
                };

                that.getLabelElement = function (data) {

                    return $('<div>', {"class": 'enjoy_hint_label', id: 'enjoyhint_label'})
                        .css({
                            'top': data.y + 'px',
                            'left': data.x + 'px'
                        })
                        .html(data.text).appendTo(that.enjoyhint);
                };


                that.disableEventsNearRect = function (rect) {

                    $top_dis_events.css({
                        top: '0',
                        left: '0'
                    }).height(rect.top);

                    $bottom_dis_events.css({
                        top: rect.bottom + 'px',
                        left: '0'
                    });

                    $left_dis_events.css({
                        top: '0',
                        left: 0 + 'px'
                    }).width(rect.left);

                    $right_dis_events.css({
                        top: '0',
                        left: rect.right + 'px'
                    });

                    that.$element_dis_events.css({
                        top: rect.top + 'px',
                        left: rect.left + 'px'
                    })
                    .width(rect.right - rect.left)
                    .height(rect.bottom - rect.top)
                    .hide();

                };

                (function($) {

                    $.event.special.destroyed = {

                        remove: function(o) {

                            if (o.handler) {

                                o.handler()
                            }
                        }
                    }
                })(jQuery);

                that.renderLabelWithShape = function (data) {

                    that.stepData = data;

                    function findParentDialog(element) {

                        if (element.tagName === "MD-DIALOG") {

                            return element;
                        } else if (typeof element.tagName == "undefined") {

                            return null;
                        } else {

                            return findParentDialog($(element).parent()[0]);
                        }
                    }

                    var dialog = findParentDialog($(that.stepData.enjoyHintElementSelector)[0]);

                    if (dialog != null) {

                        $(dialog).on('dialogClosing', function() {

                            that.stopFunction();
                            return;
                        });
                    }

                    that.resetComponentStuff();

                    var shape_type = data.shape || 'rect';
                    var shape_data = {};

                    var half_w = 0;
                    var half_h = 0;

                    var shape_offsets = {
                        top: data.top || 0,
                        bottom: data.bottom || 0,
                        left: data.left || 0,
                        right: data.right || 0
                    };

                    switch (shape_type) {

                        case 'circle':

                            half_w = half_h = data.radius;

                            var sides_pos = {
                                top: data.center_y - half_h + shape_offsets.top,
                                bottom: data.center_y + half_h - shape_offsets.bottom,
                                left: data.center_x - half_w + shape_offsets.left,
                                right: data.center_x + half_w - shape_offsets.right
                            };

                            var width = sides_pos.right - sides_pos.left;
                            var height = sides_pos.bottom - sides_pos.top;
                            data.radius = Math.round(Math.min(width, height) / 2);

                            //new half habarites
                            half_w = half_h = Math.round(data.radius / 2);

                            var new_half_w = Math.round(width / 2);
                            var new_half_h = Math.round(height / 2);

                            //new center_x and center_y
                            data.center_x = sides_pos.left + new_half_w;
                            data.center_y = sides_pos.top + new_half_h;

                            shape_data = that.renderCircle({
                                x: data.center_x,
                                y: data.center_y,
                                r: data.radius
                            });

                            break;

                        case 'rect':

                            half_w = Math.round(data.width / 2);
                            half_h = Math.round(data.height / 2);

                            var sides_pos = {
                                top: data.center_y - half_h + shape_offsets.top,
                                bottom: data.center_y + half_h - shape_offsets.bottom,
                                left: data.center_x - half_w + shape_offsets.left,
                                right: data.center_x + half_w - shape_offsets.right
                            };

                            data.width = sides_pos.right - sides_pos.left;
                            data.height = sides_pos.bottom - sides_pos.top;

                            half_w = Math.round(data.width / 2);
                            half_h = Math.round(data.height / 2);

                            //new center_x and center_y
                            data.center_x = sides_pos.left + half_w;
                            data.center_y = sides_pos.top + half_h;

                            shape_data = that.renderRect({
                                x: data.center_x,
                                y: data.center_y,
                                w: data.width,
                                h: data.height,
                                r: data.radius
                            }, 0.2);

                            break;
                    }

                    var body_size = {
                        w: that.enjoyhint.width(),
                        h: that.enjoyhint.height()
                    };

                    var label = that.getLabelElement({
                        x: 0,
                        y: 0,
                        text: data.text
                    });

                    var label_width = label.outerWidth();
                    var label_height = label.outerHeight();
                    label.remove();
                    var top_offset = data.center_y - half_h;
                    var bottom_offset = body_size.h - (data.center_y + half_h);
                    var left_offset = data.center_x - half_w;
                    var right_offset = body_size.w - (data.center_x + half_w);

                    var label_hor_side = (body_size.w - data.center_x) < data.center_x ? 'left' : 'right';
                    var label_ver_side = (body_size.h - data.center_y) < data.center_y ? 'top' : 'bottom';
                    var label_shift = 150;
                    var label_margin = 40;
                    var label_shift_with_label_width = label_shift + label_width + label_margin;
                    var label_shift_with_label_height = label_shift + label_height + label_margin;
                    var label_hor_offset = half_w + label_shift;
                    var label_ver_offset = half_h + label_shift;

                    //original: var label_x = (label_hor_side == 'left') ? data.center_x - label_hor_offset - label_width : data.center_x + label_hor_offset;
                    var label_y = (label_ver_side == 'top') ? data.center_y - label_ver_offset - label_height : data.center_y + label_ver_offset;
                    var label_x = window.innerWidth / 2 - label_width / 2;

                    if (top_offset < label_shift_with_label_height && bottom_offset < label_shift_with_label_height) {

                        label_y = data.center_y + label_margin;
                    }

                    if (window.innerWidth <= 640) {

                    }

                    var label_data = that.renderLabel({
                        x: label_x,
                        y: label_y,
                        text: data.text
                    });

                    that.$next_btn.css({
                        left: label_x,
                        top: label_y + label_height + 20
                    });

                    var left_skip = label_x + that.$next_btn.width() + 10;

                    if (that.nextBtn == "hide"){

                        left_skip = label_x;
                    }

                    that.$skip_btn.css({
                        left: left_skip,
                        top: label_y + label_height + 20
                    });

                    that.$close_btn.css({
                        right : 10,
                        top: 10
                    });

                    that.disableEventsNearRect({
                        top: shape_data.top,
                        bottom: shape_data.bottom,
                        left: shape_data.left,
                        right: shape_data.right
                    });

                    var x_to = 0;
                    var y_to = 0;
                    var arrow_side = false;
                    var conn_label_side = 'left';
                    var conn_circle_side = 'left';

                    var is_center = (label_data.left <= shape_data.x && label_data.right >= shape_data.x);
                    var is_left = (label_data.right < shape_data.x);
                    var is_right = (label_data.left > shape_data.x);

                    var is_abs_left = (label_data.right < shape_data.left);
                    var is_abs_right = (label_data.left > shape_data.right);

                    var is_top = (label_data.bottom < shape_data.top);
                    var is_bottom = (label_data.top > shape_data.bottom);
                    var is_mid = (label_data.bottom >= shape_data.y && label_data.top <= shape_data.y);
                    var is_mid_top = (label_data.bottom <= shape_data.y && !is_top);
                    var is_mid_bottom = (label_data.top >= shape_data.y && !is_bottom);


                    function setArrowData(l_s, c_s, a_s) {

                        conn_label_side = l_s;
                        conn_circle_side = c_s;
                        arrow_side = a_s;
                    }

                    function sideStatements(top_s, mid_top_s, mid_s, mid_bottom_s, bottom_s) {

                        var statement = [];

                        if (is_top) {

                            statement = top_s;
                        } else if (is_mid_top) {

                            statement = mid_top_s;
                        } else if (is_mid) {

                            statement = mid_s;
                        } else if (is_mid_bottom) {

                            statement = mid_bottom_s;
                        } else {//bottom

                            statement = bottom_s;
                        }

                        if (!statement) {

                            return;
                        } else {

                            setArrowData(statement[0], statement[1], statement[2]);
                        }
                    }

                    if (is_center) {

                        if (is_top) {

                            setArrowData('bottom', 'top', 'top');
                        } else if (is_bottom) {

                            setArrowData('top', 'bottom', 'bottom');
                        } else {

                            return;
                        }

                    } else if (is_left) {

                        sideStatements(
                            ['right', 'top', 'top'],//top
                            ['bottom', 'left', 'bottom'],//mid_top
                            ['right', 'left', 'top'],//mid
                            ['top', 'left', 'top'],//mid_bot
                            ['right', 'bottom', 'bottom']//bot
                        );

                    } else {//right

                        sideStatements(
                            ['left', 'top', 'top'],//top
                            ['bottom', 'right', 'bottom'],//mid_top
                            ['left', 'right', 'top'],//mid
                            ['top', 'right', 'top'],//mid_bot
                            ['left', 'bottom', 'bottom']//bot
                        );

                    }

                    var label_conn_coordinates = label_data.conn[conn_label_side];
                    var circle_conn_coordinates = shape_data.conn[conn_circle_side];
                    var by_top_side = (arrow_side == 'top');

                    that.renderArrow({
                        x_from: label_conn_coordinates.x,
                        y_from: label_conn_coordinates.y,
                        x_to: window.innerWidth < 640 ? shape_data.left + (shape_data.left > 0) : circle_conn_coordinates.x,
                        y_to: window.innerWidth < 640 ? shape_data.conn.left.y : circle_conn_coordinates.y,
                        by_top_side: by_top_side
                    });

                };

                that.clear = function () {
                  $('#enjoyhint_arrpw_line').remove();
                  $('#enjoyhint_label').remove();
                  $(window).off('resize.enjoy_hint');
                };

                return this;
            });
        },

        set: function (val) {

            this.each(function () {

                this.enjoyhint_obj.setValue(val);
            });

            return this;
        },

        show: function () {

            this.each(function () {

                this.enjoyhint_obj.show();
            });

            return this;
        },

        hide: function () {

            this.each(function () {

                this.enjoyhint_obj.hide();
            });

            return this;
        },

        hide_next: function () {

            this.each(function () {

                this.enjoyhint_obj.hideNextBtn();
            });

            return this;
        },

        show_next: function () {

            this.each(function () {

                this.enjoyhint_obj.showNextBtn();
            });

            return this;
        },

        hide_skip: function () {

            this.each(function () {

                this.enjoyhint_obj.hideSkipBtn();
            });

            return this;
        },

        show_skip: function () {

            this.each(function () {

                this.enjoyhint_obj.showSkipBtn();
            });

            return this;
        },

        render_circle: function (x, y, r) {

            this.each(function () {

                this.enjoyhint_obj.renderCircle(x, y, r);
            });

            return this;
        },

        render_label: function (x, y, r) {

            this.each(function () {

                this.enjoyhint_obj.renderLabel(x, y, r);
            });

            return this;
        },

        render_label_with_shape: function (data, stopFunction, updateShapeData) {

            this.each(function () {

                that.stopFunction = stopFunction;
                that.updateShapeData = updateShapeData;
                this.enjoyhint_obj.renderLabelWithShape(data);
            });

            return this;
        },

        redo_events_near_rect: function(rect) {

            that.disableEventsNearRect({
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                right: rect.right
            });
        },

        clear: function () {

            this.each(function () {

                this.enjoyhint_obj.clear();
            });

            return this;
        },

        close: function (val) {

            this.each(function () {

                this.enjoyhint_obj.closePopdown();
            });

            return this;
        },

        disable_element_events: function () {

            this.each(function () {
                this.enjoyhint_obj.disableEventsOfRect();
            });

            return this;
        }

    };

    $.fn.enjoyhint = function (method) {

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {

            return methods.init.apply(this, arguments);
        } else {

            $.error('Method ' + method + ' does not exist on $.numinput');
        }

        return this;
    };
})(window.jQuery);
;/*! KineticJS v5.2.0 2015-01-22 http://lavrton.github.io/KineticJS/ by Eric Rowell @ericdrowell, Anton Lavrenov @lavrton - MIT License https://github.com/lavrton/KineticJS/wiki/License*/
var Kinetic={};!function(a){var b=Math.PI/180;Kinetic={version:"5.2.0",stages:[],idCounter:0,ids:{},names:{},shapes:{},listenClickTap:!1,inDblClickWindow:!1,enableTrace:!1,traceArrMax:100,dblClickWindow:400,pixelRatio:void 0,dragDistance:0,angleDeg:!0,showWarnings:!0,Filters:{},Node:function(a){this._init(a)},Shape:function(a){this.__init(a)},Container:function(a){this.__init(a)},Stage:function(a){this.___init(a)},BaseLayer:function(a){this.___init(a)},Layer:function(a){this.____init(a)},FastLayer:function(a){this.____init(a)},Group:function(a){this.___init(a)},isDragging:function(){var a=Kinetic.DD;return a?a.isDragging:!1},isDragReady:function(){var a=Kinetic.DD;return a?!!a.node:!1},_addId:function(a,b){void 0!==b&&(this.ids[b]=a)},_removeId:function(a){void 0!==a&&delete this.ids[a]},_addName:function(a,b){if(void 0!==b)for(var c=b.split(/\s/g),d=0;d<c.length;d++){var e=c[d];e&&(void 0===this.names[e]&&(this.names[e]=[]),this.names[e].push(a))}},_removeName:function(a,b){if(void 0!==a){var c=this.names[a];if(void 0!==c){for(var d=0;d<c.length;d++){var e=c[d];e._id===b&&c.splice(d,1)}0===c.length&&delete this.names[a]}}},getAngle:function(a){return this.angleDeg?a*b:a},_parseUA:function(a){var b=a.toLowerCase(),c=/(chrome)[ \/]([\w.]+)/.exec(b)||/(webkit)[ \/]([\w.]+)/.exec(b)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b)||/(msie) ([\w.]+)/.exec(b)||b.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b)||[],d=!!a.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i),e=!!a.match(/IEMobile/i);return{browser:c[1]||"",version:c[2]||"0",mobile:d,ieMobile:e}},UA:void 0},Kinetic.UA=Kinetic._parseUA(a.navigator&&a.navigator.userAgent||"")}(this),function(a,b){if("object"==typeof exports){var c=b();if(global.window===global)Kinetic.document=global.document,Kinetic.window=global;else{var d=require("canvas"),e=require("jsdom").jsdom;Kinetic.document=e("<!DOCTYPE html><html><head></head><body></body></html>"),Kinetic.window=Kinetic.document.createWindow(),Kinetic.window.Image=d.Image,Kinetic._nodeCanvas=d}return Kinetic.root=a,void(module.exports=c)}"function"==typeof define&&define.amd&&define(b),Kinetic.document=document,Kinetic.window=window,Kinetic.root=a}(this,function(){return Kinetic}),function(){Kinetic.Collection=function(){var a=[].slice.call(arguments),b=a.length,c=0;for(this.length=b;b>c;c++)this[c]=a[c];return this},Kinetic.Collection.prototype=[],Kinetic.Collection.prototype.each=function(a){for(var b=0;b<this.length;b++)a(this[b],b)},Kinetic.Collection.prototype.toArray=function(){var a,b=[],c=this.length;for(a=0;c>a;a++)b.push(this[a]);return b},Kinetic.Collection.toCollection=function(a){var b,c=new Kinetic.Collection,d=a.length;for(b=0;d>b;b++)c.push(a[b]);return c},Kinetic.Collection._mapMethod=function(a){Kinetic.Collection.prototype[a]=function(){var b,c=this.length,d=[].slice.call(arguments);for(b=0;c>b;b++)this[b][a].apply(this[b],d);return this}},Kinetic.Collection.mapMethods=function(a){var b=a.prototype;for(var c in b)Kinetic.Collection._mapMethod(c)},Kinetic.Transform=function(a){this.m=a&&a.slice()||[1,0,0,1,0,0]},Kinetic.Transform.prototype={copy:function(){return new Kinetic.Transform(this.m)},point:function(a){var b=this.m;return{x:b[0]*a.x+b[2]*a.y+b[4],y:b[1]*a.x+b[3]*a.y+b[5]}},translate:function(a,b){return this.m[4]+=this.m[0]*a+this.m[2]*b,this.m[5]+=this.m[1]*a+this.m[3]*b,this},scale:function(a,b){return this.m[0]*=a,this.m[1]*=a,this.m[2]*=b,this.m[3]*=b,this},rotate:function(a){var b=Math.cos(a),c=Math.sin(a),d=this.m[0]*b+this.m[2]*c,e=this.m[1]*b+this.m[3]*c,f=this.m[0]*-c+this.m[2]*b,g=this.m[1]*-c+this.m[3]*b;return this.m[0]=d,this.m[1]=e,this.m[2]=f,this.m[3]=g,this},getTranslation:function(){return{x:this.m[4],y:this.m[5]}},skew:function(a,b){var c=this.m[0]+this.m[2]*b,d=this.m[1]+this.m[3]*b,e=this.m[2]+this.m[0]*a,f=this.m[3]+this.m[1]*a;return this.m[0]=c,this.m[1]=d,this.m[2]=e,this.m[3]=f,this},multiply:function(a){var b=this.m[0]*a.m[0]+this.m[2]*a.m[1],c=this.m[1]*a.m[0]+this.m[3]*a.m[1],d=this.m[0]*a.m[2]+this.m[2]*a.m[3],e=this.m[1]*a.m[2]+this.m[3]*a.m[3],f=this.m[0]*a.m[4]+this.m[2]*a.m[5]+this.m[4],g=this.m[1]*a.m[4]+this.m[3]*a.m[5]+this.m[5];return this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g,this},invert:function(){var a=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]),b=this.m[3]*a,c=-this.m[1]*a,d=-this.m[2]*a,e=this.m[0]*a,f=a*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),g=a*(this.m[1]*this.m[4]-this.m[0]*this.m[5]);return this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g,this},getMatrix:function(){return this.m},setAbsolutePosition:function(a,b){var c=this.m[0],d=this.m[1],e=this.m[2],f=this.m[3],g=this.m[4],h=this.m[5],i=(c*(b-h)-d*(a-g))/(c*f-d*e),j=(a-g-e*i)/c;return this.translate(j,i)}};var a="2d",b="[object Array]",c="[object Number]",d="[object String]",e=Math.PI/180,f=180/Math.PI,g="#",h="",i="0",j="Kinetic warning: ",k="Kinetic error: ",l="rgb(",m={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},n=/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;Kinetic.Util={_isElement:function(a){return!(!a||1!=a.nodeType)},_isFunction:function(a){return!!(a&&a.constructor&&a.call&&a.apply)},_isObject:function(a){return!!a&&a.constructor==Object},_isArray:function(a){return Object.prototype.toString.call(a)==b},_isNumber:function(a){return Object.prototype.toString.call(a)==c},_isString:function(a){return Object.prototype.toString.call(a)==d},_throttle:function(a,b,c){var d,e,f,g=null,h=0,i=c||{},j=function(){h=i.leading===!1?0:(new Date).getTime(),g=null,f=a.apply(d,e),d=e=null};return function(){var c=(new Date).getTime();h||i.leading!==!1||(h=c);var k=b-(c-h);return d=this,e=arguments,0>=k?(clearTimeout(g),g=null,h=c,f=a.apply(d,e),d=e=null):g||i.trailing===!1||(g=setTimeout(j,k)),f}},_hasMethods:function(a){var b,c=[];for(b in a)this._isFunction(a[b])&&c.push(b);return c.length>0},createCanvasElement:function(){var a=Kinetic.document.createElement("canvas");try{a.style=a.style||{}}catch(b){}return a},isBrowser:function(){return"object"!=typeof exports},_isInDocument:function(a){for(;a=a.parentNode;)if(a==Kinetic.document)return!0;return!1},_simplifyArray:function(a){var b,c,d=[],e=a.length,f=Kinetic.Util;for(b=0;e>b;b++)c=a[b],f._isNumber(c)?c=Math.round(1e3*c)/1e3:f._isString(c)||(c=c.toString()),d.push(c);return d},_getImage:function(b,c){var d,e;if(b)if(this._isElement(b))c(b);else if(this._isString(b))d=new Kinetic.window.Image,d.onload=function(){c(d)},d.src=b;else if(b.data){e=Kinetic.Util.createCanvasElement(),e.width=b.width,e.height=b.height;var f=e.getContext(a);f.putImageData(b,0,0),this._getImage(e.toDataURL(),c)}else c(null);else c(null)},_getRGBAString:function(a){var b=a.red||0,c=a.green||0,d=a.blue||0,e=a.alpha||1;return["rgba(",b,",",c,",",d,",",e,")"].join(h)},_rgbToHex:function(a,b,c){return((1<<24)+(a<<16)+(b<<8)+c).toString(16).slice(1)},_hexToRgb:function(a){a=a.replace(g,h);var b=parseInt(a,16);return{r:b>>16&255,g:b>>8&255,b:255&b}},getRandomColor:function(){for(var a=(16777215*Math.random()<<0).toString(16);a.length<6;)a=i+a;return g+a},get:function(a,b){return void 0===a?b:a},getRGB:function(a){var b;return a in m?(b=m[a],{r:b[0],g:b[1],b:b[2]}):a[0]===g?this._hexToRgb(a.substring(1)):a.substr(0,4)===l?(b=n.exec(a.replace(/ /g,"")),{r:parseInt(b[1],10),g:parseInt(b[2],10),b:parseInt(b[3],10)}):{r:0,g:0,b:0}},_merge:function(a,b){var c=this._clone(b);for(var d in a)c[d]=this._isObject(a[d])?this._merge(a[d],c[d]):a[d];return c},cloneObject:function(a){var b={};for(var c in a)b[c]=this._isObject(a[c])?this.cloneObject(a[c]):this._isArray(a[c])?this.cloneArray(a[c]):a[c];return b},cloneArray:function(a){return a.slice(0)},_degToRad:function(a){return a*e},_radToDeg:function(a){return a*f},_capitalize:function(a){return a.charAt(0).toUpperCase()+a.slice(1)},error:function(a){throw new Error(k+a)},warn:function(a){Kinetic.root.console&&console.warn&&Kinetic.showWarnings&&console.warn(j+a)},extend:function(a,b){function c(){this.constructor=a}c.prototype=b.prototype;var d=a.prototype;a.prototype=new c;for(var e in d)d.hasOwnProperty(e)&&(a.prototype[e]=d[e]);a.__super__=b.prototype},addMethods:function(a,b){var c;for(c in b)a.prototype[c]=b[c]},_getControlPoints:function(a,b,c,d,e,f,g){var h=Math.sqrt(Math.pow(c-a,2)+Math.pow(d-b,2)),i=Math.sqrt(Math.pow(e-c,2)+Math.pow(f-d,2)),j=g*h/(h+i),k=g*i/(h+i),l=c-j*(e-a),m=d-j*(f-b),n=c+k*(e-a),o=d+k*(f-b);return[l,m,n,o]},_expandPoints:function(a,b){var c,d,e=a.length,f=[];for(c=2;e-2>c;c+=2)d=Kinetic.Util._getControlPoints(a[c-2],a[c-1],a[c],a[c+1],a[c+2],a[c+3],b),f.push(d[0]),f.push(d[1]),f.push(a[c]),f.push(a[c+1]),f.push(d[2]),f.push(d[3]);return f},_removeLastLetter:function(a){return a.substring(0,a.length-1)}}}(),function(){var a=Kinetic.Util.createCanvasElement(),b=a.getContext("2d"),c=Kinetic.UA.mobile?function(){var a=window.devicePixelRatio||1,c=b.webkitBackingStorePixelRatio||b.mozBackingStorePixelRatio||b.msBackingStorePixelRatio||b.oBackingStorePixelRatio||b.backingStorePixelRatio||1;return a/c}():1;Kinetic.Canvas=function(a){this.init(a)},Kinetic.Canvas.prototype={init:function(a){var b=a||{},d=b.pixelRatio||Kinetic.pixelRatio||c;this.pixelRatio=d,this._canvas=Kinetic.Util.createCanvasElement(),this._canvas.style.padding=0,this._canvas.style.margin=0,this._canvas.style.border=0,this._canvas.style.background="transparent",this._canvas.style.position="absolute",this._canvas.style.top=0,this._canvas.style.left=0},getContext:function(){return this.context},getPixelRatio:function(){return this.pixelRatio},setPixelRatio:function(a){this.pixelRatio=a,this.setSize(this.getWidth(),this.getHeight())},setWidth:function(a){this.width=this._canvas.width=a*this.pixelRatio,this._canvas.style.width=a+"px"},setHeight:function(a){this.height=this._canvas.height=a*this.pixelRatio,this._canvas.style.height=a+"px"},getWidth:function(){return this.width},getHeight:function(){return this.height},setSize:function(a,b){this.setWidth(a),this.setHeight(b)},toDataURL:function(a,b){try{return this._canvas.toDataURL(a,b)}catch(c){try{return this._canvas.toDataURL()}catch(d){return Kinetic.Util.warn("Unable to get data URL. "+d.message),""}}}},Kinetic.SceneCanvas=function(a){var b=a||{},c=b.width||0,d=b.height||0;Kinetic.Canvas.call(this,b),this.context=new Kinetic.SceneContext(this),this.setSize(c,d)},Kinetic.SceneCanvas.prototype={setWidth:function(a){var b=this.pixelRatio,c=this.getContext()._context;Kinetic.Canvas.prototype.setWidth.call(this,a),c.scale(b,b)},setHeight:function(a){var b=this.pixelRatio,c=this.getContext()._context;Kinetic.Canvas.prototype.setHeight.call(this,a),c.scale(b,b)}},Kinetic.Util.extend(Kinetic.SceneCanvas,Kinetic.Canvas),Kinetic.HitCanvas=function(a){var b=a||{},c=b.width||0,d=b.height||0;Kinetic.Canvas.call(this,b),this.context=new Kinetic.HitContext(this),this.setSize(c,d),this.hitCanvas=!0},Kinetic.Util.extend(Kinetic.HitCanvas,Kinetic.Canvas)}(),function(){var a=",",b="(",c=")",d="([",e="])",f=";",g="()",h="=",i=["arc","arcTo","beginPath","bezierCurveTo","clearRect","clip","closePath","createLinearGradient","createPattern","createRadialGradient","drawImage","fill","fillText","getImageData","createImageData","lineTo","moveTo","putImageData","quadraticCurveTo","rect","restore","rotate","save","scale","setLineDash","setTransform","stroke","strokeText","transform","translate"];Kinetic.Context=function(a){this.init(a)},Kinetic.Context.prototype={init:function(a){this.canvas=a,this._context=a._canvas.getContext("2d"),Kinetic.enableTrace&&(this.traceArr=[],this._enableTrace())},fillShape:function(a){a.getFillEnabled()&&this._fill(a)},strokeShape:function(a){a.getStrokeEnabled()&&this._stroke(a)},fillStrokeShape:function(a){var b=a.getFillEnabled();b&&this._fill(a),a.getStrokeEnabled()&&this._stroke(a)},getTrace:function(i){var j,k,l,m,n=this.traceArr,o=n.length,p="";for(j=0;o>j;j++)k=n[j],l=k.method,l?(m=k.args,p+=l,p+=i?g:Kinetic.Util._isArray(m[0])?d+m.join(a)+e:b+m.join(a)+c):(p+=k.property,i||(p+=h+k.val)),p+=f;return p},clearTrace:function(){this.traceArr=[]},_trace:function(a){var b,c=this.traceArr;c.push(a),b=c.length,b>=Kinetic.traceArrMax&&c.shift()},reset:function(){var a=this.getCanvas().getPixelRatio();this.setTransform(1*a,0,0,1*a,0,0)},getCanvas:function(){return this.canvas},clear:function(a){var b=this.getCanvas();a?this.clearRect(a.x||0,a.y||0,a.width||0,a.height||0):this.clearRect(0,0,b.getWidth(),b.getHeight())},_applyLineCap:function(a){var b=a.getLineCap();b&&this.setAttr("lineCap",b)},_applyOpacity:function(a){var b=a.getAbsoluteOpacity();1!==b&&this.setAttr("globalAlpha",b)},_applyLineJoin:function(a){var b=a.getLineJoin();b&&this.setAttr("lineJoin",b)},setAttr:function(a,b){this._context[a]=b},arc:function(){var a=arguments;this._context.arc(a[0],a[1],a[2],a[3],a[4],a[5])},beginPath:function(){this._context.beginPath()},bezierCurveTo:function(){var a=arguments;this._context.bezierCurveTo(a[0],a[1],a[2],a[3],a[4],a[5])},clearRect:function(){var a=arguments;this._context.clearRect(a[0],a[1],a[2],a[3])},clip:function(){this._context.clip()},closePath:function(){this._context.closePath()},createImageData:function(){var a=arguments;return 2===a.length?this._context.createImageData(a[0],a[1]):1===a.length?this._context.createImageData(a[0]):void 0},createLinearGradient:function(){var a=arguments;return this._context.createLinearGradient(a[0],a[1],a[2],a[3])},createPattern:function(){var a=arguments;return this._context.createPattern(a[0],a[1])},createRadialGradient:function(){var a=arguments;return this._context.createRadialGradient(a[0],a[1],a[2],a[3],a[4],a[5])},drawImage:function(){var a=arguments,b=this._context;3===a.length?b.drawImage(a[0],a[1],a[2]):5===a.length?b.drawImage(a[0],a[1],a[2],a[3],a[4]):9===a.length&&b.drawImage(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8])},fill:function(){this._context.fill()},fillText:function(){var a=arguments;this._context.fillText(a[0],a[1],a[2])},getImageData:function(){var a=arguments;return this._context.getImageData(a[0],a[1],a[2],a[3])},lineTo:function(){var a=arguments;this._context.lineTo(a[0],a[1])},moveTo:function(){var a=arguments;this._context.moveTo(a[0],a[1])},rect:function(){var a=arguments;this._context.rect(a[0],a[1],a[2],a[3])},putImageData:function(){var a=arguments;this._context.putImageData(a[0],a[1],a[2])},quadraticCurveTo:function(){var a=arguments;this._context.quadraticCurveTo(a[0],a[1],a[2],a[3])},restore:function(){this._context.restore()},rotate:function(){var a=arguments;this._context.rotate(a[0])},save:function(){this._context.save()},scale:function(){var a=arguments;this._context.scale(a[0],a[1])},setLineDash:function(){var a=arguments,b=this._context;this._context.setLineDash?b.setLineDash(a[0]):"mozDash"in b?b.mozDash=a[0]:"webkitLineDash"in b&&(b.webkitLineDash=a[0])},setTransform:function(){var a=arguments;this._context.setTransform(a[0],a[1],a[2],a[3],a[4],a[5])},stroke:function(){this._context.stroke()},strokeText:function(){var a=arguments;this._context.strokeText(a[0],a[1],a[2])},transform:function(){var a=arguments;this._context.transform(a[0],a[1],a[2],a[3],a[4],a[5])},translate:function(){var a=arguments;this._context.translate(a[0],a[1])},_enableTrace:function(){var a,b,c=this,d=i.length,e=Kinetic.Util._simplifyArray,f=this.setAttr,g=function(a){var d,f=c[a];c[a]=function(){return b=e(Array.prototype.slice.call(arguments,0)),d=f.apply(c,arguments),c._trace({method:a,args:b}),d}};for(a=0;d>a;a++)g(i[a]);c.setAttr=function(){f.apply(c,arguments),c._trace({property:arguments[0],val:arguments[1]})}}},Kinetic.SceneContext=function(a){Kinetic.Context.call(this,a)},Kinetic.SceneContext.prototype={_fillColor:function(a){var b=a.fill()||Kinetic.Util._getRGBAString({red:a.fillRed(),green:a.fillGreen(),blue:a.fillBlue(),alpha:a.fillAlpha()});this.setAttr("fillStyle",b),a._fillFunc(this)},_fillPattern:function(a){var b=a.getFillPatternImage(),c=a.getFillPatternX(),d=a.getFillPatternY(),e=a.getFillPatternScale(),f=Kinetic.getAngle(a.getFillPatternRotation()),g=a.getFillPatternOffset(),h=a.getFillPatternRepeat();(c||d)&&this.translate(c||0,d||0),f&&this.rotate(f),e&&this.scale(e.x,e.y),g&&this.translate(-1*g.x,-1*g.y),this.setAttr("fillStyle",this.createPattern(b,h||"repeat")),this.fill()},_fillLinearGradient:function(a){var b=a.getFillLinearGradientStartPoint(),c=a.getFillLinearGradientEndPoint(),d=a.getFillLinearGradientColorStops(),e=this.createLinearGradient(b.x,b.y,c.x,c.y);if(d){for(var f=0;f<d.length;f+=2)e.addColorStop(d[f],d[f+1]);this.setAttr("fillStyle",e),this.fill()}},_fillRadialGradient:function(a){for(var b=a.getFillRadialGradientStartPoint(),c=a.getFillRadialGradientEndPoint(),d=a.getFillRadialGradientStartRadius(),e=a.getFillRadialGradientEndRadius(),f=a.getFillRadialGradientColorStops(),g=this.createRadialGradient(b.x,b.y,d,c.x,c.y,e),h=0;h<f.length;h+=2)g.addColorStop(f[h],f[h+1]);this.setAttr("fillStyle",g),this.fill()},_fill:function(a){var b=a.fill()||a.fillRed()||a.fillGreen()||a.fillBlue(),c=a.getFillPatternImage(),d=a.getFillLinearGradientColorStops(),e=a.getFillRadialGradientColorStops(),f=a.getFillPriority();b&&"color"===f?this._fillColor(a):c&&"pattern"===f?this._fillPattern(a):d&&"linear-gradient"===f?this._fillLinearGradient(a):e&&"radial-gradient"===f?this._fillRadialGradient(a):b?this._fillColor(a):c?this._fillPattern(a):d?this._fillLinearGradient(a):e&&this._fillRadialGradient(a)},_stroke:function(a){var b=a.dash(),c=a.getStrokeScaleEnabled();a.hasStroke()&&(c||(this.save(),this.setTransform(1,0,0,1,0,0)),this._applyLineCap(a),b&&a.dashEnabled()&&this.setLineDash(b),this.setAttr("lineWidth",a.strokeWidth()),this.setAttr("strokeStyle",a.stroke()||Kinetic.Util._getRGBAString({red:a.strokeRed(),green:a.strokeGreen(),blue:a.strokeBlue(),alpha:a.strokeAlpha()})),a._strokeFunc(this),c||this.restore())},_applyShadow:function(a){var b=Kinetic.Util,c=a.getAbsoluteOpacity(),d=b.get(a.getShadowColor(),"black"),e=b.get(a.getShadowBlur(),5),f=b.get(a.getShadowOpacity(),1),g=b.get(a.getShadowOffset(),{x:0,y:0});f&&this.setAttr("globalAlpha",f*c),this.setAttr("shadowColor",d),this.setAttr("shadowBlur",e),this.setAttr("shadowOffsetX",g.x),this.setAttr("shadowOffsetY",g.y)}},Kinetic.Util.extend(Kinetic.SceneContext,Kinetic.Context),Kinetic.HitContext=function(a){Kinetic.Context.call(this,a)},Kinetic.HitContext.prototype={_fill:function(a){this.save(),this.setAttr("fillStyle",a.colorKey),a._fillFuncHit(this),this.restore()},_stroke:function(a){a.hasStroke()&&(this._applyLineCap(a),this.setAttr("lineWidth",a.strokeWidth()),this.setAttr("strokeStyle",a.colorKey),a._strokeFuncHit(this))}},Kinetic.Util.extend(Kinetic.HitContext,Kinetic.Context)}(),function(){var a="get",b="set";Kinetic.Factory={addGetterSetter:function(a,b,c,d,e){this.addGetter(a,b,c),this.addSetter(a,b,d,e),this.addOverloadedGetterSetter(a,b)},addGetter:function(b,c,d){var e=a+Kinetic.Util._capitalize(c);b.prototype[e]=function(){var a=this.attrs[c];return void 0===a?d:a}},addSetter:function(a,c,d,e){var f=b+Kinetic.Util._capitalize(c);a.prototype[f]=function(a){return d&&(a=d.call(this,a)),this._setAttr(c,a),e&&e.call(this),this}},addComponentsGetterSetter:function(c,d,e,f,g){var h,i,j=e.length,k=Kinetic.Util._capitalize,l=a+k(d),m=b+k(d);c.prototype[l]=function(){var a={};for(h=0;j>h;h++)i=e[h],a[i]=this.getAttr(d+k(i));return a},c.prototype[m]=function(a){var b,c=this.attrs[d];f&&(a=f.call(this,a));for(b in a)this._setAttr(d+k(b),a[b]);return this._fireChangeEvent(d,c,a),g&&g.call(this),this},this.addOverloadedGetterSetter(c,d)},addOverloadedGetterSetter:function(c,d){var e=Kinetic.Util._capitalize(d),f=b+e,g=a+e;c.prototype[d]=function(){return arguments.length?(this[f](arguments[0]),this):this[g]()}},backCompat:function(a,b){var c;for(c in b)a.prototype[c]=a.prototype[b[c]]},afterSetFilter:function(){this._filterUpToDate=!1}},Kinetic.Validators={RGBComponent:function(a){return a>255?255:0>a?0:Math.round(a)},alphaComponent:function(a){return a>1?1:1e-4>a?1e-4:a}}}(),function(){var a="absoluteOpacity",b="absoluteTransform",c="Change",d="children",e=".",f="",g="get",h="id",i="kinetic",j="listening",k="mouseenter",l="mouseleave",m="name",n="set",o="Shape",p=" ",q="stage",r="transform",s="Stage",t="visible",u=["id"],v=["xChange.kinetic","yChange.kinetic","scaleXChange.kinetic","scaleYChange.kinetic","skewXChange.kinetic","skewYChange.kinetic","rotationChange.kinetic","offsetXChange.kinetic","offsetYChange.kinetic","transformsEnabledChange.kinetic"].join(p);Kinetic.Util.addMethods(Kinetic.Node,{_init:function(c){var d=this;this._id=Kinetic.idCounter++,this.eventListeners={},this.attrs={},this._cache={},this._filterUpToDate=!1,this.setAttrs(c),this.on(v,function(){this._clearCache(r),d._clearSelfAndDescendantCache(b)}),this.on("visibleChange.kinetic",function(){d._clearSelfAndDescendantCache(t)}),this.on("listeningChange.kinetic",function(){d._clearSelfAndDescendantCache(j)}),this.on("opacityChange.kinetic",function(){d._clearSelfAndDescendantCache(a)})},_clearCache:function(a){a?delete this._cache[a]:this._cache={}},_getCache:function(a,b){var c=this._cache[a];return void 0===c&&(this._cache[a]=b.call(this)),this._cache[a]},_clearSelfAndDescendantCache:function(a){this._clearCache(a),this.children&&this.getChildren().each(function(b){b._clearSelfAndDescendantCache(a)})},clearCache:function(){return delete this._cache.canvas,this._filterUpToDate=!1,this},cache:function(a){var b=a||{},c=b.x||0,d=b.y||0,e=b.width||this.width(),f=b.height||this.height(),g=b.drawBorder||!1;if(0===e||0===f)return void Kinetic.Util.warn("Width or height of caching configuration equals 0. Cache is ignored.");var h=new Kinetic.SceneCanvas({pixelRatio:1,width:e,height:f}),i=new Kinetic.SceneCanvas({pixelRatio:1,width:e,height:f}),j=new Kinetic.HitCanvas({width:e,height:f}),k=h.getContext(),l=j.getContext();return j.isCache=!0,this.clearCache(),k.save(),l.save(),g&&(k.save(),k.beginPath(),k.rect(0,0,e,f),k.closePath(),k.setAttr("strokeStyle","red"),k.setAttr("lineWidth",5),k.stroke(),k.restore()),k.translate(-1*c,-1*d),l.translate(-1*c,-1*d),"Shape"===this.nodeType&&(k.translate(-1*this.x(),-1*this.y()),l.translate(-1*this.x(),-1*this.y())),this.drawScene(h,this),this.drawHit(j,this),k.restore(),l.restore(),this._cache.canvas={scene:h,filter:i,hit:j},this},_drawCachedSceneCanvas:function(a){a.save(),this.getLayer()._applyTransform(this,a),a._applyOpacity(this),a.drawImage(this._getCachedSceneCanvas()._canvas,0,0),a.restore()},_getCachedSceneCanvas:function(){var a,b,c,d,e=this.filters(),f=this._cache.canvas,g=f.scene,h=f.filter,i=h.getContext();if(e){if(!this._filterUpToDate){try{for(a=e.length,i.clear(),i.drawImage(g._canvas,0,0),b=i.getImageData(0,0,h.getWidth(),h.getHeight()),c=0;a>c;c++)d=e[c],d.call(this,b),i.putImageData(b,0,0)}catch(j){Kinetic.Util.warn("Unable to apply filter. "+j.message)}this._filterUpToDate=!0}return h}return g},_drawCachedHitCanvas:function(a){var b=this._cache.canvas,c=b.hit;a.save(),this.getLayer()._applyTransform(this,a),a.drawImage(c._canvas,0,0),a.restore()},on:function(a,b){var c,d,g,h,i,j=a.split(p),k=j.length;for(c=0;k>c;c++)d=j[c],g=d.split(e),h=g[0],i=g[1]||f,this.eventListeners[h]||(this.eventListeners[h]=[]),this.eventListeners[h].push({name:i,handler:b});return this},off:function(a){var b,c,d,f,g,h,i=(a||"").split(p),j=i.length;if(!a)for(c in this.eventListeners)this._off(c);for(b=0;j>b;b++)if(d=i[b],f=d.split(e),g=f[0],h=f[1],g)this.eventListeners[g]&&this._off(g,h);else for(c in this.eventListeners)this._off(c,h);return this},dispatchEvent:function(a){var b={target:this,type:a.type,evt:a};this.fire(a.type,b)},addEventListener:function(a,b){this.on(a,function(a){b.call(this,a.evt)})},removeEventListener:function(a){this.off(a)},remove:function(){var c=this.getParent();return c&&c.children&&(c.children.splice(this.index,1),c._setChildrenIndices(),delete this.parent),this._clearSelfAndDescendantCache(q),this._clearSelfAndDescendantCache(b),this._clearSelfAndDescendantCache(t),this._clearSelfAndDescendantCache(j),this._clearSelfAndDescendantCache(a),this},destroy:function(){Kinetic._removeId(this.getId()),Kinetic._removeName(this.getName(),this._id),this.remove()},getAttr:function(a){var b=g+Kinetic.Util._capitalize(a);return Kinetic.Util._isFunction(this[b])?this[b]():this.attrs[a]},getAncestors:function(){for(var a=this.getParent(),b=new Kinetic.Collection;a;)b.push(a),a=a.getParent();return b},getAttrs:function(){return this.attrs||{}},setAttrs:function(a){var b,c;if(a)for(b in a)b===d||a[b]instanceof Kinetic.Node||(c=n+Kinetic.Util._capitalize(b),Kinetic.Util._isFunction(this[c])?this[c](a[b]):this._setAttr(b,a[b]));return this},isListening:function(){return this._getCache(j,this._isListening)},_isListening:function(){var a=this.getListening(),b=this.getParent();return"inherit"===a?b?b.isListening():!0:a},isVisible:function(){return this._getCache(t,this._isVisible)},_isVisible:function(){var a=this.getVisible(),b=this.getParent();return"inherit"===a?b?b.isVisible():!0:a},shouldDrawHit:function(a){var b=this.getLayer();return a&&a.isCache||b&&b.hitGraphEnabled()&&this.isListening()&&this.isVisible()},show:function(){return this.setVisible(!0),this},hide:function(){return this.setVisible(!1),this},getZIndex:function(){return this.index||0},getAbsoluteZIndex:function(){function a(i){for(b=[],c=i.length,d=0;c>d;d++)e=i[d],h++,e.nodeType!==o&&(b=b.concat(e.getChildren().toArray())),e._id===g._id&&(d=c);b.length>0&&b[0].getDepth()<=f&&a(b)}var b,c,d,e,f=this.getDepth(),g=this,h=0;return g.nodeType!==s&&a(g.getStage().getChildren()),h},getDepth:function(){for(var a=0,b=this.parent;b;)a++,b=b.parent;return a},setPosition:function(a){return this.setX(a.x),this.setY(a.y),this},getPosition:function(){return{x:this.getX(),y:this.getY()}},getAbsolutePosition:function(){var a=this.getAbsoluteTransform().getMatrix(),b=new Kinetic.Transform,c=this.offset();return b.m=a.slice(),b.translate(c.x,c.y),b.getTranslation()},setAbsolutePosition:function(a){var b,c=this._clearTransform();return this.attrs.x=c.x,this.attrs.y=c.y,delete c.x,delete c.y,b=this.getAbsoluteTransform(),b.invert(),b.translate(a.x,a.y),a={x:this.attrs.x+b.getTranslation().x,y:this.attrs.y+b.getTranslation().y},this.setPosition({x:a.x,y:a.y}),this._setTransform(c),this},_setTransform:function(a){var c;for(c in a)this.attrs[c]=a[c];this._clearCache(r),this._clearSelfAndDescendantCache(b)},_clearTransform:function(){var a={x:this.getX(),y:this.getY(),rotation:this.getRotation(),scaleX:this.getScaleX(),scaleY:this.getScaleY(),offsetX:this.getOffsetX(),offsetY:this.getOffsetY(),skewX:this.getSkewX(),skewY:this.getSkewY()};return this.attrs.x=0,this.attrs.y=0,this.attrs.rotation=0,this.attrs.scaleX=1,this.attrs.scaleY=1,this.attrs.offsetX=0,this.attrs.offsetY=0,this.attrs.skewX=0,this.attrs.skewY=0,this._clearCache(r),this._clearSelfAndDescendantCache(b),a},move:function(a){var b=a.x,c=a.y,d=this.getX(),e=this.getY();return void 0!==b&&(d+=b),void 0!==c&&(e+=c),this.setPosition({x:d,y:e}),this},_eachAncestorReverse:function(a,b){var c,d,e=[],f=this.getParent();if(b&&b._id===this._id)return a(this),!0;for(e.unshift(this);f&&(!b||f._id!==b._id);)e.unshift(f),f=f.parent;for(c=e.length,d=0;c>d;d++)a(e[d])},rotate:function(a){return this.setRotation(this.getRotation()+a),this},moveToTop:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveToTop function is ignored.");var a=this.index;return this.parent.children.splice(a,1),this.parent.children.push(this),this.parent._setChildrenIndices(),!0},moveUp:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveUp function is ignored.");var a=this.index,b=this.parent.getChildren().length;return b-1>a?(this.parent.children.splice(a,1),this.parent.children.splice(a+1,0,this),this.parent._setChildrenIndices(),!0):!1},moveDown:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveDown function is ignored.");var a=this.index;return a>0?(this.parent.children.splice(a,1),this.parent.children.splice(a-1,0,this),this.parent._setChildrenIndices(),!0):!1},moveToBottom:function(){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. moveToBottom function is ignored.");var a=this.index;return a>0?(this.parent.children.splice(a,1),this.parent.children.unshift(this),this.parent._setChildrenIndices(),!0):!1},setZIndex:function(a){if(!this.parent)return void Kinetic.Util.warn("Node has no parent. zIndex parameter is ignored.");var b=this.index;return this.parent.children.splice(b,1),this.parent.children.splice(a,0,this),this.parent._setChildrenIndices(),this},getAbsoluteOpacity:function(){return this._getCache(a,this._getAbsoluteOpacity)},_getAbsoluteOpacity:function(){var a=this.getOpacity();return this.getParent()&&(a*=this.getParent().getAbsoluteOpacity()),a},moveTo:function(a){return this.getParent()!==a&&(this.remove(),a.add(this)),this},toObject:function(){var a,b,c,d,e=Kinetic.Util,f={},g=this.getAttrs();f.attrs={};for(a in g)b=g[a],e._isFunction(b)||e._isElement(b)||e._isObject(b)&&e._hasMethods(b)||(c=this[a],delete g[a],d=c?c.call(this):null,g[a]=b,d!==b&&(f.attrs[a]=b));return f.className=this.getClassName(),f},toJSON:function(){return JSON.stringify(this.toObject())},getParent:function(){return this.parent},getLayer:function(){var a=this.getParent();return a?a.getLayer():null},getStage:function(){return this._getCache(q,this._getStage)},_getStage:function(){var a=this.getParent();return a?a.getStage():void 0},fire:function(a,b,c){return c?this._fireAndBubble(a,b||{}):this._fire(a,b||{}),this},getAbsoluteTransform:function(a){return a?this._getAbsoluteTransform(a):this._getCache(b,this._getAbsoluteTransform)},_getAbsoluteTransform:function(a){var b,c,d=new Kinetic.Transform;return this._eachAncestorReverse(function(a){b=a.transformsEnabled(),c=a.getTransform(),"all"===b?d.multiply(c):"position"===b&&d.translate(a.x(),a.y())},a),d},getTransform:function(){return this._getCache(r,this._getTransform)},_getTransform:function(){var a=new Kinetic.Transform,b=this.getX(),c=this.getY(),d=Kinetic.getAngle(this.getRotation()),e=this.getScaleX(),f=this.getScaleY(),g=this.getSkewX(),h=this.getSkewY(),i=this.getOffsetX(),j=this.getOffsetY();return(0!==b||0!==c)&&a.translate(b,c),0!==d&&a.rotate(d),(0!==g||0!==h)&&a.skew(g,h),(1!==e||1!==f)&&a.scale(e,f),(0!==i||0!==j)&&a.translate(-1*i,-1*j),a},clone:function(a){var b,c,d,e,f,g=this.getClassName(),h=Kinetic.Util.cloneObject(this.attrs);for(var j in u){var k=u[j];delete h[k]}for(b in a)h[b]=a[b];var l=new Kinetic[g](h);for(b in this.eventListeners)for(c=this.eventListeners[b],d=c.length,e=0;d>e;e++)f=c[e],f.name.indexOf(i)<0&&(l.eventListeners[b]||(l.eventListeners[b]=[]),l.eventListeners[b].push(f));return l},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d=this.getStage(),e=a.x||0,f=a.y||0,g=new Kinetic.SceneCanvas({width:a.width||this.getWidth()||(d?d.getWidth():0),height:a.height||this.getHeight()||(d?d.getHeight():0),pixelRatio:1}),h=g.getContext();return h.save(),(e||f)&&h.translate(-1*e,-1*f),this.drawScene(g),h.restore(),g.toDataURL(b,c)},toImage:function(a){Kinetic.Util._getImage(this.toDataURL(a),function(b){a.callback(b)})},setSize:function(a){return this.setWidth(a.width),this.setHeight(a.height),this},getSize:function(){return{width:this.getWidth(),height:this.getHeight()}},getWidth:function(){return this.attrs.width||0},getHeight:function(){return this.attrs.height||0},getClassName:function(){return this.className||this.nodeType},getType:function(){return this.nodeType},getDragDistance:function(){return void 0!==this.attrs.dragDistance?this.attrs.dragDistance:this.parent?this.parent.getDragDistance():Kinetic.dragDistance
},_get:function(a){return this.className===a||this.nodeType===a?[this]:[]},_off:function(a,b){var c,d,e=this.eventListeners[a];for(c=0;c<e.length;c++)if(d=e[c].name,!("kinetic"===d&&"kinetic"!==b||b&&d!==b)){if(e.splice(c,1),0===e.length){delete this.eventListeners[a];break}c--}},_fireChangeEvent:function(a,b,d){this._fire(a+c,{oldVal:b,newVal:d})},setId:function(a){var b=this.getId();return Kinetic._removeId(b),Kinetic._addId(this,a),this._setAttr(h,a),this},setName:function(a){var b=this.getName();return Kinetic._removeName(b,this._id),Kinetic._addName(this,a),this._setAttr(m,a),this},setAttr:function(a,b){var c=n+Kinetic.Util._capitalize(a),d=this[c];return Kinetic.Util._isFunction(d)?d.call(this,b):this._setAttr(a,b),this},_setAttr:function(a,b){var c;void 0!==b&&(c=this.attrs[a],this.attrs[a]=b,this._fireChangeEvent(a,c,b))},_setComponentAttr:function(a,b,c){var d;void 0!==c&&(d=this.attrs[a],d||(this.attrs[a]=this.getAttr(a)),this.attrs[a][b]=c,this._fireChangeEvent(a,d,c))},_fireAndBubble:function(a,b,c){var d=!0;if(b&&this.nodeType===o&&(b.target=this),a===k&&c&&(this._id===c._id||this.isAncestorOf&&this.isAncestorOf(c))?d=!1:a===l&&c&&(this._id===c._id||this.isAncestorOf&&this.isAncestorOf(c))&&(d=!1),d){this._fire(a,b);var e=(a===k||a===l)&&(c&&c.isAncestorOf&&c.isAncestorOf(this)||!(!c||!c.isAncestorOf));b&&!b.cancelBubble&&this.parent&&this.parent.isListening()&&!e&&(c&&c.parent?this._fireAndBubble.call(this.parent,a,b,c.parent):this._fireAndBubble.call(this.parent,a,b))}},_fire:function(a,b){var c,d=this.eventListeners[a];if(b.type=a,d)for(c=0;c<d.length;c++)d[c].handler.call(this,b)},draw:function(){return this.drawScene(),this.drawHit(),this}}),Kinetic.Node.create=function(a,b){return this._createNode(JSON.parse(a),b)},Kinetic.Node._createNode=function(a,b){var c,d,e,f=Kinetic.Node.prototype.getClassName.call(a),g=a.children;if(b&&(a.attrs.container=b),c=new Kinetic[f](a.attrs),g)for(d=g.length,e=0;d>e;e++)c.add(this._createNode(g[e]));return c},Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"position"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"x",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"y",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"opacity",1),Kinetic.Factory.addGetter(Kinetic.Node,"name"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"name"),Kinetic.Factory.addGetter(Kinetic.Node,"id"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"id"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"rotation",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node,"scale",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Node,"scaleX",1),Kinetic.Factory.addGetterSetter(Kinetic.Node,"scaleY",1),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node,"skew",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Node,"skewX",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"skewY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Node,"offset",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Node,"offsetX",0),Kinetic.Factory.addGetterSetter(Kinetic.Node,"offsetY",0),Kinetic.Factory.addSetter(Kinetic.Node,"dragDistance"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"dragDistance"),Kinetic.Factory.addSetter(Kinetic.Node,"width",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"width"),Kinetic.Factory.addSetter(Kinetic.Node,"height",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"height"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"listening","inherit"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"filters",void 0,function(a){return this._filterUpToDate=!1,a}),Kinetic.Factory.addGetterSetter(Kinetic.Node,"visible","inherit"),Kinetic.Factory.addGetterSetter(Kinetic.Node,"transformsEnabled","all"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"size"),Kinetic.Factory.backCompat(Kinetic.Node,{rotateDeg:"rotate",setRotationDeg:"setRotation",getRotationDeg:"getRotation"}),Kinetic.Collection.mapMethods(Kinetic.Node)}(),function(){Kinetic.Filters.Grayscale=function(a){var b,c,d=a.data,e=d.length;for(b=0;e>b;b+=4)c=.34*d[b]+.5*d[b+1]+.16*d[b+2],d[b]=c,d[b+1]=c,d[b+2]=c}}(),function(){Kinetic.Filters.Brighten=function(a){var b,c=255*this.brightness(),d=a.data,e=d.length;for(b=0;e>b;b+=4)d[b]+=c,d[b+1]+=c,d[b+2]+=c},Kinetic.Factory.addGetterSetter(Kinetic.Node,"brightness",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Invert=function(a){var b,c=a.data,d=c.length;for(b=0;d>b;b+=4)c[b]=255-c[b],c[b+1]=255-c[b+1],c[b+2]=255-c[b+2]}}(),function(){function a(){this.r=0,this.g=0,this.b=0,this.a=0,this.next=null}function b(b,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D=b.data,E=b.width,F=b.height,G=e+e+1,H=E-1,I=F-1,J=e+1,K=J*(J+1)/2,L=new a,M=null,N=L,O=null,P=null,Q=c[e],R=d[e];for(h=1;G>h;h++)N=N.next=new a,h==J&&(M=N);for(N.next=L,l=k=0,g=0;F>g;g++){for(u=v=w=x=m=n=o=p=0,q=J*(y=D[k]),r=J*(z=D[k+1]),s=J*(A=D[k+2]),t=J*(B=D[k+3]),m+=K*y,n+=K*z,o+=K*A,p+=K*B,N=L,h=0;J>h;h++)N.r=y,N.g=z,N.b=A,N.a=B,N=N.next;for(h=1;J>h;h++)i=k+((h>H?H:h)<<2),m+=(N.r=y=D[i])*(C=J-h),n+=(N.g=z=D[i+1])*C,o+=(N.b=A=D[i+2])*C,p+=(N.a=B=D[i+3])*C,u+=y,v+=z,w+=A,x+=B,N=N.next;for(O=L,P=M,f=0;E>f;f++)D[k+3]=B=p*Q>>R,0!==B?(B=255/B,D[k]=(m*Q>>R)*B,D[k+1]=(n*Q>>R)*B,D[k+2]=(o*Q>>R)*B):D[k]=D[k+1]=D[k+2]=0,m-=q,n-=r,o-=s,p-=t,q-=O.r,r-=O.g,s-=O.b,t-=O.a,i=l+((i=f+e+1)<H?i:H)<<2,u+=O.r=D[i],v+=O.g=D[i+1],w+=O.b=D[i+2],x+=O.a=D[i+3],m+=u,n+=v,o+=w,p+=x,O=O.next,q+=y=P.r,r+=z=P.g,s+=A=P.b,t+=B=P.a,u-=y,v-=z,w-=A,x-=B,P=P.next,k+=4;l+=E}for(f=0;E>f;f++){for(v=w=x=u=n=o=p=m=0,k=f<<2,q=J*(y=D[k]),r=J*(z=D[k+1]),s=J*(A=D[k+2]),t=J*(B=D[k+3]),m+=K*y,n+=K*z,o+=K*A,p+=K*B,N=L,h=0;J>h;h++)N.r=y,N.g=z,N.b=A,N.a=B,N=N.next;for(j=E,h=1;e>=h;h++)k=j+f<<2,m+=(N.r=y=D[k])*(C=J-h),n+=(N.g=z=D[k+1])*C,o+=(N.b=A=D[k+2])*C,p+=(N.a=B=D[k+3])*C,u+=y,v+=z,w+=A,x+=B,N=N.next,I>h&&(j+=E);for(k=f,O=L,P=M,g=0;F>g;g++)i=k<<2,D[i+3]=B=p*Q>>R,B>0?(B=255/B,D[i]=(m*Q>>R)*B,D[i+1]=(n*Q>>R)*B,D[i+2]=(o*Q>>R)*B):D[i]=D[i+1]=D[i+2]=0,m-=q,n-=r,o-=s,p-=t,q-=O.r,r-=O.g,s-=O.b,t-=O.a,i=f+((i=g+J)<I?i:I)*E<<2,m+=u+=O.r=D[i],n+=v+=O.g=D[i+1],o+=w+=O.b=D[i+2],p+=x+=O.a=D[i+3],O=O.next,q+=y=P.r,r+=z=P.g,s+=A=P.b,t+=B=P.a,u-=y,v-=z,w-=A,x-=B,P=P.next,k+=E}}var c=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259],d=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];Kinetic.Filters.Blur=function(a){var c=Math.round(this.blurRadius());c>0&&b(a,c)},Kinetic.Factory.addGetterSetter(Kinetic.Node,"blurRadius",0,null,Kinetic.Factory.afterSetFilter)}(),function(){function a(a,b,c){var d=4*(c*a.width+b),e=[];return e.push(a.data[d++],a.data[d++],a.data[d++],a.data[d++]),e}function b(a,b){return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))}function c(a){for(var b=[0,0,0],c=0;c<a.length;c++)b[0]+=a[c][0],b[1]+=a[c][1],b[2]+=a[c][2];return b[0]/=a.length,b[1]/=a.length,b[2]/=a.length,b}function d(d,e){var f=a(d,0,0),g=a(d,d.width-1,0),h=a(d,0,d.height-1),i=a(d,d.width-1,d.height-1),j=e||10;if(b(f,g)<j&&b(g,i)<j&&b(i,h)<j&&b(h,f)<j){for(var k=c([g,f,i,h]),l=[],m=0;m<d.width*d.height;m++){var n=b(k,[d.data[4*m],d.data[4*m+1],d.data[4*m+2]]);l[m]=j>n?0:255}return l}}function e(a,b){for(var c=0;c<a.width*a.height;c++)a.data[4*c+3]=b[c]}function f(a,b,c){for(var d=[1,1,1,1,0,1,1,1,1],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=2040===k?255:0}return g}function g(a,b,c){for(var d=[1,1,1,1,1,1,1,1,1],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=k>=1020?255:0}return g}function h(a,b,c){for(var d=[1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9,1/9],e=Math.round(Math.sqrt(d.length)),f=Math.floor(e/2),g=[],h=0;c>h;h++)for(var i=0;b>i;i++){for(var j=h*b+i,k=0,l=0;e>l;l++)for(var m=0;e>m;m++){var n=h+l-f,o=i+m-f;if(n>=0&&c>n&&o>=0&&b>o){var p=n*b+o,q=d[l*e+m];k+=a[p]*q}}g[j]=k}return g}Kinetic.Filters.Mask=function(a){var b=this.threshold(),c=d(a,b);return c&&(c=f(c,a.width,a.height),c=g(c,a.width,a.height),c=h(c,a.width,a.height),e(a,c)),a},Kinetic.Factory.addGetterSetter(Kinetic.Node,"threshold",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.RGB=function(a){var b,c,d=a.data,e=d.length,f=this.red(),g=this.green(),h=this.blue();for(b=0;e>b;b+=4)c=(.34*d[b]+.5*d[b+1]+.16*d[b+2])/255,d[b]=c*f,d[b+1]=c*g,d[b+2]=c*h,d[b+3]=d[b+3]},Kinetic.Factory.addGetterSetter(Kinetic.Node,"red",0,function(a){return this._filterUpToDate=!1,a>255?255:0>a?0:Math.round(a)}),Kinetic.Factory.addGetterSetter(Kinetic.Node,"green",0,function(a){return this._filterUpToDate=!1,a>255?255:0>a?0:Math.round(a)}),Kinetic.Factory.addGetterSetter(Kinetic.Node,"blue",0,Kinetic.Validators.RGBComponent,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.HSV=function(a){var b,c,d,e,f,g=a.data,h=g.length,i=Math.pow(2,this.value()),j=Math.pow(2,this.saturation()),k=Math.abs(this.hue()+360)%360,l=i*j*Math.cos(k*Math.PI/180),m=i*j*Math.sin(k*Math.PI/180),n=.299*i+.701*l+.167*m,o=.587*i-.587*l+.33*m,p=.114*i-.114*l-.497*m,q=.299*i-.299*l-.328*m,r=.587*i+.413*l+.035*m,s=.114*i-.114*l+.293*m,t=.299*i-.3*l+1.25*m,u=.587*i-.586*l-1.05*m,v=.114*i+.886*l-.2*m;for(b=0;h>b;b+=4)c=g[b+0],d=g[b+1],e=g[b+2],f=g[b+3],g[b+0]=n*c+o*d+p*e,g[b+1]=q*c+r*d+s*e,g[b+2]=t*c+u*d+v*e,g[b+3]=f},Kinetic.Factory.addGetterSetter(Kinetic.Node,"hue",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"saturation",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"value",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Factory.addGetterSetter(Kinetic.Node,"hue",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"saturation",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"luminance",0,null,Kinetic.Factory.afterSetFilter),Kinetic.Filters.HSL=function(a){var b,c,d,e,f,g=a.data,h=g.length,i=1,j=Math.pow(2,this.saturation()),k=Math.abs(this.hue()+360)%360,l=127*this.luminance(),m=i*j*Math.cos(k*Math.PI/180),n=i*j*Math.sin(k*Math.PI/180),o=.299*i+.701*m+.167*n,p=.587*i-.587*m+.33*n,q=.114*i-.114*m-.497*n,r=.299*i-.299*m-.328*n,s=.587*i+.413*m+.035*n,t=.114*i-.114*m+.293*n,u=.299*i-.3*m+1.25*n,v=.587*i-.586*m-1.05*n,w=.114*i+.886*m-.2*n;for(b=0;h>b;b+=4)c=g[b+0],d=g[b+1],e=g[b+2],f=g[b+3],g[b+0]=o*c+p*d+q*e+l,g[b+1]=r*c+s*d+t*e+l,g[b+2]=u*c+v*d+w*e+l,g[b+3]=f}}(),function(){Kinetic.Filters.Emboss=function(a){var b=10*this.embossStrength(),c=255*this.embossWhiteLevel(),d=this.embossDirection(),e=this.embossBlend(),f=0,g=0,h=a.data,i=a.width,j=a.height,k=4*i,l=j;switch(d){case"top-left":f=-1,g=-1;break;case"top":f=-1,g=0;break;case"top-right":f=-1,g=1;break;case"right":f=0,g=1;break;case"bottom-right":f=1,g=1;break;case"bottom":f=1,g=0;break;case"bottom-left":f=1,g=-1;break;case"left":f=0,g=-1}do{var m=(l-1)*k,n=f;1>l+n&&(n=0),l+n>j&&(n=0);var o=(l-1+n)*i*4,p=i;do{var q=m+4*(p-1),r=g;1>p+r&&(r=0),p+r>i&&(r=0);var s=o+4*(p-1+r),t=h[q]-h[s],u=h[q+1]-h[s+1],v=h[q+2]-h[s+2],w=t,x=w>0?w:-w,y=u>0?u:-u,z=v>0?v:-v;if(y>x&&(w=u),z>x&&(w=v),w*=b,e){var A=h[q]+w,B=h[q+1]+w,C=h[q+2]+w;h[q]=A>255?255:0>A?0:A,h[q+1]=B>255?255:0>B?0:B,h[q+2]=C>255?255:0>C?0:C}else{var D=c-w;0>D?D=0:D>255&&(D=255),h[q]=h[q+1]=h[q+2]=D}}while(--p)}while(--l)},Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossStrength",.5,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossWhiteLevel",.5,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossDirection","top-left",null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"embossBlend",!1,null,Kinetic.Factory.afterSetFilter)}(),function(){function a(a,b,c,d,e){var f,g=c-b,h=e-d;return 0===g?d+h/2:0===h?d:(f=(a-b)/g,f=h*f+d)}Kinetic.Filters.Enhance=function(b){var c,d,e,f,g=b.data,h=g.length,i=g[0],j=i,k=g[1],l=k,m=g[2],n=m,o=this.enhance();if(0!==o){for(f=0;h>f;f+=4)c=g[f+0],i>c?i=c:c>j&&(j=c),d=g[f+1],k>d?k=d:d>l&&(l=d),e=g[f+2],m>e?m=e:e>n&&(n=e);j===i&&(j=255,i=0),l===k&&(l=255,k=0),n===m&&(n=255,m=0);var p,q,r,s,t,u,v,w,x;for(o>0?(q=j+o*(255-j),r=i-o*(i-0),t=l+o*(255-l),u=k-o*(k-0),w=n+o*(255-n),x=m-o*(m-0)):(p=.5*(j+i),q=j+o*(j-p),r=i+o*(i-p),s=.5*(l+k),t=l+o*(l-s),u=k+o*(k-s),v=.5*(n+m),w=n+o*(n-v),x=m+o*(m-v)),f=0;h>f;f+=4)g[f+0]=a(g[f+0],i,j,r,q),g[f+1]=a(g[f+1],k,l,u,t),g[f+2]=a(g[f+2],m,n,x,w)}},Kinetic.Factory.addGetterSetter(Kinetic.Node,"enhance",0,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Posterize=function(a){var b,c=Math.round(254*this.levels())+1,d=a.data,e=d.length,f=255/c;for(b=0;e>b;b+=1)d[b]=Math.floor(d[b]/f)*f},Kinetic.Factory.addGetterSetter(Kinetic.Node,"levels",.5,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Noise=function(a){var b,c=255*this.noise(),d=a.data,e=d.length,f=c/2;for(b=0;e>b;b+=4)d[b+0]+=f-2*f*Math.random(),d[b+1]+=f-2*f*Math.random(),d[b+2]+=f-2*f*Math.random()},Kinetic.Factory.addGetterSetter(Kinetic.Node,"noise",.2,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Pixelate=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p=Math.ceil(this.pixelSize()),q=a.width,r=a.height,s=Math.ceil(q/p),t=Math.ceil(r/p);for(a=a.data,m=0;s>m;m+=1)for(n=0;t>n;n+=1){for(e=0,f=0,g=0,h=0,i=m*p,j=i+p,k=n*p,l=k+p,o=0,b=i;j>b;b+=1)if(!(b>=q))for(c=k;l>c;c+=1)c>=r||(d=4*(q*c+b),e+=a[d+0],f+=a[d+1],g+=a[d+2],h+=a[d+3],o+=1);for(e/=o,f/=o,g/=o,b=i;j>b;b+=1)if(!(b>=q))for(c=k;l>c;c+=1)c>=r||(d=4*(q*c+b),a[d+0]=e,a[d+1]=f,a[d+2]=g,a[d+3]=h)}},Kinetic.Factory.addGetterSetter(Kinetic.Node,"pixelSize",8,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Threshold=function(a){var b,c=255*this.threshold(),d=a.data,e=d.length;for(b=0;e>b;b+=1)d[b]=d[b]<c?0:255},Kinetic.Factory.addGetterSetter(Kinetic.Node,"threshold",.5,null,Kinetic.Factory.afterSetFilter)}(),function(){Kinetic.Filters.Sepia=function(a){var b,c,d,e,f,g,h,i,j,k=a.data,l=a.width,m=a.height,n=4*l;do{b=(m-1)*n,c=l;do d=b+4*(c-1),e=k[d],f=k[d+1],g=k[d+2],h=.393*e+.769*f+.189*g,i=.349*e+.686*f+.168*g,j=.272*e+.534*f+.131*g,k[d]=h>255?255:h,k[d+1]=i>255?255:i,k[d+2]=j>255?255:j,k[d+3]=k[d+3];while(--c)}while(--m)}}(),function(){Kinetic.Filters.Solarize=function(a){var b=a.data,c=a.width,d=a.height,e=4*c,f=d;do{var g=(f-1)*e,h=c;do{var i=g+4*(h-1),j=b[i],k=b[i+1],l=b[i+2];j>127&&(j=255-j),k>127&&(k=255-k),l>127&&(l=255-l),b[i]=j,b[i+1]=k,b[i+2]=l}while(--h)}while(--f)}}(),function(){var a=function(a,b,c){var d,e,f,g,h=a.data,i=b.data,j=a.width,k=a.height,l=c.polarCenterX||j/2,m=c.polarCenterY||k/2,n=0,o=0,p=0,q=0,r=Math.sqrt(l*l+m*m);e=j-l,f=k-m,g=Math.sqrt(e*e+f*f),r=g>r?g:r;var s,t,u,v,w=k,x=j,y=360/x*Math.PI/180;for(t=0;x>t;t+=1)for(u=Math.sin(t*y),v=Math.cos(t*y),s=0;w>s;s+=1)e=Math.floor(l+r*s/w*v),f=Math.floor(m+r*s/w*u),d=4*(f*j+e),n=h[d+0],o=h[d+1],p=h[d+2],q=h[d+3],d=4*(t+s*j),i[d+0]=n,i[d+1]=o,i[d+2]=p,i[d+3]=q},b=function(a,b,c){var d,e,f,g,h,i,j=a.data,k=b.data,l=a.width,m=a.height,n=c.polarCenterX||l/2,o=c.polarCenterY||m/2,p=0,q=0,r=0,s=0,t=Math.sqrt(n*n+o*o);e=l-n,f=m-o,i=Math.sqrt(e*e+f*f),t=i>t?i:t;var u,v,w,x,y=m,z=l,A=c.polarRotation||0;for(e=0;l>e;e+=1)for(f=0;m>f;f+=1)g=e-n,h=f-o,u=Math.sqrt(g*g+h*h)*y/t,v=(180*Math.atan2(h,g)/Math.PI+360+A)%360,v=v*z/360,w=Math.floor(v),x=Math.floor(u),d=4*(x*l+w),p=j[d+0],q=j[d+1],r=j[d+2],s=j[d+3],d=4*(f*l+e),k[d+0]=p,k[d+1]=q,k[d+2]=r,k[d+3]=s},c=Kinetic.Util.createCanvasElement();Kinetic.Filters.Kaleidoscope=function(d){var e,f,g,h,i,j,k,l,m,n,o=d.width,p=d.height,q=Math.round(this.kaleidoscopePower()),r=Math.round(this.kaleidoscopeAngle()),s=Math.floor(o*(r%360)/360);if(!(1>q)){c.width=o,c.height=p;var t=c.getContext("2d").getImageData(0,0,o,p);a(d,t,{polarCenterX:o/2,polarCenterY:p/2});for(var u=o/Math.pow(2,q);8>=u;)u=2*u,q-=1;u=Math.ceil(u);var v=u,w=0,x=v,y=1;for(s+u>o&&(w=v,x=0,y=-1),f=0;p>f;f+=1)for(e=w;e!==x;e+=y)g=Math.round(e+s)%o,m=4*(o*f+g),i=t.data[m+0],j=t.data[m+1],k=t.data[m+2],l=t.data[m+3],n=4*(o*f+e),t.data[n+0]=i,t.data[n+1]=j,t.data[n+2]=k,t.data[n+3]=l;for(f=0;p>f;f+=1)for(v=Math.floor(u),h=0;q>h;h+=1){for(e=0;v+1>e;e+=1)m=4*(o*f+e),i=t.data[m+0],j=t.data[m+1],k=t.data[m+2],l=t.data[m+3],n=4*(o*f+2*v-e-1),t.data[n+0]=i,t.data[n+1]=j,t.data[n+2]=k,t.data[n+3]=l;v*=2}b(t,d,{polarRotation:0})}},Kinetic.Factory.addGetterSetter(Kinetic.Node,"kaleidoscopePower",2,null,Kinetic.Factory.afterSetFilter),Kinetic.Factory.addGetterSetter(Kinetic.Node,"kaleidoscopeAngle",0,null,Kinetic.Factory.afterSetFilter)}(),function(){function a(a){setTimeout(a,1e3/60)}function b(){return e.apply(Kinetic.root,arguments)}var c=500,d=function(){return Kinetic.root.performance&&Kinetic.root.performance.now?function(){return Kinetic.root.performance.now()}:function(){return(new Date).getTime()}}(),e=function(){return Kinetic.root.requestAnimationFrame||Kinetic.root.webkitRequestAnimationFrame||Kinetic.root.mozRequestAnimationFrame||Kinetic.root.oRequestAnimationFrame||Kinetic.root.msRequestAnimationFrame||a}();Kinetic.Animation=function(a,b){var c=Kinetic.Animation;this.func=a,this.setLayers(b),this.id=c.animIdCounter++,this.frame={time:0,timeDiff:0,lastTime:d()}},Kinetic.Animation.prototype={setLayers:function(a){var b=[];b=a?a.length>0?a:[a]:[],this.layers=b},getLayers:function(){return this.layers},addLayer:function(a){var b,c,d=this.layers;if(d){for(b=d.length,c=0;b>c;c++)if(d[c]._id===a._id)return!1}else this.layers=[];return this.layers.push(a),!0},isRunning:function(){var a,b=Kinetic.Animation,c=b.animations,d=c.length;for(a=0;d>a;a++)if(c[a].id===this.id)return!0;return!1},start:function(){var a=Kinetic.Animation;this.stop(),this.frame.timeDiff=0,this.frame.lastTime=d(),a._addAnimation(this)},stop:function(){Kinetic.Animation._removeAnimation(this)},_updateFrameObject:function(a){this.frame.timeDiff=a-this.frame.lastTime,this.frame.lastTime=a,this.frame.time+=this.frame.timeDiff,this.frame.frameRate=1e3/this.frame.timeDiff}},Kinetic.Animation.animations=[],Kinetic.Animation.animIdCounter=0,Kinetic.Animation.animRunning=!1,Kinetic.Animation._addAnimation=function(a){this.animations.push(a),this._handleAnimation()},Kinetic.Animation._removeAnimation=function(a){var b,c=a.id,d=this.animations,e=d.length;for(b=0;e>b;b++)if(d[b].id===c){this.animations.splice(b,1);break}},Kinetic.Animation._runFrames=function(){var a,b,c,e,f,g,h,i,j,k={},l=this.animations;for(e=0;e<l.length;e++)if(a=l[e],b=a.layers,c=a.func,a._updateFrameObject(d()),g=b.length,j=c?c.call(a,a.frame)!==!1:!0)for(f=0;g>f;f++)h=b[f],void 0!==h._id&&(k[h._id]=h);for(i in k)k[i].draw()},Kinetic.Animation._animationLoop=function(){var a=Kinetic.Animation;a.animations.length?(b(a._animationLoop),a._runFrames()):a.animRunning=!1},Kinetic.Animation._handleAnimation=function(){var a=this;this.animRunning||(this.animRunning=!0,a._animationLoop())};var f=Kinetic.Node.prototype.moveTo;Kinetic.Node.prototype.moveTo=function(a){f.call(this,a)},Kinetic.BaseLayer.prototype.batchDraw=function(){var a=this,b=Kinetic.Animation;this.batchAnim||(this.batchAnim=new b(function(){a.lastBatchDrawTime&&d()-a.lastBatchDrawTime>c&&a.batchAnim.stop()},this)),this.lastBatchDrawTime=d(),this.batchAnim.isRunning()||(this.draw(),this.batchAnim.start())},Kinetic.Stage.prototype.batchDraw=function(){this.getChildren().each(function(a){a.batchDraw()})}}(this),function(){var a={node:1,duration:1,easing:1,onFinish:1,yoyo:1},b=1,c=2,d=3,e=0;Kinetic.Tween=function(b){var c,d,g=this,h=b.node,i=h._id,j=b.easing||Kinetic.Easings.Linear,k=!!b.yoyo;c="undefined"==typeof b.duration?1:0===b.duration?.001:b.duration,this.node=h,this._id=e++,this.anim=new Kinetic.Animation(function(){g.tween.onEnterFrame()},h.getLayer()||(h instanceof Kinetic.Stage?h.getLayers():null)),this.tween=new f(d,function(a){g._tweenFunc(a)},j,0,1,1e3*c,k),this._addListeners(),Kinetic.Tween.attrs[i]||(Kinetic.Tween.attrs[i]={}),Kinetic.Tween.attrs[i][this._id]||(Kinetic.Tween.attrs[i][this._id]={}),Kinetic.Tween.tweens[i]||(Kinetic.Tween.tweens[i]={});for(d in b)void 0===a[d]&&this._addAttr(d,b[d]);this.reset(),this.onFinish=b.onFinish,this.onReset=b.onReset},Kinetic.Tween.attrs={},Kinetic.Tween.tweens={},Kinetic.Tween.prototype={_addAttr:function(a,b){var c,d,e,f,g,h=this.node,i=h._id;if(e=Kinetic.Tween.tweens[i][a],e&&delete Kinetic.Tween.attrs[i][e][a],c=h.getAttr(a),Kinetic.Util._isArray(b))for(d=[],g=b.length,f=0;g>f;f++)d.push(b[f]-c[f]);else d=b-c;Kinetic.Tween.attrs[i][this._id][a]={start:c,diff:d},Kinetic.Tween.tweens[i][a]=this._id},_tweenFunc:function(a){var b,c,d,e,f,g,h,i=this.node,j=Kinetic.Tween.attrs[i._id][this._id];for(b in j){if(c=j[b],d=c.start,e=c.diff,Kinetic.Util._isArray(d))for(f=[],h=d.length,g=0;h>g;g++)f.push(d[g]+e[g]*a);else f=d+e*a;i.setAttr(b,f)}},_addListeners:function(){var a=this;this.tween.onPlay=function(){a.anim.start()},this.tween.onReverse=function(){a.anim.start()},this.tween.onPause=function(){a.anim.stop()},this.tween.onFinish=function(){a.onFinish&&a.onFinish()},this.tween.onReset=function(){a.onReset&&a.onReset()}},play:function(){return this.tween.play(),this},reverse:function(){return this.tween.reverse(),this},reset:function(){return this.tween.reset(),this},seek:function(a){return this.tween.seek(1e3*a),this},pause:function(){return this.tween.pause(),this},finish:function(){return this.tween.finish(),this},destroy:function(){var a,b=this.node._id,c=this._id,d=Kinetic.Tween.tweens[b];this.pause();for(a in d)delete Kinetic.Tween.tweens[b][a];delete Kinetic.Tween.attrs[b][c]}};var f=function(a,b,c,d,e,f,g){this.prop=a,this.propFunc=b,this.begin=d,this._pos=d,this.duration=f,this._change=0,this.prevPos=0,this.yoyo=g,this._time=0,this._position=0,this._startTime=0,this._finish=0,this.func=c,this._change=e-this.begin,this.pause()};f.prototype={fire:function(a){var b=this[a];b&&b()},setTime:function(a){a>this.duration?this.yoyo?(this._time=this.duration,this.reverse()):this.finish():0>a?this.yoyo?(this._time=0,this.play()):this.reset():(this._time=a,this.update())},getTime:function(){return this._time},setPosition:function(a){this.prevPos=this._pos,this.propFunc(a),this._pos=a},getPosition:function(a){return void 0===a&&(a=this._time),this.func(a,this.begin,this._change,this.duration)},play:function(){this.state=c,this._startTime=this.getTimer()-this._time,this.onEnterFrame(),this.fire("onPlay")},reverse:function(){this.state=d,this._time=this.duration-this._time,this._startTime=this.getTimer()-this._time,this.onEnterFrame(),this.fire("onReverse")},seek:function(a){this.pause(),this._time=a,this.update(),this.fire("onSeek")},reset:function(){this.pause(),this._time=0,this.update(),this.fire("onReset")},finish:function(){this.pause(),this._time=this.duration,this.update(),this.fire("onFinish")},update:function(){this.setPosition(this.getPosition(this._time))},onEnterFrame:function(){var a=this.getTimer()-this._startTime;this.state===c?this.setTime(a):this.state===d&&this.setTime(this.duration-a)},pause:function(){this.state=b,this.fire("onPause")},getTimer:function(){return(new Date).getTime()}},Kinetic.Easings={BackEaseIn:function(a,b,c,d){var e=1.70158;return c*(a/=d)*a*((e+1)*a-e)+b},BackEaseOut:function(a,b,c,d){var e=1.70158;return c*((a=a/d-1)*a*((e+1)*a+e)+1)+b},BackEaseInOut:function(a,b,c,d){var e=1.70158;return(a/=d/2)<1?c/2*a*a*(((e*=1.525)+1)*a-e)+b:c/2*((a-=2)*a*(((e*=1.525)+1)*a+e)+2)+b},ElasticEaseIn:function(a,b,c,d,e,f){var g=0;return 0===a?b:1==(a/=d)?b+c:(f||(f=.3*d),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),-(e*Math.pow(2,10*(a-=1))*Math.sin(2*(a*d-g)*Math.PI/f))+b)},ElasticEaseOut:function(a,b,c,d,e,f){var g=0;return 0===a?b:1==(a/=d)?b+c:(f||(f=.3*d),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),e*Math.pow(2,-10*a)*Math.sin(2*(a*d-g)*Math.PI/f)+c+b)},ElasticEaseInOut:function(a,b,c,d,e,f){var g=0;return 0===a?b:2==(a/=d/2)?b+c:(f||(f=.3*d*1.5),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),1>a?-.5*e*Math.pow(2,10*(a-=1))*Math.sin(2*(a*d-g)*Math.PI/f)+b:e*Math.pow(2,-10*(a-=1))*Math.sin(2*(a*d-g)*Math.PI/f)*.5+c+b)},BounceEaseOut:function(a,b,c,d){return(a/=d)<1/2.75?7.5625*c*a*a+b:2/2.75>a?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:2.5/2.75>a?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b},BounceEaseIn:function(a,b,c,d){return c-Kinetic.Easings.BounceEaseOut(d-a,0,c,d)+b},BounceEaseInOut:function(a,b,c,d){return d/2>a?.5*Kinetic.Easings.BounceEaseIn(2*a,0,c,d)+b:.5*Kinetic.Easings.BounceEaseOut(2*a-d,0,c,d)+.5*c+b},EaseIn:function(a,b,c,d){return c*(a/=d)*a+b},EaseOut:function(a,b,c,d){return-c*(a/=d)*(a-2)+b},EaseInOut:function(a,b,c,d){return(a/=d/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},StrongEaseIn:function(a,b,c,d){return c*(a/=d)*a*a*a*a+b},StrongEaseOut:function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b},StrongEaseInOut:function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b},Linear:function(a,b,c,d){return c*a/d+b}}}(),function(){Kinetic.DD={anim:new Kinetic.Animation(function(){var a=this.dirty;return this.dirty=!1,a}),isDragging:!1,justDragged:!1,offset:{x:0,y:0},node:null,_drag:function(a){var b=Kinetic.DD,c=b.node;if(c){if(!b.isDragging){var d=c.getStage().getPointerPosition(),e=c.dragDistance(),f=Math.max(Math.abs(d.x-b.startPointerPos.x),Math.abs(d.y-b.startPointerPos.y));if(e>f)return}c._setDragPosition(a),b.isDragging||(b.isDragging=!0,c.fire("dragstart",{type:"dragstart",target:c,evt:a},!0)),c.fire("dragmove",{type:"dragmove",target:c,evt:a},!0)}},_endDragBefore:function(a){var b,c,d=Kinetic.DD,e=d.node;e&&(b=e.nodeType,c=e.getLayer(),d.anim.stop(),d.isDragging&&(d.isDragging=!1,d.justDragged=!0,Kinetic.listenClickTap=!1,a&&(a.dragEndNode=e)),delete d.node,(c||e).draw())},_endDragAfter:function(a){a=a||{};var b=a.dragEndNode;a&&b&&b.fire("dragend",{type:"dragend",target:b,evt:a},!0)}},Kinetic.Node.prototype.startDrag=function(){var a=Kinetic.DD,b=this.getStage(),c=this.getLayer(),d=b.getPointerPosition(),e=this.getAbsolutePosition();d&&(a.node&&a.node.stopDrag(),a.node=this,a.startPointerPos=d,a.offset.x=d.x-e.x,a.offset.y=d.y-e.y,a.anim.setLayers(c||this.getLayers()),a.anim.start(),this._setDragPosition())},Kinetic.Node.prototype._setDragPosition=function(a){var b=Kinetic.DD,c=this.getStage().getPointerPosition(),d=this.getDragBoundFunc();if(c){var e={x:c.x-b.offset.x,y:c.y-b.offset.y};void 0!==d&&(e=d.call(this,e,a)),this.setAbsolutePosition(e),this._lastPos&&this._lastPos.x===e.x&&this._lastPos.y===e.y||(b.anim.dirty=!0),this._lastPos=e}},Kinetic.Node.prototype.stopDrag=function(){var a=Kinetic.DD,b={};a._endDragBefore(b),a._endDragAfter(b)},Kinetic.Node.prototype.setDraggable=function(a){this._setAttr("draggable",a),this._dragChange()};var a=Kinetic.Node.prototype.destroy;Kinetic.Node.prototype.destroy=function(){var b=Kinetic.DD;b.node&&b.node._id===this._id&&this.stopDrag(),a.call(this)},Kinetic.Node.prototype.isDragging=function(){var a=Kinetic.DD;return!(!a.node||a.node._id!==this._id||!a.isDragging)},Kinetic.Node.prototype._listenDrag=function(){var a=this;this._dragCleanup(),"Stage"===this.getClassName()?this.on("contentMousedown.kinetic contentTouchstart.kinetic",function(b){Kinetic.DD.node||a.startDrag(b)}):this.on("mousedown.kinetic touchstart.kinetic",function(b){1!==b.evt.button&&2!==b.evt.button&&(Kinetic.DD.node||a.startDrag(b))})},Kinetic.Node.prototype._dragChange=function(){if(this.attrs.draggable)this._listenDrag();else{this._dragCleanup();var a=this.getStage(),b=Kinetic.DD;a&&b.node&&b.node._id===this._id&&b.node.stopDrag()}},Kinetic.Node.prototype._dragCleanup=function(){"Stage"===this.getClassName()?(this.off("contentMousedown.kinetic"),this.off("contentTouchstart.kinetic")):(this.off("mousedown.kinetic"),this.off("touchstart.kinetic"))},Kinetic.Factory.addGetterSetter(Kinetic.Node,"dragBoundFunc"),Kinetic.Factory.addGetter(Kinetic.Node,"draggable",!1),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Node,"draggable");var b=Kinetic.document.documentElement;b.addEventListener("mouseup",Kinetic.DD._endDragBefore,!0),b.addEventListener("touchend",Kinetic.DD._endDragBefore,!0),b.addEventListener("mouseup",Kinetic.DD._endDragAfter,!1),b.addEventListener("touchend",Kinetic.DD._endDragAfter,!1)}(),function(){Kinetic.Util.addMethods(Kinetic.Container,{__init:function(a){this.children=new Kinetic.Collection,Kinetic.Node.call(this,a)},getChildren:function(a){if(a){var b=new Kinetic.Collection;return this.children.each(function(c){a(c)&&b.push(c)}),b}return this.children},hasChildren:function(){return this.getChildren().length>0},removeChildren:function(){for(var a,b=Kinetic.Collection.toCollection(this.children),c=0;c<b.length;c++)a=b[c],delete a.parent,a.index=0,a.hasChildren()&&a.removeChildren(),a.remove();return b=null,this.children=new Kinetic.Collection,this},destroyChildren:function(){for(var a,b=Kinetic.Collection.toCollection(this.children),c=0;c<b.length;c++)a=b[c],delete a.parent,a.index=0,a.destroy();return b=null,this.children=new Kinetic.Collection,this},add:function(a){if(arguments.length>1){for(var b=0;b<arguments.length;b++)this.add(arguments[b]);return this}if(a.getParent())return a.moveTo(this),this;var c=this.children;return this._validateAdd(a),a.index=c.length,a.parent=this,c.push(a),this._fire("add",{child:a}),a.isDragging()&&Kinetic.DD.anim.setLayers(a.getLayer()),this},destroy:function(){this.hasChildren()&&this.destroyChildren(),Kinetic.Node.prototype.destroy.call(this)},find:function(a){var b,c,d,e,f,g,h,i=[],j=a.replace(/ /g,"").split(","),k=j.length;for(b=0;k>b;b++)if(d=j[b],"#"===d.charAt(0))f=this._getNodeById(d.slice(1)),f&&i.push(f);else if("."===d.charAt(0))e=this._getNodesByName(d.slice(1)),i=i.concat(e);else for(g=this.getChildren(),h=g.length,c=0;h>c;c++)i=i.concat(g[c]._get(d));return Kinetic.Collection.toCollection(i)},_getNodeById:function(a){var b=Kinetic.ids[a];return void 0!==b&&this.isAncestorOf(b)?b:null},_getNodesByName:function(a){var b=Kinetic.names[a]||[];return this._getDescendants(b)},_get:function(a){for(var b=Kinetic.Node.prototype._get.call(this,a),c=this.getChildren(),d=c.length,e=0;d>e;e++)b=b.concat(c[e]._get(a));return b},toObject:function(){var a=Kinetic.Node.prototype.toObject.call(this);
a.children=[];for(var b=this.getChildren(),c=b.length,d=0;c>d;d++){var e=b[d];a.children.push(e.toObject())}return a},_getDescendants:function(a){for(var b=[],c=a.length,d=0;c>d;d++){var e=a[d];this.isAncestorOf(e)&&b.push(e)}return b},isAncestorOf:function(a){for(var b=a.getParent();b;){if(b._id===this._id)return!0;b=b.getParent()}return!1},clone:function(a){var b=Kinetic.Node.prototype.clone.call(this,a);return this.getChildren().each(function(a){b.add(a.clone())}),b},getAllIntersections:function(a){var b=[];return this.find("Shape").each(function(c){c.isVisible()&&c.intersects(a)&&b.push(c)}),b},_setChildrenIndices:function(){this.children.each(function(a,b){a.index=b})},drawScene:function(a,b){var c=this.getLayer(),d=a||c&&c.getCanvas(),e=d&&d.getContext(),f=this._cache.canvas,g=f&&f.scene;return this.isVisible()&&(g?this._drawCachedSceneCanvas(e):this._drawChildren(d,"drawScene",b)),this},drawHit:function(a,b){var c=this.getLayer(),d=a||c&&c.hitCanvas,e=d&&d.getContext(),f=this._cache.canvas,g=f&&f.hit;return this.shouldDrawHit(d)&&(c&&c.clearHitCache(),g?this._drawCachedHitCanvas(e):this._drawChildren(d,"drawHit",b)),this},_drawChildren:function(a,b,c){var d,e,f=this.getLayer(),g=a&&a.getContext(),h=this.getClipWidth(),i=this.getClipHeight(),j=h&&i;j&&f&&(d=this.getClipX(),e=this.getClipY(),g.save(),f._applyTransform(this,g),g.beginPath(),g.rect(d,e,h,i),g.clip(),g.reset()),this.children.each(function(d){d[b](a,c)}),j&&g.restore()},shouldDrawHit:function(a){var b=this.getLayer(),c=Kinetic.DD,d=c&&Kinetic.isDragging()&&-1!==Kinetic.DD.anim.getLayers().indexOf(b);return a&&a.isCache||b&&b.hitGraphEnabled()&&this.isVisible()&&!d}}),Kinetic.Util.extend(Kinetic.Container,Kinetic.Node),Kinetic.Container.prototype.get=Kinetic.Container.prototype.find,Kinetic.Factory.addComponentsGetterSetter(Kinetic.Container,"clip",["x","y","width","height"]),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipX"),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipY"),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipWidth"),Kinetic.Factory.addGetterSetter(Kinetic.Container,"clipHeight"),Kinetic.Collection.mapMethods(Kinetic.Container)}(),function(){function a(a){a.fill()}function b(a){a.stroke()}function c(a){a.fill()}function d(a){a.stroke()}function e(){this._clearCache(f)}var f="hasShadow";Kinetic.Util.addMethods(Kinetic.Shape,{__init:function(f){this.nodeType="Shape",this._fillFunc=a,this._strokeFunc=b,this._fillFuncHit=c,this._strokeFuncHit=d;for(var g,h=Kinetic.shapes;;)if(g=Kinetic.Util.getRandomColor(),g&&!(g in h))break;this.colorKey=g,h[g]=this,Kinetic.Node.call(this,f),this.on("shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic shadowEnabledChange.kinetic",e)},hasChildren:function(){return!1},getChildren:function(){return[]},getContext:function(){return this.getLayer().getContext()},getCanvas:function(){return this.getLayer().getCanvas()},hasShadow:function(){return this._getCache(f,this._hasShadow)},_hasShadow:function(){return this.getShadowEnabled()&&0!==this.getShadowOpacity()&&!!(this.getShadowColor()||this.getShadowBlur()||this.getShadowOffsetX()||this.getShadowOffsetY())},hasFill:function(){return!!(this.getFill()||this.getFillPatternImage()||this.getFillLinearGradientColorStops()||this.getFillRadialGradientColorStops())},hasStroke:function(){return!!(this.stroke()||this.strokeRed()||this.strokeGreen()||this.strokeBlue())},intersects:function(a){var b,c=this.getStage(),d=c.bufferHitCanvas;return d.getContext().clear(),this.drawScene(d),b=d.context.getImageData(Math.round(a.x),Math.round(a.y),1,1).data,b[3]>0},destroy:function(){Kinetic.Node.prototype.destroy.call(this),delete Kinetic.shapes[this.colorKey]},_useBufferCanvas:function(){return(this.hasShadow()||1!==this.getAbsoluteOpacity())&&this.hasFill()&&this.hasStroke()&&this.getStage()},drawScene:function(a,b){var c,d,e,f=this.getLayer(),g=a||f.getCanvas(),h=g.getContext(),i=this._cache.canvas,j=this.sceneFunc(),k=this.hasShadow();if(this.isVisible())if(i)this._drawCachedSceneCanvas(h);else if(j){if(h.save(),this._useBufferCanvas()){if(c=this.getStage(),d=c.bufferCanvas,e=d.getContext(),e.clear(),e.save(),e._applyLineJoin(this),f)f._applyTransform(this,e,b);else{var l=this.getAbsoluteTransform(b).getMatrix();h.transform(l[0],l[1],l[2],l[3],l[4],l[5])}j.call(this,e),e.restore(),k&&!g.hitCanvas&&(h.save(),h._applyShadow(this),h.drawImage(d._canvas,0,0),h.restore()),h._applyOpacity(this),h.drawImage(d._canvas,0,0)}else{if(h._applyLineJoin(this),f)f._applyTransform(this,h,b);else{var m=this.getAbsoluteTransform(b).getMatrix();h.transform(m[0],m[1],m[2],m[3],m[4],m[5])}k&&!g.hitCanvas&&(h.save(),h._applyShadow(this),j.call(this,h),h.restore()),h._applyOpacity(this),j.call(this,h)}h.restore()}return this},drawHit:function(a,b){var c=this.getLayer(),d=a||c.hitCanvas,e=d.getContext(),f=this.hitFunc()||this.sceneFunc(),g=this._cache.canvas,h=g&&g.hit;if(this.shouldDrawHit(d))if(c&&c.clearHitCache(),h)this._drawCachedHitCanvas(e);else if(f){if(e.save(),e._applyLineJoin(this),c)c._applyTransform(this,e,b);else{var i=this.getAbsoluteTransform(b).getMatrix();e.transform(i[0],i[1],i[2],i[3],i[4],i[5])}f.call(this,e),e.restore()}return this},drawHitFromCache:function(a){var b,c,d,e,f,g,h,i,j=a||0,k=this._cache.canvas,l=this._getCachedSceneCanvas(),m=l.getContext(),n=k.hit,o=n.getContext(),p=l.getWidth(),q=l.getHeight();o.clear();try{for(b=m.getImageData(0,0,p,q),c=b.data,d=o.getImageData(0,0,p,q),e=d.data,f=c.length,g=Kinetic.Util._hexToRgb(this.colorKey),h=0;f>h;h+=4)i=c[h+3],i>j&&(e[h]=g.r,e[h+1]=g.g,e[h+2]=g.b,e[h+3]=255);o.putImageData(d,0,0)}catch(r){Kinetic.Util.warn("Unable to draw hit graph from cached scene canvas. "+r.message)}return this}}),Kinetic.Util.extend(Kinetic.Shape,Kinetic.Node),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"stroke"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeRed",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeGreen",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeBlue",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeAlpha",1,Kinetic.Validators.alphaComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeWidth",2),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"lineJoin"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"lineCap"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"sceneFunc"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"hitFunc"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"dash"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowColor"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowRed",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowGreen",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowBlue",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowAlpha",1,Kinetic.Validators.alphaComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowBlur"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowOpacity"),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"shadowOffset",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowOffsetX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowOffsetY",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternImage"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fill"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRed",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillGreen",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillBlue",0,Kinetic.Validators.RGBComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillAlpha",1,Kinetic.Validators.alphaComponent),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternY",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientColorStops"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientColorStops"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternRepeat","repeat"),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"shadowEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"dashEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"strokeScaleEnabled",!0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPriority","color"),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillPatternOffset",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternOffsetX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternOffsetY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillPatternScale",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternScaleX",1),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternScaleY",1),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillLinearGradientStartPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientStartPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientStartPointY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillLinearGradientEndPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientEndPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillLinearGradientEndPointY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillRadialGradientStartPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientStartPointY",0),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Shape,"fillRadialGradientEndPoint",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndPointX",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillRadialGradientEndPointY",0),Kinetic.Factory.addGetterSetter(Kinetic.Shape,"fillPatternRotation",0),Kinetic.Factory.backCompat(Kinetic.Shape,{dashArray:"dash",getDashArray:"getDash",setDashArray:"getDash",drawFunc:"sceneFunc",getDrawFunc:"getSceneFunc",setDrawFunc:"setSceneFunc",drawHitFunc:"hitFunc",getDrawHitFunc:"getHitFunc",setDrawHitFunc:"setHitFunc"}),Kinetic.Collection.mapMethods(Kinetic.Shape)}(),function(){function a(a,b){a.content.addEventListener(b,function(c){a[L+b](c)},!1)}var b="Stage",c="string",d="px",e="mouseout",f="mouseleave",g="mouseover",h="mouseenter",i="mousemove",j="mousedown",k="mouseup",l="click",m="dblclick",n="touchstart",o="touchend",p="tap",q="dbltap",r="touchmove",s="DOMMouseScroll",t="mousewheel",u="wheel",v="contentMouseout",w="contentMouseover",x="contentMousemove",y="contentMousedown",z="contentMouseup",A="contentClick",B="contentDblclick",C="contentTouchstart",D="contentTouchend",E="contentDbltap",F="contentTouchmove",G="div",H="relative",I="inline-block",J="kineticjs-content",K=" ",L="_",M="container",N="",O=[j,i,k,e,n,r,o,g,s,t,u],P=O.length;Kinetic.Util.addMethods(Kinetic.Stage,{___init:function(a){this.nodeType=b,Kinetic.Container.call(this,a),this._id=Kinetic.idCounter++,this._buildDOM(),this._bindContentEvents(),this._enableNestedTransforms=!1,Kinetic.stages.push(this)},_validateAdd:function(a){"Layer"!==a.getType()&&Kinetic.Util.error("You may only add layers to the stage.")},setContainer:function(a){if(typeof a===c){var b=a;if(a=Kinetic.document.getElementById(a),!a)throw"Can not find container in document with id "+b}return this._setAttr(M,a),this},shouldDrawHit:function(){return!0},draw:function(){return Kinetic.Node.prototype.draw.call(this),this},setHeight:function(a){return Kinetic.Node.prototype.setHeight.call(this,a),this._resizeDOM(),this},setWidth:function(a){return Kinetic.Node.prototype.setWidth.call(this,a),this._resizeDOM(),this},clear:function(){var a,b=this.children,c=b.length;for(a=0;c>a;a++)b[a].clear();return this},clone:function(a){return a||(a={}),a.container=Kinetic.document.createElement(G),Kinetic.Container.prototype.clone.call(this,a)},destroy:function(){var a=this.content;Kinetic.Container.prototype.destroy.call(this),a&&Kinetic.Util._isInDocument(a)&&this.getContainer().removeChild(a);var b=Kinetic.stages.indexOf(this);b>-1&&Kinetic.stages.splice(b,1)},getPointerPosition:function(){return this.pointerPos},getStage:function(){return this},getContent:function(){return this.content},toDataURL:function(a){function b(e){var f=i[e],j=f.toDataURL(),k=new Kinetic.window.Image;k.onload=function(){h.drawImage(k,0,0),e<i.length-1?b(e+1):a.callback(g.toDataURL(c,d))},k.src=j}a=a||{};var c=a.mimeType||null,d=a.quality||null,e=a.x||0,f=a.y||0,g=new Kinetic.SceneCanvas({width:a.width||this.getWidth(),height:a.height||this.getHeight(),pixelRatio:1}),h=g.getContext()._context,i=this.children;(e||f)&&h.translate(-1*e,-1*f),b(0)},toImage:function(a){var b=a.callback;a.callback=function(a){Kinetic.Util._getImage(a,function(a){b(a)})},this.toDataURL(a)},getIntersection:function(a){var b,c,d=this.getChildren(),e=d.length,f=e-1;for(b=f;b>=0;b--)if(c=d[b].getIntersection(a))return c;return null},_resizeDOM:function(){if(this.content){var a,b,c=this.getWidth(),e=this.getHeight(),f=this.getChildren(),g=f.length;for(this.content.style.width=c+d,this.content.style.height=e+d,this.bufferCanvas.setSize(c,e),this.bufferHitCanvas.setSize(c,e),a=0;g>a;a++)b=f[a],b.setSize(c,e),b.draw()}},add:function(a){if(!(arguments.length>1))return Kinetic.Container.prototype.add.call(this,a),a._setCanvasSize(this.width(),this.height()),a.draw(),this.content.appendChild(a.canvas._canvas),this;for(var b=0;b<arguments.length;b++)this.add(arguments[b])},getParent:function(){return null},getLayer:function(){return null},getLayers:function(){return this.getChildren()},_bindContentEvents:function(){for(var b=0;P>b;b++)a(this,O[b])},_mouseover:function(a){Kinetic.UA.mobile||(this._setPointerPosition(a),this._fire(w,{evt:a}))},_mouseout:function(a){if(!Kinetic.UA.mobile){this._setPointerPosition(a);var b=this.targetShape;b&&!Kinetic.isDragging()&&(b._fireAndBubble(e,{evt:a}),b._fireAndBubble(f,{evt:a}),this.targetShape=null),this.pointerPos=void 0,this._fire(v,{evt:a})}},_mousemove:function(a){if(Kinetic.UA.ieMobile)return this._touchmove(a);if(("undefined"==typeof a.webkitMovementX&&"undefined"==typeof a.webkitMovementY||0!==a.webkitMovementY||0!==a.webkitMovementX)&&!Kinetic.UA.mobile){this._setPointerPosition(a);var b,c=Kinetic.DD;Kinetic.isDragging()||(b=this.getIntersection(this.getPointerPosition()),b&&b.isListening()?Kinetic.isDragging()||this.targetShape&&this.targetShape._id===b._id?b._fireAndBubble(i,{evt:a}):(this.targetShape&&(this.targetShape._fireAndBubble(e,{evt:a},b),this.targetShape._fireAndBubble(f,{evt:a},b)),b._fireAndBubble(g,{evt:a},this.targetShape),b._fireAndBubble(h,{evt:a},this.targetShape),this.targetShape=b):this.targetShape&&!Kinetic.isDragging()&&(this.targetShape._fireAndBubble(e,{evt:a}),this.targetShape._fireAndBubble(f,{evt:a}),this.targetShape=null),this._fire(x,{evt:a})),c&&c._drag(a),a.preventDefault&&a.preventDefault()}},_mousedown:function(a){if(Kinetic.UA.ieMobile)return this._touchstart(a);if(!Kinetic.UA.mobile){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition());Kinetic.listenClickTap=!0,b&&b.isListening()&&(this.clickStartShape=b,b._fireAndBubble(j,{evt:a})),this._fire(y,{evt:a})}a.preventDefault&&a.preventDefault()},_mouseup:function(a){if(Kinetic.UA.ieMobile)return this._touchend(a);if(!Kinetic.UA.mobile){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition()),c=this.clickStartShape,d=!1,e=Kinetic.DD;Kinetic.inDblClickWindow?(d=!0,Kinetic.inDblClickWindow=!1):e&&e.justDragged?e&&(e.justDragged=!1):Kinetic.inDblClickWindow=!0,setTimeout(function(){Kinetic.inDblClickWindow=!1},Kinetic.dblClickWindow),b&&b.isListening()&&(b._fireAndBubble(k,{evt:a}),Kinetic.listenClickTap&&c&&c._id===b._id&&(b._fireAndBubble(l,{evt:a}),d&&b._fireAndBubble(m,{evt:a}))),this._fire(z,{evt:a}),Kinetic.listenClickTap&&(this._fire(A,{evt:a}),d&&this._fire(B,{evt:a})),Kinetic.listenClickTap=!1}a.preventDefault&&a.preventDefault()},_touchstart:function(a){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition());Kinetic.listenClickTap=!0,b&&b.isListening()&&(this.tapStartShape=b,b._fireAndBubble(n,{evt:a}),b.isListening()&&a.preventDefault&&a.preventDefault()),this._fire(C,{evt:a})},_touchend:function(a){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition()),c=!1;Kinetic.inDblClickWindow?(c=!0,Kinetic.inDblClickWindow=!1):Kinetic.inDblClickWindow=!0,setTimeout(function(){Kinetic.inDblClickWindow=!1},Kinetic.dblClickWindow),b&&b.isListening()&&(b._fireAndBubble(o,{evt:a}),Kinetic.listenClickTap&&b._id===this.tapStartShape._id&&(b._fireAndBubble(p,{evt:a}),c&&b._fireAndBubble(q,{evt:a})),b.isListening()&&a.preventDefault&&a.preventDefault()),Kinetic.listenClickTap&&(this._fire(D,{evt:a}),c&&this._fire(E,{evt:a})),Kinetic.listenClickTap=!1},_touchmove:function(a){this._setPointerPosition(a);var b,c=Kinetic.DD;Kinetic.isDragging()||(b=this.getIntersection(this.getPointerPosition()),b&&b.isListening()&&(b._fireAndBubble(r,{evt:a}),b.isListening()&&a.preventDefault&&a.preventDefault()),this._fire(F,{evt:a})),c&&(c._drag(a),Kinetic.isDragging()&&a.preventDefault())},_DOMMouseScroll:function(a){this._mousewheel(a)},_mousewheel:function(a){this._setPointerPosition(a);var b=this.getIntersection(this.getPointerPosition());b&&b.isListening()&&b._fireAndBubble(t,{evt:a})},_wheel:function(a){this._mousewheel(a)},_setPointerPosition:function(a){var b,c=this._getContentPosition(),d=a.offsetX,e=a.clientX,f=null,g=null;a=a?a:window.event,void 0!==a.touches?a.touches.length>0&&(b=a.touches[0],f=b.clientX-c.left,g=b.clientY-c.top):void 0!==d?(f=d,g=a.offsetY):"mozilla"===Kinetic.UA.browser?(f=a.layerX,g=a.layerY):void 0!==e&&c&&(f=e-c.left,g=a.clientY-c.top),null!==f&&null!==g&&(this.pointerPos={x:f,y:g})},_getContentPosition:function(){var a=this.content.getBoundingClientRect?this.content.getBoundingClientRect():{top:0,left:0};return{top:a.top,left:a.left}},_buildDOM:function(){var a=this.getContainer();if(!a){if(Kinetic.Util.isBrowser())throw"Stage has no container. A container is required.";a=Kinetic.document.createElement(G)}a.innerHTML=N,this.content=Kinetic.document.createElement(G),this.content.style.position=H,this.content.style.display=I,this.content.className=J,this.content.setAttribute("role","presentation"),a.appendChild(this.content),this.bufferCanvas=new Kinetic.SceneCanvas({pixelRatio:1}),this.bufferHitCanvas=new Kinetic.HitCanvas,this._resizeDOM()},_onContent:function(a,b){var c,d,e=a.split(K),f=e.length;for(c=0;f>c;c++)d=e[c],this.content.addEventListener(d,b,!1)},cache:function(){Kinetic.Util.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.")},clearCache:function(){}}),Kinetic.Util.extend(Kinetic.Stage,Kinetic.Container),Kinetic.Factory.addGetter(Kinetic.Stage,"container"),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Stage,"container")}(),function(){Kinetic.Util.addMethods(Kinetic.BaseLayer,{___init:function(a){this.nodeType="Layer",Kinetic.Container.call(this,a)},createPNGStream:function(){return this.canvas._canvas.createPNGStream()},getCanvas:function(){return this.canvas},getHitCanvas:function(){return this.hitCanvas},getContext:function(){return this.getCanvas().getContext()},clear:function(a){return this.getContext().clear(a),this.getHitCanvas().getContext().clear(a),this},clearHitCache:function(){this._hitImageData=void 0},setZIndex:function(a){Kinetic.Node.prototype.setZIndex.call(this,a);var b=this.getStage();return b&&(b.content.removeChild(this.getCanvas()._canvas),a<b.getChildren().length-1?b.content.insertBefore(this.getCanvas()._canvas,b.getChildren()[a+1].getCanvas()._canvas):b.content.appendChild(this.getCanvas()._canvas)),this},moveToTop:function(){Kinetic.Node.prototype.moveToTop.call(this);var a=this.getStage();a&&(a.content.removeChild(this.getCanvas()._canvas),a.content.appendChild(this.getCanvas()._canvas))},moveUp:function(){if(Kinetic.Node.prototype.moveUp.call(this)){var a=this.getStage();a&&(a.content.removeChild(this.getCanvas()._canvas),this.index<a.getChildren().length-1?a.content.insertBefore(this.getCanvas()._canvas,a.getChildren()[this.index+1].getCanvas()._canvas):a.content.appendChild(this.getCanvas()._canvas))}},moveDown:function(){if(Kinetic.Node.prototype.moveDown.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.getCanvas()._canvas),a.content.insertBefore(this.getCanvas()._canvas,b[this.index+1].getCanvas()._canvas)}}},moveToBottom:function(){if(Kinetic.Node.prototype.moveToBottom.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.getCanvas()._canvas),a.content.insertBefore(this.getCanvas()._canvas,b[1].getCanvas()._canvas)}}},getLayer:function(){return this},remove:function(){var a=this.getCanvas()._canvas;return Kinetic.Node.prototype.remove.call(this),a&&a.parentNode&&Kinetic.Util._isInDocument(a)&&a.parentNode.removeChild(a),this},getStage:function(){return this.parent},setSize:function(a,b){this.canvas.setSize(a,b)},getWidth:function(){return this.parent?this.parent.getWidth():void 0},setWidth:function(){Kinetic.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.')},getHeight:function(){return this.parent?this.parent.getHeight():void 0},setHeight:function(){Kinetic.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.')}}),Kinetic.Util.extend(Kinetic.BaseLayer,Kinetic.Container),Kinetic.Factory.addGetterSetter(Kinetic.BaseLayer,"clearBeforeDraw",!0),Kinetic.Collection.mapMethods(Kinetic.BaseLayer)}(),function(){var a="#",b="beforeDraw",c="draw",d=[{x:0,y:0},{x:-1,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1}],e=d.length;Kinetic.Util.addMethods(Kinetic.Layer,{____init:function(a){this.nodeType="Layer",this.canvas=new Kinetic.SceneCanvas,this.hitCanvas=new Kinetic.HitCanvas,Kinetic.BaseLayer.call(this,a)},_setCanvasSize:function(a,b){this.canvas.setSize(a,b),this.hitCanvas.setSize(a,b)},_validateAdd:function(a){var b=a.getType();"Group"!==b&&"Shape"!==b&&Kinetic.Util.error("You may only add groups and shapes to a layer.")},getIntersection:function(a){var b,c,f,g;if(!this.hitGraphEnabled()||!this.isVisible())return null;for(var h=1,i=!1;;){for(c=0;e>c;c++){if(f=d[c],b=this._getIntersection({x:a.x+f.x*h,y:a.y+f.y*h}),g=b.shape)return g;b.antialiased&&(i=!0)}if(!i)return;h+=1}},_getImageData:function(a,b){var c=this.hitCanvas.width||1,d=this.hitCanvas.height||1,e=Math.round(b)*c+Math.round(a);return this._hitImageData||(this._hitImageData=this.hitCanvas.context.getImageData(0,0,c,d)),[this._hitImageData.data[4*e+0],this._hitImageData.data[4*e+1],this._hitImageData.data[4*e+2],this._hitImageData.data[4*e+3]]},_getIntersection:function(b){var c,d,e=this.hitCanvas.context.getImageData(b.x,b.y,1,1).data,f=e[3];return 255===f?(c=Kinetic.Util._rgbToHex(e[0],e[1],e[2]),d=Kinetic.shapes[a+c],{shape:d}):f>0?{antialiased:!0}:{}},drawScene:function(a,d){var e=this.getLayer(),f=a||e&&e.getCanvas();return this._fire(b,{node:this}),this.getClearBeforeDraw()&&f.getContext().clear(),Kinetic.Container.prototype.drawScene.call(this,f,d),this._fire(c,{node:this}),this},_applyTransform:function(a,b,c){var d=a.getAbsoluteTransform(c).getMatrix();b.transform(d[0],d[1],d[2],d[3],d[4],d[5])},drawHit:function(a,b){var c=this.getLayer(),d=a||c&&c.hitCanvas;return c&&c.getClearBeforeDraw()&&c.getHitCanvas().getContext().clear(),Kinetic.Container.prototype.drawHit.call(this,d,b),this.imageData=null,this},clear:function(a){return this.getContext().clear(a),this.getHitCanvas().getContext().clear(a),this.imageData=null,this},setVisible:function(a){return Kinetic.Node.prototype.setVisible.call(this,a),a?(this.getCanvas()._canvas.style.display="block",this.hitCanvas._canvas.style.display="block"):(this.getCanvas()._canvas.style.display="none",this.hitCanvas._canvas.style.display="none"),this},enableHitGraph:function(){return this.setHitGraphEnabled(!0),this},disableHitGraph:function(){return this.setHitGraphEnabled(!1),this},setSize:function(a,b){Kinetic.BaseLayer.prototype.setSize.call(this,a,b),this.hitCanvas.setSize(a,b)}}),Kinetic.Util.extend(Kinetic.Layer,Kinetic.BaseLayer),Kinetic.Factory.addGetterSetter(Kinetic.Layer,"hitGraphEnabled",!0),Kinetic.Collection.mapMethods(Kinetic.Layer)}(),function(){Kinetic.Util.addMethods(Kinetic.FastLayer,{____init:function(a){this.nodeType="Layer",this.canvas=new Kinetic.SceneCanvas,Kinetic.BaseLayer.call(this,a)},_validateAdd:function(a){var b=a.getType();"Shape"!==b&&Kinetic.Util.error("You may only add shapes to a fast layer.")},_setCanvasSize:function(a,b){this.canvas.setSize(a,b)},hitGraphEnabled:function(){return!1},getIntersection:function(){return null},drawScene:function(a){var b=this.getLayer(),c=a||b&&b.getCanvas();return this.getClearBeforeDraw()&&c.getContext().clear(),Kinetic.Container.prototype.drawScene.call(this,c),this},_applyTransform:function(a,b,c){if(!c||c._id!==this._id){var d=a.getTransform().getMatrix();b.transform(d[0],d[1],d[2],d[3],d[4],d[5])}},draw:function(){return this.drawScene(),this},clear:function(a){return this.getContext().clear(a),this},setVisible:function(a){return Kinetic.Node.prototype.setVisible.call(this,a),this.getCanvas()._canvas.style.display=a?"block":"none",this}}),Kinetic.Util.extend(Kinetic.FastLayer,Kinetic.BaseLayer),Kinetic.Collection.mapMethods(Kinetic.FastLayer)}(),function(){Kinetic.Util.addMethods(Kinetic.Group,{___init:function(a){this.nodeType="Group",Kinetic.Container.call(this,a)},_validateAdd:function(a){var b=a.getType();"Group"!==b&&"Shape"!==b&&Kinetic.Util.error("You may only add groups and shapes to groups.")}}),Kinetic.Util.extend(Kinetic.Group,Kinetic.Container),Kinetic.Collection.mapMethods(Kinetic.Group)}(),function(){Kinetic.Rect=function(a){this.___init(a)},Kinetic.Rect.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Rect",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.getCornerRadius(),c=this.getWidth(),d=this.getHeight();a.beginPath(),b?(a.moveTo(b,0),a.lineTo(c-b,0),a.arc(c-b,b,b,3*Math.PI/2,0,!1),a.lineTo(c,d-b),a.arc(c-b,d-b,b,0,Math.PI/2,!1),a.lineTo(b,d),a.arc(b,d-b,b,Math.PI/2,Math.PI,!1),a.lineTo(0,b),a.arc(b,b,b,Math.PI,3*Math.PI/2,!1)):a.rect(0,0,c,d),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Rect,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Rect,"cornerRadius",0),Kinetic.Collection.mapMethods(Kinetic.Rect)}(),function(){var a=2*Math.PI-1e-4,b="Circle";Kinetic.Circle=function(a){this.___init(a)},Kinetic.Circle.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className=b,this.sceneFunc(this._sceneFunc)},_sceneFunc:function(b){b.beginPath(),b.arc(0,0,this.getRadius(),0,a,!1),b.closePath(),b.fillStrokeShape(this)},getWidth:function(){return 2*this.getRadius()},getHeight:function(){return 2*this.getRadius()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.radius()!==a/2&&this.setRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.radius()!==a/2&&this.setRadius(a/2)},setRadius:function(a){this._setAttr("radius",a),this.setWidth(2*a),this.setHeight(2*a)}},Kinetic.Util.extend(Kinetic.Circle,Kinetic.Shape),Kinetic.Factory.addGetter(Kinetic.Circle,"radius",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Circle,"radius"),Kinetic.Collection.mapMethods(Kinetic.Circle)}(),function(){var a=2*Math.PI-1e-4,b="Ellipse";Kinetic.Ellipse=function(a){this.___init(a)},Kinetic.Ellipse.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className=b,this.sceneFunc(this._sceneFunc)},_sceneFunc:function(b){var c=this.getRadiusX(),d=this.getRadiusY();b.beginPath(),b.save(),c!==d&&b.scale(1,d/c),b.arc(0,0,c,0,a,!1),b.restore(),b.closePath(),b.fillStrokeShape(this)},getWidth:function(){return 2*this.getRadiusX()},getHeight:function(){return 2*this.getRadiusY()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius({x:a/2})},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius({y:a/2})}},Kinetic.Util.extend(Kinetic.Ellipse,Kinetic.Shape),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Ellipse,"radius",["x","y"]),Kinetic.Factory.addGetterSetter(Kinetic.Ellipse,"radiusX",0),Kinetic.Factory.addGetterSetter(Kinetic.Ellipse,"radiusY",0),Kinetic.Collection.mapMethods(Kinetic.Ellipse)}(),function(){var a=2*Math.PI-1e-4;Kinetic.Ring=function(a){this.___init(a)},Kinetic.Ring.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Ring",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(b){b.beginPath(),b.arc(0,0,this.getInnerRadius(),0,a,!1),b.moveTo(this.getOuterRadius(),0),b.arc(0,0,this.getOuterRadius(),a,0,!0),b.closePath(),b.fillStrokeShape(this)},getWidth:function(){return 2*this.getOuterRadius()},getHeight:function(){return 2*this.getOuterRadius()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.outerRadius()!==a/2&&this.setOuterRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.outerRadius()!==a/2&&this.setOuterRadius(a/2)},setOuterRadius:function(a){this._setAttr("outerRadius",a),this.setWidth(2*a),this.setHeight(2*a)}},Kinetic.Util.extend(Kinetic.Ring,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Ring,"innerRadius",0),Kinetic.Factory.addGetter(Kinetic.Ring,"outerRadius",0),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Ring,"outerRadius"),Kinetic.Collection.mapMethods(Kinetic.Ring)}(),function(){Kinetic.Wedge=function(a){this.___init(a)},Kinetic.Wedge.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Wedge",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){a.beginPath(),a.arc(0,0,this.getRadius(),0,Kinetic.getAngle(this.getAngle()),this.getClockwise()),a.lineTo(0,0),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Wedge,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Wedge,"radius",0),Kinetic.Factory.addGetterSetter(Kinetic.Wedge,"angle",0),Kinetic.Factory.addGetterSetter(Kinetic.Wedge,"clockwise",!1),Kinetic.Factory.backCompat(Kinetic.Wedge,{angleDeg:"angle",getAngleDeg:"getAngle",setAngleDeg:"setAngle"}),Kinetic.Collection.mapMethods(Kinetic.Wedge)}(),function(){Kinetic.Arc=function(a){this.___init(a)},Kinetic.Arc.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Arc",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=Kinetic.getAngle(this.angle()),c=this.clockwise();a.beginPath(),a.arc(0,0,this.getOuterRadius(),0,b,c),a.arc(0,0,this.getInnerRadius(),b,0,!c),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Arc,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"innerRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"outerRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"angle",0),Kinetic.Factory.addGetterSetter(Kinetic.Arc,"clockwise",!1),Kinetic.Collection.mapMethods(Kinetic.Arc)}(),function(){var a="Image";Kinetic.Image=function(a){this.___init(a)},Kinetic.Image.prototype={___init:function(b){Kinetic.Shape.call(this,b),this.className=a,this.sceneFunc(this._sceneFunc),this.hitFunc(this._hitFunc)},_useBufferCanvas:function(){return(this.hasShadow()||1!==this.getAbsoluteOpacity())&&this.hasStroke()&&this.getStage()},_sceneFunc:function(a){var b,c,d,e=this.getWidth(),f=this.getHeight(),g=this.getImage();g&&(b=this.getCropWidth(),c=this.getCropHeight(),d=b&&c?[g,this.getCropX(),this.getCropY(),b,c,0,0,e,f]:[g,0,0,e,f]),(this.hasFill()||this.hasStroke()||this.hasShadow())&&(a.beginPath(),a.rect(0,0,e,f),a.closePath(),a.fillStrokeShape(this)),g&&a.drawImage.apply(a,d)
},_hitFunc:function(a){var b=this.getWidth(),c=this.getHeight();a.beginPath(),a.rect(0,0,b,c),a.closePath(),a.fillStrokeShape(this)},getWidth:function(){var a=this.getImage();return this.attrs.width||(a?a.width:0)},getHeight:function(){var a=this.getImage();return this.attrs.height||(a?a.height:0)}},Kinetic.Util.extend(Kinetic.Image,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Image,"image"),Kinetic.Factory.addComponentsGetterSetter(Kinetic.Image,"crop",["x","y","width","height"]),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropX",0),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropY",0),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropWidth",0),Kinetic.Factory.addGetterSetter(Kinetic.Image,"cropHeight",0),Kinetic.Collection.mapMethods(Kinetic.Image)}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}var c="auto",d="center",e="Change.kinetic",f="2d",g="-",h="",i="left",j="text",k="Text",l="middle",m="normal",n="px ",o=" ",p="right",q="word",r="char",s="none",t=["fontFamily","fontSize","fontStyle","fontVariant","padding","align","lineHeight","text","width","height","wrap"],u=t.length,v=Kinetic.Util.createCanvasElement().getContext(f);Kinetic.Text=function(a){this.___init(a)},Kinetic.Text.prototype={___init:function(d){d=d||{},d.fill=d.fill||"black",void 0===d.width&&(d.width=c),void 0===d.height&&(d.height=c),Kinetic.Shape.call(this,d),this._fillFunc=a,this._strokeFunc=b,this.className=k;for(var f=0;u>f;f++)this.on(t[f]+e,this._setTextData);this._setTextData(),this.sceneFunc(this._sceneFunc),this.hitFunc(this._hitFunc)},_sceneFunc:function(a){var b,c=this.getPadding(),e=this.getTextHeight(),f=this.getLineHeight()*e,g=this.textArr,h=g.length,j=this.getWidth();for(a.setAttr("font",this._getContextFont()),a.setAttr("textBaseline",l),a.setAttr("textAlign",i),a.save(),a.translate(c,0),a.translate(0,c+e/2),b=0;h>b;b++){var k=g[b],m=k.text,n=k.width;a.save(),this.getAlign()===p?a.translate(j-n-2*c,0):this.getAlign()===d&&a.translate((j-n-2*c)/2,0),this.partialText=m,a.fillStrokeShape(this),a.restore(),a.translate(0,f)}a.restore()},_hitFunc:function(a){var b=this.getWidth(),c=this.getHeight();a.beginPath(),a.rect(0,0,b,c),a.closePath(),a.fillStrokeShape(this)},setText:function(a){var b=Kinetic.Util._isString(a)?a:a.toString();return this._setAttr(j,b),this},getWidth:function(){return this.attrs.width===c?this.getTextWidth()+2*this.getPadding():this.attrs.width},getHeight:function(){return this.attrs.height===c?this.getTextHeight()*this.textArr.length*this.getLineHeight()+2*this.getPadding():this.attrs.height},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},_getTextSize:function(a){var b,c=v,d=this.getFontSize();return c.save(),c.font=this._getContextFont(),b=c.measureText(a),c.restore(),{width:b.width,height:parseInt(d,10)}},_getContextFont:function(){return this.getFontStyle()+o+this.getFontVariant()+o+this.getFontSize()+n+this.getFontFamily()},_addTextLine:function(a,b){return this.textArr.push({text:a,width:b})},_getTextWidth:function(a){return v.measureText(a).width},_setTextData:function(){var a=this.getText().split("\n"),b=+this.getFontSize(),d=0,e=this.getLineHeight()*b,f=this.attrs.width,h=this.attrs.height,i=f!==c,j=h!==c,k=this.getPadding(),l=f-2*k,m=h-2*k,n=0,p=this.getWrap(),q=p!==s,t=p!==r&&q;this.textArr=[],v.save(),v.font=this._getContextFont();for(var u=0,w=a.length;w>u;++u){var x=a[u],y=this._getTextWidth(x);if(i&&y>l)for(;x.length>0;){for(var z=0,A=x.length,B="",C=0;A>z;){var D=z+A>>>1,E=x.slice(0,D+1),F=this._getTextWidth(E);l>=F?(z=D+1,B=E,C=F):A=D}if(!B)break;if(t){var G=Math.max(B.lastIndexOf(o),B.lastIndexOf(g))+1;G>0&&(z=G,B=B.slice(0,z),C=this._getTextWidth(B))}if(this._addTextLine(B,C),d=Math.max(d,C),n+=e,!q||j&&n+e>m)break;if(x=x.slice(z),x.length>0&&(y=this._getTextWidth(x),l>=y)){this._addTextLine(x,y),n+=e,d=Math.max(d,y);break}}else this._addTextLine(x,y),n+=e,d=Math.max(d,y);if(j&&n+e>m)break}v.restore(),this.textHeight=b,this.textWidth=d}},Kinetic.Util.extend(Kinetic.Text,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontFamily","Arial"),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontSize",12),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontStyle",m),Kinetic.Factory.addGetterSetter(Kinetic.Text,"fontVariant",m),Kinetic.Factory.addGetterSetter(Kinetic.Text,"padding",0),Kinetic.Factory.addGetterSetter(Kinetic.Text,"align",i),Kinetic.Factory.addGetterSetter(Kinetic.Text,"lineHeight",1),Kinetic.Factory.addGetterSetter(Kinetic.Text,"wrap",q),Kinetic.Factory.addGetter(Kinetic.Text,"text",h),Kinetic.Factory.addOverloadedGetterSetter(Kinetic.Text,"text"),Kinetic.Collection.mapMethods(Kinetic.Text)}(),function(){Kinetic.Line=function(a){this.___init(a)},Kinetic.Line.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Line",this.on("pointsChange.kinetic tensionChange.kinetic closedChange.kinetic",function(){this._clearCache("tensionPoints")}),this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b,c,d,e=this.getPoints(),f=e.length,g=this.getTension(),h=this.getClosed();if(f){if(a.beginPath(),a.moveTo(e[0],e[1]),0!==g&&f>4){for(b=this.getTensionPoints(),c=b.length,d=h?0:4,h||a.quadraticCurveTo(b[0],b[1],b[2],b[3]);c-2>d;)a.bezierCurveTo(b[d++],b[d++],b[d++],b[d++],b[d++],b[d++]);h||a.quadraticCurveTo(b[c-2],b[c-1],e[f-2],e[f-1])}else for(d=2;f>d;d+=2)a.lineTo(e[d],e[d+1]);h?(a.closePath(),a.fillStrokeShape(this)):a.strokeShape(this)}},getTensionPoints:function(){return this._getCache("tensionPoints",this._getTensionPoints)},_getTensionPoints:function(){return this.getClosed()?this._getTensionPointsClosed():Kinetic.Util._expandPoints(this.getPoints(),this.getTension())},_getTensionPointsClosed:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=Kinetic.Util,e=d._getControlPoints(a[b-2],a[b-1],a[0],a[1],a[2],a[3],c),f=d._getControlPoints(a[b-4],a[b-3],a[b-2],a[b-1],a[0],a[1],c),g=Kinetic.Util._expandPoints(a,c),h=[e[2],e[3]].concat(g).concat([f[0],f[1],a[b-2],a[b-1],f[2],f[3],e[0],e[1],a[0],a[1]]);return h}},Kinetic.Util.extend(Kinetic.Line,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Line,"closed",!1),Kinetic.Factory.addGetterSetter(Kinetic.Line,"tension",0),Kinetic.Factory.addGetterSetter(Kinetic.Line,"points",[]),Kinetic.Collection.mapMethods(Kinetic.Line)}(),function(){Kinetic.Sprite=function(a){this.___init(a)},Kinetic.Sprite.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Sprite",this._updated=!0;var b=this;this.anim=new Kinetic.Animation(function(){var a=b._updated;return b._updated=!1,a}),this.on("animationChange.kinetic",function(){this.frameIndex(0)}),this.on("frameIndexChange.kinetic",function(){this._updated=!0}),this.on("frameRateChange.kinetic",function(){this.anim.isRunning()&&(clearInterval(this.interval),this._setInterval())}),this.sceneFunc(this._sceneFunc),this.hitFunc(this._hitFunc)},_sceneFunc:function(a){var b=this.getAnimation(),c=this.frameIndex(),d=4*c,e=this.getAnimations()[b],f=this.frameOffsets(),g=e[d+0],h=e[d+1],i=e[d+2],j=e[d+3],k=this.getImage();if(k)if(f){var l=f[b],m=2*c;a.drawImage(k,g,h,i,j,l[m+0],l[m+1],i,j)}else a.drawImage(k,g,h,i,j,0,0,i,j)},_hitFunc:function(a){var b=this.getAnimation(),c=this.frameIndex(),d=4*c,e=this.getAnimations()[b],f=this.frameOffsets(),g=e[d+2],h=e[d+3];if(a.beginPath(),f){var i=f[b],j=2*c;a.rect(i[j+0],i[j+1],g,h)}else a.rect(0,0,g,h);a.closePath(),a.fillShape(this)},_useBufferCanvas:function(){return(this.hasShadow()||1!==this.getAbsoluteOpacity())&&this.hasStroke()},_setInterval:function(){var a=this;this.interval=setInterval(function(){a._updateIndex()},1e3/this.getFrameRate())},start:function(){var a=this.getLayer();this.anim.setLayers(a),this._setInterval(),this.anim.start()},stop:function(){this.anim.stop(),clearInterval(this.interval)},isRunning:function(){return this.anim.isRunning()},_updateIndex:function(){var a=this.frameIndex(),b=this.getAnimation(),c=this.getAnimations(),d=c[b],e=d.length/4;this.frameIndex(e-1>a?a+1:0)}},Kinetic.Util.extend(Kinetic.Sprite,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"animation"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"animations"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"frameOffsets"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"image"),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"frameIndex",0),Kinetic.Factory.addGetterSetter(Kinetic.Sprite,"frameRate",17),Kinetic.Factory.backCompat(Kinetic.Sprite,{index:"frameIndex",getIndex:"getFrameIndex",setIndex:"setFrameIndex"}),Kinetic.Collection.mapMethods(Kinetic.Sprite)}(),function(){Kinetic.Path=function(a){this.___init(a)},Kinetic.Path.prototype={___init:function(a){this.dataArray=[];var b=this;Kinetic.Shape.call(this,a),this.className="Path",this.dataArray=Kinetic.Path.parsePathData(this.getData()),this.on("dataChange.kinetic",function(){b.dataArray=Kinetic.Path.parsePathData(this.getData())}),this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.dataArray,c=!1;a.beginPath();for(var d=0;d<b.length;d++){var e=b[d].command,f=b[d].points;switch(e){case"L":a.lineTo(f[0],f[1]);break;case"M":a.moveTo(f[0],f[1]);break;case"C":a.bezierCurveTo(f[0],f[1],f[2],f[3],f[4],f[5]);break;case"Q":a.quadraticCurveTo(f[0],f[1],f[2],f[3]);break;case"A":var g=f[0],h=f[1],i=f[2],j=f[3],k=f[4],l=f[5],m=f[6],n=f[7],o=i>j?i:j,p=i>j?1:i/j,q=i>j?j/i:1;a.translate(g,h),a.rotate(m),a.scale(p,q),a.arc(0,0,o,k,k+l,1-n),a.scale(1/p,1/q),a.rotate(-m),a.translate(-g,-h);break;case"z":a.closePath(),c=!0}}c?a.fillStrokeShape(this):a.strokeShape(this)}},Kinetic.Util.extend(Kinetic.Path,Kinetic.Shape),Kinetic.Path.getLineLength=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},Kinetic.Path.getPointOnLine=function(a,b,c,d,e,f,g){void 0===f&&(f=b),void 0===g&&(g=c);var h=(e-c)/(d-b+1e-8),i=Math.sqrt(a*a/(1+h*h));b>d&&(i*=-1);var j,k=h*i;if(d===b)j={x:f,y:g+k};else if((g-c)/(f-b+1e-8)===h)j={x:f+i,y:g+k};else{var l,m,n=this.getLineLength(b,c,d,e);if(1e-8>n)return void 0;var o=(f-b)*(d-b)+(g-c)*(e-c);o/=n*n,l=b+o*(d-b),m=c+o*(e-c);var p=this.getLineLength(f,g,l,m),q=Math.sqrt(a*a-p*p);i=Math.sqrt(q*q/(1+h*h)),b>d&&(i*=-1),k=h*i,j={x:l+i,y:m+k}}return j},Kinetic.Path.getPointOnCubicBezier=function(a,b,c,d,e,f,g,h,i){function j(a){return a*a*a}function k(a){return 3*a*a*(1-a)}function l(a){return 3*a*(1-a)*(1-a)}function m(a){return(1-a)*(1-a)*(1-a)}var n=h*j(a)+f*k(a)+d*l(a)+b*m(a),o=i*j(a)+g*k(a)+e*l(a)+c*m(a);return{x:n,y:o}},Kinetic.Path.getPointOnQuadraticBezier=function(a,b,c,d,e,f,g){function h(a){return a*a}function i(a){return 2*a*(1-a)}function j(a){return(1-a)*(1-a)}var k=f*h(a)+d*i(a)+b*j(a),l=g*h(a)+e*i(a)+c*j(a);return{x:k,y:l}},Kinetic.Path.getPointOnEllipticalArc=function(a,b,c,d,e,f){var g=Math.cos(f),h=Math.sin(f),i={x:c*Math.cos(e),y:d*Math.sin(e)};return{x:a+(i.x*g-i.y*h),y:b+(i.x*h+i.y*g)}},Kinetic.Path.parsePathData=function(a){if(!a)return[];var b=a,c=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"];b=b.replace(new RegExp(" ","g"),",");for(var d=0;d<c.length;d++)b=b.replace(new RegExp(c[d],"g"),"|"+c[d]);var e=b.split("|"),f=[],g=0,h=0;for(d=1;d<e.length;d++){var i=e[d],j=i.charAt(0);i=i.slice(1),i=i.replace(new RegExp(",-","g"),"-"),i=i.replace(new RegExp("-","g"),",-"),i=i.replace(new RegExp("e,-","g"),"e-");var k=i.split(",");k.length>0&&""===k[0]&&k.shift();for(var l=0;l<k.length;l++)k[l]=parseFloat(k[l]);for(;k.length>0&&!isNaN(k[0]);){var m,n,o,p,q,r,s,t,u,v,w=null,x=[],y=g,z=h;switch(j){case"l":g+=k.shift(),h+=k.shift(),w="L",x.push(g,h);break;case"L":g=k.shift(),h=k.shift(),x.push(g,h);break;case"m":var A=k.shift(),B=k.shift();if(g+=A,h+=B,w="M",f.length>2&&"z"===f[f.length-1].command)for(var C=f.length-2;C>=0;C--)if("M"===f[C].command){g=f[C].points[0]+A,h=f[C].points[1]+B;break}x.push(g,h),j="l";break;case"M":g=k.shift(),h=k.shift(),w="M",x.push(g,h),j="L";break;case"h":g+=k.shift(),w="L",x.push(g,h);break;case"H":g=k.shift(),w="L",x.push(g,h);break;case"v":h+=k.shift(),w="L",x.push(g,h);break;case"V":h=k.shift(),w="L",x.push(g,h);break;case"C":x.push(k.shift(),k.shift(),k.shift(),k.shift()),g=k.shift(),h=k.shift(),x.push(g,h);break;case"c":x.push(g+k.shift(),h+k.shift(),g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),w="C",x.push(g,h);break;case"S":n=g,o=h,m=f[f.length-1],"C"===m.command&&(n=g+(g-m.points[2]),o=h+(h-m.points[3])),x.push(n,o,k.shift(),k.shift()),g=k.shift(),h=k.shift(),w="C",x.push(g,h);break;case"s":n=g,o=h,m=f[f.length-1],"C"===m.command&&(n=g+(g-m.points[2]),o=h+(h-m.points[3])),x.push(n,o,g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),w="C",x.push(g,h);break;case"Q":x.push(k.shift(),k.shift()),g=k.shift(),h=k.shift(),x.push(g,h);break;case"q":x.push(g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),w="Q",x.push(g,h);break;case"T":n=g,o=h,m=f[f.length-1],"Q"===m.command&&(n=g+(g-m.points[0]),o=h+(h-m.points[1])),g=k.shift(),h=k.shift(),w="Q",x.push(n,o,g,h);break;case"t":n=g,o=h,m=f[f.length-1],"Q"===m.command&&(n=g+(g-m.points[0]),o=h+(h-m.points[1])),g+=k.shift(),h+=k.shift(),w="Q",x.push(n,o,g,h);break;case"A":p=k.shift(),q=k.shift(),r=k.shift(),s=k.shift(),t=k.shift(),u=g,v=h,g=k.shift(),h=k.shift(),w="A",x=this.convertEndpointToCenterParameterization(u,v,g,h,s,t,p,q,r);break;case"a":p=k.shift(),q=k.shift(),r=k.shift(),s=k.shift(),t=k.shift(),u=g,v=h,g+=k.shift(),h+=k.shift(),w="A",x=this.convertEndpointToCenterParameterization(u,v,g,h,s,t,p,q,r)}f.push({command:w||j,points:x,start:{x:y,y:z},pathLength:this.calcLength(y,z,w||j,x)})}("z"===j||"Z"===j)&&f.push({command:"z",points:[],start:void 0,pathLength:0})}return f},Kinetic.Path.calcLength=function(a,b,c,d){var e,f,g,h,i=Kinetic.Path;switch(c){case"L":return i.getLineLength(a,b,d[0],d[1]);case"C":for(e=0,f=i.getPointOnCubicBezier(0,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),h=.01;1>=h;h+=.01)g=i.getPointOnCubicBezier(h,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"Q":for(e=0,f=i.getPointOnQuadraticBezier(0,a,b,d[0],d[1],d[2],d[3]),h=.01;1>=h;h+=.01)g=i.getPointOnQuadraticBezier(h,a,b,d[0],d[1],d[2],d[3]),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"A":e=0;var j=d[4],k=d[5],l=d[4]+k,m=Math.PI/180;if(Math.abs(j-l)<m&&(m=Math.abs(j-l)),f=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],j,0),0>k)for(h=j-m;h>l;h-=m)g=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],h,0),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;else for(h=j+m;l>h;h+=m)g=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],h,0),e+=i.getLineLength(f.x,f.y,g.x,g.y),f=g;return g=i.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],l,0),e+=i.getLineLength(f.x,f.y,g.x,g.y)}return 0},Kinetic.Path.convertEndpointToCenterParameterization=function(a,b,c,d,e,f,g,h,i){var j=i*(Math.PI/180),k=Math.cos(j)*(a-c)/2+Math.sin(j)*(b-d)/2,l=-1*Math.sin(j)*(a-c)/2+Math.cos(j)*(b-d)/2,m=k*k/(g*g)+l*l/(h*h);m>1&&(g*=Math.sqrt(m),h*=Math.sqrt(m));var n=Math.sqrt((g*g*h*h-g*g*l*l-h*h*k*k)/(g*g*l*l+h*h*k*k));e===f&&(n*=-1),isNaN(n)&&(n=0);var o=n*g*l/h,p=n*-h*k/g,q=(a+c)/2+Math.cos(j)*o-Math.sin(j)*p,r=(b+d)/2+Math.sin(j)*o+Math.cos(j)*p,s=function(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1])},t=function(a,b){return(a[0]*b[0]+a[1]*b[1])/(s(a)*s(b))},u=function(a,b){return(a[0]*b[1]<a[1]*b[0]?-1:1)*Math.acos(t(a,b))},v=u([1,0],[(k-o)/g,(l-p)/h]),w=[(k-o)/g,(l-p)/h],x=[(-1*k-o)/g,(-1*l-p)/h],y=u(w,x);return t(w,x)<=-1&&(y=Math.PI),t(w,x)>=1&&(y=0),0===f&&y>0&&(y-=2*Math.PI),1===f&&0>y&&(y+=2*Math.PI),[q,r,g,h,v,y,j,f]},Kinetic.Factory.addGetterSetter(Kinetic.Path,"data"),Kinetic.Collection.mapMethods(Kinetic.Path)}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}var c="",d="normal";Kinetic.TextPath=function(a){this.___init(a)},Kinetic.TextPath.prototype={___init:function(c){var d=this;this.dummyCanvas=Kinetic.Util.createCanvasElement(),this.dataArray=[],Kinetic.Shape.call(this,c),this._fillFunc=a,this._strokeFunc=b,this._fillFuncHit=a,this._strokeFuncHit=b,this.className="TextPath",this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange.kinetic",function(){d.dataArray=Kinetic.Path.parsePathData(this.attrs.data)}),this.on("textChange.kinetic textStroke.kinetic textStrokeWidth.kinetic",d._setTextData),d._setTextData(),this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){a.setAttr("font",this._getContextFont()),a.setAttr("textBaseline","middle"),a.setAttr("textAlign","left"),a.save();for(var b=this.glyphInfo,c=0;c<b.length;c++){a.save();var d=b[c].p0;a.translate(d.x,d.y),a.rotate(b[c].rotation),this.partialText=b[c].text,a.fillStrokeShape(this),a.restore()}a.restore()},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},setText:function(a){Kinetic.Text.prototype.setText.call(this,a)},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext("2d");c.save(),c.font=this._getContextFont();var d=c.measureText(a);return c.restore(),{width:d.width,height:parseInt(this.attrs.fontSize,10)}},_setTextData:function(){var a=this,b=this._getTextSize(this.attrs.text);this.textWidth=b.width,this.textHeight=b.height,this.glyphInfo=[];for(var c,d,e,f=this.attrs.text.split(""),g=-1,h=0,i=function(){h=0;for(var b=a.dataArray,d=g+1;d<b.length;d++){if(b[d].pathLength>0)return g=d,b[d];"M"==b[d].command&&(c={x:b[d].points[0],y:b[d].points[1]})}return{}},j=function(b){var f=a._getTextSize(b).width,g=0,j=0;for(d=void 0;Math.abs(f-g)/f>.01&&25>j;){j++;for(var k=g;void 0===e;)e=i(),e&&k+e.pathLength<f&&(k+=e.pathLength,e=void 0);if(e==={}||void 0===c)return void 0;var l=!1;switch(e.command){case"L":Kinetic.Path.getLineLength(c.x,c.y,e.points[0],e.points[1])>f?d=Kinetic.Path.getPointOnLine(f,c.x,c.y,e.points[0],e.points[1],c.x,c.y):e=void 0;break;case"A":var m=e.points[4],n=e.points[5],o=e.points[4]+n;0===h?h=m+1e-8:f>g?h+=Math.PI/180*n/Math.abs(n):h-=Math.PI/360*n/Math.abs(n),(0>n&&o>h||n>=0&&h>o)&&(h=o,l=!0),d=Kinetic.Path.getPointOnEllipticalArc(e.points[0],e.points[1],e.points[2],e.points[3],h,e.points[6]);break;case"C":0===h?h=f>e.pathLength?1e-8:f/e.pathLength:f>g?h+=(f-g)/e.pathLength:h-=(g-f)/e.pathLength,h>1&&(h=1,l=!0),d=Kinetic.Path.getPointOnCubicBezier(h,e.start.x,e.start.y,e.points[0],e.points[1],e.points[2],e.points[3],e.points[4],e.points[5]);break;case"Q":0===h?h=f/e.pathLength:f>g?h+=(f-g)/e.pathLength:h-=(g-f)/e.pathLength,h>1&&(h=1,l=!0),d=Kinetic.Path.getPointOnQuadraticBezier(h,e.start.x,e.start.y,e.points[0],e.points[1],e.points[2],e.points[3])}void 0!==d&&(g=Kinetic.Path.getLineLength(c.x,c.y,d.x,d.y)),l&&(l=!1,e=void 0)}},k=0;k<f.length&&(j(f[k]),void 0!==c&&void 0!==d);k++){var l=Kinetic.Path.getLineLength(c.x,c.y,d.x,d.y),m=0,n=Kinetic.Path.getPointOnLine(m+l/2,c.x,c.y,d.x,d.y),o=Math.atan2(d.y-c.y,d.x-c.x);this.glyphInfo.push({transposeX:n.x,transposeY:n.y,text:f[k],rotation:o,p0:c,p1:d}),c=d}}},Kinetic.TextPath.prototype._getContextFont=Kinetic.Text.prototype._getContextFont,Kinetic.Util.extend(Kinetic.TextPath,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontFamily","Arial"),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontSize",12),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontStyle",d),Kinetic.Factory.addGetterSetter(Kinetic.TextPath,"fontVariant",d),Kinetic.Factory.addGetter(Kinetic.TextPath,"text",c),Kinetic.Collection.mapMethods(Kinetic.TextPath)}(),function(){Kinetic.RegularPolygon=function(a){this.___init(a)},Kinetic.RegularPolygon.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="RegularPolygon",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b,c,d,e=this.attrs.sides,f=this.attrs.radius;for(a.beginPath(),a.moveTo(0,0-f),b=1;e>b;b++)c=f*Math.sin(2*b*Math.PI/e),d=-1*f*Math.cos(2*b*Math.PI/e),a.lineTo(c,d);a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.RegularPolygon,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon,"radius",0),Kinetic.Factory.addGetterSetter(Kinetic.RegularPolygon,"sides",0),Kinetic.Collection.mapMethods(Kinetic.RegularPolygon)}(),function(){Kinetic.Star=function(a){this.___init(a)},Kinetic.Star.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Star",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.innerRadius(),c=this.outerRadius(),d=this.numPoints();a.beginPath(),a.moveTo(0,0-c);for(var e=1;2*d>e;e++){var f=e%2===0?c:b,g=f*Math.sin(e*Math.PI/d),h=-1*f*Math.cos(e*Math.PI/d);a.lineTo(g,h)}a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Star,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Star,"numPoints",5),Kinetic.Factory.addGetterSetter(Kinetic.Star,"innerRadius",0),Kinetic.Factory.addGetterSetter(Kinetic.Star,"outerRadius",0),Kinetic.Collection.mapMethods(Kinetic.Star)}(),function(){var a=["fontFamily","fontSize","fontStyle","padding","lineHeight","text"],b="Change.kinetic",c="none",d="up",e="right",f="down",g="left",h="Label",i=a.length;Kinetic.Label=function(a){this.____init(a)},Kinetic.Label.prototype={____init:function(a){var b=this;Kinetic.Group.call(this,a),this.className=h,this.on("add.kinetic",function(a){b._addListeners(a.child),b._sync()})},getText:function(){return this.find("Text")[0]},getTag:function(){return this.find("Tag")[0]},_addListeners:function(c){var d,e=this,f=function(){e._sync()};for(d=0;i>d;d++)c.on(a[d]+b,f)},getWidth:function(){return this.getText().getWidth()},getHeight:function(){return this.getText().getHeight()},_sync:function(){var a,b,c,h,i,j,k,l=this.getText(),m=this.getTag();if(l&&m){switch(a=l.getWidth(),b=l.getHeight(),c=m.getPointerDirection(),h=m.getPointerWidth(),k=m.getPointerHeight(),i=0,j=0,c){case d:i=a/2,j=-1*k;break;case e:i=a+h,j=b/2;break;case f:i=a/2,j=b+k;break;case g:i=-1*h,j=b/2}m.setAttrs({x:-1*i,y:-1*j,width:a,height:b}),l.setAttrs({x:-1*i,y:-1*j})}}},Kinetic.Util.extend(Kinetic.Label,Kinetic.Group),Kinetic.Collection.mapMethods(Kinetic.Label),Kinetic.Tag=function(a){this.___init(a)},Kinetic.Tag.prototype={___init:function(a){Kinetic.Shape.call(this,a),this.className="Tag",this.sceneFunc(this._sceneFunc)},_sceneFunc:function(a){var b=this.getWidth(),c=this.getHeight(),h=this.getPointerDirection(),i=this.getPointerWidth(),j=this.getPointerHeight(),k=this.getCornerRadius();a.beginPath(),a.moveTo(0,0),h===d&&(a.lineTo((b-i)/2,0),a.lineTo(b/2,-1*j),a.lineTo((b+i)/2,0)),k?(a.lineTo(b-k,0),a.arc(b-k,k,k,3*Math.PI/2,0,!1)):a.lineTo(b,0),h===e&&(a.lineTo(b,(c-j)/2),a.lineTo(b+i,c/2),a.lineTo(b,(c+j)/2)),k?(a.lineTo(b,c-k),a.arc(b-k,c-k,k,0,Math.PI/2,!1)):a.lineTo(b,c),h===f&&(a.lineTo((b+i)/2,c),a.lineTo(b/2,c+j),a.lineTo((b-i)/2,c)),k?(a.lineTo(k,c),a.arc(k,c-k,k,Math.PI/2,Math.PI,!1)):a.lineTo(0,c),h===g&&(a.lineTo(0,(c+j)/2),a.lineTo(-1*i,c/2),a.lineTo(0,(c-j)/2)),k&&(a.lineTo(0,k),a.arc(k,k,k,Math.PI,3*Math.PI/2,!1)),a.closePath(),a.fillStrokeShape(this)}},Kinetic.Util.extend(Kinetic.Tag,Kinetic.Shape),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"pointerDirection",c),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"pointerWidth",0),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"pointerHeight",0),Kinetic.Factory.addGetterSetter(Kinetic.Tag,"cornerRadius",0),Kinetic.Collection.mapMethods(Kinetic.Tag)}(),function(){Kinetic.Arrow=function(a){this.____init(a)},Kinetic.Arrow.prototype={____init:function(a){Kinetic.Line.call(this,a),this.className="Arrow"},_sceneFunc:function(a){var b=2*Math.PI,c=this.points(),d=c.length,e=c[d-2]-c[d-4],f=c[d-1]-c[d-3],g=(Math.atan2(f,e)+b)%b,h=this.pointerLength(),i=this.pointerWidth();a.save(),a.beginPath(),a.translate(c[d-2],c[d-1]),a.rotate(g),a.moveTo(0,0),a.lineTo(-h,i/2),a.lineTo(-h,-i/2),a.closePath(),a.restore(),this.pointerAtBeginning()&&(a.save(),a.translate(c[0],c[1]),e=c[2]-c[0],f=c[3]-c[1],a.rotate((Math.atan2(-f,-e)+b)%b),a.moveTo(0,0),a.lineTo(-10,6),a.lineTo(-10,-6),a.closePath(),a.restore()),a.fillStrokeShape(this),Kinetic.Line.prototype._sceneFunc.apply(this,arguments)}},Kinetic.Util.extend(Kinetic.Arrow,Kinetic.Line),Kinetic.Factory.addGetterSetter(Kinetic.Arrow,"pointerLength",10),Kinetic.Factory.addGetterSetter(Kinetic.Arrow,"pointerWidth",10),Kinetic.Factory.addGetterSetter(Kinetic.Arrow,"pointerAtBeginning",!1),Kinetic.Collection.mapMethods(Kinetic.Arrow)}();;/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});