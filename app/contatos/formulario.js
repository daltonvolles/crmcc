'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { salvarContato } from '../actions'
import { telefoneValido } from '../../lib/telefone'

// Usado na tela Contatos e na janela de novo contato do Funil (com onSalvo e onCancelar).
export default function FormularioContato({ onSalvo, onCancelar }) {
  const [erro, setErro] = useState('')
  const [salvo, setSalvo] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const dados = new FormData(form)
    setSalvo('')

    if (!dados.get('nome')?.toString().trim()) {
      setErro('Informe o nome do contato.')
      return
    }

    if (!telefoneValido(dados.get('telefone')?.toString().trim())) {
      setErro('Telefone deve estar no formato (11) 91234-5678.')
      return
    }

    setErro('')
    startTransition(async () => {
      const resultado = await salvarContato(dados)
      if (resultado.erro) {
        setErro(resultado.erro)
        return
      }
      if (onSalvo) return onSalvo(resultado.contato)
      setSalvo(resultado.contato.nome)
      form.reset()
    })
  }

  return (
    <section
      className="cartao"
      style={{ padding: '32px', maxWidth: '560px', width: '100%', background: onCancelar ? 'var(--color-elevated)' : undefined }}
    >
      <h2 style={{ fontSize: '18px', marginBottom: '24px' }}>Novo contato</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Campo label="Nome" name="nome" required autoFocus={!!onCancelar} />
        <Campo label="Email" name="email" type="email" />
        <Campo label="Telefone" name="telefone" type="tel" placeholder="(11) 91234-5678" />

        {erro && <p className="erro">{erro}</p>}
        {salvo && (
          <p style={{ fontSize: '14px' }}>
            {salvo} foi salvo. <Link href="/funil" className="link">Ver no funil</Link>
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          <button type="submit" disabled={pending} className="botao botao-primario" style={{ flex: 1, padding: '12px 20px', fontSize: '15px' }}>
            {pending ? 'Salvando...' : 'Salvar contato'}
          </button>
          {onCancelar && (
            <button type="button" onClick={onCancelar} disabled={pending} className="botao botao-secundario" style={{ padding: '12px 20px', fontSize: '15px' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function Campo({ label, name, type = 'text', required = false, placeholder, autoFocus }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span className="rotulo">
        {label}
        {required && ' *'}
      </span>
      <input name={name} type={type} placeholder={placeholder} autoFocus={autoFocus} className="campo" />
    </label>
  )
}
