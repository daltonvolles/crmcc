'use client'

import { useActionState } from 'react'
import { entrar } from './actions'
import { Cartao, Campo, Botao, Mensagem, LinkTexto } from './componentes'

export default function Login() {
  const [estado, acao, pending] = useActionState(entrar, {})

  return (
    <Cartao
      subtitulo="Entre para acessar seus contatos."
      rodape={
        <>
          Não tem login? <LinkTexto href="/cadastro">Cadastre-se</LinkTexto>
        </>
      }
    >
      <form action={acao} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Campo label="Usuário" name="usuario" autoComplete="username" />
        <Campo label="Senha" name="senha" type="password" autoComplete="current-password" />

        {estado?.erro && <Mensagem erro>{estado.erro}</Mensagem>}

        <Botao pending={pending} textoPending="Entrando...">
          Entrar
        </Botao>
      </form>
    </Cartao>
  )
}
