export function pickupTimes(date: string, now = new Date()): string[] {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
  const value=(key:string)=>parts.find(p=>p.type===key)?.value || '';
  const today=`${value('year')}-${value('month')}-${value('day')}`;
  if(!date || date<today)return [];
  const current=Number(value('hour'))*60+Number(value('minute'));
  return Array.from({length:288},(_,i)=>i*5).filter(minutes=>date>today || minutes>current).map(minutes=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`);
}
