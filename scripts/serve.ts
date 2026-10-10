import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
export function serve(port=4173){
 const root=resolve('dist');
 const types:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json','.txt':'text/plain'};
 const server=createServer(async(req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url??'/',`http://127.0.0.1:${port}`).pathname);
   let file=resolve(root,'.'+pathname);
   if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
   if((await stat(file)).isDirectory())file=resolve(file,'index.html');
   const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html')));}
 });
 server.listen(port,'127.0.0.1',()=>console.log(`Local preview: http://127.0.0.1:${port}`));return server;
}
if(process.argv[1]?.endsWith('serve.ts'))serve(Number(process.env.PORT??4173));
