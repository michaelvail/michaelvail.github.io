import*as n from"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=a(e);fetch(e.href,r)}})();const M=new n.Scene;M.background=new n.Color("#191919");const m=new n.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);m.position.setZ(30);const w=new n.WebGLRenderer({canvas:document.querySelector("#bg")});w.setPixelRatio(window.devicePixelRatio);w.setSize(window.innerWidth,window.innerHeight);const F=new n.PointLight(16777215,500);F.position.set(25,20,25);M.add(F);const N=`
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
`,K=new n.SphereGeometry(500,32,32),Z=new n.ShaderMaterial({vertexShader:N,fragmentShader:J,side:n.BackSide}),$=new n.Mesh(K,Z);M.add($);const H=[{name:"About",sectionId:"about"},{name:"Research",sectionId:"research"},{name:"Projects",sectionId:"projects"},{name:"Articles",sectionId:"articles"}],W=document.getElementById("loading-overlay"),T=document.getElementById("scroll-hint"),v=document.getElementById("nav"),S=v==null?void 0:v.querySelectorAll(".nav-dot"),I=document.querySelectorAll("main > section"),P=[],u=H.length,ee=1,x=15,s=new n.Group,y=w.domElement,V=.005,te=new n.Quaternion;let l=0,g=null,f=!1,z=!1,L=!1,R=!1,b=new n.Vector2;const ne=new n.MeshPhysicalMaterial({color:12303291,transparent:!0,opacity:.5,roughness:.2,metalness:.6,transmission:.9,thickness:2,ior:1.4,emissive:new n.Color(2236979),emissiveIntensity:.7}),oe=new n.SphereGeometry(ee,32,32);for(let t=0;t<u;t++){const o=t/u*2*Math.PI,a=x*Math.cos(o),i=x*Math.sin(o),e=new n.Vector3(a,0,i),r=new n.Mesh(oe,ne.clone());r.position.copy(e),P.push(r),s.add(r);const c=(t+1)%u,d=new n.Vector3(x*Math.cos(c/u*2*Math.PI),0,x*Math.sin(c/u*2*Math.PI)),h=new n.LineCurve3(e,d),p=new n.TubeGeometry(h,8,.05,8,!1),Y=new n.MeshPhysicalMaterial({color:13421823,transparent:!0,opacity:.4,roughness:.5,metalness:.3,transmission:.8,thickness:1}),B=new n.Mesh(p,Y);s.add(B)}s.rotation.x=-1.2;s.rotation.z=.8;M.add(s);j();W&&(W.classList.add("hidden"),setTimeout(()=>W.remove(),500));const q=ie();q&&document.addEventListener("touchstart",()=>{A()},{once:!0});function A(){if(z||f)return;if(z=!0,X=!0,T&&(T.style.display="none"),k(0,!0),!g){const o=new n.SphereGeometry(.5,16,16),a=new n.MeshBasicMaterial({color:16776657});g=new n.Mesh(o,a),s.add(g)}const t=s.worldToLocal(P[0].getWorldPosition(new n.Vector3));g.position.copy(t)}I.forEach(t=>{t.style.display="none",t.addEventListener("pointerenter",()=>{L=!0}),t.addEventListener("pointerleave",()=>{L=!1})});S.forEach((t,o)=>{t.addEventListener("click",()=>{f||o===l||(E(l,o),l=o)})});let G=0,C=0,O=!1,X=!1;q||(document.addEventListener("wheel",t=>{if(f||L)return;if(t.preventDefault(),!z){A();return}const o=Math.sign(t.deltaY),a=(l+o+u)%u;E(l,a),l=a},{passive:!1}),document.addEventListener("touchstart",t=>{const o=t.touches[0];G=o.clientY,O=Array.from(I).some(a=>{const i=a.getBoundingClientRect();return a.style.display!=="none"&&o.clientX>=i.left&&o.clientX<=i.right&&o.clientY>=i.top&&o.clientY<=i.bottom})},{passive:!0}),document.addEventListener("touchend",t=>{if(f||L)return;C=t.changedTouches[0].clientY;const a=G-C;if(!(Math.abs(a)<30)&&!O){A();const e=Math.sign(a),r=(l+e+u)%u;E(l,r),l=r}}));if(q){let t=0,o=0,a=!1;document.addEventListener("touchstart",i=>{const e=i.touches[0];t=e.clientY,o=e.clientX,a=Array.from(I).some(r=>{const c=r.getBoundingClientRect();return r.style.display!=="none"&&e.clientX>=c.left&&e.clientX<=c.right&&e.clientY>=c.top&&e.clientY<=c.bottom})},{passive:!0}),document.addEventListener("touchend",i=>{const e=i.changedTouches[0],r=t-e.clientY,c=o-e.clientX,d=Math.sqrt(c**2+r**2),h=10;if(X){X=!1;return}if(!a&&d<h){const p=(l+1)%u;E(l,p),l=p}},{passive:!0})}function E(t,o){if(f)return;f=!0;const a=s.worldToLocal(P[t].getWorldPosition(new n.Vector3)),i=s.worldToLocal(P[o].getWorldPosition(new n.Vector3));g.position.copy(a);const e=performance.now(),r=600;function c(d){const h=Math.min((d-e)/r,1);g.position.lerpVectors(a,i,h),h<1?requestAnimationFrame(c):(k(o),f=!1)}requestAnimationFrame(c)}function k(t,o=!1){const a=H[t];I.forEach(i=>{i.id===a.sectionId?(i.style.display="block",o&&(i.classList.add("slide-in"),i.addEventListener("animationend",()=>{i.classList.remove("slide-in")},{once:!0})),i.scrollTop=0,i.scrollIntoView({behavior:"smooth"})):i.style.display="none"}),v&&(v.classList.add("visible"),S==null||S.forEach((i,e)=>{i.classList.toggle("active",e===t)}))}function D(){requestAnimationFrame(D),s.rotation.x+=1e-4,s.rotation.y+=5e-4,s.rotation.z+=2e-4,w.render(M,m)}D();y.addEventListener("mousedown",t=>{R=!0,b.set(t.clientX,t.clientY),te.copy(s.quaternion)});y.addEventListener("mouseup",t=>{R=!1});y.addEventListener("mousemove",t=>{if(!R)return;const o=t.clientX-b.x,a=t.clientY-b.y,i=m.up.clone().normalize(),e=new n.Vector3;m.getWorldDirection(e),e.cross(i).normalize();const r=new n.Quaternion().setFromAxisAngle(i,o*V),c=new n.Quaternion().setFromAxisAngle(e,a*V),d=r.multiply(c);s.quaternion.premultiply(d),b.set(t.clientX,t.clientY)});window.addEventListener("resize",()=>{y.width=window.innerWidth,y.height=window.innerHeight,m.aspect=window.innerWidth/window.innerHeight,m.updateProjectionMatrix(),w.setSize(window.innerWidth,window.innerHeight),w.setPixelRatio(window.devicePixelRatio),j()});function j(){const t=s.rotation.clone(),o=s.scale.clone();s.rotation.set(0,0,0),s.scale.set(1,1,1),s.updateMatrixWorld(!0);const e=new n.Box3().setFromObject(s).getBoundingSphere(new n.Sphere).radius||1;s.rotation.copy(t),s.scale.copy(o),s.updateMatrixWorld(!0);const r=Math.abs(m.position.z-s.position.z),c=n.MathUtils.degToRad(m.fov),d=2*Math.tan(c/2)*r,h=d*m.aspect,p=h*.45,Y=d*.95,Q=Math.min(p,Y)/(2*e),U=n.MathUtils.clamp(Q,.1,3);s.scale.setScalar(U);const _=-h*.2;s.position.setX(_)}function ie(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
