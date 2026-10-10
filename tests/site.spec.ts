import {test,expect} from '@playwright/test';
test('desktop search, keyboard charts, copying, navigation and assets',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');
 await expect(page).toHaveTitle(/On-chain stories/);
 await page.getByRole('searchbox').fill('missing');await expect(page.locator('.empty')).toBeVisible();
 await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.locator('[data-card]')).toBeVisible();
 await page.getByRole('searchbox').fill('79au');await expect(page.locator('[data-card]')).toBeVisible();
 await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
 await page.getByRole('link',{name:'Explore the investigation'}).click();
 const seller=page.getByRole('button',{name:'Seller B 500,000 79AU'});await seller.focus();await page.keyboard.press('Enter');await expect(seller).toHaveAttribute('aria-pressed','true');await expect(page.locator('#detail-nine-pulls')).toContainText('Identity unresolved');
 const holding=page.getByRole('button',{name:'Primary holding'});await holding.focus();await page.keyboard.press('Space');await expect(page.locator('#detail-fund-flow')).toContainText('14,384.806266');await expect(page.locator('#detail-fund-flow a')).toHaveAttribute('href',/bscscan.com/);
 await page.getByText('Accessible data table',{exact:true}).click();await expect(page.locator('table')).toBeVisible();
 await page.getByRole('button',{name:'Copy prompt',exact:true}).click();await expect(page.locator('.prompt-status')).toHaveText('Copied to clipboard.');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('0xee0e4416');
 await page.getByRole('button',{name:'Copy article link'}).click();await expect(page.locator('.copy-status')).toHaveText('Copied to clipboard.');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:'test-results/article-desktop.png',fullPage:true});
 for(let i=0;i<3;i++){await page.getByRole('link',{name:/Back to all investigations/}).click();await page.getByRole('link',{name:'Read investigation',exact:false}).click();await expect(page.locator('h1')).toContainText('79AU');}
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBe(true);expect(errors).toEqual([]);
});
for(const width of [360,390])test(`mobile ${width}: readable routes, no overflow, reduced motion`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
 await page.getByRole('link',{name:'Explore the investigation'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'Tornado.cash proxy'}).click();await expect(page.locator('#detail-fund-flow')).toContainText('1 BNB');
 await expect(page.locator('.article-cover')).toHaveJSProperty('naturalWidth',3200);
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:`test-results/article-${width}.png`,fullPage:true});
 await page.locator('#fund-flow').screenshot({path:`test-results/flow-${width}.png`});
});
test('deep links, missing routes and no-JavaScript reading',async({browser,page})=>{
 const response=await page.goto('/missing-route/');expect(response?.status()).toBe(404);
 const context=await browser.newContext({javaScriptEnabled:false});const plain=await context.newPage();await plain.goto('/insights/79au-privileged-function/');await expect(plain.locator('h1')).toContainText('79AU');await plain.getByText('Read all routes and wallet details',{exact:true}).click();await expect(plain.getByText('1,302 BNB',{exact:false}).last()).toBeVisible();await context.close();
});
