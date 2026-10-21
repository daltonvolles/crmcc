'use client'

// Peças compartilhadas entre o Kanban e a página do contato.

import { useEffect, useState, useTransition } from 'react'
import { buscarAnotacoes, salvarAnotacao, editarAnotacao, excluirAnotacao } from './actions'
import { ETAPAS } from './etapas'

// Jeito de trocar a etapa sem arrastar (principalmente no celular).
export function SeletorEtapa({ etapa, onChange }) {
  const cor = ETAPAS[etapa].cor

  return (
    <select
      value={etapa}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Etapa do contato"
      className="mono"
      style={{
        color: cor,
        background: 'var(--color-bg)',
        border: `1px solid ${cor}`,
        borderRadius: 'var(--radius)',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {Object.entries(ETAPAS).map(([chave, info]) => (
        <option key={chave} value={chave} style={{ color: 'var(--color-text)', background: 'var(--color-elevated)' }}>
          {info.label}
        </option>
      ))}
    </select>
  )
}

export function Anotacoes({ contatoId }) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva uma anotação..."
          rows={3}
          className="campo"
        />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={pending} className="botao botao-primario" style={{ alignSelf: 'flex-start' }}>
          {pending ? 'Salvando...' : 'Salvar anotação'}
        </button>
      </form>

      {anotacoes === null && !erro && <p className="apoio" style={{ fontSize: '14px' }}>Carregando...</p>}

      {anotacoes?.length === 0 && <p className="apoio" style={{ fontSize: '14px' }}>Nenhuma anotação ainda.</p>}

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
    <div style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <p className="apoio mono" style={{ fontSize: '12px' }}>{formatarData(anotacao.criado_em)}</p>
        {!editando && (
          <div style={{ display: 'flex', gap: '14px' }}>
            <button type="button" className="botao-texto" onClick={() => setEditando(true)} disabled={pending}>
              Editar
            </button>
            <button type="button" className="botao-texto" onClick={handleExcluir} disabled={pending}>
              {pending ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        )}
      </div>

      {editando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={3} className="campo" />
          {erro && <p className="erro">{erro}</p>}
          <div style={{ display: 'flex', gap: '14px' }}>
            <button type="button" className="botao-texto" onClick={handleSalvar} disabled={pending}>
              {pending ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="botao-texto" onClick={handleCancelar} disabled={pending}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '15px', marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{anotacao.texto}</p>
      )}
    </div>
  )
}

function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
