import {resultCount,labels} from './editorial.js';
const form=document.querySelector<HTMLFormElement>('.filters');
if(form){
 const apply=()=>{
  const data=new FormData(form);const q=String(data.get('q')??'').trim().toLowerCase();const chain=String(data.get('chain')??'');
  let count=0;
  document.querySelectorAll<HTMLElement>('[data-card]').forEach(card=>{card.hidden=!(card.dataset.search?.includes(q)&&(!chain||card.dataset.chain===chain));if(!card.hidden)count++;});
  document.querySelector('.result-count')!.textContent=resultCount(count);
  document.querySelector<HTMLElement>('.empty')!.hidden=count!==0;
  const params=new URLSearchParams();if(q)params.set('q',q);if(chain)params.set('chain',chain);
  history.replaceState(null,'',`${location.pathname}${params.size?'?'+params:''}${location.hash}`);
 };
 const params=new URLSearchParams(location.search);
 (form.elements.namedItem('q') as HTMLInputElement).value=params.get('q')??'';
 const select=form.elements.namedItem('chain') as HTMLSelectElement;
 select.value=params.get('chain')??'';if(select.selectedIndex<0)select.value='';
 form.addEventListener('submit',e=>{e.preventDefault();apply();});form.addEventListener('input',apply);form.addEventListener('reset',()=>setTimeout(apply));apply();
}
document.querySelectorAll<HTMLButtonElement>('[data-select]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll<HTMLButtonElement>('[data-select]').forEach(peer=>{if(peer.dataset.group===button.dataset.group)peer.setAttribute('aria-pressed',String(peer===button));});
 const panel=document.getElementById(button.getAttribute('aria-controls')!)!;
 panel.textContent=button.dataset.detail??'';
 if(button.dataset.url){const a=document.createElement('a');a.href=button.dataset.url;a.textContent=' View address on BscScan ↗';a.rel='noreferrer';panel.append(a);}
}));
async function copy(text:string,status:Element,message:string){
 try{await navigator.clipboard.writeText(text);status.textContent=message;}
 catch{status.textContent='Clipboard unavailable. Select and copy the visible text or browser address manually.';}
}
document.querySelector('[data-copy-link]')?.addEventListener('click',()=>void copy(location.href.split('#')[0],document.querySelector('.copy-status')!,labels.copiedLink));
document.querySelector('[data-copy-prompt]')?.addEventListener('click',()=>void copy(document.getElementById('investigation-prompt')!.textContent!,document.querySelector('.prompt-status')!,labels.copiedPrompt));
const progress=document.querySelector<HTMLElement>('.reading-progress');
if(progress){const update=()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${total>0?Math.min(100,scrollY/total*100):0}%`;};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}
if(typeof IntersectionObserver==='function'){
 try{
 const links=[...document.querySelectorAll<HTMLAnchorElement>('aside nav a')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-10% 0px -70% 0px'});
 document.querySelectorAll('.article-body > section').forEach(s=>observer.observe(s));
 }catch{/* Navigation remains usable without observer enhancement. */}
}

// Keep source quantities visible; percentages are an optional derived annotation.
document.querySelectorAll<HTMLInputElement>('[data-show-shares]').forEach(toggle=>toggle.addEventListener('change',()=>{
 toggle.closest('[data-chart]')!.querySelectorAll<HTMLElement>('[data-share]').forEach(note=>{note.hidden=!toggle.checked;});
}));
document.querySelectorAll<HTMLButtonElement>('[data-select]').forEach(button=>button.addEventListener('keydown',event=>{
 if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key))return;
 const peers=[...document.querySelectorAll<HTMLButtonElement>('[data-select]')].filter(peer=>peer.dataset.group===button.dataset.group);
 const direction=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;
 const index=event.key==='Home'?0:event.key==='End'?peers.length-1:(peers.indexOf(button)+direction+peers.length)%peers.length;
 event.preventDefault();peers[index].focus();peers[index].click();
}));

// Progressive enhancement: CSS never hides content pending an observer.
// Animate only entering figures/sections, once, without changing their layout.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations=new Set<Animation>();
const animate=(element:Element,keyframes:Keyframe[],delay=0)=>{
 if(motionPreference.matches||typeof element.animate!=='function')return;
 const animation=element.animate(keyframes,{duration:420,delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'none'});
 activeAnimations.add(animation);animation.finished.then(()=>activeAnimations.delete(animation),()=>activeAnimations.delete(animation));
};
if(typeof IntersectionObserver==='function'){
 try{
  const revealObserver=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){
    revealObserver.unobserve(entry.target);
    animate(entry.target,[{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}]);
    entry.target.querySelectorAll('.bar-track > span').forEach((bar,i)=>animate(bar,[{transform:'scaleX(0)',transformOrigin:'left'},{transform:'scaleX(1)',transformOrigin:'left'}],Math.min(i*45,135)));
    entry.target.querySelectorAll('.flow-edge i').forEach((arrow,i)=>animate(arrow,[{opacity:.2,transform:'translateX(-8px)'},{opacity:1,transform:'translateX(0)'}],Math.min(i*45,135)));
   }
  },{threshold:.05,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(section=>revealObserver.observe(section));
 }catch{/* An unavailable observer must not affect reading or interactions. */}
}
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)activeAnimations.forEach(animation=>animation.cancel());});
addEventListener('pagehide',()=>activeAnimations.forEach(animation=>animation.cancel()));
