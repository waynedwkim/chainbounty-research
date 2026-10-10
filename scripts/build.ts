import {mkdir,readFile,writeFile,cp,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {chromium} from '@playwright/test';
import {loadArticles} from '../src/content.js';
import {home,articlePage,shell} from '../src/render.js';
import {makeLockedCover,assertCoverStyle,coverLayoutIssues,COVER_STYLE} from '../templates/cover/cover-lock.mjs';
export async function buildSite(){
 const all=await loadArticles();const articles=all.filter(a=>a.status==='published');
 const dist=resolve('dist');if(dist!==resolve(process.cwd(),'dist'))throw new Error('Unsafe output');
 await rm(dist,{recursive:true,force:true});await mkdir(`${dist}/assets/covers`,{recursive:true});
 await cp('public',dist,{recursive:true});
 await build({entryPoints:['src/client.ts'],bundle:true,minify:true,outfile:`${dist}/assets/client.js`,target:'es2022'});
 await cp('src/site.css',`${dist}/assets/site.css`);
 const logo=JSON.parse(await readFile('templates/cover/logo-embed.json','utf8'));
 const profile=JSON.parse(await readFile('templates/cover/cover-fonts.json','utf8'));
 const fontCSS=[];
 for(const spec of Object.values(profile.fonts) as {file:string;sha256:string;family:string;style:string}[]){
  const bytes=await readFile(`public/assets/fonts/${spec.file}`);
  if(createHash('sha256').update(bytes).digest('hex')!==spec.sha256)throw new Error(`Locked font mismatch: ${spec.file}`);
  fontCSS.push(`@font-face{font-family:'${spec.family}';font-weight:${spec.style==='Bold'?700:400};src:url(data:font/ttf;base64,${bytes.toString('base64')})}`);
 }
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL??'msedge',headless:true});
 const receipts=[];
 try{
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:2});
  for(const a of articles){
   const svg=makeLockedCover(a.cover,'blog-cover',logo);
   const check=assertCoverStyle(svg,'blog-cover',logo);
   await page.setContent(`<html><head><style>${fontCSS.join('')}body{margin:0}</style></head><body>${svg}</body></html>`);
   await page.evaluate(()=>document.fonts.ready);
   await page.addScriptTag({content:`var COVER_STYLE=${JSON.stringify(COVER_STYLE)};`});
   const issues=await page.locator('svg[data-cover-style]').evaluate(coverLayoutIssues);
   if(issues.length)throw new Error(`${a.slug}: ${issues.join(', ')}`);
   await page.screenshot({path:`${dist}/assets/covers/${a.slug}.png`});
   await writeFile(`${dist}/assets/covers/${a.slug}.svg`,svg.replace('<rect id="background"',`<style>${fontCSS.join('')}</style><rect id="background"`));
   receipts.push({slug:a.slug,style:check.style,fingerprint:createHash('sha256').update(check.signature).digest('hex'),width:3200,height:1800,layoutIssues:issues});
   await mkdir(`${dist}/insights/${a.slug}`,{recursive:true});
   await writeFile(`${dist}/insights/${a.slug}/index.html`,articlePage(a));
  }
 }finally{await browser.close();}
 await writeFile(`${dist}/index.html`,home(articles));
 await writeFile(`${dist}/404.html`,shell('Page not found','The requested investigation could not be found.','<main id="main" class="wrap home-intro"><p class="eyebrow">404 / NOT FOUND</p><h1>This route ends here.</h1><p>The investigation may have moved.</p><a href="/">Return to the research library →</a></main>'));
 await writeFile(`${dist}/robots.txt`,'User-agent: *\nDisallow: /\n');
 await writeFile(`${dist}/cover-validation.json`,JSON.stringify(receipts,null,2));
 console.log(`Built ${articles.length} article(s); ${all.length-articles.length} draft(s) excluded. Covers: 3200 × 1800, font hashes and locked style verified.`);
}
if(process.argv[1]?.endsWith('build.ts'))await buildSite();
