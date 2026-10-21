import { redirect } from 'next/navigation'
import { buscarContato } from '../../../lib/contatos'
import { usuarioLogado } from '../../../lib/usuarios'
import { idValido } from '../../../lib/validacao'
import Shell from '../../shell'
import PaginaContato, { ContatoNaoEncontrado } from './pagina'

export default async function Contato({ params }) {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')

  const { id } = await params
  const contato = idValido(id) ? await buscarContato(id) : null

  return (
    <Shell usuario={usuario}>
      {contato ? <PaginaContato contato={contato} /> : <ContatoNaoEncontrado />}
    </Shell>
  )
}
