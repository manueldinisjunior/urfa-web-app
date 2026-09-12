import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../utils/api';
export function useResource<T>(path: string | null, interval = 0) {
 const [data,setData]=useState<T>();const [error,setError]=useState('');const [loading,setLoading]=useState(true);const generation=useRef(0);
 const reload=useCallback(async()=>{
  if(!path){setLoading(false);return;}
  const current=++generation.current;
  try { const result=await api<T>(path);if(current===generation.current){setData(result);setError('');} }
  catch(e){if(current===generation.current)setError(e instanceof Error?e.message:'Verbindung fehlgeschlagen');}
  finally{if(current===generation.current)setLoading(false);}
 },[path]);
 useEffect(()=>{setData(undefined);setLoading(true);void reload();const timer=interval?window.setInterval(()=>{if(!document.hidden)void reload();},interval):undefined;return()=>{generation.current++;window.clearInterval(timer);};},[reload,interval]);
 return {data,error,loading,reload};
}
