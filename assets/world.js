/* CASE 001 / original procedural WebGL environment. No third-party runtime. */
(()=>{
 const canvas=document.getElementById('world');
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
 if(!gl){document.body.classList.add('no-webgl');window.IUCWorld={setScene(){},setDensity(){},setTiming(){},setFocus(){},setPointer(){}};return;}
 const V=`#version 300 es
 in vec2 aPosition;
 void main(){gl_Position=vec4(aPosition,0.,1.);}`;
 const F=`#version 300 es
 precision highp float;
 out vec4 fragColor;
 uniform vec2 uResolution;
 uniform vec2 uPointer;
 uniform float uTime;
 uniform float uScene;
 uniform float uDensity;
 uniform float uTiming;
 uniform float uFocus;
 uniform float uMobile;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float hash3(vec3 p){p=fract(p*.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
 mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
 float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
 float sdRoundBox(vec3 p,vec3 b,float r){return sdBox(p,b)-r;}
 float sdTorus(vec3 p,vec2 t){return length(vec2(length(p.xz)-t.x,p.y))-t.y;}
 vec2 mapScene(vec3 p){
   p.x-=uMobile>.5?.20:1.20;
   p.y-=uMobile>.5?-.58:.02;
   vec3 q=p;
   q.xz*=rot(.24+uTime*.085+uPointer.x*.12);
   q.yz*=rot(-.1+sin(uTime*.29)*.07+uPointer.y*.11);
   float d=sdRoundBox(q,vec3(.63,1.12,.16),.105);
   d=min(d,sdRoundBox(q-vec3(0.,0.,.145),vec3(.56,1.01,.042),.042));
   vec3 ring=q;ring.xy*=rot(.56);ring.yz*=rot(.30);
   float tor=sdTorus(ring,vec2(1.54,.012));
   vec3 ring2=q;ring2.xy*=rot(-.85);ring2.xz*=rot(.15+uTime*.065);
   float tor2=sdTorus(ring2,vec2(1.75,.008));
   float bracket=max(sdRoundBox(q,vec3(.74,1.23,.25),.05),-sdRoundBox(q,vec3(.70,1.19,.29),.045));
   d=min(d,bracket);
   if(tor<d && tor<tor2)return vec2(tor,2.);
   if(tor2<d)return vec2(tor2,3.);
   return vec2(d,1.);
 }
 vec3 normalScene(vec3 p){vec2 e=vec2(.003,0.);return normalize(vec3(mapScene(p+e.xyy).x-mapScene(p-e.xyy).x,mapScene(p+e.yxy).x-mapScene(p-e.yxy).x,mapScene(p+e.yyx).x-mapScene(p-e.yyx).x));}
 vec3 renderMonolith(vec2 uv){
   vec3 ro=vec3(0.,0.,6.1);
   vec3 rd=normalize(vec3(uv*.84,-2.7));
   vec3 color=vec3(0.);
   float t=0.;vec2 h=vec2(0.);
   for(int i=0;i<65;i++){
     if(uMobile>.5 && i>=41)break;
     h=mapScene(ro+rd*t);
     if(h.x<.003||t>11.)break;
     t+=max(.013,h.x*.74);
   }
   if(t<11.&&h.x<.005){
     vec3 pos=ro+rd*t;
     vec3 nor=normalScene(pos);
     vec3 l1=normalize(vec3(-.9,1.8,2.4));
     vec3 l2=normalize(vec3(1.6,-.45,-.4));
     float diffuse=max(dot(nor,l1),0.);
     float rim=pow(1.-max(dot(nor,-rd),0.),3.);
     float spec=pow(max(dot(reflect(-l1,nor),-rd),0.),45.);
     float spec2=pow(max(dot(reflect(-l2,nor),-rd),0.),12.);
     float irregular=hash3(floor(pos*260.));
     float bands=sin(pos.y*31.+sin(pos.x*15.)*1.6)*.5+.5;
     vec3 metal=mix(vec3(.057,.103,.114),vec3(.21,.31,.31),diffuse*.85+bands*.15);
     if(h.y>1.5)metal=vec3(.33,.62,.53);
     color=metal*(.42+diffuse*1.5)+vec3(.56,.92,.75)*spec*1.2+vec3(.34,.68,.57)*spec2*.26;
     color+=vec3(.45,.82,.7)*rim*(h.y>1.5?1.65:.75);
     color+=vec3(.12,.15,.14)*(irregular-.5)*.14;
     float edge=pow(1.-abs(dot(nor,-rd)),7.);
     color+=vec3(.40,.75,.69)*edge*.46;
     color*=exp(-.03*t*t);
   }
   return color;
 }
 vec3 background(vec2 uv,float scene){
   vec3 base=mix(vec3(.012,.019,.029),vec3(.035,.055,.063),clamp(uv.y*.4+.35,0.,1.));
   float halo=exp(-dot(uv-vec2(uMobile>.5?.06:.39,-.05),uv-vec2(uMobile>.5?.06:.39,-.05))*1.27);
   base+=vec3(.025,.073,.084)*halo;
   base+=vec3(.015,.035,.049)*exp(-length(uv-vec2(-.5,1.3))*1.6);
   float gridX=1.-smoothstep(0.,.018,abs(fract(uv.x*7.3)-.5));
   float gridY=1.-smoothstep(0.,.018,abs(fract(uv.y*7.3)-.5));
   base+=vec3(.019,.034,.036)*(gridX+gridY)*.09;
   float star=0.;
   for(int i=0;i<3;i++){
     float fi=float(i);
     vec2 p=uv*mix(39.,94.,fi/3.)+fi*17.;
     vec2 cell=floor(p),f=fract(p)-.5;
     float on=step(.986,hash(cell+fi*2.));
     float tw=.6+.4*sin(uTime*.6+hash(cell)*30.);
     star+=on*(1.-smoothstep(0.,.12,length(f)))*tw*(.26-fi*.07);
   }
   base+=vec3(.36,.59,.56)*star;
   return base;
 }
 void main(){
   vec2 uv=(gl_FragCoord.xy-.5*uResolution)/uResolution.y*2.;
   uv.x+=uPointer.x*.015;uv.y-=uPointer.y*.015;
   vec3 c=background(uv,uScene);
   float monolithWeight=1.-smoothstep(.2,1.15,uScene);
   if(monolithWeight>.002){
     vec3 obj=renderMonolith(uv);
     float glow=exp(-length(uv-vec2(uMobile>.5?.07:.38,uMobile>.5?-.19:0.))*2.)*.072;
     c+=(obj+vec3(.06,.19,.16)*glow)*monolithWeight;
     float radius=length((uv-vec2(uMobile>.5?.07:.39,uMobile>.5?-.22:0.))*vec2(.65,1.));
     float orbit=exp(-abs(radius-.92)*195.)*.13;
     c+=vec3(.26,.57,.49)*orbit*monolithWeight;
   }
   float fieldWeight=smoothstep(.4,1.45,uScene)*(1.-smoothstep(1.55,2.4,uScene));
   if(fieldWeight>.001){
     vec2 p=uv*vec2(19.,17.);vec2 ip=floor(p),f=fract(p)-.5;
     float n=hash(ip);
     float visible=step(1.-mix(.10,.8,uDensity),n);
     float light=(1.-smoothstep(.025,.18,length(f+vec2(sin(uTime*.23+n*13.)*.2,cos(uTime*.19+n*15.)*.2))))*visible;
     float fog=exp(-dot(uv,uv)*.19);
     c+=vec3(.09,.22,.25)*light*.6*fieldWeight*fog;
     c+=vec3(.022,.065,.064)*(1.-uDensity)*exp(-length(uv)*1.1)*fieldWeight;
   }
   float timeWeight=smoothstep(1.5,2.55,uScene)*(1.-smoothstep(2.5,3.4,uScene));
   if(timeWeight>.001){
     float r=length(uv-vec2(-.43,-.10));
     float aureole=exp(-abs(r-.78)*14.)*.045+exp(-r*r*.6)*.025;
     c+=vec3(.20,.39,.31)*aureole*timeWeight;
   }
   float focusWeight=smoothstep(2.5,3.4,uScene)*(1.-smoothstep(3.5,4.2,uScene));
   if(focusWeight>.001){
     float r=length(uv-vec2(.6,-.12));
     c+=vec3(.09,.23,.20)*exp(-r*r*1.3)*focusWeight*(.15+uFocus*.35);
   }
   float vig=1.-smoothstep(.8,2.5,length(uv))*.69;
   c*=vig;
   float g=hash(gl_FragCoord.xy+fract(uTime)*100.)-.5;
   c+=(g*.013);
   c=pow(max(c,vec3(0.)),vec3(.86));
   fragColor=vec4(c,1.);
 }`;
 const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(s));}return s;};
 let program;
 try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,V));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,F));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));}catch(e){console.warn('Procedural world unavailable',e);canvas.style.display='none';window.IUCWorld={setScene(){},setDensity(){},setTiming(){},setFocus(){},setPointer(){}};return;}
 const vao=gl.createVertexArray();gl.bindVertexArray(vao);const buff=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buff);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
 gl.useProgram(program);const uni={};['uResolution','uPointer','uTime','uScene','uDensity','uTiming','uFocus','uMobile'].forEach(name=>uni[name]=gl.getUniformLocation(program,name));
 const values={scene:0,density:1,timing:.5,focus:.33,pointer:[0,0]};let scene=0,den=1,last=0,frame=0,active=true;
 const rm=window.matchMedia('(prefers-reduced-motion: reduce)');const coarse=window.matchMedia('(max-width: 780px)');let w=0,h=0,dpr=1,paintAt=0;
 function resize(){dpr=Math.min(devicePixelRatio||1,coarse.matches?1:1.4);w=Math.round(innerWidth*dpr);h=Math.round(innerHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}}
 function render(now){frame=requestAnimationFrame(render);if(document.hidden||!active)return;const fps=coarse.matches?30:50;if(now-paintAt<1000/fps)return;paintAt=now;resize();const seconds=now*.001;const delta=Math.min(.07,(now-last)*.001||.016);last=now;const k=1-Math.exp(-delta*(rm.matches?30:3.5));scene+=(values.scene-scene)*k;den+=(values.density-den)*k;
 gl.useProgram(program);gl.uniform2f(uni.uResolution,w,h);gl.uniform2f(uni.uPointer,...values.pointer);gl.uniform1f(uni.uTime,rm.matches?1:seconds);gl.uniform1f(uni.uScene,scene);gl.uniform1f(uni.uDensity,den);gl.uniform1f(uni.uTiming,values.timing);gl.uniform1f(uni.uFocus,values.focus);gl.uniform1f(uni.uMobile,coarse.matches?1:0);gl.drawArrays(gl.TRIANGLES,0,3);}
 document.addEventListener('visibilitychange',()=>{last=performance.now()});window.addEventListener('resize',resize,{passive:true});resize();frame=requestAnimationFrame(render);
 window.IUCWorld={setScene(n){values.scene=n},setDensity(n){values.density=n},setTiming(n){values.timing=n},setFocus(n){values.focus=n},setPointer(x,y){values.pointer=[x,y]},stop(){active=false;cancelAnimationFrame(frame)}};
})();
