import React from 'react'

export function RiskScore({ score, label, className }) {
  let color = 'text-green-500'
  let strokeColor = 'stroke-green-500'
  let riskLabel = 'Low Risk'

  if (score > 30 && score <= 70) {
    color = 'text-yellow-500'
    strokeColor = 'stroke-yellow-500'
    riskLabel = 'Medium Risk'
  } else if (score > 70) {
    color = 'text-red-500'
    strokeColor = 'stroke-red-500'
    riskLabel = 'High Risk'
  }

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="stroke-muted"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <div className={`mt-4 font-semibold ${color}`}>
        {label || riskLabel}
      </div>
    </div>
  )
}
