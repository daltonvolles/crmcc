'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sair } from './actions'

export default function Navbar({ usuario }) {
  const caminho = usePathname()
  const paginas = [{ href: '/', label: 'Contatos' }]
  if (usuario.papel === 'admin') paginas.push({ href: '/usuarios', label: 'Usuários' })

  return (
    <nav
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '18px' }}>Meu CRM</span>

        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          {paginas.map((pagina) => {
            const ativa = caminho === pagina.href
            return (
              <Link
                key={pagina.href}
                href={pagina.href}
                style={{
                  color: ativa ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '15px',
                  textDecoration: 'none',
                }}
              >
                {pagina.label}
              </Link>
            )
          })}
        </div>

        <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>{usuario.usuario}</span>
        <form action={sair}>
          <button
            type="submit"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </form>
      </div>
    </nav>
  )
}
