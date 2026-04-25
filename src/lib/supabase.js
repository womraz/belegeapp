import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL und Anon Key fehlen. Bitte .env Datei konfigurieren.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getBelege({sortField='erfassungsdatum',sortDir='desc',filters={}}={}) {
  let query=supabase.from('belege').select('*').order(sortField,{ascending:sortDir==='asc'})
  if(filters.lieferant) query=query.ilike('lieferant',`%${filters.lieferant}%`)
  if(filters.von) query=query.gte('belegdatum',filters.von)
  if(filters.bis) query=query.lte('belegdatum',filters.bis)
  if(filters.bezahlt==='bezahlt') query=query.not('bezahldatum','is',null)
  if(filters.bezahlt==='offen') query=query.is('bezahldatum',null)
  const{data,error}=await query;if(error)throw error;return data
}
export async function getBelegById(id){const{data,error}=await supabase.from('belege').select('*').eq('id',id).single();if(error)throw error;return data}
export async function createBeleg(beleg){const{data:{user}}=await supabase.auth.getUser();const{data,error}=await supabase.from('belege').insert({...beleg,user_id:user.id}).select().single();if(error)throw error;return data}
export async function updateBeleg(id,updates){const{data,error}=await supabase.from('belege').update(updates).eq('id',id).select().single();if(error)throw error;return data}
export async function deleteBeleg(id){const b=await getBelegById(id);if(b.file_path)await supabase.storage.from('belege-dateien').remove([b.file_path]);const{error}=await supabase.from('belege').delete().eq('id',id);if(error)throw error}
export async function uploadFile(file,userId){const path=`${userId}/${Date.now()}_${file.name}`;const{error}=await supabase.storage.from('belege-dateien').upload(path,file,{upsert:false});if(error)throw error;return path}
export async function getFileUrl(p){const{data}=await supabase.storage.from('belege-dateien').createSignedUrl(p,60*60);return data?.signedUrl}
export async function downloadFile(p){const{data,error}=await supabase.storage.from('belege-dateien').download(p);if(error)throw error;return data}
