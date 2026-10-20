// O detalhe técnico do banco fica só no log do servidor; quem usa o CRM vê uma mensagem simples.
export function erroDoBanco(error) {
  console.error('Erro no banco de dados:', error.code, error.message)
  return new Error('Não foi possível concluir a operação. Tente novamente.')
}
