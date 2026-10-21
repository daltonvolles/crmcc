'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { buscarContatos } from '../actions'
import { ETAPAS } from '../etapas'

// Busca por nome ou email; cada resultado leva para a página do contato.
export default function BuscaContatos() {
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const limpo = termo.trim()
    if (limpo.length < 2) {
      setResultados(null)
      return
    }

    // Espera a pessoa parar de digitar antes de buscar.
    let valido = true
    const espera = setTimeout(() => {
      buscarContatos(limpo)
        .then((lista) => {
          if (!valido) return
          setResultados(lista)
          setErro('')
        })
        .catch(() => valido && setErro('Não foi possível buscar agora.'))
    }, 250)

    return () => {
      valido = false
      clearTimeout(espera)
    }
  }, [termo])

  return (
    <section className="cartao" style={{ padding: '24px 32px', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span className="rotulo">Buscar contato</span>
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Nome ou email"
          className="campo"
        />
      </label>

      {erro && <p className="erro">{erro}</p>}

      {resultados?.length === 0 && (
        <p className="apoio" style={{ fontSize: '14px' }}>Nenhum contato encontrado para "{termo.trim()}".</p>
      )}

      {resultados?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {resultados.map((contato) => {
            const info = ETAPAS[contato.etapa] || ETAPAS.novo
            return (
              <Link key={contato.id} href={`/contatos/${contato.id}`} className="resultado-busca">
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 700, overflowWrap: 'anywhere' }}>{contato.nome}</span>
                  <span className="apoio mono" style={{ display: 'block', fontSize: '12px', marginTop: '4px', overflowWrap: 'anywhere' }}>
                    {contato.email || 'Sem email'}
                  </span>
                </span>
                <span className="mono" style={{ color: info.cor, fontSize: '12px', whiteSpace: 'nowrap' }}>{info.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
