import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'**/*.spec.ts',fullyParallel:false,workers:1,use:{baseURL:'http://127.0.0.1:4173',channel:process.env.BROWSER_CHANNEL??'msedge',headless:true},webServer:{command:'npm run preview',url:'http://127.0.0.1:4173',reuseExistingServer:true},reporter:'list'});
