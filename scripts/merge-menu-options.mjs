import fs from 'node:fs/promises';
import { load } from 'cheerio';
const products=JSON.parse(await fs.readFile('src/data/catalog.json','utf8'));
for(const product of products){
 if(!product.configurationPending)continue;
 const source=JSON.parse(await fs.readFile(`${process.argv[2]}/${product.sourceProductId}.json`,'utf8'));
 const $=load(source.html);
 const variants=source.json.map(size=>{
  const groups=[],extras=[];
  const captions=$(`#isidedishselectionform${size.id} h3`).map((_,e)=>$(e).text().trim().replace(/:$/,'')).get();
  (size.sidedishgroups||[]).forEach((group,index)=>{
   const options=(group.sidedishes||[]).map(o=>({id:o.id.toLowerCase(),name:o.name,price:Number(o.price_pickup??o.price)}));
   if(['1','3'].includes(group.type))groups.push({id:`choice-${index}`,name:captions[index]||`Auswahl ${index+1}`,required:true,options});
   else if(group.type==='2')extras.push(...options);
   else throw new Error(`Unknown choice type ${group.type}`);
  });
  return {id:size.id.toLowerCase(),name:size.name,price:Number(size.price_pickup??size.price),optionGroups:groups,extras};
 });
 if(variants.length>1){product.variants=variants;product.price=Math.min(...variants.map(v=>v.price));}
 else {product.optionGroups=variants[0].optionGroups;product.extras=variants[0].extras;product.price=variants[0].price;}
 product.configurationPending=false;
}
for(const p of products)p.featured=['Urfa Karisik Izgara','Dönertasche','Tavuk Şi̇ş','Baklava Portion'].includes(p.name);
await fs.writeFile('src/data/catalog.json',JSON.stringify(products,null,2)+'\n');await fs.writeFile('server/seed-products.json',JSON.stringify(products,null,2)+'\n');
console.log({products:products.length,variants:products.filter(p=>p.variants?.length).length,withChoices:products.filter(p=>p.optionGroups.length||p.extras.length||p.variants?.length).length});
