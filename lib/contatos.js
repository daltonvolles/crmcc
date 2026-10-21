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

// Devolve null se o contato não existe (ou foi apagado).
export async function buscarContato(id) {
  const { data, error } = await supabase
    .from('contatos')
    .select('id, nome, email, telefone, etapa, criado_em')
    .eq('id', id)
    .maybeSingle()

  if (error) throw erroDoBanco(error)
  return data
}

// Busca por parte do nome ou do email, sem diferenciar maiúsculas.
export async function pesquisarContatos(termo) {
  // Tira caracteres que têm significado especial no filtro do banco.
  const limpo = termo.replace(/[,()%*\\"]/g, ' ').trim()
  if (!limpo) return []

  const { data, error } = await supabase
    .from('contatos')
    .select('id, nome, email, etapa')
    .or(`nome.ilike.%${limpo}%,email.ilike.%${limpo}%`)
    .order('nome')
    .limit(20)

  if (error) throw erroDoBanco(error)
  return data
}

export async function atualizarEtapa({ id, etapa }) {
  const { data, error } = await supabase
    .from('contatos')
    .update({ etapa })
    .eq('id', id)
    .select('id, nome, email, telefone, etapa, criado_em')
    .single()

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
