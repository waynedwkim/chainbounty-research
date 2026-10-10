import {watch} from 'node:fs';
import {buildSite} from './build.js';
import {serve} from './serve.js';
await buildSite();serve();
let timer:ReturnType<typeof setTimeout>;let building=false;let pending=false;
async function rebuild(){if(building){pending=true;return;}building=true;try{await buildSite();console.log('Reload the browser to see updates.');}catch(e){console.error(e);}finally{building=false;if(pending){pending=false;void rebuild();}}}
for(const path of ['content','src','public','templates'])watch(path,{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(()=>void rebuild(),150);});
