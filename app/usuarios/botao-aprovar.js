'use client'

import { useTransition } from 'react'
import { aprovar } from '../actions'

export default function BotaoAprovar({ id }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => aprovar(id))}
      className="botao botao-primario"
    >
      {pending ? 'Aprovando...' : 'Aprovar'}
    </button>
  )
}
