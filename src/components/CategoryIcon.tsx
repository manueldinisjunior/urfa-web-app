import type { ReactNode } from 'react';
const drawings: Record<string, ReactNode> = {
  Vorspeisen: <><ellipse cx="16" cy="21" rx="13" ry="6"/><path d="M6 18v-6h8v6m4 0v-8h8v8M8 9l3-4 3 4m6-2h5"/></>,
  Suppen: <><path d="M3 15h26c-1 8-5 12-13 12S4 23 3 15ZM8 29h16M10 11c-5-4 5-4 0-8m7 8c-5-4 5-4 0-8m7 8c-5-4 5-4 0-8"/></>,
  Salate: <><path d="M3 18h26c-2 7-6 11-13 11S5 25 3 18ZM8 18C0 7 11 3 15 14m1 4C15 5 25 2 28 6c-1 8-6 11-12 12M8 10l5 8m11-8-7 8"/></>,
  Pizza: <><path d="m5 6 11 23L28 6C20 1 12 1 5 6Zm2 4c6-4 12-4 19 0"/><circle cx="13" cy="13" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="17" cy="20" r="1.5"/></>,
  Pide: <><path d="M2 16C9 0 23 0 30 16c-7 16-21 16-28 0Zm4 0c6-10 14-10 20 0-6 10-14 10-20 0Z"/><path d="m10 13 3 5m3-8v12m4-9 2 5"/></>,
  Dönergerichte: <><path d="M7 10c0-9 18-9 18 0M5 11h22l-4 16H9L5 11Zm1 3 5 3 5-3 5 3 5-3M11 22h10"/></>,
  wrap: <><path d="M6 10 15 29 27 8M9 17l13 5M13 25l9-12"/><ellipse cx="16" cy="9" rx="11" ry="5" transform="rotate(-10 16 9)"/><path d="m10 8 3-2 4 4 4-4 3 2"/></>,
  grill: <><path d="m4 28 24-24M4 20l8 8m-3-13 8 8m-3-13 8 8m-3-13 8 8"/><path d="m4 20 5-5 8 8-5 5Zm10-10 5-5 8 8-5 5Z"/></>,
  pan: <><ellipse cx="12" cy="18" rx="10" ry="8"/><path d="m21 15 9-8M6 17h12M9 21h5M8 7V3m7 4V3"/></>,
  Schnitzel: <><path d="M4 17C1 10 8 6 13 8c5-8 15-4 15 3 5 5-1 13-7 12-5 8-17 3-17-6Z"/><path d="m8 13 2 1m5-3 2 1m5 1 2 1m-12 5 2 1m5-2 2 1m-10 5 2 1"/><path d="m24 27 5-3 1 6Z"/></>,
  Desserts: <><path d="m3 16 13-9 13 9-13 9-13-9Zm0 0v6l13 9 13-9v-6M16 25v6m-7-19 13 9m-13 0 13-9"/></>,
  soft: <><path d="M7 10h18l-3 19H10L7 10Zm3 6h12M18 10l3-8h6"/><circle cx="14" cy="22" r="1"/></>,
  beer: <><path d="M7 10v19h16V10M23 12h5v11h-5M11 15v10m7-10v10M7 10C0 6 7 0 11 5c3-5 10-3 10 1 6-1 7 6 2 6"/></>,
};
export default function CategoryIcon({name}:{name:string}) {
 const key=drawings[name]?name:/Dürüm|Wrap/i.test(name)?'wrap':/Grill/.test(name)?'grill':/Pfannen/.test(name)?'pan':name==='Alkoholfreie Getränke'?'soft':'beer';
 return <svg className="category-food-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[key]}</svg>;
}
