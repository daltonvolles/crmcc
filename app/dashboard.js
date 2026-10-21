import Link from 'next/link'
import { ETAPAS } from './etapas'
import { tempoDesde } from '../lib/tempo'

const etapaDe = (contato) => (ETAPAS[contato.etapa] ? contato.etapa : 'novo')

// Peças do Dashboard. Tudo sai da mesma lista de contatos, então números, gráfico e lista batem sempre.
export function contarPorEtapa(contatos) {
  return Object.entries(ETAPAS).map(([chave, info]) => ({
    chave,
    ...info,
    valor: contatos.filter((c) => etapaDe(c) === chave).length,
  }))
}

function porcentagem(valor, total) {
  return total ? Math.round((valor / total) * 100) : 0
}

export function CartoesNumeros({ total, etapas }) {
  return (
    <section className="dash-numeros">
      <div className="cartao dash-numero">
        <p className="rotulo">Total de contatos</p>
        <p className="mono dash-valor">{total}</p>
        <p className="apoio mono" style={{ fontSize: '12px' }}>no funil</p>
      </div>

      {etapas.map((etapa) => (
        <div key={etapa.chave} className="cartao dash-numero" style={{ borderTop: `3px solid ${etapa.cor}` }}>
          <p className="rotulo" style={{ color: etapa.cor }}>{etapa.label}</p>
          <p className="mono dash-valor">{etapa.valor}</p>
          <p className="apoio mono" style={{ fontSize: '12px' }}>{porcentagem(etapa.valor, total)}% do total</p>
        </div>
      ))}
    </section>
  )
}

// Barras horizontais, uma por etapa, com nome e número escritos ao lado (a cor nunca é a única pista).
export function GraficoFunil({ total, etapas }) {
  const maior = Math.max(...etapas.map((e) => e.valor), 1)

  return (
    <section className="cartao" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '17px' }}>Distribuição por etapa</h2>
        <p className="apoio" style={{ fontSize: '13px', marginTop: '4px' }}>Quantos contatos há em cada etapa do funil.</p>
      </div>

      {total === 0 ? (
        <p className="kanban-vazio">Sem contatos ainda. O gráfico aparece quando você cadastrar o primeiro.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {etapas.map((etapa) => (
            <div
              key={etapa.chave}
              className="dash-barra-linha"
              title={`${etapa.label}: ${etapa.valor} contato(s), ${porcentagem(etapa.valor, total)}%`}
            >
              <span style={{ fontSize: '14px' }}>{etapa.label}</span>
              <div className="dash-trilho">
                {etapa.valor > 0 && (
                  <div
                    className="dash-barra"
                    style={{ width: `${(etapa.valor / maior) * 100}%`, background: etapa.cor }}
                  />
                )}
              </div>
              <span className="mono" style={{ fontSize: '13px', textAlign: 'right' }}>
                {etapa.valor} <span className="apoio">· {porcentagem(etapa.valor, total)}%</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function UltimosContatos({ contatos }) {
  return (
    <section className="cartao" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '17px' }}>Últimos contatos cadastrados</h2>
        <p className="apoio" style={{ fontSize: '13px', marginTop: '4px' }}>Os 5 mais recentes. Clique para abrir.</p>
      </div>

      {contatos.length === 0 ? (
        <p className="kanban-vazio">
          Nenhum contato cadastrado ainda. <Link href="/contatos" className="link">Cadastrar o primeiro</Link>
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {contatos.map((contato) => {
            const info = ETAPAS[etapaDe(contato)]
            return (
              <Link key={contato.id} href={`/contatos/${contato.id}`} className="resultado-busca">
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 700, overflowWrap: 'anywhere' }}>{contato.nome}</span>
                  <span className="apoio mono" style={{ display: 'block', fontSize: '12px', marginTop: '4px' }}>
                    {tempoDesde(contato.criado_em)}
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
