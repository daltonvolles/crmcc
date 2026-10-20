'use client'

import { useEffect, useState, useTransition } from 'react'
import { salvarContato, buscarAnotacoes, salvarAnotacao, editarAnotacao, excluirAnotacao } from './actions'
import { telefoneValido } from '../lib/telefone'

const ETAPAS = {
  novo: { label: 'Novo', cor: '#64748B' },
  em_contato: { label: 'Em contato', cor: '#D97706' },
  proposta: { label: 'Proposta', cor: '#7C3AED' },
  cliente: { label: 'Cliente', cor: '#15803D' },
}

export default function ContatosApp({ contatosIniciais }) {
  const [contatos, setContatos] = useState(contatosIniciais)
  const [erro, setErro] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const dados = new FormData(form)

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
      setContatos((atual) => [resultado.contato, ...atual])
      form.reset()
    })
  }

  return (
    <main
      style={{
        padding: '48px 24px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <PainelFunil contatos={contatos} />

        <div>
          <h1 style={{ fontSize: '32px' }}>Contatos</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', marginTop: '8px' }}>
            Organize seus contatos e oportunidades de negócio.
          </p>
        </div>

        <section
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: '32px',
          }}
        >
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Novo contato</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Campo label="Nome" name="nome" required />
            <Campo label="Email" name="email" type="email" />
            <Campo label="Telefone" name="telefone" type="tel" placeholder="(11) 91234-5678" />

            {erro && <p style={{ color: '#B91C1C', fontSize: '14px' }}>{erro}</p>}

            <button
              type="submit"
              disabled={pending}
              style={{
                marginTop: '8px',
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: pending ? 'default' : 'pointer',
                opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? 'Salvando...' : 'Salvar contato'}
            </button>
          </form>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '20px' }}>Contatos</h2>

          {contatos.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)' }}>Nenhum contato cadastrado ainda.</p>
          )}

          {contatos.map((contato) => (
            <CartaoContato key={contato.id} contato={contato} />
          ))}
        </section>
      </div>
    </main>
  )
}

// Os números saem da mesma lista da tela, então mudam junto com ela.
function PainelFunil({ contatos }) {
  const itens = [
    { label: 'Total', valor: contatos.length, cor: 'var(--color-text)' },
    ...Object.entries(ETAPAS).map(([chave, info]) => ({
      label: info.label,
      valor: contatos.filter((c) => (ETAPAS[c.etapa] ? c.etapa : 'novo') === chave).length,
      cor: info.cor,
    })),
  ]

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
      }}
    >
      {itens.map((item, i) => (
        <div
          key={item.label}
          style={{
            padding: '20px',
            borderLeft: i === 0 ? 'none' : '1px solid var(--color-border)',
          }}
        >
          <p style={{ color: item.cor, fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', margin: 0 }}>
            {item.label}
          </p>
          <p style={{ color: item.cor, fontSize: '40px', fontWeight: 700, lineHeight: 1, margin: '10px 0 0' }}>
            {item.valor}
          </p>
        </div>
      ))}
    </section>
  )
}

function CartaoContato({ contato }) {
  const [aberto, setAberto] = useState(false)

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '16px' }}>{contato.nome}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {[contato.email, contato.telefone].filter(Boolean).join(' · ') || 'Sem email ou telefone'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Etiqueta etapa={contato.etapa} />
          <button
            type="button"
            onClick={() => setAberto(!aberto)}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: '4px 10px',
              fontSize: '13px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: 'var(--color-accent)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {aberto ? 'Fechar' : 'Anotações'}
          </button>
        </div>
      </div>

      {aberto && <Anotacoes contatoId={contato.id} />}
    </div>
  )
}

