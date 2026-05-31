import { Link } from 'react-router-dom'

const SOCIAL_PROOF = ['₹4L – ₹80L range', '44 cars', 'All segments', 'Scored in real-time']

const HOW = [
  {
    n: '01',
    title: 'Answer 5 questions',
    body: 'Budget, use case, how many seats, fuel preference, and what you care about most.',
  },
  {
    n: '02',
    title: 'Every car gets a score',
    body: 'A transparent engine scores each car across six dimensions — and shows you the breakdown.',
  },
  {
    n: '03',
    title: 'AI writes your rationale',
    body: 'A grounded AI advisor explains in plain language why each car fits you and what to watch.',
  },
]

const SEGMENTS = [
  { label: 'Hatchback', icon: '🚗', desc: 'City-friendly, easy to park' },
  { label: 'Sedan', icon: '🚙', desc: 'Balanced comfort and boot' },
  { label: 'Compact SUV', icon: '🛻', desc: 'Ride height without the size' },
  { label: 'SUV / MPV', icon: '🚐', desc: 'Space, safety, presence' },
  { label: 'Electric', icon: '⚡', desc: 'Near-zero running cost' },
  { label: 'Hybrid', icon: '🔋', desc: 'Best of both worlds' },
]

export function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
      {/* HERO — left-aligned editorial */}
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI-powered · Free · No signup
        </div>

        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight text-zinc-900">
          Too many cars,
          <br />
          <span className="text-zinc-400">not enough clarity.</span>
          <br />
          <span className="text-indigo-600">Let's fix that.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
          Answer 5 questions about your budget, your life, and what matters. Get a ranked shortlist
          with a clear, honest reason for every pick — and refine it in plain English.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700"
          >
            Find my car
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="text-sm text-zinc-400">No account needed</span>
        </div>

        {/* Stats strip */}
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {SOCIAL_PROOF.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-sm text-zinc-400">
              <span className="h-1 w-1 rounded-full bg-zinc-300" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="mt-24 border-t border-zinc-100 pt-16">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">How it works</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {HOW.map((step) => (
            <div key={step.n}>
              <div className="text-4xl font-black text-zinc-100">{step.n}</div>
              <h3 className="mt-2 text-base font-bold text-zinc-900">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEGMENTS */}
      <div className="mt-20 border-t border-zinc-100 pt-16">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          Segments covered
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.label}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-center transition hover:border-zinc-400"
            >
              <div className="text-2xl">{seg.icon}</div>
              <div className="mt-2 text-xs font-bold text-zinc-900">{seg.label}</div>
              <div className="mt-0.5 text-[10px] text-zinc-400">{seg.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="mt-24 rounded-3xl bg-zinc-900 px-8 py-12 text-center">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Confused about which car to buy?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-300">
          You're 60 seconds from a ranked, explained shortlist. No ads, no dealer referrals.
        </p>
        <Link
          to="/wizard"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-zinc-900 transition hover:bg-zinc-100"
        >
          Get my shortlist →
        </Link>
      </div>
    </div>
  )
}
