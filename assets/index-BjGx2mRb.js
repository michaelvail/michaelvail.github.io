import*as n from"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function i(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=i(r);fetch(r.href,s)}})();const b=new n.Scene;b.background=new n.Color("#191919");const m=new n.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);m.position.setZ(30);const h=new n.WebGLRenderer({canvas:document.querySelector("#bg")});h.setPixelRatio(window.devicePixelRatio);h.setSize(window.innerWidth,window.innerHeight);const q=h.domElement,ie=new n.PointLight(16777215,500);ie.position.set(25,20,25);b.add(ie);const ve=`
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ye=`
  varying vec3 vWorldPosition;
  uniform float time;

  // --- Hash + Noise + FBM ---
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // --- Bayer Dither (4x4) ---
  float bayer(vec2 uv) {
    int x = int(mod(uv.x, 4.0));
    int y = int(mod(uv.y, 4.0));
    int idx = y * 4 + x;

    float m[16];
    m[ 0] = 0.0/16.0;  m[ 1] = 8.0/16.0;  m[ 2] = 2.0/16.0;  m[ 3] =10.0/16.0;
    m[ 4] =12.0/16.0;  m[ 5] = 4.0/16.0;  m[ 6] =14.0/16.0;  m[ 7] = 6.0/16.0;
    m[ 8] = 3.0/16.0;  m[ 9] =11.0/16.0;  m[10] = 1.0/16.0;  m[11] = 9.0/16.0;
    m[12] =15.0/16.0;  m[13] = 7.0/16.0;  m[14] =13.0/16.0;  m[15] = 5.0/16.0;

    return m[idx];
  }

  void main() {
    vec3 dir = normalize(vWorldPosition);
    vec2 p = dir.xz * 2.0;

    float t = time * 0.1;

    // Flow field
    vec2 flow = vec2(
      fbm(p + vec2(t, -t * 0.7)),
      fbm(p + vec2(-t * 0.5, t * 0.9))
    );

    vec2 q = p + flow * 0.5;

    float f1 = fbm(q * 1.3);
    float f2 = fbm(q * 2.1 + vec2(2.7, -1.9));

    float ink = (f1 * 0.6 + f2 * 0.4);

    // --- Darken + compress contrast ---
    ink = pow(ink, 2.2);   // stronger gamma = darker, smoother
    ink *= 0.14;           // lower contrast

    float sky = 0.035 + ink;  // darker base

    // --- Add dithering to eliminate banding ---
    float d = bayer(gl_FragCoord.xy) * (1.0 / 255.0);
    sky += d;

    gl_FragColor = vec4(vec3(sky), 1.0);
  }
`,ge=new n.SphereGeometry(500,32,32),he=new n.ShaderMaterial({vertexShader:ve,fragmentShader:ye,side:n.BackSide,depthWrite:!1,depthTest:!1,uniforms:{time:{value:0}}}),re=new n.Mesh(ge,he);re.frustumCulled=!1;b.add(re);const Y=[{name:"About",sectionId:"about"},{name:"Research",sectionId:"research"},{name:"VR",sectionId:"vr"},{name:"Side Quests",sectionId:"sidequests"},{name:"Articles",sectionId:"articles"},{name:"Asymptotic Dining",sectionId:"dining"},{name:"Hokey Pokey",sectionId:"hokey"}],M=document.getElementById("nav"),g=M==null?void 0:M.querySelectorAll(".nav-dot"),we=document.querySelectorAll("#section-frame > section"),u=[],I=[],y=Y.length,se=1,be=15,a=new n.Group,te=.005,xe=new n.Quaternion;let v=0,d=null,p=!1,x=!1,ae=!1,F=new n.Vector2;const Pe=new n.MeshPhysicalMaterial({color:11184810,transparent:!0,opacity:.8,roughness:.05,metalness:0,transmission:1,thickness:1.5,attenuationColor:new n.Color(16777215),attenuationDistance:1,ior:1.45,clearcoat:.6,clearcoatRoughness:.15,emissive:new n.Color(2236979),emissiveIntensity:.4}),Le=new n.SphereGeometry(se,32,32),Se=se*4;for(let e=0;e<y;e++){let t,i=!1;for(;!i;)t=new n.Vector3(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1).normalize().multiplyScalar(be),i=u.every(r=>t.distanceTo(r.position)>=Se);const o=new n.Mesh(Le,Pe.clone());o.position.copy(t),u.push(o),a.add(o)}for(let e=0;e<y;e++)for(let t=e+1;t<y;t++){const i=new n.LineCurve3(u[e].position,u[t].position),o=new n.TubeGeometry(i,8,.1,8,!1),r=new n.ShaderMaterial({transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,uniforms:{baseColor:{value:new n.Color(14540253)},pulseColor:{value:new n.Color(15658734)},time:{value:0},pulsePos:{value:-1},tubeLength:{value:1},direction:{value:1},startPos:{value:new n.Vector3},endPos:{value:new n.Vector3}},vertexShader:`
        uniform vec3 startPos;
        uniform vec3 endPos;

        varying float vAlong;

        void main() {
            // World position of this vertex
            vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

            // Project onto the tube direction
            vec3 dir = normalize(endPos - startPos);
            float len = length(endPos - startPos);

            float proj = dot(worldPos - startPos, dir);

            // Normalize 0 → 1
            vAlong = clamp(proj / len, 0.0, 1.0);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 baseColor;
        uniform vec3 pulseColor;
        uniform float pulsePos;
        uniform float tubeLength;
        uniform float direction;

        varying float vAlong;

        void main() {
            // Directional position along tube
            float pos = (direction > 0.0) ? vAlong : (1.0 - vAlong);

            // Gaussian pulse centered at pulsePos
            float pulse = exp(-6.0 * pow(pos - pulsePos, 2.0));

            // Fade: 1.0 at pos=0 → 0.0 at pos=0.5
            float fade = smoothstep(0.75, 0.0, pos);

            // Base visibility (correct range for additive blending)
            float base = 0.08;

            // Final alpha
            float alpha = base + pulse * fade * 0.6;

            // Final color (brighter base)
            vec3 color = baseColor * 0.85 + pulseColor * pulse * fade * 0.8;

            gl_FragColor = vec4(color, alpha);
        }
      `}),s=new n.Mesh(o,r.clone()),l=u[e].getWorldPosition(new n.Vector3),f=u[t].getWorldPosition(new n.Vector3);s.material.uniforms.startPos.value.copy(l),s.material.uniforms.endPos.value.copy(f),s.userData={i:e,j:t,mat:s.material,direction:1},I.push(s),a.add(s)}a.rotation.x=-1.2;a.rotation.z=.8;b.add(a);if(!d){new n.PlaneGeometry(1,1);const e=new n.ShaderMaterial({opacity:0,transparent:!0,depthWrite:!1,depthTest:!1,blending:n.AdditiveBlending,uniforms:{color:{value:new n.Color(16776657)},time:{value:0},intensity:{value:1},opacity:{value:0}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform vec3 color;
      uniform float time;
      uniform float intensity;
      uniform float opacity;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv - 0.5;
        float d = length(uv);

        float flash = smoothstep(0.6, 0.0, d);
        flash += 0.05 * sin(time * 3.0 + d * 12.0);
        flash = pow(flash, 1.6);

        gl_FragColor = vec4(color * flash * intensity, flash * opacity);
      }
    `});if(d=new n.Mesh(new n.PlaneGeometry(1,1),e),d.material._fadedIn=!1,d.scale.set(3,3,3),d.renderOrder=9999,b.add(d),u[0]){const t=u[0].getWorldPosition(new n.Vector3),i=m.position.clone().sub(t).normalize();d.position.copy(t).add(i.multiplyScalar(.4))}}ce();const c=document.createElement("div");c.className="nav-tooltip";document.body.appendChild(c);let z;g.forEach((e,t)=>{const i=Y[t].name;e.addEventListener("mouseenter",()=>{if("ontouchstart"in window)return;clearTimeout(z),c.textContent=i,c.style.display="block",c.style.opacity="0",c.getBoundingClientRect();const o=e.getBoundingClientRect();c.style.left=`${o.left-c.offsetWidth/2-6}px`,c.style.top=`${o.top+o.height/2-c.offsetHeight/2}px`,requestAnimationFrame(()=>{c.style.opacity="1"})}),e.addEventListener("mousemove",()=>{if("ontouchstart"in window)return;const o=e.getBoundingClientRect();c.style.left=`${o.left-c.offsetWidth/2-6}px`,c.style.top=`${o.top+o.height/2-c.offsetHeight/2}px`}),e.addEventListener("mouseleave",()=>{"ontouchstart"in window||(c.style.opacity="0",z=setTimeout(()=>{c.style.display="none"},150))}),e.addEventListener("touchstart",()=>{const o=e.getBoundingClientRect();c.textContent=i,c.style.display="block",c.style.opacity="1",c.style.left=`${o.left-c.offsetWidth/2-6}px`,c.style.top=`${o.top+o.height/2-c.offsetHeight/2}px`,clearTimeout(z),z=setTimeout(()=>{c.style.opacity="0",setTimeout(()=>{c.style.display="none"},150)},1e3)}),e.addEventListener("click",()=>{p||t===v||(w(t),C(t))})});const Me=document.getElementById("next-section"),ke=document.getElementById("prev-section");Me.addEventListener("click",()=>{var t,i;if(p)return;const e=(v+1)%y;w(e),C(e),(t=g[v])==null||t.classList.remove("active"),(i=g[e])==null||i.classList.add("active")});ke.addEventListener("click",()=>{var t,i;if(p)return;const e=(v-1+y)%y;w(e),C(e),(t=g[v])==null||t.classList.remove("active"),(i=g[e])==null||i.classList.add("active")});function w(e){var W,j;if(p)return;p=!0;const t=v,i=u[e].getWorldPosition(new n.Vector3),o=a.getWorldPosition(new n.Vector3),r=i.clone().sub(o).normalize(),s=m.position.clone().sub(o).normalize(),l=a.quaternion.clone(),E=new n.Quaternion().setFromUnitVectors(r,s).multiply(l),D=u[t].getWorldPosition(new n.Vector3),R=u[e].getWorldPosition(new n.Vector3),K=a.worldToLocal(D.clone()),_=a.worldToLocal(R.clone()),N=performance.now(),H=800;function P(ue){const B=Math.min((ue-N)/H,1),Z=B*B*(3-2*B);a.quaternion.slerpQuaternions(l,E,Z),a.updateMatrixWorld(!0);const me=new n.Vector3().lerpVectors(K,_,Z),J=a.localToWorld(me.clone()),fe=m.position.clone().sub(J).normalize();d.position.copy(J).add(fe.multiplyScalar(.4)),B<1?requestAnimationFrame(P):(p=!1,v=e,I.forEach(G=>{const{i:ee,j:pe,mat:Q}=G.userData;(ee===e||pe===e)&&(ee===e?(G.userData.direction=1,Q.uniforms.direction.value=1):(G.userData.direction=-1,Q.uniforms.direction.value=-1),Q.uniforms.pulsePos.value=0)}),d.material._fadedIn||(d.material._fadedIn=!0,de()))}requestAnimationFrame(P),C(e),(W=g[t])==null||W.classList.remove("active"),(j=g[e])==null||j.classList.add("active")}function C(e,t=!1){const i=Y[e];we.forEach(o=>{o.id===i.sectionId?(o.classList.add("visible"),o.id==="dining"&&Ee()):(o.id==="dining"&&We(),o.classList.remove("visible"))}),M.classList.add("visible"),g.forEach((o,r)=>{o.classList.toggle("active",r===e)})}function le(){requestAnimationFrame(le);const e=performance.now()*.001;if(d.material.uniforms.time.value=e,!p){const t=u[v].position.clone(),i=a.localToWorld(t),o=m.position.clone().sub(i).normalize();d.position.copy(i).add(o.multiplyScalar(.4))}d.quaternion.copy(m.quaternion),!p&&!x&&(a.rotation.x+=1e-4,a.rotation.y+=5e-4,a.rotation.z+=2e-4),I.forEach(t=>{const{i,j:o,mat:r}=t.userData,s=u[i].getWorldPosition(new n.Vector3),l=u[o].getWorldPosition(new n.Vector3);r.uniforms.startPos.value.copy(s),r.uniforms.endPos.value.copy(l)}),I.forEach(t=>{const i=t.userData.mat;i&&i.uniforms.pulsePos.value>=0&&(i.uniforms.pulsePos.value+=.009,i.uniforms.pulsePos.value>1&&(i.uniforms.pulsePos.value=-1))}),h.render(b,m)}le();q.addEventListener("mousedown",e=>{x=!0,F.set(e.clientX,e.clientY),xe.copy(a.quaternion)});q.addEventListener("mouseup",e=>{x=!1});q.addEventListener("mousemove",e=>{if(!x)return;const t=e.clientX-F.x,i=e.clientY-F.y,o=m.up.clone().normalize(),r=new n.Vector3;m.getWorldDirection(r),r.cross(o).normalize();const s=new n.Quaternion().setFromAxisAngle(o,t*te),l=new n.Quaternion().setFromAxisAngle(r,i*te),f=s.multiply(l);a.quaternion.premultiply(f),F.set(e.clientX,e.clientY)});window.addEventListener("resize",()=>{m.aspect=window.innerWidth/window.innerHeight,m.updateProjectionMatrix(),h.setSize(window.innerWidth,window.innerHeight),h.setPixelRatio(window.devicePixelRatio),!x&&!p&&ce()});document.addEventListener("keydown",e=>{if(ae&&!p){if(e.key==="ArrowRight"||e.key==="ArrowDown"){const t=(v+1)%y;w(t)}if(e.key==="ArrowLeft"||e.key==="ArrowUp"){const t=(v-1+y)%y;w(t)}}});q.addEventListener("dblclick",e=>{e.preventDefault()});function ce(){const e=a.rotation.clone(),t=a.scale.clone();a.rotation.set(0,0,0),a.scale.set(1,1,1),a.updateMatrixWorld(!0);const r=new n.Box3().setFromObject(a).getBoundingSphere(new n.Sphere).radius||1;a.rotation.copy(e),a.scale.copy(t),a.updateMatrixWorld(!0);const s=Math.abs(m.position.z-a.position.z),l=n.MathUtils.degToRad(m.fov),f=2*Math.tan(l/2)*s,E=f*m.aspect,D=E*.45,R=f*.95,_=Math.min(D,R)/(2*r),N=n.MathUtils.clamp(_,.1,3);a.scale.setScalar(N);const H=-E*.25;if(a.position.setX(H),u[0]){const P=u[0].getWorldPosition(new n.Vector3),W=m.position.clone().sub(P).normalize();d.position.copy(P).add(W.multiplyScalar(.4))}}let V=!1;function Ce(e,t,i){const o=[];let r=1,s=e;for(;;){const l=Math.max(s,i);if(l>=r)break;o.push(l),r-=l,s*=t}return o.push(r),o}function A(){const e=parseFloat(initSlider.value),t=parseFloat(rSlider.value),i=parseFloat(epsSlider.value);initVal.textContent=e.toFixed(2),rVal.textContent=t.toFixed(2),epsVal.textContent=i.toFixed(4);const o=Ce(e,t,i),r=o.map((l,f)=>f+1),s=o.reduce((l,f)=>(l.push((l.length?l[l.length-1]:0)+f),l),[]);Plotly.react("plot1",[{x:r,y:o,mode:"lines+markers",line:{color:"#ddd"},marker:{color:"#eee"}}],{title:"Bite Size by Bite Number",xaxis:{title:"Bite Number",color:"#ccc",range:[0,null]},yaxis:{title:"Bite Size",color:"#ccc",range:[0,null]},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#eee"}}),Plotly.react("plot2",[{x:r,y:s,mode:"lines+markers",line:{color:"#ddd"},marker:{color:"#eee"}}],{title:"Cumulative Consumption",xaxis:{title:"Bite Number",color:"#ccc",range:[0,null]},yaxis:{title:"Proportion Consumed",color:"#ccc",range:[0,1]},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#eee"}}),Plotly.react("plot3",[{x:s,y:o,mode:"lines+markers",line:{color:"#ddd"},marker:{color:"#eee"}}],{title:"Bite Size by Consumption",xaxis:{title:"Proportion Consumed",color:"#ccc",range:[0,1]},yaxis:{title:"Bite Size",color:"#ccc",range:[0,null]},paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:"#eee"}})}function Ee(){V||(V=!0,Plotly.newPlot("plot1",[],{}),Plotly.newPlot("plot2",[],{}),Plotly.newPlot("plot3",[],{}),initSlider.oninput=A,rSlider.oninput=A,epsSlider.oninput=A,A())}function We(){V&&(Plotly.purge("plot1"),Plotly.purge("plot2"),Plotly.purge("plot3"),initSlider.oninput=null,rSlider.oninput=null,epsSlider.oninput=null,V=!1)}function oe(e){const t=(e.value-e.min)/(e.max-e.min)*100;e.style.setProperty("--value-percent",t+"%")}document.querySelectorAll('input[type="range"]').forEach(e=>{oe(e),e.addEventListener("input",()=>oe(e))});window.addEventListener("resize",()=>{x||p||["plot1","plot2","plot3"].forEach(e=>{const t=document.getElementById(e);t&&Plotly.Plots.resize(t)})});const Be=document.getElementById("terminal-overlay"),T=document.getElementById("terminal-scroll"),ze=document.getElementById("terminal-text"),k=document.getElementById("terminal-continue");k.style.display="none";ze.innerHTML='&#8203;<span id="terminal-cursor"></span>';const Ae=document.getElementById("terminal-cursor"),ne=["$ boot michael.sys","","> loading profile...","subject    : Michael Vail","origin     : New York","uptime     : 24 years","modules    : research | programming | teaching | writing","","> initializing diagnostics...","curiosity.meter    : maxed (100%)","whimsy.meter       : overclocked (128%)","idea.stream        : active","sleep.scheduler    : unstable (manual override required)","matcha.intake      : dependency detected","","> system check complete - fully operational"];let O=0,L=0,$=!0,U="",S=null;function Te(e){const t=e.indexOf(":");if(t===-1)return e;const i=t+3+"ch";return`<span class="hang" style="padding-left:${i}; text-indent:-${i};">`+e+"</span>"}function X(){if(!$)return;if(O>=ne.length){Fe();return}const e=ne[O];if(L===0&&(S=document.createTextNode(""),Ae.before(S)),L<e.length){const i=e[L];if(U+=i,S.textContent+=i,L++,T.scrollTop=T.scrollHeight,!$)return;setTimeout(X,30);return}const t=Te(U);S.replaceWith(document.createRange().createContextualFragment(t+`
`)),U="",S=null,L=0,O++,T.scrollTop=T.scrollHeight,setTimeout(X,150)}function Fe(){$=!1,k.textContent="Continue"}function Ie(){document.getElementById("terminal-box").classList.add("hidden"),Be.classList.add("fade-out"),setTimeout(()=>{Ve()},600)}k.addEventListener("click",()=>{Ie()});setTimeout(()=>{k.style.display="inline-block",k.style.opacity=1,X()},1e3);function Ve(){ae=!0,C(0),g[0].classList.add("active"),w(0),M.classList.add("visible"),document.getElementById("section-frame").classList.add("active"),d.material._fadedIn||(d.material._fadedIn=!0,de())}function de(e=600){const t=d.material;t.uniforms.opacity.value=0;const i=performance.now();function o(r){const s=Math.min((r-i)/e,1),l=s*s*(3-2*s);t.uniforms.opacity.value=l,s<1&&requestAnimationFrame(o)}requestAnimationFrame(o)}