function Anotacoes({ contatoId }) {
  const [anotacoes, setAnotacoes] = useState(null)
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    buscarAnotacoes(contatoId)
      .then(setAnotacoes)
      .catch(() => setErro('Não foi possível carregar as anotações.'))
  }, [contatoId])

  function handleSalvar(event) {
    event.preventDefault()

    if (!texto.trim()) {
      setErro('Escreva a anotação antes de salvar.')
      return
    }

    setErro('')
    startTransition(async () => {
      const resultado = await salvarAnotacao(contatoId, texto)
      if (resultado.erro) {
        setErro(resultado.erro)
        return
      }
      setAnotacoes((atual) => [resultado.anotacao, ...(atual || [])])
      setTexto('')
    })
  }

  return (
    <div
      style={{
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva uma anotação..."
          rows={3}
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: '10px 12px',
            fontSize: '15px',
            fontFamily: 'inherit',
            color: 'var(--color-text)',
            resize: 'vertical',
          }}
        />
        {erro && <p style={{ color: '#B91C1C', fontSize: '14px' }}>{erro}</p>}
        <button
          type="submit"
          disabled={pending}
          style={{
            alignSelf: 'flex-start',
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '8px 16px',
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: 700,
            cursor: pending ? 'default' : 'pointer',
            opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? 'Salvando...' : 'Salvar anotação'}
        </button>
      </form>

      {anotacoes === null && !erro && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Carregando...</p>
      )}

      {anotacoes?.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Nenhuma anotação ainda.</p>
      )}

      {anotacoes?.map((anotacao) => (
        <ItemAnotacao
          key={anotacao.id}
          anotacao={anotacao}
          onAtualizada={(nova) =>
            setAnotacoes((atual) => atual.map((a) => (a.id === nova.id ? nova : a)))
          }
          onExcluida={() => setAnotacoes((atual) => atual.filter((a) => a.id !== anotacao.id))}
        />
      ))}
    </div>
  )
}

function ItemAnotacao({ anotacao, onAtualizada, onExcluida }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(anotacao.texto)
  const [erro, setErro] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSalvar() {
    if (!texto.trim()) {
      setErro('A anotação não pode ficar vazia.')
      return
    }

    setErro('')
    startTransition(async () => {
      const resultado = await editarAnotacao(anotacao.id, texto)
      if (resultado.erro) {
        setErro(resultado.erro)
        return
      }
      onAtualizada(resultado.anotacao)
      setEditando(false)
    })
  }

  function handleCancelar() {
    setTexto(anotacao.texto)
    setErro('')
    setEditando(false)
  }

  function handleExcluir() {
    if (!window.confirm('Excluir esta anotação?')) return

    startTransition(async () => {
      await excluirAnotacao(anotacao.id)
      onExcluida()
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{formatarData(anotacao.criado_em)}</p>
        {!editando && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <BotaoTexto onClick={() => setEditando(true)} disabled={pending}>
              Editar
            </BotaoTexto>
            <BotaoTexto onClick={handleExcluir} disabled={pending}>
              {pending ? 'Excluindo...' : 'Excluir'}
            </BotaoTexto>
          </div>
        )}
      </div>

      {editando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: '10px 12px',
              fontSize: '15px',
              fontFamily: 'inherit',
              color: 'var(--color-text)',
              resize: 'vertical',
            }}
          />
          {erro && <p style={{ color: '#B91C1C', fontSize: '14px' }}>{erro}</p>}
          <div style={{ display: 'flex', gap: '12px' }}>
            <BotaoTexto onClick={handleSalvar} disabled={pending}>
              {pending ? 'Salvando...' : 'Salvar'}
            </BotaoTexto>
            <BotaoTexto onClick={handleCancelar} disabled={pending}>
              Cancelar
            </BotaoTexto>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '15px', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{anotacao.texto}</p>
      )}
    </div>
  )
}

function BotaoTexto({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: 700,
        color: 'var(--color-accent)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}

function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Campo({ label, name, type = 'text', required = false, placeholder }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
      <span>
        {label}
        {required && ' *'}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '10px 12px',
          fontSize: '16px',
          fontFamily: 'inherit',
          color: 'var(--color-text)',
        }}
      />
    </label>
  )
}

function Etiqueta({ etapa }) {
  const info = ETAPAS[etapa] || ETAPAS.novo
  return (
    <span
      style={{
        color: info.cor,
        border: `1px solid ${info.cor}`,
        borderRadius: 'var(--radius)',
        padding: '4px 10px',
        fontSize: '13px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {info.label}
    </span>
  )
}
