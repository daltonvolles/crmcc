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
      style={{
        background: 'var(--color-accent)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: pending ? 'default' : 'pointer',
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? 'Aprovando...' : 'Aprovar'}
    </button>
  )
}
