import { z } from 'zod';
const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const link = z.url().refine(v => v.startsWith('https://'), 'Only HTTPS source links are allowed');
const source = z.object({label:text, url:link}).strict();
const common = {id, title:text};
const figure = {caption:text, note:text, source};
const tone = z.enum(['slate','sage','amber']);
const node = z.object({id, label:text, role:text, detail:text, url:link.optional(), tone}).strict();
export const blockSchema = z.discriminatedUnion('type',[
  z.object({...common, type:z.literal('prose'), paragraphs:z.array(text).min(1)}).strict(),
  z.object({...common, ...figure, type:z.literal('bars'), unit:text, rows:z.array(z.object({label:text, value:z.number().finite().nonnegative(), detail:text,tone}).strict()).min(1)}).strict(),
  z.object({...common,...figure,type:z.literal('flow'),context:text, nodes:z.array(node).min(2), edges:z.array(z.object({from:id,to:id,label:text,kind:z.enum(['observed','reported'])}).strict()).min(1)}).strict(),
  z.object({...common,type:z.literal('conclusion'),paragraphs:z.array(text).min(1),takeaways:z.array(text).min(1)}).strict()
]);
export const articleSchema = z.object({
  schemaVersion:z.literal(1),slug:id,status:z.enum(['draft','published']),title:text,dek:text,category:text,chain:text,
  publishedAt:z.iso.date(),asOf:text,author:text,readingMinutes:z.number().int().positive(),
  cover:z.object({title:text,subtitle:z.array(text).min(1).max(2),dateline:text}).strict(),
  metrics:z.array(z.object({value:text,label:text}).strict()).min(1).max(4),
  blocks:z.array(blockSchema).min(1),sources:z.array(source).min(1),
  cta:z.object({title:text,description:text,label:text,url:link,prompt:text}).strict()
}).strict().superRefine((article,ctx)=>{
  const ids=new Set<string>();
  for(const block of article.blocks){
    if(ids.has(block.id)||['sources','follow-up'].includes(block.id))ctx.addIssue({code:'custom',message:`Duplicate or reserved section id: ${block.id}`});
    ids.add(block.id);
    if(block.type==='flow'){
      const nodes=new Set(block.nodes.map(n=>n.id));
      if(nodes.size!==block.nodes.length)ctx.addIssue({code:'custom',message:'Duplicate flow node id'});
      for(const edge of block.edges)if(!nodes.has(edge.from)||!nodes.has(edge.to))ctx.addIssue({code:'custom',message:'Flow edge refers to missing node'});
    }
  }
});
export type Article=z.infer<typeof articleSchema>;
export type Block=z.infer<typeof blockSchema>;
