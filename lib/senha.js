import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

// A senha fica guardada no formato "sal:hash", nunca como texto puro.
export function gerarHash(senha) {
  const sal = randomBytes(16).toString('hex')
  return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`
}

export function senhaConfere(senha, guardado) {
  const [sal, hash] = (guardado || '').split(':')
  if (!senha || !sal || !hash) return false

  const esperado = Buffer.from(hash, 'hex')
  const calculado = scryptSync(senha, sal, esperado.length)
  return esperado.length === 64 && timingSafeEqual(calculado, esperado)
}
