export interface Settings {isOpen:boolean;openingHours:{closed:boolean;open:string;close:string}[];slotMinutes:30|60;durationMinutes:number;leadMinutes:number;slotLimit:number;totalTables:number;tableCapacity:number;preparationMinutes:number;autoConfirm:boolean;emailEnabled?:boolean;smsEnabled?:boolean;timezone?:string;}
export interface Customer {name:string;email:string;phone:string;address?:string;}
export interface HistoryEntry {status:string;at:string;}
export interface OrderItem {id:string;name:string;imageUrl:string;quantity:number;unitCents:number;options:{groupName:string;optionName:string}[];extras:string[];}
export interface Order {id:string;order_number:string;customer:Customer;items:OrderItem[];total_cents:number;status:string;notes:string;pickup_at:string;estimated_minutes:number;created_at:string;history:HistoryEntry[];}
export interface Reservation {id:string;reservation_number:string;customer:Customer;starts_at:string;ends_at:string;people:number;table_id:string;table_number:number;status:string;notes:string;reason:string;created_at:string;history:HistoryEntry[];}
export const statusLabels:Record<string,string>={pending:'Eingegangen',confirmed:'Bestätigt',preparing:'In Zubereitung',ready:'Abholbereit',delivered:'Abgeholt',rejected:'Abgelehnt',cancelled:'Storniert'};
export const dateLabel=(value:string)=>new Date(value).toLocaleString('de-DE',{timeZone:'Europe/Berlin',dateStyle:'short',timeStyle:'short'});
export const berlinDate=(date=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(date);
export const cents=(value:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(value/100);
