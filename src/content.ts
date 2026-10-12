import {readFile,readdir} from 'node:fs/promises';
import {articleSchema,communityPostSchema,type Article,type CommunityPost} from './schema.js';
export async function loadCommunityPosts():Promise<CommunityPost[]>{
 const posts=communityPostSchema.array().parse(JSON.parse(await readFile('content/community-posts.json','utf8')));
 if(new Set(posts.map(p=>p.url)).size!==posts.length)throw new Error('Duplicate Community article');
 for(const post of posts)await readFile(`public${post.image}`);
 return posts.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
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
