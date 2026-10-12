import {test,expect} from '@playwright/test';

for(const width of [320,390,768,1024,1280,1440,2048])test(`publication navigation and complete layout at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const path of ['/','/insights/79au-privileged-function/']){
  await page.goto(path);await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  expect(await page.evaluate(()=>document.body.getBoundingClientRect().width)).toBe(width);
  expect(await page.evaluate(()=>document.scrollingElement?.tagName)).toBe('HTML');
  await expect(page.locator('iframe')).toHaveCount(0);
  for(const region of [page.locator('header'),page.locator('footer')]){
   const x=region.getByRole('link',{name:'X / Twitter'});
   await expect(x).toBeVisible();await expect(x).toHaveAttribute('href','https://x.com/ChainBountyX');
   await expect(region.getByRole('link',{name:'Community',exact:true})).toHaveAttribute('href','https://community.chainbounty.io/');
   await expect(region.getByRole('link',{name:'Community',exact:true})).toBeVisible();
   await x.focus();await expect(x).toBeFocused();
  }
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(page.locator('form[role=search],select')).toHaveCount(0);
  await expect(page.getByText('ChainBounty / Research journal',{exact:true})).toHaveCount(0);
  const cover=page.locator(path==='/'?'.feature-art img':'.article-cover');
  const ratio=await cover.evaluate(image=>{const box=image.getBoundingClientRect();const style=getComputedStyle(image);return (box.width-parseFloat(style.borderLeftWidth)-parseFloat(style.borderRightWidth))/(box.height-parseFloat(style.borderTopWidth)-parseFloat(style.borderBottomWidth));});
  expect(ratio).toBeCloseTo(16/9,2);
  if(path==='/'&&width>=1024){
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   const cta=await page.locator('.feature-copy .button').boundingBox();expect(cta!.y+cta!.height).toBeLessThan(900);
  }
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`test-results/publication-${width}-${path==='/'?'home':'article'}.png`,fullPage:true,animations:'disabled'});
 }
 await page.goto('/');await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page).toHaveURL(/#main$/);
 const link=page.locator('.research-card .text-link');
 expect(await link.evaluate(el=>getComputedStyle(el).textDecorationLine)).toBe('none');
 expect(await link.locator('.link-label').evaluate(el=>getComputedStyle(el).textDecorationLine)).toBe('underline');
 await expect(link.locator('svg')).toHaveAttribute('aria-hidden','true');
 const label=await link.locator('.link-label').boundingBox();const icon=await link.locator('svg').boundingBox();
 expect(icon!.x-label!.x-label!.width).toBeCloseTo(8,0);
 await link.focus();await page.keyboard.press('Enter');await expect(page.locator('h1')).toContainText('79AU');
});
