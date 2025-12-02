import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones helper para pricing
export async function getMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data
}

export async function getSizes() {
  const { data, error } = await supabase
    .from('sizes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data
}

export async function getFinishes() {
  const { data, error } = await supabase
    .from('finishes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  
  if (error) throw error
  return data
}

export async function getQuantityBreaks() {
  const { data, error } = await supabase
    .from('quantity_breaks')
    .select('*')
    .eq('is_active', true)
    .order('min_qty')
  
  if (error) throw error
  return data
}

// Obtener toda la configuración de pricing de una vez
export async function getPricingConfig() {
  const [materials, sizes, finishes, quantityBreaks] = await Promise.all([
    getMaterials(),
    getSizes(),
    getFinishes(),
    getQuantityBreaks()
  ])
  
  return { materials, sizes, finishes, quantityBreaks }
}