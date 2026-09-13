/** Author: Manuel Dinis Júnior. Customer sessions are separate from admin sessions. */
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { hash, token } from './auth.mjs';
import { assert } from './validation.mjs';
import { queueEmail } from './domain.mjs';
export async function sendCustomerLink(db, cfg, customer) {
  if (!cfg.emailEnabled) return;
  const secret = token();
  await db.query("INSERT INTO customer_tokens VALUES($1,$2,now()+interval '20 minutes')", [hash(secret),customer.id]);
  await queueEmail(db,`customer:${hash(secret)}`,customer.email,'Dein sicherer Urfa-Kontozugang',`Bestätige deine E-Mail-Adresse und öffne dein Konto: ${cfg.publicUrl}/#/account?token=${secret}\nDer Link ist einmalig und 20 Minuten gültig. Falls du dies nicht angefordert hast, ignoriere diese Nachricht.`);
}
export async function accountAfterOrder(tx, cfg, email) {
  const result = await tx.query('INSERT INTO customers(id,email) VALUES($1,$2) ON CONFLICT(email) DO NOTHING RETURNING *',[randomUUID(),email.toLowerCase()]);
  if(result.rows[0]) await sendCustomerLink(tx,cfg,result.rows[0]);
}
export function customerRoutes(app, db, cfg, admin, limit) {
  const cookie={httpOnly:true,secure:cfg.production,sameSite:'lax',path:'/api'};
  const requireCustomer=async(req,res,next)=>{
    const row=(await db.query('SELECT c.id,c.email FROM customer_sessions s JOIN customers c ON c.id=s.customer_id WHERE s.token_hash=$1 AND s.expires_at>now() AND c.verified_at IS NOT NULL',[hash(req.cookies.urfa_customer||'')])).rows[0];
    assert(row,401,'Bitte im Kundenkonto anmelden'); req.customer=row;next();
  };
  app.post('/api/customer/login',limit(5,'customer-login'),async(req,res)=>{
    const email=z.string().email().max(254).parse(req.body.email).toLowerCase();
    assert(cfg.emailEnabled,503,'E-Mail-Anmeldung ist noch nicht eingerichtet');
    const customer=(await db.query('SELECT * FROM customers WHERE email=$1',[email])).rows[0];
    if(customer) await sendCustomerLink(db,cfg,customer);
    res.json({message:'Wenn ein Konto vorhanden ist, erhältst du einen Anmeldelink. Dein Konto entsteht bei der ersten Bestellung.'});
  });
  app.post('/api/customer/verify',limit(10,'customer-verify'),async(req,res)=>{
    const secret=z.string().regex(/^[a-f0-9]{64}$/).parse(req.body.token);
    const session=token();
    await db.tx(async tx=>{
      const row=(await tx.query('DELETE FROM customer_tokens WHERE token_hash=$1 AND expires_at>now() RETURNING customer_id',[hash(secret)])).rows[0];
      assert(row,401,'Link ist ungültig oder abgelaufen');
      await tx.query('UPDATE customers SET verified_at=COALESCE(verified_at,now()) WHERE id=$1',[row.customer_id]);
      await tx.query("INSERT INTO customer_sessions VALUES($1,$2,now()+interval '7 days')",[hash(session),row.customer_id]);
    });
    res.cookie('urfa_customer',session,{...cookie,maxAge:604800000});res.json({ok:true});
  });
  app.post('/api/customer/logout',async(req,res)=>{await db.query('DELETE FROM customer_sessions WHERE token_hash=$1',[hash(req.cookies.urfa_customer||'')]);res.clearCookie('urfa_customer',cookie);res.json({ok:true});});
  app.get('/api/customer/me',requireCustomer,(req,res)=>res.json(req.customer));
  app.get('/api/customer/orders',requireCustomer,async(req,res)=>res.json((await db.query("SELECT id,order_number,items,total_cents,status,created_at FROM orders WHERE lower(customer->>'email')=$1 ORDER BY created_at DESC LIMIT 100",[req.customer.email])).rows));
  app.get('/api/customer/favorites',requireCustomer,async(req,res)=>res.json((await db.query('SELECT product_id FROM customer_favorites WHERE customer_id=$1',[req.customer.id])).rows.map(r=>r.product_id)));
  app.put('/api/customer/favorites/:id',requireCustomer,async(req,res)=>{
    const p=(await db.query('SELECT id FROM products WHERE id=$1 AND deleted_at IS NULL',[req.params.id])).rows[0];assert(p,404,'Produkt nicht gefunden');
    await db.query('INSERT INTO customer_favorites VALUES($1,$2) ON CONFLICT DO NOTHING',[req.customer.id,p.id]);res.json({ok:true});
  });
  app.delete('/api/customer/favorites/:id',requireCustomer,async(req,res)=>{await db.query('DELETE FROM customer_favorites WHERE customer_id=$1 AND product_id=$2',[req.customer.id,req.params.id]);res.json({ok:true});});
  const cartItem=z.object({id:z.string().max(100),lineId:z.string().max(1000),name:z.string().max(200),quantity:z.number().int().min(1).max(20),price:z.number().min(0).max(10000),imageUrl:z.string().max(2000),selectedOptions:z.array(z.object({groupId:z.string(),groupName:z.string(),optionId:z.string(),optionName:z.string(),price:z.number().optional()})).max(20).optional(),selectedExtras:z.array(z.object({id:z.string(),name:z.string(),price:z.number()})).max(20).optional()});
  const cleanup=async()=>db.query('DELETE FROM customer_carts WHERE expires_at<=now()');
  app.get('/api/customer/cart',requireCustomer,async(req,res)=>{await cleanup();const row=(await db.query('SELECT items,expires_at FROM customer_carts WHERE customer_id=$1',[req.customer.id])).rows[0];res.json(row||{items:[],expires_at:null});});
  app.put('/api/customer/cart',limit(120,'customer-cart'),requireCustomer,async(req,res)=>{
    const items=z.array(cartItem).max(100).parse(req.body.items);await cleanup();
    if(!items.length){await db.query('DELETE FROM customer_carts WHERE customer_id=$1',[req.customer.id]);return res.json({items:[],expires_at:null});}
    // Prices are recomputed by the existing checkout; cart values never authorize a charge.
    const row=(await db.query("INSERT INTO customer_carts VALUES($1,$2,now()+interval '24 hours') ON CONFLICT(customer_id) DO UPDATE SET items=EXCLUDED.items RETURNING items,expires_at",[req.customer.id,JSON.stringify(items)])).rows[0];res.json(row);
  });
  app.get('/api/admin/carts',admin,async(req,res)=>{await cleanup();res.json((await db.query('SELECT c.email,cart.items,cart.expires_at FROM customer_carts cart JOIN customers c ON c.id=cart.customer_id ORDER BY cart.expires_at')).rows);});
}
