import {test,expect} from '@playwright/test';
import {loadCommunityPosts} from '../src/content.js';
const posts=await loadCommunityPosts();
for(const width of [320,390,768,1280,2048])test(`official Community cards at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('link',{name:'Community articles',exact:true}).click();await expect(page).toHaveURL(/#community$/);
 await expect(page.locator('#approach')).toHaveCount(0);await expect(page.locator('.community-card')).toHaveCount(2);
 for(const [i,post] of posts.entries()){
  const card=page.locator('.community-card').nth(i);await card.scrollIntoViewIfNeeded();
  await expect(card.locator('h3')).toHaveText(post.title);await expect(card.locator('time')).toHaveAttribute('datetime',post.publishedAt);
  await expect(card.locator('img')).toHaveJSProperty('naturalWidth',3200);
  expect(await card.locator('img').evaluate(img=>{const r=img.getBoundingClientRect();return Math.abs(r.width/(r.height-1)-16/9)<.02;})).toBe(true);
  expect(await card.evaluate(el=>[...el.querySelectorAll('h3,p')].every(e=>e.scrollWidth<=e.clientWidth&&e.scrollHeight<=e.clientHeight))).toBe(true);
  const link=card.getByRole('link');await expect(link).toHaveAttribute('href',post.url);await link.focus();await expect(link).toBeFocused();
  // Intercept only the external destination; verify keyboard activation without making CI depend on the live service.
  await page.route(post.url,route=>route.fulfill({body:'<h1>Official article destination</h1>',contentType:'text/html'}));
  await page.keyboard.press('Enter');await expect(page).toHaveURL(post.url);await page.goBack();
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
 await page.locator('#community').screenshot({path:`test-results/community-${width}.png`,animations:'disabled',style:'.masthead{visibility:hidden}'});
});
