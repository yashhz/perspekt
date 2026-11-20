(function(){
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
function clamp(v){return Math.max(0,Math.min(1,v))}
var onScroll=[];
function tickAll(){onScroll.forEach(function(f){f()})}
addEventListener('scroll',tickAll,{passive:true});addEventListener('resize',tickAll);

/* reveal */
function count(el){var n=+el.dataset.n,d=+el.dataset.d||0,t0=0;(function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1300),e=1-Math.pow(1-p,3),v=n*e;el.textContent=d?v.toFixed(d):Math.round(v).toLocaleString('en-US');if(p<1)requestAnimationFrame(step)})(performance.now())}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(!calm)$$('[data-n]',e.target).forEach(count)}})},{threshold:.25});
$$('.rv,.gw,#cal,#foot-logo').forEach(function(el){io.observe(el)});
$$('.plan.rv').forEach(function(p,i){p.style.transitionDelay=(i*90)+'ms,'+(i*90)+'ms,0ms,0ms'});
$$('#cal-grid').forEach(function(){});

/* header: rule after scroll, current section, phone menu */
(function(){
  var nav=$('#nav'),links=$$('#nav-links a'),secs=links.map(function(l){return $(l.getAttribute('href'))}),btn=$('#menu-btn'),menu=$('#menu');
  onScroll.push(function(){
    nav.classList.toggle('stuck',scrollY>8);
    var cur=-1;secs.forEach(function(s,i){if(s.getBoundingClientRect().top<innerHeight*.45)cur=i});
    var book=$('#book').getBoundingClientRect().top<innerHeight*.45;
    active=cur>-1&&!book?links[cur]:null;if(!hover)place(active);
  });
  /* the highlight slides to the section you are in, and previews whichever link you point at */
  var ul=$('#nav-links'),ind=$('.ind',ul),active=null,hover=null,placed=false;
  function place(el){
    links.forEach(function(l){l.classList.toggle('lit',l===el)});
    if(!el||!ul.offsetWidth){ind.style.opacity=0;return}
    var r=el.getBoundingClientRect(),u=ul.getBoundingClientRect();
    if(!placed){ind.style.transition='none';placed=true}
    ind.style.width=r.width+'px';ind.style.transform='translateX('+(r.left-u.left)+'px)';ind.style.opacity=1;
    ind.offsetWidth;ind.style.transition='';
  }
  links.forEach(function(l){l.addEventListener('mouseenter',function(){hover=l;place(l)});l.addEventListener('focus',function(){hover=l;place(l)})});
  ul.addEventListener('mouseleave',function(){hover=null;place(active)});
  ul.addEventListener('focusout',function(){hover=null;place(active)});
  addEventListener('resize',function(){placed=false;place(hover||active)});
  function toggle(v){menu.classList.toggle('open',v);btn.setAttribute('aria-expanded',v)}
  btn.addEventListener('click',function(){toggle(!menu.classList.contains('open'))});
  $$('a',menu).forEach(function(l){l.addEventListener('click',function(){toggle(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
})();

/* theme: light unless the visitor picks dark; the choice is remembered */
(function(){
  var root=document.documentElement,btn=$('#theme-btn');
  function dark(){return root.getAttribute('data-mode')==='dark'}
  btn.addEventListener('click',function(){var d=!dark();if(d)root.setAttribute('data-mode','dark');else root.removeAttribute('data-mode');
    try{localStorage.setItem('perspekt-theme',d?'dark':'light')}catch(e){}
    btn.setAttribute('aria-pressed',d);document.dispatchEvent(new Event('themechange'))});
  btn.setAttribute('aria-pressed',dark());
})();

/* page progress */
onScroll.push(function(){var h=document.documentElement;$('#bar').style.transform='scaleX('+clamp(h.scrollTop/(h.scrollHeight-innerHeight||1))+')'});

/* ---------- hero: perspective lines that follow the pointer, and a card that tilts ---------- */
(function(){
  var c=$('#persp'),x=c.getContext('2d'),hero=c.parentNode,post=$('#post'),W=0,H=0,seen=true,t0=0,raf=0;
  var home=innerWidth<900?{x:.86,y:.05}:{x:.78,y:.4},vp={x:home.x,y:home.y},to={x:home.x,y:home.y};
  var ink='#111';function readInk(){ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'#111'}readInk();
  document.addEventListener('themechange',function(){readInk();if(W)draw()});
  function size(){var d=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0)}
  function draw(){
    x.clearRect(0,0,W,H);var px=vp.x*W,py=vp.y*H,i,n=14;
    x.strokeStyle=ink;x.lineWidth=1;x.globalAlpha=.085;x.beginPath();
    for(i=0;i<=n;i++){var u=i/n;
      x.moveTo(px,py);x.lineTo(u*W,0);x.moveTo(px,py);x.lineTo(u*W,H);
      if(i>0&&i<n&&i%2===0){x.moveTo(px,py);x.lineTo(0,u*H);x.moveTo(px,py);x.lineTo(W,u*H)}}
    x.stroke();
    x.globalAlpha=.12;[.12,.26,.46,.72].forEach(function(k){x.strokeRect(px-px*k,py-py*k,(W-px)*k+px*k,(H-py)*k+py*k)});
    x.globalAlpha=1;x.fillStyle=ink;x.beginPath();x.arc(px,py,3,0,7);x.fill();
  }
  function tick(t){
    if(!t0)t0=t;var s=(t-t0)/1000;
    var amp=W<900?2.4:1;vp.x+=(to.x+Math.sin(s*.35)*.025*amp-vp.x)*.06;vp.y+=(to.y+Math.cos(s*.27)*.03*amp-vp.y)*.06;draw();
    if(seen)raf=requestAnimationFrame(tick);
  }
  size();draw();
  addEventListener('resize',function(){size();draw()});
  if(calm)return;
  hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();
    to.x=(e.clientX-r.left)/r.width;to.y=(e.clientY-r.top)/r.height;
    post.style.setProperty('--ry',((to.x-.5)*10).toFixed(2)+'deg');post.style.setProperty('--rx',((.5-to.y)*8).toFixed(2)+'deg')});
  var touch=matchMedia('(hover: none)').matches;
  if(touch){
    hero.addEventListener('pointerdown',function(e){var r=hero.getBoundingClientRect();to.x=(e.clientX-r.left)/r.width;to.y=(e.clientY-r.top)/r.height});
    onScroll.push(function(){var p=Math.min(1,scrollY/(H||1));to.x=home.x-p*.62;to.y=home.y+p*.8});
  }
  hero.addEventListener('pointerleave',function(){if(touch)return;to.x=home.x;to.y=home.y;post.style.setProperty('--ry','0deg');post.style.setProperty('--rx','0deg')});
  new IntersectionObserver(function(es){seen=es[0].isIntersecting;cancelAnimationFrame(raf);if(seen)raf=requestAnimationFrame(tick)}).observe(hero);
})();

/* ---------- hero: the post reacts like a real one ---------- */
(function(){
  var like=$('#pa-like'),rep=$('#pa-rep'),send=$('#pa-send'),toast=$('#toast'),tt=0;
  function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2800)}
  function pop(b){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
  function toggle(b,out,base){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);$(out).textContent=(base+(on?1:0)).toLocaleString('en-US');if(on)pop(b)}
  like.addEventListener('click',function(){toggle(like,'#pa-likes',312)});
  rep.addEventListener('click',function(){toggle(rep,'#pa-reposts',12)});
  /* Send copies the site's link, then opens the phone's share sheet where there is one */
  function fallbackCopy(url){var t=document.createElement('textarea');t.value=url;t.setAttribute('readonly','');t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();return ok}
  send.addEventListener('click',function(){
    pop(send);
    var url=location.href.split('#')[0];
    var copied=function(){say('Link copied. Send it to someone who should be posting.')};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(copied,function(){if(fallbackCopy(url))copied();else say(url)});
    else if(fallbackCopy(url))copied();else say(url);
    if(navigator.share)navigator.share({title:'Perspekt',text:'LinkedIn personal branding and ghostwriting.',url:url}).catch(function(){});
  });
})();

