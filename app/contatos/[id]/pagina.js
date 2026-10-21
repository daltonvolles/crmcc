'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mudarEtapa } from '../../actions'
import { ETAPAS } from '../../etapas'
import { Anotacoes, SeletorEtapa } from '../../contato-partes'
import { tempoDesde } from '../../../lib/tempo'

// Tudo de um contato num lugar só: dados, etapa, anotações e follow-ups.
export default function PaginaContato({ contato }) {
  const [etapa, setEtapa] = useState(ETAPAS[contato.etapa] ? contato.etapa : 'novo')
  const [erro, setErro] = useState('')

  async function trocarEtapa(nova) {
    const anterior = etapa
    setEtapa(nova)
    setErro('')

    try {
      const resultado = await mudarEtapa(contato.id, nova)
      if (resultado.erro) throw new Error(resultado.erro)
    } catch {
      setEtapa(anterior)
      setErro('Não foi possível mudar a etapa.')
    }
  }

  return (
    <>
      <Link href="/funil" className="link" style={{ fontSize: '14px' }}>
        ← Voltar ao funil
      </Link>

      <section className="cartao" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <p className="rotulo">Contato</p>
            <h1 style={{ fontSize: '28px', marginTop: '8px', overflowWrap: 'anywhere' }}>{contato.nome}</h1>
            <p className="apoio mono" style={{ fontSize: '12px', marginTop: '8px' }} suppressHydrationWarning>
              {tempoDesde(contato.criado_em)}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span className="rotulo">Etapa</span>
            <SeletorEtapa etapa={etapa} onChange={trocarEtapa} />
            {erro && <p className="erro" style={{ fontSize: '12px' }}>{erro}</p>}
          </div>
        </div>

        <div className="contato-dados">
          <Dado rotulo="Email" valor={contato.email} />
          <Dado rotulo="Telefone" valor={contato.telefone} />
        </div>
      </section>

      <Secao titulo="Anotações">
        <Anotacoes contatoId={contato.id} />
      </Secao>

      <Secao titulo="Follow-ups">
        <p className="apoio" style={{ fontSize: '14px', lineHeight: 1.5 }}>
          A geração de follow-ups com IA ainda não está disponível. Quando estiver, o botão de gerar e a lista dos
          follow-ups deste contato vão aparecer aqui.
        </p>
      </Secao>
    </>
  )
}

function Dado({ rotulo, valor }) {
  return (
    <div style={{ minWidth: 0 }}>
      <p className="rotulo">{rotulo}</p>
      <p className="mono" style={{ fontSize: '14px', marginTop: '6px', overflowWrap: 'anywhere', color: valor ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
        {valor || 'Não informado'}
      </p>
    </div>
  )
}

function Secao({ titulo, children }) {
  return (
    <section className="cartao" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <h2 style={{ fontSize: '18px' }}>{titulo}</h2>
      {children}
    </section>
  )
}

// Contato apagado ou endereço errado: avisa e volta para o funil sozinho.
export function ContatoNaoEncontrado() {
  const router = useRouter()

  useEffect(() => {
    const espera = setTimeout(() => router.replace('/funil'), 4000)
    return () => clearTimeout(espera)
  }, [router])

  return (
    <section className="cartao" style={{ padding: '32px', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h1 style={{ fontSize: '22px' }}>Este contato não existe mais</h1>
      <p className="apoio" style={{ fontSize: '15px', lineHeight: 1.5 }}>
        Ele pode ter sido apagado. Você vai voltar ao funil em instantes.
      </p>
      <Link href="/funil" className="link" style={{ fontSize: '14px' }}>
        Voltar ao funil agora
      </Link>
    </section>
  )
}
