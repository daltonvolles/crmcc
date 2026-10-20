import { supabase } from './supabase'
import { erroDoBanco } from './erros'

export async function listarAnotacoes(contatoId) {
  const { data, error } = await supabase
    .from('anotacoes')
    .select('id, texto, criado_em')
    .eq('contato_id', contatoId)
    .order('criado_em', { ascending: false })

  if (error) throw erroDoBanco(error)
  return data
}

export async function criarAnotacao({ contatoId, texto }) {
  const { data, error } = await supabase
    .from('anotacoes')
    .insert({ contato_id: contatoId, texto })
    .select('id, texto, criado_em')
    .single()

  if (error) throw erroDoBanco(error)
  return data
}

export async function atualizarAnotacao({ id, texto }) {
  const { data, error } = await supabase
    .from('anotacoes')
    .update({ texto })
    .eq('id', id)
    .select('id, texto, criado_em')
    .single()

  if (error) throw erroDoBanco(error)
  return data
}

export async function apagarAnotacao(id) {
  const { error } = await supabase.from('anotacoes').delete().eq('id', id)

  if (error) throw erroDoBanco(error)
}
