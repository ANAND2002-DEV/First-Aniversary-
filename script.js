const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let current='#intro';
const sections=$$('.screen');
function show(target){const el=$(target);if(!el)return;sections.forEach(s=>s.classList.add('hidden'));el.classList.remove('hidden');current=target;window.scrollTo({top:0,behavior:'instant'});el.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,easing:'cubic-bezier(.2,.8,.2,1)'});updateProgress();if(target==='#final')startFireworks()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-next]');if(b)show(b.dataset.next)});
$('#restart').addEventListener('click',()=>show('#intro'));
const order=sections.map(s=>'#'+s.id);function updateProgress(){const i=Math.max(0,order.indexOf(current));$('.progress i').style.width=((i/(order.length-1))*100)+'%'}
const UNLOCK_AT=new Date('2026-10-02T00:00:00+05:30').getTime();
let loaderStarted=false;
let countdownTimer=null;

function startLoader(){
  if(loaderStarted)return;
  loaderStarted=true;
  const loader=$('#loader');
  if(!loader)return;
  loader.classList.remove('lock-hidden');
  setTimeout(()=>{
    loader.style.opacity='0';
    setTimeout(()=>loader.remove(),700);
  },2000);
}

const accessLock=$('#access-lock');
const nameGate=$('#name-gate');
const timerGate=$('#timer-gate');
const nameForm=$('#name-form');
const nameInput=$('#closest-name');
const nameError=$('#name-error');
const ownerSettings=$('#owner-settings');
const ownerGate=$('#owner-gate');
const ownerClose=$('#owner-close');
const ownerForm=$('#owner-form');
const ownerName=$('#owner-name');
const ownerPassword=$('#owner-password');
const ownerError=$('#owner-error');

function pad(n){return String(n).padStart(2,'0')}

function updateCountdown(){
  const remaining=UNLOCK_AT-Date.now();
  if(remaining<=0){
    unlockWebsite();
    return;
  }
  const total=Math.floor(remaining/1000);
  const days=Math.floor(total/86400);
  const hours=Math.floor((total%86400)/3600);
  const minutes=Math.floor((total%3600)/60);
  const seconds=total%60;
  $('#days').textContent=String(days).padStart(2,'0');
  $('#hours').textContent=pad(hours);
  $('#minutes').textContent=pad(minutes);
  $('#seconds').textContent=pad(seconds);
}

function unlockWebsite(){
  if(countdownTimer)clearInterval(countdownTimer);
  if(!accessLock||!accessLock.isConnected)return;
  accessLock.classList.add('lock-closing');
  setTimeout(()=>{
    if(accessLock.isConnected)accessLock.remove();
    startLoader();
  },650);
}

nameForm.addEventListener('submit',e=>{
  e.preventDefault();
  const answer=nameInput.value.trim().toLowerCase();
  if(answer==='sneha'){
    nameError.textContent='';
    nameGate.classList.add('hidden');
    timerGate.classList.remove('hidden');
    updateCountdown();
    if(Date.now()<UNLOCK_AT)countdownTimer=setInterval(updateCountdown,1000);
  }else{
    nameError.textContent='That doesn’t seem right. Try again.';
    nameInput.select();
  }
});

ownerSettings.addEventListener('click',()=>{
  ownerGate.classList.remove('hidden');
  ownerError.textContent='';
  ownerName.focus();
});

ownerClose.addEventListener('click',()=>{
  ownerGate.classList.add('hidden');
  ownerForm.reset();
  ownerError.textContent='';
});

ownerForm.addEventListener('submit',e=>{
  e.preventDefault();
  const validName=ownerName.value.trim().toLowerCase()==='anand';
  const validPassword=ownerPassword.value==='anand2002';
  if(validName&&validPassword){
    if(countdownTimer)clearInterval(countdownTimer);
    accessLock.classList.add('lock-closing');
    setTimeout(()=>{
      if(accessLock.isConnected)accessLock.remove();
      startLoader();
    },650);
  }else{
    ownerError.textContent='Incorrect name or password.';
  }
});

window.addEventListener('load',()=>{
  updateProgress();
  if(Date.now()>=UNLOCK_AT){
    if(accessLock&&accessLock.isConnected)accessLock.remove();
    startLoader();
  }
});
// floating lotus/hearts, deliberately subtle
setInterval(()=>{if(current==='#intro'||current==='#iloveyou'||current==='#violet'||current==='#final'){const x=document.createElement('div');x.textContent=Math.random()>.35?'♥':'✿';x.style.cssText=`position:fixed;left:${Math.random()*100}vw;bottom:-25px;color:${Math.random()>.5?'#d59be5':'#ef9db8'};font-size:${10+Math.random()*18}px;z-index:20;pointer-events:none;opacity:.6`;document.body.appendChild(x);x.animate([{transform:'translateY(0) rotate(0)',opacity:0},{transform:'translateY(-45vh) rotate(100deg)',opacity:.6},{transform:'translateY(-105vh) rotate(220deg)',opacity:0}],{duration:6000+Math.random()*2500,easing:'ease-out'}).onfinish=()=>x.remove()}},1100);
let raf;
function startFireworks(){const c=$('#fireworks'),ctx=c.getContext('2d');cancelAnimationFrame(raf);const dpr=Math.min(devicePixelRatio||1,2);function resize(){c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}resize();let p=[],r=[],tick=0;function burst(x,y){for(let i=0;i<55;i++){const a=Math.random()*Math.PI*2,s=1.3+Math.random()*4.5;p.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,h:265+Math.random()*100})}}function launch(){r.push({x:innerWidth*(.15+Math.random()*.7),y:innerHeight+10,vy:-(7+Math.random()*4)})}function frame(){ctx.fillStyle='rgba(5,3,8,.18)';ctx.fillRect(0,0,innerWidth,innerHeight);if(tick++%25===0)launch();r.forEach((q,i)=>{q.y+=q.vy;q.vy+=.09;ctx.fillStyle='rgba(235,180,255,.9)';ctx.fillRect(q.x,q.y,2,7);if(q.vy>0){burst(q.x,q.y);r.splice(i,1)}});p.forEach((q,i)=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.035;q.vx*=.985;q.life-=.012;ctx.fillStyle=`hsla(${q.h},70%,78%,${Math.max(0,q.life)})`;ctx.fillRect(q.x,q.y,2,2);if(q.life<=0)p.splice(i,1)});raf=requestAnimationFrame(frame)}frame()}
