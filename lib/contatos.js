import { supabase } from './supabase'
import { erroDoBanco } from './erros'

export async function listarContatos() {
  const { data, error } = await supabase
    .from('contatos')
    .select('id, nome, email, telefone, etapa, criado_em')
    .order('criado_em', { ascending: false })

  if (error) throw erroDoBanco(error)
  return data
}

export async function criarContato({ nome, email, telefone }) {
  const { data, error } = await supabase
    .from('contatos')
    .insert({ nome, email: email || null, telefone: telefone || null })
    .select('id, nome, email, telefone, etapa, criado_em')
    .single()

  if (error) throw erroDoBanco(error)
  return data
}
