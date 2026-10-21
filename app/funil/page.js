import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { listarContatos } from '../../lib/contatos'
import { usuarioLogado } from '../../lib/usuarios'
import Shell, { Titulo } from '../shell'
import { ETAPAS } from '../etapas'
import KanbanFunil from './kanban'

export default async function Funil() {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')

  return (
    <Shell usuario={usuario} largo>
      <Titulo titulo="Funil" subtitulo="Arraste os contatos entre as etapas ou troque pelo seletor do cartão." />
      <Suspense fallback={<Carregando />}>
        <DadosFunil />
      </Suspense>
    </Shell>
  )
}

// Busca os contatos à parte, para a tela aparecer já com o aviso de carregando.
async function DadosFunil() {
  const contatos = await listarContatos()
  return <KanbanFunil contatos={contatos} />
}

function Carregando() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p className="rotulo">Carregando contatos...</p>
      <div className="kanban">
        {Object.entries(ETAPAS).map(([chave, info]) => (
          <div key={chave} className="kanban-coluna">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
              <p className="rotulo" style={{ color: info.cor }}>{info.label}</p>
              <p className="mono apoio" style={{ fontSize: '13px' }}>--</p>
            </div>
            <p className="kanban-vazio">Carregando...</p>
          </div>
        ))}
      </div>
    </section>
  )
}
