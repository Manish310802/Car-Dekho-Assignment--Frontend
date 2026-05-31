import { useState } from 'react'

interface Props {
  onRefine: (message: string) => Promise<void>
  busy: boolean
}

const CHIPS = [
  'Something cheaper',
  'I need 7 seats',
  'Prefer an EV',
  'Better fuel economy',
  'Stronger engine',
]

export function ChatRefine({ onRefine, busy }: Props) {
  const [text, setText] = useState('')

  const submit = async (msg: string) => {
    if (!msg.trim() || busy) return
    setText('')
    await onRefine(msg.trim())
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-base">
          🤖
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-900">Refine your shortlist</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Tell me what to change and I'll re-rank — in plain English.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void submit(text)
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. something cheaper with better mileage"
          disabled={busy}
          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
        >
          {busy ? (
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
              Thinking
            </span>
          ) : 'Refine →'}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => void submit(chip)}
            disabled={busy}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-40"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}
