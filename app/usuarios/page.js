import { redirect } from 'next/navigation'
import { listarUsuarios, usuarioLogado } from '../../lib/usuarios'
import Shell, { Titulo } from '../shell'
import BotaoAprovar from './botao-aprovar'

export default async function Usuarios() {
  const usuario = await usuarioLogado()
  if (!usuario) redirect('/login')
  if (usuario.papel !== 'admin') redirect('/')

  const usuarios = await listarUsuarios()

  return (
    <Shell usuario={usuario}>
      <Titulo titulo="Usuários" subtitulo="Aprove os novos cadastros para que possam entrar no CRM." />

      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="cartao"
            style={{
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div>
              <p className="mono" style={{ fontWeight: 500, fontSize: '15px' }}>{u.usuario}</p>
              <p className="rotulo" style={{ marginTop: '8px' }}>
                {u.papel === 'admin' ? 'Administrador' : 'Usuário'} ·{' '}
                <span style={{ color: u.status === 'aprovado' ? 'var(--color-text-muted)' : 'var(--color-accent)' }}>
                  {u.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                </span>
              </p>
            </div>
            {u.status === 'pendente' && <BotaoAprovar id={u.id} />}
          </div>
        ))}
      </section>
    </Shell>
  )
}
