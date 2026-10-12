import {test,expect} from '@playwright/test';

test('derived shares, route selection, history, and layout stability',async({page})=>{
 await page.goto('/insights/79au-privileged-function/');
 await page.evaluate(()=>document.fonts.ready);
 const chart=page.locator('#nine-pulls');
 await chart.scrollIntoViewIfNeeded();
 await page.getByRole('checkbox',{name:'Show shares of the total'}).check();
 await expect(chart).toContainText('Shares of 2,520,000 79AU');
 await expect(chart.getByText('· 79.8%',{exact:true})).toBeVisible();
 await expect(chart).toContainText('2,010,000 79AU');
 await page.getByRole('checkbox',{name:'Show shares of the total'}).uncheck();
 await expect(chart.locator('[data-share]').first()).toBeHidden();
 const wallet=page.getByRole('button',{name:/^Collection wallet/}).first();
 await wallet.focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('#detail-fund-flow')).toContainText('14,394.916171 BNB');
 await expect(page.locator('#detail-fund-flow')).toContainText('not a complete reconciliation');
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('button',{name:/^Primary holding/})).toBeFocused();
 await expect(page.locator('#detail-fund-flow')).toContainText('14,384.806266');
 await page.getByRole('link',{name:/Back to all investigations/}).click();
 await page.goBack();await expect(page.locator('h1')).toContainText('79AU');
 await page.goForward();await expect(page.locator('.research-grid')).toBeVisible();
 await page.goBack();await page.getByRole('button',{name:/^Tornado\.cash proxy/}).click();
 await expect(page.locator('#detail-fund-flow')).toContainText('possible test deposit');
 // Opacity/transforms must not change document dimensions while scrolling.
 const height=await page.evaluate(()=>document.documentElement.scrollHeight);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.locator('#conclusion').scrollIntoViewIfNeeded();
 expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBe(height);
});

for(const mode of ['missing','throws'] as const)test(`content and controls survive an observer that ${mode}`,async({page})=>{
 await page.addInitScript(mode=>{
  Object.defineProperty(window,'IntersectionObserver',{value:mode==='missing'?undefined:class{constructor(){throw new Error('Observer unavailable');}},configurable:true});
 },mode);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/insights/79au-privileged-function/');
 await expect(page.locator('#permission')).toBeVisible();
 await page.getByRole('checkbox',{name:'Show shares of the total'}).check();
 await expect(page.getByText('· 79.8%',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/^Primary holding/}).click();
 await expect(page.locator('#detail-fund-flow')).toContainText('14,384.806266');
 expect(errors).toEqual([]);
});

test('reduced motion cancels active animations and keeps figures visible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/insights/79au-privileged-function/');
 await page.locator('#fund-flow').scrollIntoViewIfNeeded();
 expect(await page.evaluate(()=>document.getAnimations().length)).toBe(0);
 await expect(page.getByRole('button',{name:/^Primary holding/})).toBeVisible();
});

test('record the reading and chart interaction',async({browser})=>{
 const context=await browser.newContext({viewport:{width:1280,height:900},recordVideo:{dir:'test-results/interaction-recording',size:{width:1280,height:900}}});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/');
 // Brief dwell times make the review recording readable; assertions use locators.
 await page.waitForTimeout(600);
 await page.getByRole('link',{name:'Read the investigation',exact:true}).first().click();
 await page.waitForTimeout(600);
 await page.locator('#nine-pulls').scrollIntoViewIfNeeded();
 await page.waitForTimeout(600);
 await page.getByRole('checkbox',{name:'Show shares of the total'}).check();
 await page.getByRole('button',{name:/Seller B 500,000/}).click();
 await page.waitForTimeout(600);
 await page.locator('#fund-flow').scrollIntoViewIfNeeded();
 await page.waitForTimeout(600);
 await page.getByRole('button',{name:/^Primary holding/}).click();
 await page.waitForTimeout(600);
 await page.getByRole('button',{name:/1,302 BNB from/}).click();
 await page.waitForTimeout(600);
 await page.locator('#conclusion').scrollIntoViewIfNeeded();
 await page.waitForTimeout(600);
 await context.close();
});

test('touch selection on a narrow viewport and a small runtime bundle',async({browser,request})=>{
 const context=await browser.newContext({viewport:{width:320,height:780},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/insights/79au-privileged-function/');
 await page.getByRole('checkbox',{name:'Show shares of the total'}).tap();
 await expect(page.getByText('· 79.8%',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/^Primary holding/}).tap();
 await expect(page.locator('#detail-fund-flow')).toContainText('14,384.806266');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await (await request.get('/assets/client.js')).body()).length).toBeLessThan(8000);
 await context.close();
});
