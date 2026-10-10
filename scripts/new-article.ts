import {readFile,writeFile} from 'node:fs/promises';
const slug=process.argv[2];if(!slug||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error('Usage: npm run new:article -- case-slug');
const sample=JSON.parse(await readFile('content/articles/79au.json','utf8'));
sample.slug=slug;sample.status='draft';sample.title='Replace with approved article title';sample.dek='Replace with the approved summary';sample.cover={title:'New investigation',subtitle:['Replace with approved subtitle'],dateline:'Replace date'};
sample.metrics=[{value:'Pending',label:'Replace with approved quantities'}];sample.blocks=[{type:'prose',id:'overview',title:'Overview',paragraphs:['Replace with approved public copy. This is a draft and is excluded from the build.']}];
sample.sources=[{label:'Replace with approved public source',url:'https://community.chainbounty.io/'}];
sample.cta={title:'Continue this investigation',description:'Replace with a case-specific follow-up.',label:'Request access',url:'https://sentineltx.ai/',prompt:'Replace with a case-specific prompt and seed.'};
await writeFile(`content/articles/${slug}.json`,JSON.stringify(sample,null,2)+'\n',{flag:'wx'});console.log(`Created draft ${slug}; edit metadata, sources and all case content before setting status to published.`);
