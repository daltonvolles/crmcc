import Link from 'next/link'

// Peças visuais compartilhadas pelas telas de login e cadastro.

export function Cartao({ subtitulo, children, rodape }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <section className="cartao" style={{ width: '100%', maxWidth: '400px', padding: '36px 32px' }}>
        <p className="rotulo">Acesso</p>
        <h1 style={{ fontSize: '26px', marginTop: '10px' }}>Meu CRM</h1>
        <p className="apoio" style={{ fontSize: '15px', marginTop: '8px', marginBottom: '28px', lineHeight: 1.5 }}>
          {subtitulo}
        </p>
        {children}
        <p className="apoio" style={{ fontSize: '14px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          {rodape}
        </p>
      </section>
    </main>
  )
}

export function LinkTexto({ href, children }) {
  return (
    <Link href={href} className="link">
      {children}
    </Link>
  )
}

export function Mensagem({ erro, children }) {
  return <p className={erro ? 'erro' : undefined} style={{ fontSize: '14px', lineHeight: 1.5 }}>{children}</p>
}

export function Campo({ label, name, type = 'text', autoComplete }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span className="rotulo">{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required className="campo" />
    </label>
  )
}

export function Botao({ pending, children, textoPending }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="botao botao-primario"
      style={{ marginTop: '8px', padding: '12px 20px', fontSize: '15px' }}
    >
      {pending ? textoPending : children}
    </button>
  )
}
