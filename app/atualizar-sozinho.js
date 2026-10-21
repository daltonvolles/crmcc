'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Busca os dados de novo a cada 30 segundos e quando a aba volta a ficar em foco,
// para a tela acompanhar mudanças feitas por outras pessoas ou em outras abas.
export default function AtualizarSozinho() {
  const router = useRouter()

  useEffect(() => {
    const atualizar = () => document.visibilityState === 'visible' && router.refresh()
    const intervalo = setInterval(atualizar, 30000)
    window.addEventListener('focus', atualizar)
    return () => {
      clearInterval(intervalo)
      window.removeEventListener('focus', atualizar)
    }
  }, [router])

  return null
}