/* ---------- hero: the post that writes itself ---------- */
(function(){
  var el=$('#typer');if(calm)return;
  var posts=[el.textContent,
   "Every founder I back gets one question in the first meeting.\n\nWhat do you believe that your competitors would call reckless?\n\nThe ones who answer fast are usually right.",
   "Our roadshow taught me one thing.\n\nThe analysts had read everything I wrote for two years. The questions were sharper. The meetings were shorter.\n\nWrite before you need to."];
  var caret=document.createElement('span');caret.className='caret';var txt=document.createTextNode('');
  var p=0,i=0;
  function type(){var s=posts[p];
    if(i<=s.length){txt.nodeValue=s.slice(0,i);var ch=s.charAt(i-1);i++;setTimeout(type,ch==='\n'?260:ch==='.'||ch==='?'?190:22+Math.random()*30)}
    else setTimeout(function(){p=(p+1)%posts.length;i=0;type()},3600)}
  setTimeout(function(){el.textContent='';el.appendChild(txt);el.appendChild(caret);p=1;type()},4200);
})();

/* ---------- why: sentence fills in; the dial changes as each point passes ---------- */
(function(){
  var el=$('#fill');
  el.innerHTML=el.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
  var ws=$$('.w',el);
  if(calm)ws.forEach(function(w){w.classList.add('on')});
  else onScroll.push(function(){var r=el.getBoundingClientRect(),vh=innerHeight,p=clamp((vh*.9-r.top)/(vh*.5+r.height*.5)),n=Math.round(p*ws.length);ws.forEach(function(w,i){w.classList.toggle('on',i<n)})});

  /* before / after: wipes across by itself until someone touches it; the handle can be dragged */
  var cmp=$('#cmp'),stage=$('#cmp-stage'),a=$('#cmp-a'),b=$('#cmp-b'),handle=$('.cmp-handle span',cmp),after=false,auto=0,drag=false;
  function setX(p){cmp.style.setProperty('--x',(p*100).toFixed(1)+'%');cmp.style.setProperty('--g',(p<.06?22*(1-p/.06):p>.94?-22*((p-.94)/.06):0).toFixed(1)+'px');var v=p>.5;after=v;a.setAttribute('aria-pressed',!v);b.setAttribute('aria-pressed',v);$('#cmp-after').setAttribute('aria-hidden',p<.02)}
  function show(v){setX(v?1:0)}
  function stop(){clearInterval(auto);auto=0}
  a.addEventListener('click',function(){stop();show(false)});b.addEventListener('click',function(){stop();show(true)});
  function at(e){var r=stage.getBoundingClientRect();return clamp((e.clientX-r.left)/r.width)}
  function start(e){stop();drag=true;cmp.classList.add('dragging');try{e.target.setPointerCapture(e.pointerId)}catch(_){}setX(at(e));e.preventDefault()}
  handle.addEventListener('pointerdown',start);
  stage.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.target!==handle)start(e)});
  addEventListener('pointermove',function(e){if(drag)setX(at(e))});
  addEventListener('pointerup',function(){if(drag){drag=false;cmp.classList.remove('dragging')}});
  show(false);
  if(!calm)new IntersectionObserver(function(es,o){if(es[0].isIntersecting){o.disconnect();setTimeout(function(){if(!drag)show(true)},700);auto=setInterval(function(){show(!after)},4200)}},{threshold:.4}).observe(cmp);
  else show(true);

  /* who it is for: the panel you point at opens */
  var auds=$$('.aud');
  function pick(el){auds.forEach(function(o){o.classList.toggle('on',o===el)})}
  auds.forEach(function(el){['mouseenter','focus','click'].forEach(function(ev){el.addEventListener(ev,function(){if(innerWidth>900)pick(el)})})});
})();

