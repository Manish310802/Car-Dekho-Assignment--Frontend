import type { ScoredCar } from '../api'
import { formatINR, fuelLabel } from '../lib/format'

interface Props {
  cars: ScoredCar[]
  onClose: () => void
}

interface Row {
  label: string
  get: (s: ScoredCar) => string | number
  better?: 'high' | 'low'
  raw?: (s: ScoredCar) => number
}

const ROWS: Row[] = [
  { label: 'Match score', get: (s) => s.match_score, better: 'high', raw: (s) => s.match_score },
  {
    label: 'Price',
    get: (s) => formatINR(s.car.price_ex_showroom_inr),
    better: 'low',
    raw: (s) => s.car.price_ex_showroom_inr,
  },
  { label: 'Fuel type', get: (s) => fuelLabel(s.car.fuel) },
  {
    label: 'Efficiency',
    get: (s) =>
      s.car.fuel === 'electric' ? `${s.car.range_km ?? '—'} km range` : `${s.car.mileage_kmpl ?? '—'} kmpl`,
    better: 'high',
    raw: (s) => (s.car.fuel === 'electric' ? (s.car.range_km ?? 0) / 12 : s.car.mileage_kmpl ?? 0),
  },
  {
    label: 'Safety (NCAP)',
    get: (s) => (s.car.safety_ncap_stars > 0 ? `${s.car.safety_ncap_stars} ★` : 'Not rated'),
    better: 'high',
    raw: (s) => s.car.safety_ncap_stars,
  },
  {
    label: 'Seats',
    get: (s) => String(s.car.seating),
    better: 'high',
    raw: (s) => s.car.seating,
  },
  {
    label: 'Power',
    get: (s) => `${s.car.power_bhp} bhp`,
    better: 'high',
    raw: (s) => s.car.power_bhp,
  },
  {
    label: 'Boot space',
    get: (s) => (s.car.boot_litres > 0 ? `${s.car.boot_litres} L` : '—'),
    better: 'high',
    raw: (s) => s.car.boot_litres,
  },
  {
    label: 'Owner rating',
    get: (s) => `${s.car.user_rating} / 5`,
    better: 'high',
    raw: (s) => s.car.user_rating,
  },
  {
    label: 'Reliability',
    get: (s) => `${s.car.reliability_score} / 10`,
    better: 'high',
    raw: (s) => s.car.reliability_score,
  },
]

function bestIndex(cars: ScoredCar[], row: Row): number {
  if (!row.better || !row.raw) return -1
  const values = cars.map(row.raw)
  const target = row.better === 'high' ? Math.max(...values) : Math.min(...values)
  const best = values.indexOf(target)
  // Only highlight if there is a clear winner (not all tied)
  return values.every((v) => v === target) ? -1 : best
}

export function CompareTable({ cars, onClose }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Side-by-side comparison</h2>
          <p className="text-xs text-zinc-400">✓ marks the better value in each row</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
        >
          Close
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="w-36 p-4 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400" />
              {cars.map((s, i) => (
                <th key={s.car.id} className={`p-4 text-left ${i === 0 ? 'bg-zinc-50' : ''}`}>
                  <div className="font-bold text-zinc-900">
                    {s.car.make} {s.car.model}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">{s.car.variant}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, ri) => {
              const best = bestIndex(cars, row)
              return (
                <tr key={row.label} className={`border-t border-zinc-100 ${ri % 2 === 0 ? '' : 'bg-zinc-50/50'}`}>
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {row.label}
                  </td>
                  {cars.map((s, i) => (
                    <td
                      key={s.car.id}
                      className={`p-4 ${i === 0 ? 'bg-zinc-50' : ''} ${i === best ? 'font-bold text-emerald-700' : 'text-zinc-700'}`}
                    >
                      {row.get(s)}
                      {i === best && (
                        <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700">
                          ✓
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
