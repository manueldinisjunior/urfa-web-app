/** Import only published restaurant catalog data, never third-party application code. */
import fs from 'node:fs/promises';
import { load } from 'cheerio';
const source=process.argv[2];if(!source)throw new Error('Usage: node scripts/import-menu.mjs path-to-downloaded-menu.html');
const $=load(await fs.readFile(source,'utf8'));const clean=s=>s.replace(/\s+/g,' ').trim();const products=[];const categories=[];
$('.menucat').each((i,section)=>{
 const category=clean($(section).find('.category-name').first().text());const categoryDescription=clean($(section).find('.category-description').first().text());categories.push(category);
 $(section).find('[itemtype="http://schema.org/Product"]').each((_,element)=>{
  const el=$(element),name=clean(el.find('.product-name').text()),description=clean(el.find('.product-description').text());const price=Number(clean(el.find('.product-price').text()).replace('€','').trim().replace('.','').replace(',','.'));
  const button=el.find('.addtobasket');const onclick=button.attr('onclick')||'';const sourceId=button.attr('data-productid')||onclick.match(/menucard_ShowSideDishes\('([^']+)'/)?.[1];
  if(!name || !sourceId || !Number.isFinite(price))throw new Error(`Missing catalog data for ${name}`);
  const attributes=clean(el.find('.meal-description-attribute-descriptions').text());const allergy=el.find('[data-allergens]');
  const sourceMinAge=Number(button.attr('data-min-age')||0);const minAge=category==='Alkoholische Getränke'?Math.max(sourceMinAge,/Raki|Whisky/i.test(name)?18:16):sourceMinAge;
  products.push({id:`urfa-${sourceId.toLowerCase()}`,name,description:[categoryDescription,description].filter(Boolean).join(' '),category,price,imageUrl:'',featured:false,available:true,stockAvailable:true,optionGroups:[],extras:[],
   ingredients:[],modelUrl:'',sourceUrl:'https://www.urfagrill-hildesheim.de/',sourceProductId:sourceId,sourceCategoryId:onclick.match(/menucard_ShowSideDishes\('[^']+','([^']+)'/)?.[1]||'',importedAt:new Date().toISOString(),
   productInfo:attributes,depositCents:Math.round(Number((attributes.match(/Pfand \(([\d,]+)/)?.[1]||'0').replace(',','.'))*100),minAge,
   allergenCodes:(allergy.attr('data-allergens')||'').split(',').filter(Boolean),additiveCodes:(allergy.attr('data-additives')||'').split(',').filter(Boolean),configurationPending:onclick.includes('menucard_ShowSideDishes'),internalNotes:''});
 });
});
if(products.length<100||new Set(products.map(p=>p.id)).size!==products.length)throw new Error('Unexpected catalog count or duplicate IDs');
await fs.writeFile('src/data/catalog.json',JSON.stringify(products,null,2)+'\n');await fs.writeFile('src/data/categories.json',JSON.stringify(categories,null,2)+'\n');await fs.writeFile('server/seed-products.json',JSON.stringify(products,null,2)+'\n');
console.log(JSON.stringify({products:products.length,categories:categories.map(c=>({name:c,count:products.filter(p=>p.category===c).length})),configurationPending:products.filter(p=>p.configurationPending).length},null,2));
