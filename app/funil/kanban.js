'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mudarEtapa } from '../actions'
import { ETAPAS } from '../etapas'
import { SeletorEtapa } from '../contato-partes'
import { tempoDesde } from '../../lib/tempo'
import FormularioContato from '../contatos/formulario'

const etapaDe = (contato) => (ETAPAS[contato.etapa] ? contato.etapa : 'novo')

// Quadro com uma coluna por etapa. A etapa muda arrastando o cartão ou pelo seletor dele.
export default function KanbanFunil({ contatos: contatosIniciais }) {
  const [contatos, setContatos] = useState(contatosIniciais)
  const [arrastando, setArrastando] = useState(null)
  const [colunaAlvo, setColunaAlvo] = useState(null)
  const [erro, setErro] = useState('')
  const [novoAberto, setNovoAberto] = useState(false)

  useEffect(() => {
    if (!novoAberto) return
    const fecharComEsc = (e) => e.key === 'Escape' && setNovoAberto(false)
    window.addEventListener('keydown', fecharComEsc)
    return () => window.removeEventListener('keydown', fecharComEsc)
  }, [novoAberto])

  async function mover(id, nova) {
    const contato = contatos.find((c) => c.id === id)
    if (!contato || etapaDe(contato) === nova) return

    const anterior = contato.etapa
    const trocar = (etapa) => setContatos((atual) => atual.map((c) => (c.id === id ? { ...c, etapa } : c)))
    trocar(nova)
    setErro('')

    try {
      const resultado = await mudarEtapa(id, nova)
      if (resultado.erro) throw new Error(resultado.erro)
    } catch {
      trocar(anterior)
      setErro(`Não foi possível mudar a etapa de ${contato.nome}.`)
    }
  }

  function handleDrop(event, etapa) {
    event.preventDefault()
    setColunaAlvo(null)
    if (arrastando) mover(arrastando, etapa)
    setArrastando(null)
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <p className="rotulo">
          Contatos <span style={{ color: 'var(--color-text)' }}>{contatos.length}</span>
        </p>
        <button type="button" onClick={() => setNovoAberto(true)} className="botao botao-primario">
          Novo contato
        </button>
      </div>

      {novoAberto && (
        <div
          className="janela-fundo"
          onMouseDown={(e) => e.target === e.currentTarget && setNovoAberto(false)}
        >
          <FormularioContato
            onCancelar={() => setNovoAberto(false)}
            onSalvo={(contato) => {
              setContatos((atual) => [contato, ...atual])
              setNovoAberto(false)
            }}
          />
        </div>
      )}

      {erro && <p className="erro">{erro}</p>}

      <div className="kanban">
        {Object.entries(ETAPAS).map(([chave, info]) => {
          const daColuna = contatos.filter((c) => etapaDe(c) === chave)
          return (
            <div
              key={chave}
              className={`kanban-coluna${colunaAlvo === chave ? ' alvo' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                if (colunaAlvo !== chave) setColunaAlvo(chave)
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setColunaAlvo(null)
              }}
              onDrop={(e) => handleDrop(e, chave)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                <p className="rotulo" style={{ color: info.cor }}>{info.label}</p>
                <p className="mono" style={{ color: info.cor, fontSize: '13px' }}>{daColuna.length}</p>
              </div>

              {daColuna.length === 0 && (
                <p className="kanban-vazio">Nenhum contato nesta etapa</p>
              )}

              {daColuna.map((contato) => (
                <CartaoContato
                  key={contato.id}
                  contato={contato}
                  etapa={chave}
                  arrastado={arrastando === contato.id}
                  onArrastar={setArrastando}
                  onMudarEtapa={(nova) => mover(contato.id, nova)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CartaoContato({ contato, etapa, arrastado, onArrastar, onMudarEtapa }) {
  const router = useRouter()

  return (
    <div
      className="cartao kanban-cartao"
      draggable
      onClick={() => router.push(`/contatos/${contato.id}`)}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', contato.id)
        onArrastar(contato.id)
      }}
      onDragEnd={() => onArrastar(null)}
      style={{
        padding: '14px 16px',
        background: 'var(--color-elevated)',
        cursor: 'pointer',
        opacity: arrastado ? 0.4 : 1,
      }}
    >
      <p style={{ fontWeight: 700, fontSize: '15px', overflowWrap: 'anywhere' }}>{contato.nome}</p>
      <p className="apoio mono" style={{ fontSize: '12px', marginTop: '6px', overflowWrap: 'anywhere' }}>
        {contato.email || 'Sem email'}
      </p>
      <p className="apoio mono" style={{ fontSize: '11px', marginTop: '4px' }} suppressHydrationWarning>
        {tempoDesde(contato.criado_em)}
      </p>

      {/* O seletor não abre a página: só troca a etapa. */}
      <div style={{ marginTop: '14px' }} onClick={(e) => e.stopPropagation()}>
        <SeletorEtapa etapa={etapa} onChange={onMudarEtapa} />
      </div>
    </div>
  )
}
