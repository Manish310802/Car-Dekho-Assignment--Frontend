// Small display helpers shared across components.

export function formatINR(rupees: number): string {
  if (rupees >= 10000000) return `₹${(rupees / 10000000).toFixed(2)} Cr`
  return `₹${(rupees / 100000).toFixed(2)} L`
}

const LABELS: Record<string, string> = {
  city_commute: 'City commute',
  family: 'Family',
  first_car: 'First car',
  performance: 'Performance',
  off_road: 'Off-road',
  long_highway: 'Highway trips',
  no_preference: 'No preference',
  low_maintenance: 'Low maintenance',
}

export function humanize(value: string): string {
  return LABELS[value] ?? value.charAt(0).toUpperCase() + value.slice(1)
}

export function fuelLabel(fuel: string): string {
  return fuel === 'cng' ? 'CNG' : humanize(fuel)
}