/* ---------- film: the frame grows into place ---------- */
(function(){var f=$('#film-box');if(calm)return;
  onScroll.push(function(){var r=f.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(innerHeight*.75));f.style.setProperty('--s',(.82+.18*p).toFixed(3))})})();

/* ---------- how: scroll down, the row travels sideways ---------- */
(function(){
  var sec=$('#how'),track=$('#track'),prog=$('#h-prog'),dist=0,on=false;
  function layout(){
    on=!calm&&innerWidth>=900&&innerHeight>=620;
    sec.classList.toggle('pinned',on);
    if(!on){sec.style.height='';track.style.transform='';return}
    dist=Math.max(0,track.scrollWidth-innerWidth);
    sec.style.height=(innerHeight+dist)+'px';
  }
  function upd(){
    if(!on)return;var r=sec.getBoundingClientRect(),nav=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navh'))||68;
    var p=dist?clamp((nav-r.top)/dist):0;
    track.style.transform='translate3d('+(-p*dist).toFixed(1)+'px,0,0)';prog.style.setProperty('--p',p.toFixed(3));
  }
  layout();upd();
  addEventListener('resize',function(){layout();upd()});
  onScroll.push(upd);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){layout();upd()});
})();

/* ---------- testimonials: duplicate each rail so it loops ---------- */
$$('.rail').forEach(function(r){$$('.q',r).forEach(function(q){var c=q.cloneNode(true);c.setAttribute('aria-hidden','true');r.appendChild(c)})});

