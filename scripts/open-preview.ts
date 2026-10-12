import {chromium} from '@playwright/test';
// A visible preview must track the user's window, not emulate a test viewport.
const browser=await chromium.launch({channel:'chrome',headless:false,args:['--start-maximized']});
const page=await browser.newPage({viewport:null});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await new Promise<void>(resolve=>browser.on('disconnected',()=>resolve()));
