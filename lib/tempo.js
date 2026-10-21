// Tempo desde uma data, em português.

// "cadastrado há 3 dias", "cadastrado agora"
export function tempoDesde(valor) {
  const segundos = Math.max(0, (Date.now() - new Date(valor).getTime()) / 1000)
  if (segundos < 60) return 'cadastrado agora'

  const formato = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
  const unidades = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  const [unidade, tamanho] = unidades.find(([, t]) => segundos >= t)
  return `cadastrado ${formato.format(-Math.floor(segundos / tamanho), unidade)}`
}
