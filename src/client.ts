const form=document.querySelector<HTMLFormElement>('.filters');
if(form){
 const apply=()=>{
  const data=new FormData(form);const q=String(data.get('q')??'').trim().toLowerCase();const chain=String(data.get('chain')??'');
  let count=0;
  document.querySelectorAll<HTMLElement>('[data-card]').forEach(card=>{card.hidden=!(card.dataset.search?.includes(q)&&(!chain||card.dataset.chain===chain));if(!card.hidden)count++;});
  document.querySelector('.result-count')!.textContent=`${count} investigation${count===1?'':'s'}`;
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
async function copy(text:string,status:Element){
 try{await navigator.clipboard.writeText(text);status.textContent='Copied to clipboard.';}
 catch{status.textContent='Clipboard unavailable. Select and copy the visible text or browser address manually.';}
}
document.querySelector('[data-copy-link]')?.addEventListener('click',()=>void copy(location.href.split('#')[0],document.querySelector('.copy-status')!));
document.querySelector('[data-copy-prompt]')?.addEventListener('click',()=>void copy(document.getElementById('investigation-prompt')!.textContent!,document.querySelector('.prompt-status')!));
const progress=document.querySelector<HTMLElement>('.reading-progress');
if(progress){const update=()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${total>0?Math.min(100,scrollY/total*100):0}%`;};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}
if('IntersectionObserver' in window){
 const links=[...document.querySelectorAll<HTMLAnchorElement>('aside nav a')];
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-10% 0px -70% 0px'});
 document.querySelectorAll('.article-body > section').forEach(s=>observer.observe(s));
}
