import*as o from"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function a(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(e){if(e.ep)return;e.ep=!0;const r=a(e);fetch(e.href,r)}})();(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(t){if(t.ep)return;t.ep=!0;const e=s(t);fetch(t.href,e)}})();const y=new o.Scene;y.background=new o.Color("#191919");const c=new o.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);c.position.setZ(30);const f=new o.WebGLRenderer({canvas:document.querySelector("#bg")});f.setPixelRatio(window.devicePixelRatio);f.setSize(window.innerWidth,window.innerHeight);const O=new o.PointLight(16777215,500);O.position.set(25,20,25);y.add(O);const N=`
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,k=`
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
`,D=new o.SphereGeometry(500,32,32),H=new o.ShaderMaterial({vertexShader:N,fragmentShader:k,side:o.BackSide}),U=new o.Mesh(D,H);y.add(U);const F=[{name:"About",sectionId:"about"},{name:"Research",sectionId:"research"},{name:"Articles",sectionId:"articles"}],b=document.getElementById("loading-overlay"),V=document.getElementById("scroll-hint"),M=document.getElementById("nav"),E=M==null?void 0:M.querySelectorAll(".nav-dot"),B=document.querySelectorAll("main > section"),x=[],u=F.length,X=1,v=15,i=new o.Group,I=f.domElement,z=.005,Y=new o.Quaternion;let p=0,m=null,w=!1,q=!1,W=!1,A=!1,g=new o.Vector2;const j=new o.MeshPhysicalMaterial({color:12303291,transparent:!0,opacity:.5,roughness:.2,metalness:.6,transmission:.9,thickness:2,ior:1.4,emissive:new o.Color(2236979),emissiveIntensity:.7}),Q=new o.SphereGeometry(X,32,32);for(let n=0;n<u;n++){const s=n/u*2*Math.PI,a=v*Math.cos(s),t=v*Math.sin(s),e=new o.Vector3(a,0,t),r=new o.Mesh(Q,j.clone());r.position.copy(e),x.push(r),i.add(r);const l=(n+1)%u,d=new o.Vector3(v*Math.cos(l/u*2*Math.PI),0,v*Math.sin(l/u*2*Math.PI)),h=new o.LineCurve3(e,d),P=new o.TubeGeometry(h,8,.05,8,!1),L=new o.MeshPhysicalMaterial({color:13421823,transparent:!0,opacity:.4,roughness:.5,metalness:.3,transmission:.8,thickness:1}),S=new o.Mesh(P,L);i.add(S)}i.rotation.x=-1.2;i.rotation.z=.8;y.add(i);C();b&&(b.classList.add("hidden"),setTimeout(()=>b.remove(),500));B.forEach(n=>{n.style.display="none",n.addEventListener("pointerenter",()=>{W=!0}),n.addEventListener("pointerleave",()=>{W=!1})});document.addEventListener("wheel",n=>{if(w||W)return;if(n.preventDefault(),!q){if(q=!0,V&&(V.style.display="none"),R(0,!0),!m){const e=new o.SphereGeometry(.5,16,16),r=new o.MeshBasicMaterial({color:16776657});m=new o.Mesh(e,r),i.add(m)}const t=i.worldToLocal(x[0].getWorldPosition(new o.Vector3));m.position.copy(t);return}const s=Math.sign(n.deltaY),a=(p+s+u)%u;G(p,a),p=a},{passive:!1});E.forEach((n,s)=>{n.addEventListener("click",()=>{w||s===p||(G(p,s),p=s)})});function G(n,s){if(w)return;w=!0;const a=i.worldToLocal(x[n].getWorldPosition(new o.Vector3)),t=i.worldToLocal(x[s].getWorldPosition(new o.Vector3));m.position.copy(a);const e=performance.now(),r=600;function l(d){const h=Math.min((d-e)/r,1);m.position.lerpVectors(a,t,h),h<1?requestAnimationFrame(l):(R(s),w=!1)}requestAnimationFrame(l)}function R(n,s=!1){const a=F[n];B.forEach(t=>{t.id===a.sectionId?(t.style.display="block",s&&(t.classList.add("slide-in"),t.addEventListener("animationend",()=>{t.classList.remove("slide-in")},{once:!0})),t.scrollTop=0,t.scrollIntoView({behavior:"smooth"})):t.style.display="none"}),M&&(M.classList.add("visible"),E==null||E.forEach((t,e)=>{t.classList.toggle("active",e===n)}))}function T(){requestAnimationFrame(T),i.rotation.x+=1e-4,i.rotation.y+=5e-4,i.rotation.z+=2e-4,f.render(y,c)}T();I.addEventListener("mousedown",n=>{A=!0,g.set(n.clientX,n.clientY),Y.copy(i.quaternion)});I.addEventListener("mouseup",n=>{A=!1});I.addEventListener("mousemove",n=>{if(!A)return;const s=n.clientX-g.x,a=n.clientY-g.y,t=c.up.clone().normalize(),e=new o.Vector3;c.getWorldDirection(e),e.cross(t).normalize();const r=new o.Quaternion().setFromAxisAngle(t,s*z),l=new o.Quaternion().setFromAxisAngle(e,a*z),d=r.multiply(l);i.quaternion.premultiply(d),g.set(n.clientX,n.clientY)});window.addEventListener("resize",()=>{c.aspect=window.innerWidth/window.innerHeight,c.updateProjectionMatrix(),f.setSize(window.innerWidth,window.innerHeight),f.setPixelRatio(window.devicePixelRatio),C()});function C(){const n=i.rotation.clone(),s=i.scale.clone();i.rotation.set(0,0,0),i.scale.set(1,1,1),i.updateMatrixWorld(!0);const a=new o.Box3().setFromObject(i).getBoundingSphere(new o.Sphere).radius||1;i.rotation.copy(n),i.scale.copy(s),i.updateMatrixWorld(!0);const t=Math.abs(c.position.z-i.position.z),e=o.MathUtils.degToRad(c.fov),r=2*Math.tan(e/2)*t,l=r*c.aspect,d=l*.45,h=r*.95,P=Math.min(d,h)/(2*a),L=o.MathUtils.clamp(P,.1,3);i.scale.setScalar(L);const S=-l*.2;i.position.setX(S)}
