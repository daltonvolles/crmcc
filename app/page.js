import { redirect } from 'next/navigation'
import { listarContatos } from '../lib/contatos'
import { usuarioLogado } from '../lib/usuarios'
import ContatosApp from './contatos-app'
import Navbar from './navbar'

export default async function Home() {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')

  const contatos = await listarContatos()

  return (
    <>
      <Navbar usuario={usuario} />
      <ContatosApp contatosIniciais={contatos} />
    </>
  )
}
