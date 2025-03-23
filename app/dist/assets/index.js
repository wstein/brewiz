(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function l(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=l(s);fetch(s.href,n)}})();const be=!1,me=(e,t)=>e===t,pe=Symbol("solid-track"),W={equals:me};let ae=ue;const N=1,G=2,ie={owned:null,cleanups:null,context:null,owner:null};var _=null;let Z=null,ve=null,y=null,A=null,I=null,Y=0;function z(e,t){const l=y,r=_,s=e.length===0,n=t===void 0?r:t,i=s?ie:{owned:null,cleanups:null,context:n?n.context:null,owner:n},a=s?e:()=>e(()=>U(()=>M(i)));_=i,y=null;try{return H(a,!0)}finally{y=l,_=r}}function L(e,t){t=t?Object.assign({},W,t):W;const l={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},r=s=>(typeof s=="function"&&(s=s(l.value)),ce(l,s));return[oe.bind(l),r]}function j(e,t,l){const r=te(e,t,!1,N);V(r)}function we(e,t,l){ae=_e;const r=te(e,t,!1,N);r.user=!0,I?I.push(r):V(r)}function T(e,t,l){l=l?Object.assign({},W,l):W;const r=te(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=l.equals||void 0,V(r),oe.bind(r)}function U(e){if(y===null)return e();const t=y;y=null;try{return e()}finally{y=t}}function $e(e){we(()=>U(e))}function xe(e){return _===null||(_.cleanups===null?_.cleanups=[e]:_.cleanups.push(e)),e}function oe(){if(this.sources&&this.state)if(this.state===N)V(this);else{const e=A;A=null,H(()=>q(this),!1),A=e}if(y){const e=this.observers?this.observers.length:0;y.sources?(y.sources.push(this),y.sourceSlots.push(e)):(y.sources=[this],y.sourceSlots=[e]),this.observers?(this.observers.push(y),this.observerSlots.push(y.sources.length-1)):(this.observers=[y],this.observerSlots=[y.sources.length-1])}return this.value}function ce(e,t,l){let r=e.value;return(!e.comparator||!e.comparator(r,t))&&(e.value=t,e.observers&&e.observers.length&&H(()=>{for(let s=0;s<e.observers.length;s+=1){const n=e.observers[s],i=Z&&Z.running;i&&Z.disposed.has(n),(i?!n.tState:!n.state)&&(n.pure?A.push(n):I.push(n),n.observers&&fe(n)),i||(n.state=N)}if(A.length>1e6)throw A=[],new Error},!1)),t}function V(e){if(!e.fn)return;M(e);const t=Y;ke(e,e.value,t)}function ke(e,t,l){let r;const s=_,n=y;y=_=e;try{r=e.fn(t)}catch(i){return e.pure&&(e.state=N,e.owned&&e.owned.forEach(M),e.owned=null),e.updatedAt=l+1,de(i)}finally{y=n,_=s}(!e.updatedAt||e.updatedAt<=l)&&(e.updatedAt!=null&&"observers"in e?ce(e,r):e.value=r,e.updatedAt=l)}function te(e,t,l,r=N,s){const n={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:_,context:_?_.context:null,pure:l};return _===null||_!==ie&&(_.owned?_.owned.push(n):_.owned=[n]),n}function K(e){if(e.state===0)return;if(e.state===G)return q(e);if(e.suspense&&U(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<Y);)e.state&&t.push(e);for(let l=t.length-1;l>=0;l--)if(e=t[l],e.state===N)V(e);else if(e.state===G){const r=A;A=null,H(()=>q(e,t[0]),!1),A=r}}function H(e,t){if(A)return e();let l=!1;t||(A=[]),I?l=!0:I=[],Y++;try{const r=e();return ye(l),r}catch(r){l||(I=null),A=null,de(r)}}function ye(e){if(A&&(ue(A),A=null),e)return;const t=I;I=null,t.length&&H(()=>ae(t),!1)}function ue(e){for(let t=0;t<e.length;t++)K(e[t])}function _e(e){let t,l=0;for(t=0;t<e.length;t++){const r=e[t];r.user?e[l++]=r:K(r)}for(t=0;t<l;t++)K(e[t])}function q(e,t){e.state=0;for(let l=0;l<e.sources.length;l+=1){const r=e.sources[l];if(r.sources){const s=r.state;s===N?r!==t&&(!r.updatedAt||r.updatedAt<Y)&&K(r):s===G&&q(r,t)}}}function fe(e){for(let t=0;t<e.observers.length;t+=1){const l=e.observers[t];l.state||(l.state=G,l.pure?A.push(l):I.push(l),l.observers&&fe(l))}}function M(e){let t;if(e.sources)for(;e.sources.length;){const l=e.sources.pop(),r=e.sourceSlots.pop(),s=l.observers;if(s&&s.length){const n=s.pop(),i=l.observerSlots.pop();r<s.length&&(n.sourceSlots[i]=r,s[r]=n,l.observerSlots[r]=i)}}if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)M(e.tOwned[t]);delete e.tOwned}if(e.owned){for(t=e.owned.length-1;t>=0;t--)M(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}e.state=0}function Ce(e){return e instanceof Error?e:new Error(typeof e=="string"?e:"Unknown error",{cause:e})}function de(e,t=_){throw Ce(e)}const Se=Symbol("fallback");function ne(e){for(let t=0;t<e.length;t++)e[t]()}function Pe(e,t,l={}){let r=[],s=[],n=[],i=0,a=t.length>1?[]:null;return xe(()=>ne(n)),()=>{let c=e()||[],u=c.length,g,o;return c[pe],U(()=>{let $,k,b,E,F,C,P,p,x;if(u===0)i!==0&&(ne(n),n=[],r=[],s=[],i=0,a&&(a=[])),l.fallback&&(r=[Se],s[0]=z(h=>(n[0]=h,l.fallback())),i=1);else if(i===0){for(s=new Array(u),o=0;o<u;o++)r[o]=c[o],s[o]=z(w);i=u}else{for(b=new Array(u),E=new Array(u),a&&(F=new Array(u)),C=0,P=Math.min(i,u);C<P&&r[C]===c[C];C++);for(P=i-1,p=u-1;P>=C&&p>=C&&r[P]===c[p];P--,p--)b[p]=s[P],E[p]=n[P],a&&(F[p]=a[P]);for($=new Map,k=new Array(p+1),o=p;o>=C;o--)x=c[o],g=$.get(x),k[o]=g===void 0?-1:g,$.set(x,o);for(g=C;g<=P;g++)x=r[g],o=$.get(x),o!==void 0&&o!==-1?(b[o]=s[g],E[o]=n[g],a&&(F[o]=a[g]),o=k[o],$.set(x,o)):n[g]();for(o=C;o<u;o++)o in b?(s[o]=b[o],n[o]=E[o],a&&(a[o]=F[o],a[o](o))):s[o]=z(w);s=s.slice(0,i=u),r=c.slice(0)}return s});function w($){if(n[o]=$,a){const[k,b]=L(o);return a[o]=b,t(c[o],k)}return t(c[o])}}}function S(e,t){return U(()=>e(t||{}))}function ge(e){const t="fallback"in e&&{fallback:()=>e.fallback};return T(Pe(()=>e.each,e.children,t||void 0))}function Ae(e,t,l){let r=l.length,s=t.length,n=r,i=0,a=0,c=t[s-1].nextSibling,u=null;for(;i<s||a<n;){if(t[i]===l[a]){i++,a++;continue}for(;t[s-1]===l[n-1];)s--,n--;if(s===i){const g=n<r?a?l[a-1].nextSibling:l[n-a]:c;for(;a<n;)e.insertBefore(l[a++],g)}else if(n===a)for(;i<s;)(!u||!u.has(t[i]))&&t[i].remove(),i++;else if(t[i]===l[n-1]&&l[a]===t[s-1]){const g=t[--s].nextSibling;e.insertBefore(l[a++],t[i++].nextSibling),e.insertBefore(l[--n],g),t[s]=l[n]}else{if(!u){u=new Map;let o=a;for(;o<n;)u.set(l[o],o++)}const g=u.get(t[i]);if(g!=null)if(a<g&&g<n){let o=i,w=1,$;for(;++o<s&&o<n&&!(($=u.get(t[o]))==null||$!==g+w);)w++;if(w>g-a){const k=t[i];for(;a<g;)e.insertBefore(l[a++],k)}else e.replaceChild(l[a++],t[i++])}else i++;else t[i++].remove()}}}const re="_$DX_DELEGATE";function Ee(e,t,l,r={}){let s;return z(n=>{s=n,t===document?e():f(t,e(),t.firstChild?null:void 0,l)},r.owner),()=>{s(),t.textContent=""}}function m(e,t,l,r){let s;const n=()=>{const a=document.createElement("template");return a.innerHTML=e,a.content.firstChild},i=()=>(s||(s=n())).cloneNode(!0);return i.cloneNode=i,i}function J(e,t=window.document){const l=t[re]||(t[re]=new Set);for(let r=0,s=e.length;r<s;r++){const n=e[r];l.has(n)||(l.add(n),t.addEventListener(n,Te))}}function he(e,t,l){l==null?e.removeAttribute(t):e.setAttribute(t,l)}function R(e,t){t==null?e.removeAttribute("class"):e.className=t}function Q(e,t,l,r){Array.isArray(l)?(e[`$$${t}`]=l[0],e[`$$${t}Data`]=l[1]):e[`$$${t}`]=l}function f(e,t,l,r){if(l!==void 0&&!r&&(r=[]),typeof t!="function")return X(e,t,r,l);j(s=>X(e,t(),s,l),r)}function Te(e){let t=e.target;const l=`$$${e.type}`,r=e.target,s=e.currentTarget,n=c=>Object.defineProperty(e,"target",{configurable:!0,value:c}),i=()=>{const c=t[l];if(c&&!t.disabled){const u=t[`${l}Data`];if(u!==void 0?c.call(t,u,e):c.call(t,e),e.cancelBubble)return}return t.host&&typeof t.host!="string"&&!t.host._$host&&t.contains(e.target)&&n(t.host),!0},a=()=>{for(;i()&&(t=t._$host||t.parentNode||t.host););};if(Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),e.composedPath){const c=e.composedPath();n(c[0]);for(let u=0;u<c.length-2&&(t=c[u],!!i());u++){if(t._$host){t=t._$host,a();break}if(t.parentNode===s)break}}else a();n(r)}function X(e,t,l,r,s){for(;typeof l=="function";)l=l();if(t===l)return l;const n=typeof t,i=r!==void 0;if(e=i&&l[0]&&l[0].parentNode||e,n==="string"||n==="number"){if(n==="number"&&(t=t.toString(),t===l))return l;if(i){let a=l[0];a&&a.nodeType===3?a.data!==t&&(a.data=t):a=document.createTextNode(t),l=O(e,l,r,a)}else l!==""&&typeof l=="string"?l=e.firstChild.data=t:l=e.textContent=t}else if(t==null||n==="boolean")l=O(e,l,r);else{if(n==="function")return j(()=>{let a=t();for(;typeof a=="function";)a=a();l=X(e,a,l,r)}),()=>l;if(Array.isArray(t)){const a=[],c=l&&Array.isArray(l);if(ee(a,t,l,s))return j(()=>l=X(e,a,l,r,!0)),()=>l;if(a.length===0){if(l=O(e,l,r),i)return l}else c?l.length===0?se(e,a,r):Ae(e,l,a):(l&&O(e),se(e,a));l=a}else if(t.nodeType){if(Array.isArray(l)){if(i)return l=O(e,l,r,t);O(e,l,null,t)}else l==null||l===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);l=t}}return l}function ee(e,t,l,r){let s=!1;for(let n=0,i=t.length;n<i;n++){let a=t[n],c=l&&l[e.length],u;if(!(a==null||a===!0||a===!1))if((u=typeof a)=="object"&&a.nodeType)e.push(a);else if(Array.isArray(a))s=ee(e,a,c)||s;else if(u==="function")if(r){for(;typeof a=="function";)a=a();s=ee(e,Array.isArray(a)?a:[a],Array.isArray(c)?c:[c])||s}else e.push(a),s=!0;else{const g=String(a);c&&c.nodeType===3&&c.data===g?e.push(c):e.push(document.createTextNode(g))}}return s}function se(e,t,l=null){for(let r=0,s=t.length;r<s;r++)e.insertBefore(t[r],l)}function O(e,t,l,r){if(l===void 0)return e.textContent="";const s=r||document.createTextNode("");if(t.length){let n=!1;for(let i=t.length-1;i>=0;i--){const a=t[i];if(s!==a){const c=a.parentNode===e;!n&&!i?c?e.replaceChild(s,a):e.insertBefore(s,l):c&&a.remove()}else n=!0}}else e.insertBefore(s,l);return[s]}function Fe(){const[e,t]=L(new Set),[l,r]=L([]),[s,n]=L(!0),[i,a]=L(null),[c,u]=L(!1),[g,o]=L(!1),[w,$]=L(null),k="/api/v1",b=async()=>{try{const d=await fetch("./fixtures/packages.json");if(!d.ok)throw new Error(`HTTP error! status: ${d.status}`);return await d.json()}catch(d){throw console.error("Error fetching packages data:",d),d}},E=async d=>{try{const v=await fetch(`${k}${d}`);if(!v.ok)throw new Error(`HTTP error! status: ${v.status}`);return await v.json()}catch(v){throw console.error(`Error fetching from ${d}:`,v),a(v.message),v}};return{packages:l,loading:s,error:i,refreshing:c,usingLocalData:g,selectedPackages:e,loadPackages:async()=>{try{n(!0),a(null);const d=await E("/packages");r(d),t(new Set),o(!1)}catch{console.warn("API not available, fetching from fixtures");try{const v=await b();r(v),o(!0)}catch(v){console.error("Failed to fetch packages data:",v),a("Failed to load packages data"),r([])}}finally{n(!1)}},refreshPackages:async()=>{try{u(!0),a(null);const d=await E("/reload");r(d),t(new Set),o(!1)}catch{console.warn("API not available, fetching from fixtures");try{const v=await b();r(v),o(!0)}catch(v){console.error("Failed to fetch packages data:",v),a("Failed to load packages data"),r([])}}finally{u(!1)}},resetSelection:()=>t(new Set),togglePackage:d=>{const v=new Set(e());v.has(d.name)?v.delete(d.name):v.add(d.name),t(v)},version:w,loadVersion:async()=>{try{const d=await E("/version");$(d)}catch(d){console.warn("Failed to fetch version info:",d),a("Failed to load version info")}},outdatedPackages:()=>l().flatMap(d=>d.packages).filter(d=>d.outdated)}}function Le(){const[e,t]=L(""),[l,r]=L({installed:!0,notInstalled:!0,outdated:!0,casks:!0,formulae:!0});return{searchTerm:e,setSearchTerm:t,filters:l,updateFilter:(i,a)=>{r(c=>{const u={...c,[i]:a};return i==="installed"&&a?u.outdated=!0:i==="outdated"&&!a?(u.installed=!1,u.notInstalled=!0):(i==="casks"||i==="formulae")&&!a&&(u[i==="casks"?"formulae":"casks"]=!0),!u.installed&&!u.notInstalled&&!u.outdated&&(u.installed=!0,u.outdated=!0),u})},resetFilters:()=>{r({installed:!0,notInstalled:!0,outdated:!0,casks:!0,formulae:!0}),t("")}}}var Ie=m('<div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50"><div class="max-w-[1800px] min-w-[1200px] mx-auto px-3 py-2"><div class="flex justify-between items-center"><div class="flex items-start gap-3"><a href=https://brew.sh target=_blank rel="noopener noreferrer"><img src=https://upload.wikimedia.org/wikipedia/commons/9/95/Homebrew_logo.svg alt="Homebrew logo"class="w-16 h-16"></a><div><h1 class="text-2xl font-bold text-center"><a href=https://github.com/wstein/brewiz target=_blank rel="noopener noreferrer"class="hover:text-gray-700 hover:underline">Homebrew Package Wizard</a></h1><p class="text-gray-600 text-sm">Select packages to install on your macOS system</p></div></div><div class="flex flex-col gap-1"><div class="relative max-w-[475px]"><input type=text placeholder="Search packages..."class="w-full px-3 py-1 h-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div class="flex gap-3 flex-wrap"><div class="flex gap-2 bg-slate-100 border border-slate-300 p-1 rounded-lg"></div><div class="flex gap-2 bg-slate-100 border border-slate-300 p-1 rounded-lg"></div></div></div><div class="flex flex-col items-end gap-3"><div class="flex gap-2"><button title="Refresh package list">Refresh</button><button title="Clear selected packages"class="px-4 py-1.5 text-base rounded-lg bg-red-500 hover:bg-red-600 text-white">Reset</button><button title="Close Brewiz"class="px-4 py-1.5 text-base rounded-lg bg-gray-500 hover:bg-gray-600 text-white">Close</button></div><div class="text-xs text-gray-500"><span></span></div></div></div><div><div class=flex-grow>'),je=m("<span>"),Ne=m('<a target=_blank rel="noopener noreferrer"class="hover:text-gray-700 hover:underline">brewiz v'),Oe=m('<div class="flex items-center justify-center p-4"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500">'),Be=m('<div class="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 rounded-lg p-4"><h3 class=font-bold>Using local package data</h3><p class=text-sm>The API server is not available. Using built-in example data instead.'),De=m('<div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4"><h3 class="font-bold flex items-center">Refreshing brew data...</h3><p>Please wait while we refresh package information.'),Re=m("<button>");const B="0.9.9";function Me(e){const t=async()=>{try{await fetch("/api/v1/terminate",{method:"POST"}),window.close(),window.opener&&window.opener.close(),window.location.href="about:blank"}catch(l){console.error("Failed to terminate server:",l)}};return(()=>{var l=Ie(),r=l.firstChild,s=r.firstChild,n=s.firstChild,i=n.nextSibling,a=i.firstChild,c=a.firstChild,u=a.nextSibling,g=u.firstChild,o=g.nextSibling,w=i.nextSibling,$=w.firstChild,k=$.firstChild,b=k.firstChild,E=k.nextSibling,F=E.nextSibling,C=$.nextSibling,P=C.firstChild,p=s.nextSibling,x=p.firstChild;return c.$$input=h=>e.onSearch(h.target.value),f(g,S(D,{get active(){return e.filters().installed},onClick:()=>e.onFilterChange("installed"),label:"Installed"}),null),f(g,S(D,{get active(){return e.filters().notInstalled},onClick:()=>e.onFilterChange("notInstalled"),label:"Not Installed"}),null),f(g,S(D,{get active(){return e.filters().outdated},onClick:()=>e.onFilterChange("outdated"),label:"Outdated"}),null),f(o,S(D,{get active(){return e.filters().casks},onClick:()=>e.onFilterChange("casks"),label:"Casks"}),null),f(o,S(D,{get active(){return e.filters().formulae},onClick:()=>e.onFilterChange("formulae"),label:"Formulae"}),null),Q(k,"click",e.onRefresh),f(k,(()=>{var h=T(()=>!!(e.loading||e.refreshing));return()=>h()&&(()=>{var d=je();return j(()=>R(d,`inline-block w-3 h-3 border-2 border-t-transparent rounded-full ${e.loading||e.refreshing?"animate-spin border-white":"border-white/50"}`)),d})()})(),b),Q(E,"click",e.onReset),F.$$click=t,f(P,(()=>{var h=T(()=>{var d;return B===(((d=e==null?void 0:e.version)==null?void 0:d.brewiz)||B)});return()=>h()?(()=>{var d=Ne();return d.firstChild,he(d,"href",`https://github.com/wstein/brewiz/tree/v${B}`),f(d,B,null),d})():`brewiz v${e.version.brewiz} / app v${B}`})()),f(x,(()=>{var h=T(()=>!!e.loading);return()=>h()&&Oe()})(),null),f(x,(()=>{var h=T(()=>!!(e.usingLocalData&&!e.loading));return()=>h()&&Be()})(),null),f(x,(()=>{var h=T(()=>!!(e.refreshing&&!e.loading));return()=>h()&&De()})(),null),j(h=>{var d=e.loading||e.refreshing,v=`px-4 py-1.5 text-base rounded-lg flex items-center gap-2 ${e.loading||e.refreshing?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-500 hover:bg-blue-600 text-white"}`,le=`${e.loading||e.usingLocalData||e.refreshing?"mt-6 mb-2":"mt-1"} flex justify-between items-end`;return d!==h.e&&(k.disabled=h.e=d),v!==h.t&&R(k,h.t=v),le!==h.a&&R(p,h.a=le),h},{e:void 0,t:void 0,a:void 0}),j(()=>c.value=e.searchTerm()),l})()}function D(e){return(()=>{var t=Re();return Q(t,"click",e.onClick),f(t,()=>e.label),j(()=>R(t,`px-3 py-1 text-sm rounded-full transition-colors ${e.active?"bg-blue-500 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300"}`)),t})()}J(["input","click"]);var Ue=m('<div><div class="flex items-center justify-between"><div class="flex items-center gap-2"><h3 class="text-lg font-semibold"></h3></div><div class="flex gap-2"></div></div><p class="text-gray-600 mt-2 text-sm flex-grow">'),Ve=m('<span class=text-yellow-500 title=Recommended><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"fill=currentColor class="w-5 h-5"><path fill-rule=evenodd d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"clip-rule=evenodd>'),He=m('<a target=_blank rel="noopener noreferrer"class="text-blue-500 hover:text-blue-600 transition-colors"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor class="w-5 h-5"><path stroke-linecap=round stroke-linejoin=round d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25">'),ze=m('<span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full group relative">'),We=m('<span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">cask'),Ge=m('<div class="relative group cursor-help"><div class="text-gray-500 hover:text-gray-700"><svg xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor class="w-5 h-5"><path stroke-linecap=round stroke-linejoin=round d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg></div><div class="absolute z-50 hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 shadow-lg w-64 right-0 transform -translate-y-3/4"><div>'),Ke=m('<div class="mt-1 pt-1 border-t border-gray-600">'),qe=m("<div>Version: "),Qe=m("<b><i> → ");function Xe(e){return(()=>{var t=Ue(),l=t.firstChild,r=l.firstChild,s=r.firstChild,n=r.nextSibling,i=l.nextSibling;return t.$$click=()=>e.onToggle(e.pkg),f(s,()=>e.pkg.name),f(r,(()=>{var a=T(()=>!!e.pkg.recommended);return()=>a()&&Ve()})(),null),f(r,(()=>{var a=T(()=>!!e.pkg.homepage);return()=>a()&&(()=>{var c=He();return c.$$click=u=>u.stopPropagation(),j(()=>he(c,"href",e.pkg.homepage)),c})()})(),null),f(n,(()=>{var a=T(()=>!!e.pkg.tap);return()=>a()&&(()=>{var c=ze();return f(c,()=>e.pkg.tap.split("/")[0]),c})()})(),null),f(n,(()=>{var a=T(()=>!!e.pkg.cask);return()=>a()&&We()})(),null),f(n,(()=>{var a=T(()=>!!e.pkg.info);return()=>a()&&(()=>{var c=Ge(),u=c.firstChild,g=u.nextSibling,o=g.firstChild;return u.$$click=w=>w.stopPropagation(),f(o,()=>e.pkg.info,null),f(o,(()=>{var w=T(()=>!!(e.pkg.versions||e.pkg.tap));return()=>w()&&(()=>{var $=Ke();return f($,(()=>{var k=T(()=>!!e.pkg.versions);return()=>k()&&(()=>{var b=qe();return b.firstChild,f(b,()=>e.pkg.versions,null),f(b,(()=>{var E=T(()=>!!e.pkg.outdated);return()=>E()&&(()=>{var F=Qe(),C=F.firstChild;return C.firstChild,f(C,()=>e.pkg.latest_version,null),F})()})(),null),b})()})()),$})()})(),null),c})()})(),null),f(i,()=>e.pkg.desc),j(()=>R(t,`p-3 rounded-lg mb-1 cursor-pointer transition-all hover:transform hover:scale-[1.02] h-full flex flex-col ${e.selected?e.pkg.installed?"bg-red-200 border-2 border-red-400 hover:border-red-500 hover:shadow-sm":"bg-green-200 border-2 border-green-400 hover:border-green-500 hover:shadow-sm":e.pkg.installed?e.pkg.outdated?"bg-blue-300 border-2 border-blue-500 hover:border-blue-600 hover:shadow-sm":"bg-blue-100 border-2 border-blue-300 hover:border-blue-400 hover:shadow-sm":"bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm"}`)),t})()}J(["click"]);var Ye=m('<div class="bg-white rounded-lg shadow-sm overflow-visible"><div class="flex items-center justify-between cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 transition-colors"><div><h2 class="text-xl font-bold"></h2><p class="text-gray-600 text-sm"></p></div><span class="text-2xl text-gray-500">'),Je=m('<div class="p-4 overflow-visible"><div class="grid grid-cols-3 2xl:grid-cols-4 gap-3 overflow-visible">');function Ze(e){const[t,l]=L(!0);return(()=>{var r=Ye(),s=r.firstChild,n=s.firstChild,i=n.firstChild,a=i.nextSibling,c=n.nextSibling;return s.$$click=()=>l(!t()),f(i,()=>e.category.name),f(a,()=>e.category.desc),f(c,()=>t()?"−":"+"),f(r,(()=>{var u=T(()=>!!t());return()=>u()&&(()=>{var g=Je(),o=g.firstChild;return f(o,S(ge,{get each(){return e.category.packages},children:w=>S(Xe,{pkg:w,get selected(){return e.selectedPackages.has(w.name)},onToggle:()=>e.onPackageToggle(w)})})),g})()})(),null),r})()}J(["click"]);var et=m('<div class="max-w-[1800px] min-w-[1200px] mx-auto px-4 py-8 pb-64 mt-32"><div class=space-y-6>');function tt(e){return(()=>{var t=et(),l=t.firstChild;return f(l,S(ge,{get each(){return e.packages},children:r=>S(Ze,{category:r,get selectedPackages(){return e.selectedPackages},get onPackageToggle(){return e.onPackageToggle}})})),t})()}function lt(e,t,l){const r=e.flatMap(i=>i.packages),s=Array.from(t).map(i=>r.find(a=>a.name===i)).filter(Boolean),n=[];return s.length===0?n.push("# Select packages to generate install and uninstall commands"):(rt(n,s),st(n,s)),nt(n,l),n.push("brew cleanup # Consider to remove old versions and free disk space"),n}function nt(e,t){t.length>0&&e.push(`brew upgrade # You have ${t.length} outdated package${t.length>1?"s":""}`)}function rt(e,t){const l=t.filter(n=>!n.installed),r=l.filter(n=>n.cask).map(n=>n.tap?`${n.tap}/${n.token}`:n.token).sort(),s=l.filter(n=>!n.cask).map(n=>n.tap?`${n.tap}/${n.name}`:n.name).sort();s.length&&e.push(`brew install ${s.join(" ")}`),r.length&&e.push(`brew install --cask ${r.join(" ")}`)}function st(e,t){const l=t.filter(n=>n.installed),r=l.filter(n=>n.cask).map(n=>n.tap?`${n.tap}/${n.token}`:n.token).sort(),s=l.filter(n=>!n.cask).map(n=>n.tap?`${n.tap}/${n.name}`:n.name).sort();s.length&&e.push(`brew uninstall ${s.join(" ")}`),r.length&&e.push(`brew uninstall --cask ${r.join(" ")}`)}var at=m('<div class="fixed bottom-0 left-0 right-0 bg-[#282a36] text-[#f8f8f2] shadow-lg z-50"><div class="max-w-[1800px] min-w-[1200px] mx-auto px-4 py-4">'),it=m('<div class="flex justify-between items-center mb-2"><h3 class="text-lg font-semibold">Brew Commands:</h3><button title="Copy commands to clipboard"class="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm flex items-center gap-2 transition-colors">'),ot=m('<pre class="font-mono text-sm overflow-x-auto rounded bg-[#1e1f29] p-4">'),ct=m("<span class=text-[#fe4a56]><i><b>"),ut=m("<div><span class=text-[#50fa7b]>brew</span> <span class=text-[#ff79c6]></span> <span class=text-[#f1fa8c]></span><span class=text-[#fe4a56]><i><b>"),ft=m("<div><span class=text-[#50fa7b]>brew</span> <span class=text-[#ff79c6]></span> <span class=text-[#f1fa8c]>");function dt(e){const[t,l]=L(""),r=()=>lt(e.categories,e.selectedPackages(),e.outdatedPackages()),s=async()=>{const i=r().join(`
`);try{await navigator.clipboard.writeText(i),n("Copied!")}catch{n("Failed to copy")}},n=i=>{l(i),setTimeout(()=>l(""),2e3)};return(()=>{var i=at(),a=i.firstChild;return f(a,S(gt,{copyToClipboard:s,copySuccess:t}),null),f(a,S(ht,{get commands(){return r()}}),null),i})()}function gt(e){return(()=>{var t=it(),l=t.firstChild,r=l.nextSibling;return Q(r,"click",e.copyToClipboard),f(r,()=>e.copySuccess()||"Copy"),t})()}function ht(e){return(()=>{var t=ot();return f(t,()=>e.commands.map(l=>l.startsWith("#")?S(bt,{text:l}):l.includes("#")?S(mt,{cmd:l}):S(pt,{cmd:l}))),t})()}function bt(e){return(()=>{var t=ct(),l=t.firstChild,r=l.firstChild;return f(r,()=>e.text),t})()}function mt(e){const[t,l]=e.cmd.split("#",2),r=t.trim().split(" ");return(()=>{var s=ut(),n=s.firstChild,i=n.nextSibling,a=i.nextSibling,c=a.nextSibling,u=c.nextSibling,g=u.nextSibling,o=g.firstChild,w=o.firstChild;return f(a,()=>r[1]),f(u,()=>r.slice(2).join(" ")),f(w,`#${l}`),s})()}function pt(e){const t=e.cmd.split(" ");return(()=>{var l=ft(),r=l.firstChild,s=r.nextSibling,n=s.nextSibling,i=n.nextSibling,a=i.nextSibling;return f(n,()=>t[1]),f(a,()=>t.slice(2).join(" ")),l})()}J(["click"]);var vt=m('<div class="min-h-screen min-w-[1200px] bg-gray-100">');function wt(){const{packages:e,loading:t,error:l,refreshing:r,usingLocalData:s,selectedPackages:n,outdatedPackages:i,version:a,loadPackages:c,refreshPackages:u,resetSelection:g,togglePackage:o,loadVersion:w}=Fe(),{searchTerm:$,setSearchTerm:k,filters:b,updateFilter:E,resetFilters:F}=Le(),C=()=>{g(),F()},P=()=>{let p=e();if($()){const x=$().toLowerCase();p=p.map(h=>({...h,packages:h.packages.filter(d=>d.name.toLowerCase().includes(x)||d.desc&&d.desc.toLowerCase().includes(x))}))}return(!b().casks||!b().formulae||b().installed||b().notInstalled||b().outdated)&&(p=p.map(x=>({...x,packages:x.packages.filter(h=>!b().casks&&h.cask||!b().formulae&&!h.cask?!1:!!(b().installed&&h.installed||b().notInstalled&&!h.installed||b().outdated&&h.outdated))}))),p.filter(x=>x.packages.length>0)};return $e(()=>{c(),w()}),(()=>{var p=vt();return f(p,S(Me,{get loading(){return t()},get refreshing(){return r()},get error(){return l()},get version(){return a()},onRefresh:u,onReset:C,get selectedPackagesCount(){return n().size},get usingLocalData(){return s()},searchTerm:$,onSearch:k,filters:b,onFilterChange:x=>E(x,!b()[x])}),null),f(p,S(tt,{get packages(){return P()},get selectedPackages(){return n()},onPackageToggle:o}),null),f(p,S(dt,{get categories(){return P()},selectedPackages:n,outdatedPackages:i}),null),p})()}const $t=document.getElementById("root");Ee(()=>S(wt,{}),$t);
