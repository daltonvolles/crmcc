import { redirect } from 'next/navigation'
import { listarContatos } from '../lib/contatos'
import { usuarioLogado } from '../lib/usuarios'
import Shell, { Titulo } from './shell'
import AtualizarSozinho from './atualizar-sozinho'
import { CartoesNumeros, GraficoFunil, UltimosContatos, contarPorEtapa } from './dashboard'

export default async function Dashboard() {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')

  // A lista já vem do mais recente para o mais antigo.
  const contatos = await listarContatos()
  const etapas = contarPorEtapa(contatos)

  return (
    <Shell usuario={usuario}>
      <AtualizarSozinho />
      <Titulo titulo="Dashboard" subtitulo="Seu funil de relance: quantos contatos existem e em que etapa estão." />
      <CartoesNumeros total={contatos.length} etapas={etapas} />
      <div className="dash-grade">
        <GraficoFunil total={contatos.length} etapas={etapas} />
        <UltimosContatos contatos={contatos.slice(0, 5)} />
      </div>
    </Shell>
  )
}
