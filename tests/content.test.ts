import test from 'node:test';
import assert from 'node:assert/strict';
import {articleSchema} from '../src/schema.js';
import {loadArticles} from '../src/content.js';
import {articlePage,esc} from '../src/render.js';
const [article]=await loadArticles();
test('source quantities and units remain exact',()=>{const bars=article.blocks.find(b=>b.type==='bars')!;assert.equal(bars.type,'bars');if(bars.type==='bars'){assert.equal(bars.unit,'79AU');assert.equal(bars.rows.reduce((sum,r)=>sum+r.value,0),2520000);}assert.match(articlePage(article),/14,394.916171 BNB/);assert.match(articlePage(article),/14,384.806266 BNB/);});
test('unsafe source protocols, negative values and invalid edges fail',()=>{
 assert.equal(articleSchema.safeParse({...article,sources:[{label:'Bad',url:'javascript:alert(1)'}]}).success,false);
 const broken=structuredClone(article);const flow=broken.blocks.find(b=>b.type==='flow')!;if(flow.type==='flow')flow.edges[0].to='unknown';assert.equal(articleSchema.safeParse(broken).success,false);
 const negative=structuredClone(article);const bars=negative.blocks.find(b=>b.type==='bars')!;if(bars.type==='bars')bars.rows[0].value=-1;assert.equal(articleSchema.safeParse(negative).success,false);
});
test('duplicate sections rejected and author text escaped',()=>{assert.equal(articleSchema.safeParse({...article,blocks:[article.blocks[0],article.blocks[0]]}).success,false);assert.equal(esc('<script>"&'), '&lt;script&gt;&quot;&amp;');assert.ok(!articlePage({...article,title:'<script>alert(1)</script>'}).includes('<script>alert'));});
test('static article contains accessible alternatives and source links',()=>{const html=articlePage(article);assert.match(html,/<table>/);assert.match(html,/Read all routes and wallet details/);assert.match(html,/aria-controls="detail-fund-flow"/);assert.match(html,/October 9, 2026 report snapshot/);});
