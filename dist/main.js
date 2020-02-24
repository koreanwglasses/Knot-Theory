!function(e){var t={};function n(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(r,s,function(t){return e[t]}.bind(null,s));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports=React},function(e,t,n){"use strict";function r(e,[t,n]){return[e*t,e*n]}function s([e,t],[n,r]){return[e+n,t+r]}function o([e,t],[n,r]){return[e-n,t-r]}function i([e,t]){return Math.sqrt(e*e+t*t)}function c(e){return r(1/i(e),e)}Object.defineProperty(t,"__esModule",{value:!0}),t.isVector2=function(e){return Array.isArray(e)&&2==e.length&&"number"==typeof e[0]&&"number"==typeof e[1]},t.scl=r,t.add=s,t.sub=o,t.norm=i,t.normalize=c,t.dist=function(e,t){return i(o(e,t))},t.shiftToward=function(e,t,n){return s(e,r(n,c(o(t,e))))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(1);function s(e){return{m11:e[0][0],m12:e[0][1],m13:e[0][2],m21:e[1][0],m22:e[1][1],m23:e[1][2],m31:e[2][0],m32:e[2][1],m33:e[2][2]}}t.matrix=s,t.id=()=>s([[1,0,0],[0,1,0],[0,0,1]]),t.scale=e=>s([[e,0,0],[0,e,0],[0,0,1]]),t.translate=([e,t])=>s([[1,0,e],[0,1,t],[0,0,1]]),t.dot=function(e,t){if(r.isVector2(t)){const n=e,r=t,s=[n.m11*r[0]+n.m12*r[1]+n.m13,n.m21*r[0]+n.m22*r[1]+n.m23,n.m31*r[0]+n.m32*r[1]+n.m33];return[s[0]/s[2],s[1]/s[2]]}return{m11:e.m11*t.m11+e.m12*t.m21+e.m13*t.m31,m12:e.m11*t.m12+e.m12*t.m22+e.m13*t.m32,m13:e.m11*t.m13+e.m12*t.m23+e.m13*t.m33,m21:e.m21*t.m11+e.m22*t.m21+e.m23*t.m31,m22:e.m21*t.m12+e.m22*t.m22+e.m23*t.m32,m23:e.m21*t.m13+e.m22*t.m23+e.m23*t.m33,m31:e.m31*t.m11+e.m32*t.m21+e.m33*t.m31,m32:e.m31*t.m12+e.m32*t.m22+e.m33*t.m32,m33:e.m31*t.m13+e.m32*t.m23+e.m33*t.m33}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),s=n(4),o=n(5),i=n(7),c=n(9),a=n(2);let u=i.trefoil();const m=a.dot(a.translate([200,200]),a.scale(100));u=c.transform(u,m),s.render(r.createElement(o.PolygonalKnotDiagramCanvas,{knot:u,width:400,height:400}),document.getElementById("react-root"))},function(e,t){e.exports=ReactDOM},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),s=n(6);class o extends r.Component{constructor(){super(...arguments),this.canvas=r.createRef()}componentDidMount(){const{knot:e,gap:t}=this.props,n=this.canvas.current.getContext("2d");n.strokeStyle="#000",n.lineWidth=5,n.lineCap="round",s.drawKnot(n,e,{gap:t})}render(){const{width:e,height:t}=this.props;return r.createElement("canvas",{ref:this.canvas,width:e,height:t})}}t.PolygonalKnotDiagramCanvas=o,o.defaultProps={gap:20}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(1);t.drawKnot=function(e,t,n){const{gap:s}=Object.assign({gap:20},n);t.arcs.forEach(t=>{const n=[t.begin.crossing.location,...t.path.filter(e=>("upper"==t.begin.strand||r.dist(e,t.begin.crossing.location)>=s)&&("upper"==t.end.strand||r.dist(e,t.end.crossing.location)>=s)),t.end.crossing.location],o="lower"==t.begin.strand?r.shiftToward(n[0],n[1],s):n[0],i="lower"==t.end.strand?r.shiftToward(n[n.length-1],n[n.length-2],s):n[n.length-1];e.beginPath(),e.moveTo(...o),n.slice(1,-1).forEach(t=>e.lineTo(...t)),e.lineTo(...i),e.stroke()})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(8);class s extends r.Crossing{constructor(e){super(),this.location=e}}t.Crossing=s,t.trefoil=()=>{const e=[new s([0,1]),new s([-Math.sqrt(3)/2,-.5]),new s([Math.sqrt(3)/2,-.5])];return{crossings:e,arcs:[{begin:e[0].lower,end:e[1].upper,path:[[-Math.sqrt(3)/2,.5]]},{begin:e[1].upper,end:e[2].lower,path:[]},{begin:e[2].lower,end:e[0].upper,path:[[Math.sqrt(3)/2,.5]]},{begin:e[0].upper,end:e[1].lower,path:[]},{begin:e[1].lower,end:e[2].upper,path:[[0,-1]]},{begin:e[2].upper,end:e[0].lower,path:[]}]}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.Crossing=class{constructor(){const e={strand:"lower",crossing:this},t={strand:"upper",crossing:this};this.lower=e,this.upper=t}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(10),s=n(2);t.transform=function(e,t){return r.map(e,e=>Object.assign(Object.assign({},e),{location:s.dot(t,e.location)}),(e,t)=>Object.assign(Object.assign({},e),{crossing:t}),(e,n,r)=>Object.assign(Object.assign({},e),{path:e.path.map(e=>s.dot(t,e)),begin:n,end:r}),(e,t,n)=>Object.assign(Object.assign({},e),{crossings:t,arcs:n}))}},function(e,t,n){"use strict";function r(e,t,n,r,s){const o=e.crossings.map(t),i=(()=>{const t={};return r=>{const s=e.crossings.indexOf(r.crossing),i=`${s},${r.strand}`;return i in t||(t[i]=n(r,o[s])),t[i]}})(),c=e.arcs.map(e=>r(e,i(e.begin),i(e.end)));return s(e,o,c)}Object.defineProperty(t,"__esModule",{value:!0}),t.map=r,t.clone=function(e){return r(e,e=>Object.assign({},e),(e,t)=>Object.assign(Object.assign({},e),{crossing:t}),(e,t,n)=>Object.assign(Object.assign({},e),{begin:t,end:n}),(e,t,n)=>Object.assign(Object.assign({},e),{crossings:t,arcs:n}))}}]);
//# sourceMappingURL=main.js.map