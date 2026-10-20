// Conferências simples dos dados antes de salvar. Rodam sempre no servidor.

export const LIMITES = { nome: 120, anotacao: 5000, usuario: 50, senha: 128 }

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REGEX_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Valor do formulário como texto sem espaços nas pontas ("" se não for texto).
export function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : ''
}

export function emailValido(email) {
  return email.length <= 254 && REGEX_EMAIL.test(email)
}

export function idValido(id) {
  return typeof id === 'string' && REGEX_ID.test(id)
}
