import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  api,
  type BuyerProfile,
  type FuelPref,
  type Priority,
  type TransmissionPref,
  type UseCase,
} from '../api'

const BUDGETS: { label: string; sublabel: string; min: number; max: number }[] = [
  { label: 'Under ₹7L', sublabel: 'Entry-level hatchbacks', min: 0, max: 700000 },
  { label: '₹7L – ₹12L', sublabel: 'Premium hatchbacks & sedans', min: 700000, max: 1200000 },
  { label: '₹12L – ₹18L', sublabel: 'Compact SUVs & midsize sedans', min: 1200000, max: 1800000 },
  { label: '₹18L – ₹25L', sublabel: 'Midsize SUVs & EVs', min: 1800000, max: 2500000 },
  { label: '₹25L+', sublabel: 'Premium SUVs, MPVs & luxury', min: 2500000, max: 5000000 },
]

const USE_CASES: { value: UseCase; label: string; icon: string; desc: string }[] = [
  { value: 'city_commute', label: 'City commute', icon: '🏙', desc: 'Tight lanes, parking, stop-go traffic' },
  { value: 'family', label: 'Family car', icon: '👨‍👩‍👧', desc: 'Space, comfort, safety for all' },
  { value: 'first_car', label: 'First car', icon: '🔰', desc: 'Easy to drive, forgiving, economical' },
  { value: 'long_highway', label: 'Highway trips', icon: '🛣', desc: 'Comfort and stability at speed' },
  { value: 'performance', label: 'Fun to drive', icon: '🏎', desc: 'Power, responsiveness, excitement' },
  { value: 'off_road', label: 'Adventure', icon: '⛰', desc: 'Rough roads, off-tarmac capability' },
]

const SEAT_OPTIONS = [
  { label: '4 seats', value: 4, desc: 'Just me or couple' },
  { label: '5 seats', value: 5, desc: 'Small family' },
  { label: '7 seats', value: 7, desc: 'Larger family or carpooling' },
]

