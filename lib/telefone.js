const REGEX_TELEFONE_BR = /^\(\d{2}\) \d{4,5}-\d{4}$/

export function telefoneValido(telefone) {
  return !telefone || REGEX_TELEFONE_BR.test(telefone)
}
