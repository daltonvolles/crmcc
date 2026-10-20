// Sessão de login: um cookie com a data de validade + uma assinatura.
// Usa Web Crypto para funcionar tanto no middleware quanto no servidor.

export const NOME_COOKIE = 'crm_sessao'
export const DURACAO_SEGUNDOS = 60 * 60 * 8 // 8 horas sem usar e a sessão expira

export const opcoesCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: DURACAO_SEGUNDOS,
}

async function assinar(texto) {
  const segredo = process.env.SESSION_SECRET
  if (!segredo) throw new Error('SESSION_SECRET não definido no .env.local')

  const codificador = new TextEncoder()
  const chave = await crypto.subtle.importKey(
    'raw',
    codificador.encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const assinatura = await crypto.subtle.sign('HMAC', chave, codificador.encode(texto))
  return Array.from(new Uint8Array(assinatura), (b) => b.toString(16).padStart(2, '0')).join('')
}

function iguais(a, b) {
  if (a.length !== b.length) return false
  let diferenca = 0
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diferenca === 0
}

// Token: "idDoUsuario.validade.assinatura"
export async function criarToken(idUsuario) {
  const validade = Math.floor(Date.now() / 1000) + DURACAO_SEGUNDOS
  const conteudo = `${idUsuario}.${validade}`
  return `${conteudo}.${await assinar(conteudo)}`
}

// Devolve o id do usuário se o token for válido; senão, null.
export async function lerToken(token) {
  if (!token || !process.env.SESSION_SECRET) return null

  const [id, validade, assinatura] = token.split('.')
  if (!id || !validade || !assinatura) return null
  if (Number(validade) < Math.floor(Date.now() / 1000)) return null

  return iguais(assinatura, await assinar(`${id}.${validade}`)) ? id : null
}
