interface Props {
  score: number
  size?: number
  animate?: boolean
}

function scoreColor(score: number): string {
  if (score >= 85) return '#15803d' // green-700
  if (score >= 70) return '#0369a1' // sky-700
  if (score >= 55) return '#b45309' // amber-700
  return '#9f1239' // rose-800
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Great fit'
  if (score >= 70) return 'Good fit'
  if (score >= 55) return 'Fair fit'
  return 'Weak fit'
}

export function ScoreRing({ score, size = 72, animate = true }: Props) {
  const strokeWidth = size < 56 ? 4 : 5
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const color = scoreColor(score)

  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={animate ? 'score-ring-arc' : ''}
            style={
              animate
                ? ({
                    '--circumference': circumference,
                    '--offset': offset,
                  } as React.CSSProperties)
                : undefined
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold leading-none" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {size >= 60 && (
        <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color }}>
          {scoreLabel(score)}
        </span>
      )}
    </div>
  )
}
