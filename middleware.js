import { NextResponse } from 'next/server'
import { NOME_COOKIE, opcoesCookie, criarToken, lerToken } from './lib/sessao'

const PAGINAS_PUBLICAS = ['/login', '/cadastro']

// Roda antes de qualquer tela ou ação: sem sessão válida, vai para o login.
export async function middleware(request) {
  if (PAGINAS_PUBLICAS.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const idUsuario = await lerToken(request.cookies.get(NOME_COOKIE)?.value)
  if (!idUsuario) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const resposta = NextResponse.next()
  // Enquanto você usa, a sessão vai sendo renovada.
  if (request.method === 'GET') {
    resposta.cookies.set(NOME_COOKIE, await criarToken(idUsuario), opcoesCookie)
  }
  return resposta
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