/* ---------- plans: tap a card to open it ---------- */
(function(){
  var plans=$$('.plan');
  function sync(){plans.forEach(function(p){var o=p.classList.contains('open');$('.plan-head',p).setAttribute('aria-expanded',o);$('.plan-more>div',p).inert=!o})}
  plans.forEach(function(p){$('.plan-head',p).addEventListener('click',function(){var was=p.classList.contains('open');plans.forEach(function(o){o.classList.remove('open')});if(!was)p.classList.add('open');sync()})});
  sync();
})();

/* ---------- pricing by region ----------
   India is the base. US = base x 2.5, Europe = base x 3, everywhere else = base x 2, converted and rounded up.
   FX is how many rupees buy one unit of the display currency: update it when rates move. */
var FX={USD:88,EUR:102};
var REGIONS={
  IN:{note:'Prices for India, in INR',cur:'INR',mult:1},
  US:{note:'Prices for the United States, in USD',cur:'USD',mult:2.5},
  EU:{note:'Prices for Europe, in EUR',cur:'EUR',mult:3},
  ROW:{note:'International prices, in USD',cur:'USD',mult:2}
};
var EUROPE='AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE GB CH NO IS LI MC AD SM'.split(' ');
var US_TZ=/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Juneau|Sitka|Nome|Adak|Menominee|Indiana|Kentucky|North_Dakota)|Pacific\/Honolulu)/;
function regionFromCountry(cc){cc=(cc||'').toUpperCase();return cc==='IN'?'IN':cc==='US'?'US':EUROPE.indexOf(cc)>-1?'EU':'ROW'}
function regionFromTimezone(){var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
  if(/^Asia\/(Kolkata|Calcutta)$/.test(tz))return 'IN';if(US_TZ.test(tz))return 'US';if(/^Europe\//.test(tz)&&!/Moscow|Istanbul|Minsk|Kirov|Samara|Volgograd/.test(tz))return 'EU';return 'ROW'}
function price(base,R){if(R.cur==='INR')return base;var v=base*R.mult/FX[R.cur],step=v<1000?50:100;return Math.ceil(v/step)*step}
function sym(cur){return cur==='INR'?'₹':cur==='EUR'?'€':'$'}
function full(v,cur){return sym(cur)+Math.round(v).toLocaleString(cur==='INR'?'en-IN':'en-US')}
function short(v,cur){var t=function(n){return (Math.round(n*10)/10).toString()};
  if(cur==='INR'){if(v>=1e7)return '₹'+t(v/1e7)+' Cr';if(v>=1e5)return '₹'+t(v/1e5)+' L';return full(v,cur)}
  if(v>=1e6)return sym(cur)+t(v/1e6)+'M';return full(v,cur)}

var region='IN';
function applyRegion(key){
  region=key;var R=REGIONS[key];
  $('#region').textContent=R.note;
  $$('.amt[data-base]').forEach(function(a){a.textContent=full(price(+a.dataset.base,R),R.cur)});
  updateRet(true);
  /* placeholder revenue figure, shown in the visitor's currency */
  var rv=R.cur==='INR'?['\u20B9',40,' L+']:R.cur==='EUR'?['\u20AC',40,'k+']:['$',45,'k+'],sn=$('#st-n');
  $('#st-pre').textContent=rv[0];sn.dataset.n=rv[1];sn.textContent=rv[1];$('#st-suf').textContent=rv[2];
}
/* Retainer: the estimate follows what the visitor picks.
   In INR: 8 posts 40k, 12 posts +15k, 16 posts +30k, engagement +15k, inbound +10k.
   The range runs from that total to about 10% above it (at least 5k). */
var RET={base:40000,posts:{8:0,12:15000,16:30000},eng:15000,inb:10000};
function kfmt(v){return v>=1000?(Math.round(v/100)/10).toString()+'k':String(v)}
function updateRet(quiet){
  var R=REGIONS[region],pick=$('input[name="ret-posts"]:checked'),posts=pick?+pick.value:8;
  var lo=RET.base+RET.posts[posts]+($('#ret-eng').checked?RET.eng:0)+($('#ret-inb').checked?RET.inb:0);
  var hi=lo+Math.max(5000,Math.round(lo*.1/5000)*5000),el=$('#ret-amt');
  el.textContent=sym(R.cur)+kfmt(price(lo,R))+'\u2013'+kfmt(price(hi,R));
  if(!quiet&&!calm){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}
}
$$('#plan-m2 input').forEach(function(i){i.addEventListener('change',function(){updateRet()})});

/* what to expect: the line draws as you scroll past */
(function(){
  var ol=$('#expect-list'),items=$$('li',ol);
  if(calm){items.forEach(function(i){i.classList.add('on')});return}
  onScroll.push(function(){var r=ol.getBoundingClientRect(),p=clamp((innerHeight*.85-r.top)/(innerHeight*.45+r.height*.5));
    ol.style.setProperty('--p',p.toFixed(3));items.forEach(function(el,i){el.classList.toggle('on',p>=i/items.length+.04)})});
})();

(function(){
  var forced={'#in':'IN','#us':'US','#eu':'EU','#row':'ROW'}[location.hash.toLowerCase()];   /* preview switch: remove before launch */
  if(forced){applyRegion(forced);return}
  applyRegion(regionFromTimezone());                                                            /* instant, no network */
  try{var ac=new AbortController();setTimeout(function(){ac.abort()},2500);                     /* then confirm by IP */
    fetch('https://api.country.is/',{signal:ac.signal}).then(function(r){return r.json()}).then(function(j){if(j&&j.country){var k=regionFromCountry(j.country);if(k!==region)applyRegion(k)}}).catch(function(){});
  }catch(e){}
})();

/* ---------- calendar preview ---------- */
(function(){
  var grid=$('#cal-grid'),slots=$('#slots'),msg=$('#cal-msg'),now=new Date(),y=now.getFullYear(),m=now.getMonth();
  if(now.getDate()>21){m++;if(m>11){m=0;y++}}
  var first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),lead=(first.getDay()+6)%7,pick=null,time=null;
  $('#cal-month').textContent=first.toLocaleDateString('en-GB',{month:'long',year:'numeric'});
  var h='MTWTFSS'.split('').map(function(d){return '<span>'+d+'</span>'}).join('');
  for(var i=0;i<lead;i++)h+='<span></span>';
  for(var d=1;d<=days;d++){var dt=new Date(y,m,d),wd=dt.getDay(),off=wd===0||wd===6||dt<=now;h+='<button type="button" id="cal-d'+d+'" aria-pressed="false" data-d="'+d+'" style="transition-delay:0s,0s,'+(d*18)+'ms,'+(d*18)+'ms"'+(off?' disabled':'')+'>'+d+'</button>'}
  grid.innerHTML=h;
  slots.innerHTML=['10:00','11:30','14:00','16:30','18:00'].map(function(t,i){return '<button type="button" id="cal-t'+i+'" aria-pressed="false">'+t+'</button>'}).join('');
  function say(){
    if(!pick){msg.textContent='Pick a day and a time.';return}
    var s=new Date(y,m,pick).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
    msg.innerHTML='<b>'+s+(time?' at '+time:'')+'</b>'+(time?'':'. Now pick a time.');
  }
  grid.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$$('button',grid).forEach(function(o){o.setAttribute('aria-pressed',o===b)});pick=+b.dataset.d;say()});
  slots.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$$('button',slots).forEach(function(o){o.setAttribute('aria-pressed',o===b)});time=b.textContent;say()});
  $('#cal-go').addEventListener('click',function(){
    if(!pick||!time){msg.textContent='Pick a day and a time first.';return}
    msg.innerHTML='<b>Nothing was sent.</b> This calendar is a preview. Live booking connects here soon.';
  });
})();
tickAll();
})();
