'use client'

import { useActionState } from 'react'
import { cadastrar } from '../login/actions'
import { Cartao, Campo, Botao, Mensagem, LinkTexto } from '../login/componentes'

export default function Cadastro() {
  const [estado, acao, pending] = useActionState(cadastrar, {})

  return (
    <Cartao
      subtitulo="Crie seu acesso. O administrador precisa aprovar antes do primeiro login."
      rodape={
        <>
          Já tem cadastro? <LinkTexto href="/login">Entrar</LinkTexto>
        </>
      }
    >
      {estado?.ok ? (
        <Mensagem>Cadastro enviado! Aguarde a aprovação do administrador para entrar.</Mensagem>
      ) : (
        <form action={acao} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Campo label="Usuário" name="usuario" autoComplete="username" />
          <Campo label="Senha" name="senha" type="password" autoComplete="new-password" />
          <Campo label="Repita a senha" name="confirmacao" type="password" autoComplete="new-password" />

          {estado?.erro && <Mensagem erro>{estado.erro}</Mensagem>}

          <Botao pending={pending} textoPending="Enviando...">
            Cadastrar
          </Botao>
        </form>
      )}
    </Cartao>
  )
}
