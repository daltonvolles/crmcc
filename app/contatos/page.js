import { redirect } from 'next/navigation'
import { usuarioLogado } from '../../lib/usuarios'
import Shell, { Titulo } from '../shell'
import BuscaContatos from './busca'
import FormularioContato from './formulario'

export default async function Contatos() {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')

  return (
    <Shell usuario={usuario}>
      <Titulo titulo="Contatos" subtitulo="Encontre um contato ou cadastre um novo. Contatos novos entram no funil como novo." />
      <BuscaContatos />
      <FormularioContato />
    </Shell>
  )
}
