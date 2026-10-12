import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {articleSchema} from '../src/schema.js';
import {loadArticles} from '../src/content.js';
import {articlePage,esc} from '../src/render.js';
import {formatDate,formatQuantity,readingTime,resultCount} from '../src/editorial.js';
const [article]=await loadArticles();
test('source quantities and units remain exact',()=>{const bars=article.blocks.find(b=>b.type==='bars')!;assert.equal(bars.type,'bars');if(bars.type==='bars'){assert.equal(bars.unit,'79AU');assert.equal(bars.rows.reduce((sum,r)=>sum+r.value,0),2520000);}assert.match(articlePage(article),/14,394.916171 BNB/);assert.match(articlePage(article),/14,384.806266 BNB/);});
test('unsafe source protocols, negative values and invalid edges fail',()=>{
 assert.equal(articleSchema.safeParse({...article,sources:[{label:'Bad',url:'javascript:alert(1)'}]}).success,false);
 const broken=structuredClone(article);const flow=broken.blocks.find(b=>b.type==='flow')!;if(flow.type==='flow')flow.edges[0].to='unknown';assert.equal(articleSchema.safeParse(broken).success,false);
 const negative=structuredClone(article);const bars=negative.blocks.find(b=>b.type==='bars')!;if(bars.type==='bars')bars.rows[0].value=-1;assert.equal(articleSchema.safeParse(negative).success,false);
});
test('duplicate sections rejected and author text escaped',()=>{assert.equal(articleSchema.safeParse({...article,blocks:[article.blocks[0],article.blocks[0]]}).success,false);assert.equal(esc('<script>"&'), '&lt;script&gt;&quot;&amp;');assert.ok(!articlePage({...article,title:'<script>alert(1)</script>'}).includes('<script>alert'));});
test('static article contains accessible alternatives and source links',()=>{const html=articlePage(article);assert.match(html,/<table>/);assert.match(html,/View routes and wallet details/);assert.match(html,/aria-controls="detail-fund-flow"/);assert.match(html,/Report snapshot: October 9, 2026/);});
test('reader dates are timezone-independent and source fractions are not rounded',()=>{
 assert.equal(formatDate('2026-10-09'),'October 9, 2026');
 assert.equal(formatDate('2026-01-01'),'January 1, 2026');
 assert.equal(formatQuantity(16249.117811),'16,249.117811');
 assert.equal(formatQuantity(3.790317),'3.790317');
 assert.equal(readingTime(4),'4-minute read');assert.equal(resultCount(1),'1 investigation');assert.equal(resultCount(0),'0 investigations');
});
test('shared rendering uses the current article provenance and date, not the sample case',()=>{
 const html=articlePage({...article,publishedAt:'2027-02-03',sourceNote:'Another report’s explicitly qualified scope.'});
 assert.match(html,/datetime="2027-02-03">February 3, 2027/);assert.match(html,/Another report’s explicitly qualified scope/);
 assert.match(html,/Shares of 2,520,000 79AU; rounded to one decimal place/);
 assert.match(html,/2,010,000 79AU/);assert.match(html,/79.8%/);
});
test('editorial changes preserve the published sample facts and locked cover text',()=>{
 const expected=JSON.parse(readFileSync(new URL('./fixtures/79au-source-facts.json',import.meta.url),'utf8'));
 const bars=article.blocks.find(b=>b.type==='bars')!;const flow=article.blocks.find(b=>b.type==='flow')!;
 if(bars.type!=='bars'||flow.type!=='flow')throw new Error('Missing source figure');
 const conclusion=article.blocks.find(b=>b.type==='conclusion')!;
 if(conclusion.type!=='conclusion')throw new Error('Missing conclusion');
 assert.deepEqual({cover:article.cover,publishedAt:article.publishedAt,metrics:article.metrics.map(m=>m.value),rows:bars.rows.map(({label,value})=>({label,value})),unit:bars.unit,nodes:flow.nodes,edges:flow.edges,captions:[bars.caption,flow.caption],conclusion:conclusion.paragraphs,prompt:article.cta.prompt},expected);
});
