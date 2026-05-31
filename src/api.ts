// Typed API client — mirrors the backend Pydantic schemas (the shared contract).

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type UseCase =
  | 'city_commute'
  | 'family'
  | 'first_car'
  | 'performance'
  | 'off_road'
  | 'long_highway'
export type FuelPref = 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid' | 'no_preference'
export type TransmissionPref = 'manual' | 'automatic' | 'no_preference'
export type Priority =
  | 'mileage'
  | 'safety'
  | 'performance'
  | 'features'
  | 'low_maintenance'
  | 'resale'

export interface BuyerProfile {
  budget_min_inr: number
  budget_max_inr: number
  use_case: UseCase
  seats: number
  fuel_pref: FuelPref
  transmission_pref: TransmissionPref
  priorities: Priority[]
}

export interface Car {
  id: string
  make: string
  model: string
  variant: string
  price_ex_showroom_inr: number
  body_type: string
  fuel: string
  transmissions: string[]
  mileage_kmpl: number | null
  range_km: number | null
  seating: number
  safety_ncap_stars: number
  boot_litres: number
  engine_cc: number
  power_bhp: number
  reliability_score: number
  user_rating: number
  review_snippets: string[]
  image_url: string | null
  key_features: string[]
}

export interface ScoreBreakdown {
  budget: number
  use_case: number
  seats: number
  fuel: number
  transmission: number
  priorities: number
}

export interface ScoredCar {
  car: Car
  match_score: number
  breakdown: ScoreBreakdown
  rationale: string
  watch_outs: string
}

export interface RecommendResponse {
  shortlist_id: string
  summary: string
  profile: BuyerProfile
  cars: ScoredCar[]
  llm_used: boolean
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`API ${res.status}: ${detail}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  recommend: (profile: BuyerProfile) =>
    request<RecommendResponse>('/api/recommend', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),
  getShortlist: (id: string) => request<RecommendResponse>(`/api/shortlist/${id}`),
  refine: (shortlistId: string, message: string) =>
    request<RecommendResponse>('/api/refine', {
      method: 'POST',
      body: JSON.stringify({ shortlist_id: shortlistId, message }),
    }),
}
