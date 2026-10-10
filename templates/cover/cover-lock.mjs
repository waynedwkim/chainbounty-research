// One portable, Base-reference cover family. No operating-system font fallback.
export const COVER_STYLE={id:'base-reference-portable-1',canvas:[1600,900],export:[3200,1800],x:144,right:1456,label:'Investigation analysis',labelSize:34,labelWeight:400,titleFont:'Liberation Serif',titleWeight:700,bodyFont:'Liberation Sans',bodyWeight:400,subtitleSize:54,subtitleLineHeight:64,dateSize:34,ink:'#000000',muted:'#555555',background:'#FFFFFF',logo:{x:144,width:360,height:80,sourceViewBox:'0 0 720 160',clearSpace:18},variants:{'blog-cover':{logoY:134,labelY:300,titleY:443,titleSize:110,subtitleY:551,dateY:716},'x-thumbnail':{logoY:142,labelY:306,titleY:465,titleSize:116,subtitleY:573,dateY:728}},maxTitleLines:1,maxSubtitleLines:2,maxDateLines:1,separators:false};
export const COVER_FIELDS=['headline-1','subtitle','subtitle-2','dateline'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function makeLockedCover(o,role,logo){
 const b=COVER_STYLE,v=b.variants[role];if(!v)throw Error('Cover role must be blog-cover or x-thumbnail');
 if(!logo?.inner||logo.width!==720||logo.height!==160)throw Error('Original embedded logo required');
 if(!Object.hasOwn(o,'subtitle')||!(typeof o.subtitle==='string'||Array.isArray(o.subtitle)))throw Error('Subtitle is required as nonempty text or one to two nonempty lines');
 const lines=Array.isArray(o.subtitle)?o.subtitle:o.subtitle.split('\n');
 if(lines.length<1||lines.length>2||lines.some(x=>typeof x!=='string'||!x.trim()))throw Error('Subtitle must contain one to two nonempty lines');
 if(lines.length>2||[o.title,o.dateline,...lines].some(x=>typeof x!=='string'||/[\r\n]/.test(x))||!o.title.trim()||!lines[0].trim()||!o.dateline.trim())throw Error('Use one title, one date and at most two subtitle lines. Shorten editorial text; never shrink fonts or redesign.');
 if(o.sectionLabel&&o.sectionLabel!==b.label)throw Error('The sentence-case cover label is locked');
 const text=(id,y,value,size,font=b.bodyFont,weight=400,fill=b.ink)=>`<text id="${id}" x="144" y="${y}" fill="${fill}" font-family="${font}" font-size="${size}" font-weight="${weight}">${esc(value)}</text>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="svg-title svg-desc" data-cover-style="${b.id}" data-media-role="${role}" data-palette="muted" data-palette-family="${role}"><title id="svg-title">${esc(o.accessibleTitle||o.title)}</title><desc id="svg-desc">${esc(o.description||`ChainBounty investigation analysis: ${o.title}; ${lines.join(' ')}; ${o.dateline}.`)} Palette key: Neutral cover. Original logo unchanged.</desc><rect id="background" width="1600" height="900" fill="#FFFFFF"/><svg id="chainbounty-logo" x="144" y="${v.logoY}" width="360" height="80" viewBox="0 0 720 160" preserveAspectRatio="xMidYMid meet" aria-label="ChainBounty logo">${logo.inner}</svg>${text('section-label',v.labelY,b.label,b.labelSize)}${text('headline-1',v.titleY,o.title,v.titleSize,b.titleFont,700)}${text('subtitle',v.subtitleY,lines[0],54)}${text('subtitle-2',v.subtitleY+64,lines[1]||'',54)}${text('dateline',v.dateY,o.dateline,34,b.bodyFont,400,b.muted)}</svg>`;
}
// Canonical structure includes every attribute, logo byte, element and fixed label.
// Only designated text, accessible title/description and the neutral palette mode vary.
export function coverStyleSignature(svg){
 svg=svg.replace(/<text\b([^>]*?)\/>/g,'<text$1></text>');for(const m of svg.matchAll(/<text\b[^>]*id="(?:headline-1|subtitle|subtitle-2|dateline)"[^>]*>([\s\S]*?)<\/text>/g))if(/</.test(m[1]))throw Error('Editable cover fields must contain plain text only');
 return svg.replace(/<(title|desc)\b[^>]*>[\s\S]*?<\/\1>/g,(_,tag)=>`<${tag}/>`) .replace(/(<text\b[^>]*\bid="(?:headline-1|subtitle|subtitle-2|dateline)"[^>]*>)[\s\S]*?(<\/text>)/g,'$1{DATA}$2').replace(/data-palette="(?:muted|bw)"/g,'data-palette="neutral"').replace(/<([\w:-]+)\b([^>]*?)(\/?)>/g,(_,tag,attrs,closed)=>{
 const a=[...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]).filter(([k])=>k!=='xmlns').sort(([a],[b])=>a.localeCompare(b));
 const rest=attrs.replace(/[\w:-]+="[^"]*"/g,'').trim();if(rest)throw Error('Unrecognized SVG markup');
 return '<'+tag+a.map(([k,v])=>' '+k+'="'+v+'"').join('')+'>'+(closed?'</'+tag+'>':'');
 }).replace(/>\s+</g,'><').trim();
}
export function assertCoverStyle(svg,role,logo){
 const expected=makeLockedCover({title:'x',subtitle:'x',dateline:'x'},role,logo);
 if(coverStyleSignature(svg)!==coverStyleSignature(expected))throw Error('Cover style drift: restore the locked Base-reference template; only incident title, subtitle (maximum two lines) and date may change.');
 const text=id=>svg.match(new RegExp('<text\\b[^>]*id="'+id+'"[^>]*>([\\s\\S]*?)</text>'))?.[1]||'';
 if(!text('headline-1').trim()||!text('subtitle').trim()||!text('dateline').trim())throw Error('Title, subtitle and date are required');
 if(COVER_FIELDS.some(id=>/[\r\n]/.test(text(id))))throw Error('Use the separate bounded subtitle lines; no unbounded wrapping');
 return {style:COVER_STYLE.id,role,signature:coverStyleSignature(svg)};
}
export function coverLayoutIssues(svg){
 const role=svg.getAttribute('data-media-role'),b=COVER_STYLE,v=b.variants[role],issues=[];if(!v)return ['missing locked cover role'];
 for(const id of ['headline-1','subtitle','dateline'])if(!svg.querySelector('#'+id)?.textContent.trim())issues.push(id+': required text is empty');const nodes=[...svg.querySelectorAll(':scope > text')],boxes=[];
 for(const n of nodes){if(!n.textContent.trim())continue;const r=n.getBBox();boxes.push({id:n.id,r});if(r.x<144-.1||r.x+r.width>1456+.1||r.y<0||r.y+r.height>810)issues.push(n.id+': outside fixed text region; shorten text');}
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],c=boxes[j];if(Math.min(a.r.x+a.r.width,c.r.x+c.r.width)>Math.max(a.r.x,c.r.x)&&Math.min(a.r.y+a.r.height,c.r.y+c.r.height)>Math.max(a.r.y,c.r.y))issues.push(a.id+' / '+c.id+': overlap');}
 return issues;
}
