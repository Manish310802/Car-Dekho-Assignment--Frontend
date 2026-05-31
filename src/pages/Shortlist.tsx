import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { api, type RecommendResponse } from '../api'
import { CarCard } from '../components/CarCard'
import { ChatRefine } from '../components/ChatRefine'
import { CompareTable } from '../components/CompareTable'
import { humanize } from '../lib/format'

export function Shortlist() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locationData = (location.state as { data?: RecommendResponse } | null)?.data ?? null
  const [data, setData] = useState<RecommendResponse | null>(locationData)
  const [loading, setLoading] = useState(locationData === null)
  const [error, setError] = useState('')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [refining, setRefining] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // If we already have data passed via location state (e.g. after refine or wizard), skip the fetch.
    if (!id || locationData) return
    let active = true
    api
      .getShortlist(id)
      .then((d) => {
        if (active) {
          setData(d)
          setError('')
        }
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load shortlist'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, locationData])

  const toggleCompare = (carId: string) => {
    setCompareIds((prev) =>
      prev.includes(carId) ? prev.filter((x) => x !== carId) : prev.length < 4 ? [...prev, carId] : prev,
    )
  }

  const handleRefine = async (message: string) => {
    if (!data) return
    setRefining(true)
    setError('')
    try {
      const res = await api.refine(data.shortlist_id, message)
      setData(res)
      setCompareIds([])
      setShowCompare(false)
      navigate(`/s/${res.shortlist_id}`, { state: { data: res }, replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refine failed — please try again')
    } finally {
      setRefining(false)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.origin + `/s/${data?.shortlist_id ?? id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <LoadingState />
  if (error && !data) return <ErrorState message={error} />
  if (!data) return null

  const compareCars = data.cars.filter((s) => compareIds.includes(s.car.id))
  const profile = data.profile

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">

      {/* Header summary card */}
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Your shortlist · {data.cars.length} cars
            </p>
            <h1 className="mt-2 text-xl font-black leading-snug text-zinc-900 sm:text-2xl">
              {data.summary}
            </h1>

            {/* Profile pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <ProfilePill>{humanize(profile.use_case)}</ProfilePill>
              <ProfilePill>{profile.seats} seats</ProfilePill>
              {profile.fuel_pref !== 'no_preference' && (
                <ProfilePill>{humanize(profile.fuel_pref)}</ProfilePill>
              )}
              {profile.priorities.map((p) => (
                <ProfilePill key={p}>{humanize(p)}</ProfilePill>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-400"
            >
              {copied ? '✓ Copied' : '🔗 Share'}
            </button>
            <Link
              to="/wizard"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-400"
            >
              ↺ Restart
            </Link>
          </div>
        </div>

        {/* Compare bar */}
        {compareIds.length >= 2 && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
            <span className="text-xs font-semibold text-emerald-700">
              {compareIds.length} cars selected for comparison
            </span>
            <button
              onClick={() => setShowCompare((v) => !v)}
              className="ml-auto rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-800"
            >
              {showCompare ? 'Hide table' : 'Compare →'}
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs text-emerald-600 hover:text-emerald-800"
            >
              Clear
            </button>
          </div>
        )}

        {!data.llm_used && (
          <p className="mt-3 text-xs text-zinc-400">
            💡 Running without an LLM key — rationale is templated. Add{' '}
            <code className="rounded bg-zinc-100 px-1 font-mono">OPENAI_API_KEY</code> for richer
            AI explanations.
          </p>
        )}
      </div>

      {/* Compare table */}
      {showCompare && compareCars.length >= 2 && (
        <div className="mb-6">
          <CompareTable cars={compareCars} onClose={() => setShowCompare(false)} />
        </div>
      )}

      {/* Refine */}
      <div className="mb-6">
        <ChatRefine onRefine={handleRefine} busy={refining} />
      </div>

      {/* Error from refine */}
      {error && (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Car cards */}
      <div className="space-y-4">
        {data.cars.map((scored, i) => (
          <CarCard
            key={scored.car.id}
            scored={scored}
            rank={i + 1}
            selected={compareIds.includes(scored.car.id)}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-[11px] text-zinc-300">
        Prices are indicative ex-showroom figures. Verify with your nearest dealer.
      </p>
    </div>
  )
}

function ProfilePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
      {children}
    </span>
  )
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="skeleton mb-2 h-4 w-32 rounded" />
        <div className="skeleton h-7 w-3/4 rounded" />
        <div className="mt-3 flex gap-2">
          {[80, 64, 72].map((w) => (
            <div key={w} className={`skeleton h-6 w-${w} rounded-full`} />
          ))}
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex gap-4">
            <div className="skeleton h-7 w-7 rounded-full" />
            <div className="flex-1">
              <div className="skeleton mb-2 h-5 w-48 rounded" />
              <div className="skeleton h-3.5 w-24 rounded" />
              <div className="skeleton mt-3 h-8 w-32 rounded" />
            </div>
            <div className="skeleton h-16 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-4xl">⚠</div>
      <p className="text-sm text-zinc-500">{message}</p>
      <Link
        to="/wizard"
        className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
      >
        Start over
      </Link>
    </div>
  )
}
