import { cookies } from 'next/headers'
import { supabase } from './supabase'
import { erroDoBanco } from './erros'
import { NOME_COOKIE, lerToken } from './sessao'

const CAMPOS = 'id, usuario, papel, status, criado_em'

export async function buscarPorUsuario(usuario) {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`${CAMPOS}, senha_hash`)
    .eq('usuario', usuario)
    .maybeSingle()

  if (error) throw erroDoBanco(error)
  return data
}

export async function criarUsuario({ usuario, senhaHash }) {
  const { error } = await supabase.from('usuarios').insert({ usuario, senha_hash: senhaHash })

  if (error?.code === '23505') return { erro: 'Esse usuário já existe.' }
  if (error) throw erroDoBanco(error)
  return {}
}

export async function listarUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select(CAMPOS)
    .order('criado_em', { ascending: false })

  if (error) throw erroDoBanco(error)
  return data
}

export async function aprovarUsuario(id) {
  const { error } = await supabase.from('usuarios').update({ status: 'aprovado' }).eq('id', id)
  if (error) throw erroDoBanco(error)
}

// Usuário da sessão atual (ou null), conferido no banco.
export async function usuarioLogado() {
  const loja = await cookies()
  const id = await lerToken(loja.get(NOME_COOKIE)?.value)
  if (!id) return null

  const { data, error } = await supabase.from('usuarios').select(CAMPOS).eq('id', id).maybeSingle()
  if (error) throw erroDoBanco(error)
  return data?.status === 'aprovado' ? data : null
}
