import*as i from"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const M=new i.Scene;M.background=new i.Color("#191919");const p=new i.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);p.position.setZ(30);const v=new i.WebGLRenderer({canvas:document.querySelector("#bg")});v.setPixelRatio(window.devicePixelRatio);v.setSize(window.innerWidth,window.innerHeight);const F=new i.PointLight(16777215,500);F.position.set(25,20,25);M.add(F);const $=`
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,J=`
  varying vec3 vWorldPosition;

  float bayerDither(vec2 uv) {
    int x = int(mod(uv.x, 4.0));
    int y = int(mod(uv.y, 4.0));
    int index = y * 4 + x;

    float thresholdMatrix[16];
    thresholdMatrix[ 0] =  0.0 / 16.0;
    thresholdMatrix[ 1] =  8.0 / 16.0;
    thresholdMatrix[ 2] =  2.0 / 16.0;
    thresholdMatrix[ 3] = 10.0 / 16.0;
    thresholdMatrix[ 4] = 12.0 / 16.0;
    thresholdMatrix[ 5] =  4.0 / 16.0;
    thresholdMatrix[ 6] = 14.0 / 16.0;
    thresholdMatrix[ 7] =  6.0 / 16.0;
    thresholdMatrix[ 8] =  3.0 / 16.0;
    thresholdMatrix[ 9] = 11.0 / 16.0;
    thresholdMatrix[10] =  1.0 / 16.0;
    thresholdMatrix[11] =  9.0 / 16.0;
    thresholdMatrix[12] = 15.0 / 16.0;
    thresholdMatrix[13] =  7.0 / 16.0;
    thresholdMatrix[14] = 13.0 / 16.0;
    thresholdMatrix[15] =  5.0 / 16.0;

    return thresholdMatrix[index];
  }

  void main() {
    float h = normalize(vWorldPosition).y * 0.5 + 0.5;

    // Get pixel coords
    vec2 screenUV = gl_FragCoord.xy;
    float dither = bayerDither(screenUV);

    float ditherStrength = 1.0 / 255.0;
    float value = h + dither * ditherStrength;

    value = clamp(value, 0.0, 1.0); // make sure final output is clean
    gl_FragColor = vec4(vec3(value * 0.5), 1.0);
  }
`,K=new i.SphereGeometry(500,32,32),Z=new i.ShaderMaterial({vertexShader:$,fragmentShader:J,side:i.BackSide}),ee=new i.Mesh(K,Z);M.add(ee);const q=[{name:"About",sectionId:"about"},{name:"Research",sectionId:"research"},{name:"VR",sectionId:"vr"},{name:"Projects",sectionId:"projects"},{name:"Articles",sectionId:"articles"},{name:"Hokey Pokey",sectionId:"hokey"}],z=document.getElementById("loading-overlay"),C=document.getElementById("scroll-hint"),w=document.getElementById("nav"),S=w==null?void 0:w.querySelectorAll(".nav-dot"),Y=document.querySelectorAll("main > section"),E=[],u=q.length,te=1,b=15,a=new i.Group,x=v.domElement,G=.005,ne=new i.Quaternion;let l=0,g=null,f=!1,A=!1,L=!1,T=!1,P=new i.Vector2;const oe=new i.MeshPhysicalMaterial({color:12303291,transparent:!0,opacity:.5,roughness:.2,metalness:.6,transmission:.9,thickness:2,ior:1.4,emissive:new i.Color(2236979),emissiveIntensity:.7}),ie=new i.SphereGeometry(te,32,32);for(let e=0;e<u;e++){const t=e/u*2*Math.PI,s=b*Math.cos(t),o=b*Math.sin(t),n=new i.Vector3(s,0,o),r=new i.Mesh(ie,oe.clone());r.position.copy(n),E.push(r),a.add(r);const c=(e+1)%u,d=new i.Vector3(b*Math.cos(c/u*2*Math.PI),0,b*Math.sin(c/u*2*Math.PI)),h=new i.LineCurve3(n,d),y=new i.TubeGeometry(h,8,.05,8,!1),X=new i.MeshPhysicalMaterial({color:13421823,transparent:!0,opacity:.4,roughness:.5,metalness:.3,transmission:.8,thickness:1}),V=new i.Mesh(y,X);a.add(V)}a.rotation.x=-1.2;a.rotation.z=.8;M.add(a);N();z&&(z.classList.add("hidden"),setTimeout(()=>z.remove(),500));const W=re();W&&document.addEventListener("touchstart",()=>{B()},{once:!0});function B(){if(A||f)return;if(A=!0,R=!0,C&&(C.style.display="none"),W){const t=document.getElementById("tap-indicator");t&&(t.style.opacity="1")}else{const t=document.getElementById("scroll-indicator");t&&(t.style.opacity="1")}if(!g){const t=new i.SphereGeometry(.5,16,16),s=new i.MeshBasicMaterial({color:16776657});g=new i.Mesh(t,s),a.add(g)}const e=a.worldToLocal(E[0].getWorldPosition(new i.Vector3));g.position.copy(e),D(0,!0)}Y.forEach(e=>{e.style.display="none",e.addEventListener("pointerenter",()=>{L=!0}),e.addEventListener("pointerleave",()=>{L=!1})});const m=document.createElement("div");m.className="nav-tooltip";document.body.appendChild(m);S.forEach((e,t)=>{const s=q[t].name;e.addEventListener("mouseenter",o=>{m.textContent=s,m.style.left=`${o.clientX}px`,m.style.top=`${o.clientY-10}px`,m.style.opacity="1"}),e.addEventListener("mousemove",o=>{m.style.left=`${o.clientX}px`,m.style.top=`${o.clientY-10}px`}),e.addEventListener("mouseleave",()=>{m.style.opacity="0"}),e.addEventListener("click",()=>{f||t===l||(I(l,t),l=t)})});let k=0,H=0,O=!1,R=!1;W||(document.addEventListener("wheel",e=>{if(f||L)return;if(e.preventDefault(),!A){B();return}const t=Math.sign(e.deltaY),s=(l+t+u)%u;I(l,s),l=s},{passive:!1}),document.addEventListener("touchstart",e=>{const t=e.touches[0];k=t.clientY,O=Array.from(Y).some(s=>{const o=s.getBoundingClientRect();return s.style.display!=="none"&&t.clientX>=o.left&&t.clientX<=o.right&&t.clientY>=o.top&&t.clientY<=o.bottom})},{passive:!0}),document.addEventListener("touchend",e=>{if(f||L)return;H=e.changedTouches[0].clientY;const s=k-H;if(!(Math.abs(s)<30)&&!O){B();const n=Math.sign(s),r=(l+n+u)%u;I(l,r),l=r}}));if(W){let e=0,t=0,s=!1;document.addEventListener("touchstart",o=>{const n=o.touches[0];e=n.clientY,t=n.clientX,s=Array.from(Y).some(r=>{const c=r.getBoundingClientRect();return r.style.display!=="none"&&n.clientX>=c.left&&n.clientX<=c.right&&n.clientY>=c.top&&n.clientY<=c.bottom})},{passive:!0}),document.addEventListener("touchend",o=>{const n=o.changedTouches[0],r=e-n.clientY,c=t-n.clientX,d=Math.sqrt(c**2+r**2),h=10;if(R){R=!1;return}if(!s&&d<h){const y=(l+1)%u;I(l,y),l=y}},{passive:!0})}function I(e,t){if(f)return;f=!0;const s=a.worldToLocal(E[e].getWorldPosition(new i.Vector3)),o=a.worldToLocal(E[t].getWorldPosition(new i.Vector3));g.position.copy(s);const n=performance.now(),r=600;function c(d){const h=Math.min((d-n)/r,1);g.position.lerpVectors(s,o,h),h<1?requestAnimationFrame(c):(D(t),f=!1)}requestAnimationFrame(c)}function D(e,t=!1){const s=q[e];Y.forEach(o=>{o.id===s.sectionId?(o.style.display="block",t&&(o.classList.add("slide-in"),o.addEventListener("animationend",()=>{o.classList.remove("slide-in")},{once:!0})),o.scrollTop=0,o.scrollIntoView({behavior:"smooth"})):o.style.display="none"}),w&&(w.classList.add("visible"),S==null||S.forEach((o,n)=>{o.classList.toggle("active",n===e)}))}function j(){requestAnimationFrame(j),a.rotation.x+=1e-4,a.rotation.y+=5e-4,a.rotation.z+=2e-4,v.render(M,p)}j();x.addEventListener("mousedown",e=>{T=!0,P.set(e.clientX,e.clientY),ne.copy(a.quaternion)});x.addEventListener("mouseup",e=>{T=!1});x.addEventListener("mousemove",e=>{if(!T)return;const t=e.clientX-P.x,s=e.clientY-P.y,o=p.up.clone().normalize(),n=new i.Vector3;p.getWorldDirection(n),n.cross(o).normalize();const r=new i.Quaternion().setFromAxisAngle(o,t*G),c=new i.Quaternion().setFromAxisAngle(n,s*G),d=r.multiply(c);a.quaternion.premultiply(d),P.set(e.clientX,e.clientY)});window.addEventListener("resize",()=>{x.width=window.innerWidth,x.height=window.innerHeight,p.aspect=window.innerWidth/window.innerHeight,p.updateProjectionMatrix(),v.setSize(window.innerWidth,window.innerHeight),v.setPixelRatio(window.devicePixelRatio),N()});function N(){const e=a.rotation.clone(),t=a.scale.clone();a.rotation.set(0,0,0),a.scale.set(1,1,1),a.updateMatrixWorld(!0);const n=new i.Box3().setFromObject(a).getBoundingSphere(new i.Sphere).radius||1;a.rotation.copy(e),a.scale.copy(t),a.updateMatrixWorld(!0);const r=Math.abs(p.position.z-a.position.z),c=i.MathUtils.degToRad(p.fov),d=2*Math.tan(c/2)*r,h=d*p.aspect,y=h*.45,X=d*.95,Q=Math.min(y,X)/(2*n),U=i.MathUtils.clamp(Q,.1,3);a.scale.setScalar(U);const _=-h*.2;a.position.setX(_)}function re(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
