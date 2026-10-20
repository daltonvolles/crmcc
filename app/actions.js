'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { criarContato } from '../lib/contatos'
import { listarAnotacoes, criarAnotacao, atualizarAnotacao, apagarAnotacao } from '../lib/anotacoes'
import { telefoneValido } from '../lib/telefone'
import { revalidatePath } from 'next/cache'
import { NOME_COOKIE } from '../lib/sessao'
import { usuarioLogado, aprovarUsuario } from '../lib/usuarios'
import { LIMITES, texto, emailValido, idValido } from '../lib/validacao'

async function exigirLogin() {
  const usuario = await usuarioLogado()
  if (!usuario) throw new Error('Não autorizado')
  return usuario
}

function exigirId(id) {
  if (!idValido(id)) throw new Error('Pedido inválido')
}

export async function aprovar(id) {
  const usuario = await exigirLogin()
  if (usuario.papel !== 'admin') throw new Error('Não autorizado')
  exigirId(id)

  await aprovarUsuario(id)
  revalidatePath('/usuarios')
}

export async function sair() {
  const loja = await cookies()
  loja.delete(NOME_COOKIE)
  redirect('/login')
}

export async function salvarContato(formData) {
  await exigirLogin()
  const nome = texto(formData.get('nome'))
  const email = texto(formData.get('email'))
  const telefone = texto(formData.get('telefone'))

  if (!nome) {
    return { erro: 'Informe o nome do contato.' }
  }

  if (nome.length > LIMITES.nome) {
    return { erro: `O nome pode ter no máximo ${LIMITES.nome} caracteres.` }
  }

  if (email && !emailValido(email)) {
    return { erro: 'Informe um email válido.' }
  }

  if (!telefoneValido(telefone)) {
    return { erro: 'Telefone deve estar no formato (11) 91234-5678.' }
  }

  const contato = await criarContato({ nome, email, telefone })
  return { contato }
}

export async function buscarAnotacoes(contatoId) {
  await exigirLogin()
  exigirId(contatoId)
  return listarAnotacoes(contatoId)
}

export async function salvarAnotacao(contatoId, conteudo) {
  await exigirLogin()
  exigirId(contatoId)
  const limpo = texto(conteudo)

  if (!limpo) {
    return { erro: 'Escreva a anotação antes de salvar.' }
  }

  if (limpo.length > LIMITES.anotacao) {
    return { erro: `A anotação pode ter no máximo ${LIMITES.anotacao} caracteres.` }
  }

  const anotacao = await criarAnotacao({ contatoId, texto: limpo })
  return { anotacao }
}

export async function editarAnotacao(id, conteudo) {
  await exigirLogin()
  exigirId(id)
  const limpo = texto(conteudo)

  if (!limpo) {
    return { erro: 'A anotação não pode ficar vazia.' }
  }

  if (limpo.length > LIMITES.anotacao) {
    return { erro: `A anotação pode ter no máximo ${LIMITES.anotacao} caracteres.` }
  }

  const anotacao = await atualizarAnotacao({ id, texto: limpo })
  return { anotacao }
}

export async function excluirAnotacao(id) {
  await exigirLogin()
  exigirId(id)
  await apagarAnotacao(id)
  return { ok: true }
}
