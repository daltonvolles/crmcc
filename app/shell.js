'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sair } from './actions'

// Moldura de toda tela logada: cabeçalho no topo, navegação à esquerda, conteúdo à direita.
export default function Shell({ usuario, largo = false, children }) {
  const caminho = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)

  const areas = [
    { href: '/', label: 'Dashboard' },
    { href: '/funil', label: 'Funil' },
    { href: '/contatos', label: 'Contatos' },
  ]
  if (usuario.papel === 'admin') areas.push({ href: '/usuarios', label: 'Usuários' })

  return (
    <>
      <header className="shell-cabecalho">
        <button
          type="button"
          className="botao botao-secundario shell-menu"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          {menuAberto ? 'Fechar' : 'Menu'}
        </button>
        <span className="shell-marca">Meu CRM</span>
        <span className="shell-usuario">{usuario.usuario}</span>
        <form action={sair}>
          <button type="submit" className="botao botao-secundario">
            Sair
          </button>
        </form>
      </header>

      <div className="shell-corpo">
        <nav className={`shell-nav${menuAberto ? ' aberta' : ''}`}>
          <p className="rotulo">Áreas</p>
          {areas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              onClick={() => setMenuAberto(false)}
              className={`nav-item${ativa(caminho, area.href) ? ' ativo' : ''}`}
            >
              {area.label}
            </Link>
          ))}
        </nav>

        <main className="shell-conteudo">
          <div className={largo ? 'largo' : undefined}>{children}</div>
        </main>
      </div>
    </>
  )
}

// A área continua ativa nas telas dentro dela (ex.: /contatos/123 deixa "Contatos" ativo).
function ativa(caminho, href) {
  return href === '/' ? caminho === '/' : caminho === href || caminho.startsWith(`${href}/`)
}

export function Titulo({ titulo, subtitulo }) {
  return (
    <div>
      <h1 style={{ fontSize: '28px' }}>{titulo}</h1>
      <p className="apoio" style={{ fontSize: '15px', marginTop: '8px' }}>
        {subtitulo}
      </p>
    </div>
  )
}
