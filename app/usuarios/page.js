import { redirect } from 'next/navigation'
import { listarUsuarios, usuarioLogado } from '../../lib/usuarios'
import Navbar from '../navbar'
import BotaoAprovar from './botao-aprovar'

export default async function Usuarios() {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')
  if (usuario.papel !== 'admin') redirect('/')

  const usuarios = await listarUsuarios()

  return (
    <>
      <Navbar usuario={usuario} />
      <main style={{ padding: '48px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px' }}>Usuários</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', marginTop: '8px' }}>
              Aprove os novos cadastros para que possam entrar no CRM.
            </p>
          </div>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {usuarios.map((u) => (
              <div
                key={u.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: '16px', margin: 0 }}>{u.usuario}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: '4px 0 0' }}>
                    {u.papel === 'admin' ? 'Administrador' : 'Usuário'} ·{' '}
                    {u.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                  </p>
                </div>
                {u.status === 'pendente' && <BotaoAprovar id={u.id} />}
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  )
}
