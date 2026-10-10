import {readFile,readdir} from 'node:fs/promises';
import {articleSchema,type Article} from './schema.js';
export async function loadArticles(directory='content/articles'):Promise<Article[]>{
 const articles:Article[]=[];
 for(const file of (await readdir(directory)).filter(f=>f.endsWith('.json'))){
  const result=articleSchema.safeParse(JSON.parse(await readFile(`${directory}/${file}`,'utf8')));
  if(!result.success)throw new Error(`${file}: ${result.error.message}`);
  if(articles.some(a=>a.slug===result.data.slug))throw new Error(`Duplicate slug: ${result.data.slug}`);
  articles.push(result.data);
 }
 return articles.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
