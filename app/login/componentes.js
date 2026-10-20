import Link from 'next/link'

// Peças visuais compartilhadas pelas telas de login e cadastro.

export function Cartao({ subtitulo, children, rodape }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '32px',
        }}
      >
        <h1 style={{ fontSize: '28px' }}>Meu CRM</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', marginTop: '8px', marginBottom: '24px' }}>
          {subtitulo}
        </p>
        {children}
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '24px', marginBottom: 0 }}>
          {rodape}
        </p>
      </section>
    </main>
  )
}

export function LinkTexto({ href, children }) {
  return (
    <Link href={href} style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none' }}>
      {children}
    </Link>
  )
}

export function Mensagem({ erro, children }) {
  return <p style={{ color: erro ? '#B91C1C' : 'var(--color-text)', fontSize: '14px', margin: 0 }}>{children}</p>
}

export function Campo({ label, name, type = 'text', autoComplete }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 700 }}>
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '12px 14px',
          fontSize: '16px',
          fontFamily: 'inherit',
          fontWeight: 400,
          color: 'var(--color-text)',
          background: 'var(--color-surface)',
        }}
      />
    </label>
  )
}

export function Botao({ pending, children, textoPending }) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        marginTop: '8px',
        background: 'var(--color-accent)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '12px 20px',
        fontSize: '16px',
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: pending ? 'default' : 'pointer',
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? textoPending : children}
    </button>
  )
}
