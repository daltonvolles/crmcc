'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NOME_COOKIE, opcoesCookie, criarToken } from '../../lib/sessao'
import { senhaConfere, gerarHash } from '../../lib/senha'
import { buscarPorUsuario, criarUsuario } from '../../lib/usuarios'
import { LIMITES } from '../../lib/validacao'

export async function entrar(estadoAnterior, formData) {
  const usuario = formData.get('usuario')?.toString().trim().toLowerCase()
  const senha = formData.get('senha')?.toString()

  const encontrado = usuario ? await buscarPorUsuario(usuario) : null

  if (!encontrado || !senhaConfere(senha, encontrado.senha_hash)) {
    return { erro: 'Usuário ou senha inválidos.' }
  }

  if (encontrado.status !== 'aprovado') {
    return { erro: 'Seu cadastro ainda está aguardando aprovação do administrador.' }
  }

  const loja = await cookies()
  loja.set(NOME_COOKIE, await criarToken(encontrado.id), opcoesCookie)
  redirect('/')
}

export async function cadastrar(estadoAnterior, formData) {
  const usuario = formData.get('usuario')?.toString().trim().toLowerCase()
  const senha = formData.get('senha')?.toString()
  const confirmacao = formData.get('confirmacao')?.toString()

  if (!usuario || !senha) {
    return { erro: 'Preencha usuário e senha.' }
  }

  if (usuario.length > LIMITES.usuario) {
    return { erro: `O usuário pode ter no máximo ${LIMITES.usuario} caracteres.` }
  }

  if (senha.length < 6) {
    return { erro: 'A senha precisa ter pelo menos 6 caracteres.' }
  }

  if (senha.length > LIMITES.senha) {
    return { erro: `A senha pode ter no máximo ${LIMITES.senha} caracteres.` }
  }

  if (senha !== confirmacao) {
    return { erro: 'As senhas não conferem.' }
  }

  const resultado = await criarUsuario({ usuario, senhaHash: gerarHash(senha) })
  if (resultado.erro) return resultado

  return { ok: true }
}