const FUELS: { value: FuelPref; label: string; icon: string }[] = [
  { value: 'no_preference', label: 'No preference', icon: '🔀' },
  { value: 'petrol', label: 'Petrol', icon: '⛽' },
  { value: 'diesel', label: 'Diesel', icon: '🛢' },
  { value: 'cng', label: 'CNG', icon: '💨' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔋' },
  { value: 'electric', label: 'Electric', icon: '⚡' },
]

const TRANSMISSIONS: { value: TransmissionPref; label: string }[] = [
  { value: 'no_preference', label: 'Either' },
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
]

const PRIORITIES: { value: Priority; label: string; icon: string; desc: string }[] = [
  { value: 'safety', label: 'Safety', icon: '🛡', desc: 'NCAP stars, airbags, ADAS' },
  { value: 'mileage', label: 'Running cost', icon: '⛽', desc: 'Mileage, range, efficiency' },
  { value: 'features', label: 'Features', icon: '✨', desc: 'Tech, infotainment, comfort' },
  { value: 'performance', label: 'Performance', icon: '⚡', desc: 'Power, bhp, acceleration' },
  { value: 'low_maintenance', label: 'Reliability', icon: '🔧', desc: 'Service intervals, dependability' },
  { value: 'resale', label: 'Resale value', icon: '💰', desc: 'Value retention, brand strength' },
]

const STEPS = 5

export function Wizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [budget, setBudget] = useState(BUDGETS[2])
  const [useCase, setUseCase] = useState<UseCase | null>(null)
  const [seats, setSeats] = useState(5)
  const [fuel, setFuel] = useState<FuelPref>('no_preference')
  const [transmission, setTransmission] = useState<TransmissionPref>('no_preference')
  const [priorities, setPriorities] = useState<Priority[]>(['safety'])

  const togglePriority = (p: Priority) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length < 3 ? [...prev, p] : prev,
    )
  }

  const canContinue = step === 1 ? useCase !== null : true

  const submit = async () => {
    if (!useCase) return
    setSubmitting(true)
    setError('')
    const profile: BuyerProfile = {
      budget_min_inr: budget.min,
      budget_max_inr: budget.max,
      use_case: useCase,
      seats,
      fuel_pref: fuel,
      transmission_pref: transmission,
      priorities,
    }
    try {
      const res = await api.recommend(profile)
      navigate(`/s/${res.shortlist_id}`, { state: { data: res } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const next = () => (step === STEPS - 1 ? void submit() : setStep((s) => s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      {/* Progress header */}
      <div className="mb-10 flex items-center gap-4">
        {step > 0 && (
          <button
            onClick={back}
            disabled={submitting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-30"
          >
            ←
          </button>
        )}
        <div className="flex-1">
          <div className="mb-1.5 flex justify-between text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            <span>
              Step {step + 1} / {STEPS}
            </span>
            <span>{Math.round(((step + 1) / STEPS) * 100)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="progress-bar h-full rounded-full bg-zinc-900"
              style={{ width: `${((step + 1) / STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step panels */}
      {step === 0 && (
        <StepWrapper title="What's your budget?" subtitle="Ex-showroom price. We'll find the best value within it.">
          <div className="grid gap-2.5">
            {BUDGETS.map((b) => (
              <OptionRow
                key={b.label}
                active={budget.label === b.label}
                onClick={() => setBudget(b)}
              >
                <span className="font-bold text-zinc-900">{b.label}</span>
                <span className="ml-auto text-xs text-zinc-400">{b.sublabel}</span>
              </OptionRow>
            ))}
          </div>
        </StepWrapper>
      )}

      {step === 1 && (
        <StepWrapper title="How will you mainly use it?" subtitle="Pick the one that fits best.">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {USE_CASES.map((u) => (
              <OptionCard
                key={u.value}
                active={useCase === u.value}
                onClick={() => setUseCase(u.value)}
              >
                <span className="text-2xl">{u.icon}</span>
                <div className="mt-2">
                  <div className="font-bold text-zinc-900">{u.label}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">{u.desc}</div>
                </div>
              </OptionCard>
            ))}
          </div>
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper title="How many people need to fit?" subtitle="We'll ensure enough seats.">
          <div className="grid gap-2.5 sm:grid-cols-3">
            {SEAT_OPTIONS.map((s) => (
              <OptionCard key={s.value} active={seats === s.value} onClick={() => setSeats(s.value)}>
                <div className="text-2xl font-black text-zinc-200">{s.value}</div>
                <div className="mt-2 font-bold text-zinc-900">{s.label}</div>
                <div className="mt-0.5 text-xs text-zinc-500">{s.desc}</div>
              </OptionCard>
            ))}
          </div>
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper title="Fuel and gearbox?" subtitle="Skip if you're open to anything.">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {FUELS.map((f) => (
              <OptionCard key={f.value} active={fuel === f.value} onClick={() => setFuel(f.value)}>
                <span className="text-xl">{f.icon}</span>
                <div className="mt-2 text-sm font-bold text-zinc-900">{f.label}</div>
              </OptionCard>
            ))}
          </div>
          <div className="mt-5">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Transmission
            </p>
            <div className="flex gap-2">
              {TRANSMISSIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTransmission(t.value)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    transmission === t.value
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </StepWrapper>
      )}

      {step === 4 && (
        <StepWrapper title="What matters most to you?" subtitle="Choose up to 3. These priorities shape your ranking.">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {PRIORITIES.map((p) => (
              <OptionRow
                key={p.value}
                active={priorities.includes(p.value)}
                onClick={() => togglePriority(p.value)}
              >
                <span className="text-lg">{p.icon}</span>
                <div className="ml-2">
                  <div className="font-bold text-zinc-900">{p.label}</div>
                  <div className="text-xs text-zinc-500">{p.desc}</div>
                </div>
                {priorities.includes(p.value) && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
                    ✓
                  </span>
                )}
              </OptionRow>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            {priorities.length}/3 selected
            {priorities.length === 3 && ' — limit reached'}
          </p>
        </StepWrapper>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8">
        <button
          onClick={next}
          disabled={!canContinue || submitting}
          className="w-full rounded-2xl bg-zinc-900 py-4 text-base font-bold text-white transition hover:bg-zinc-700 disabled:opacity-40 sm:w-auto sm:px-12"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
              Finding your matches…
            </span>
          ) : step === STEPS - 1 ? (
            'Show my shortlist →'
          ) : (
            'Continue →'
          )}
        </button>
      </div>
    </div>
  )
}

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-black leading-tight tracking-tight text-zinc-900">
        {title}
      </h1>
      <p className="mt-2 mb-7 text-sm text-zinc-500">{subtitle}</p>
      {children}
    </div>
  )
}

function OptionRow({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`option-btn flex w-full items-center rounded-2xl border px-4 py-3.5 text-left ${
        active
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
      }`}
    >
      {children}
    </button>
  )
}

function OptionCard({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`option-btn flex w-full flex-col rounded-2xl border p-4 text-left ${
        active
          ? 'border-zinc-900 bg-zinc-900 text-white **:text-white'
          : 'border-zinc-200 bg-white hover:border-zinc-400'
      }`}
    >
      {children}
    </button>
  )
}
