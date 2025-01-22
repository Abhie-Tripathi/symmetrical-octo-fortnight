"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

export function ConfidenceChart({ data }: { data: any }) {
  const chartData = data.map((item: any) => ({
    callId: item.callId,
    confidence: item.overall_confidence,
  }));

  const getBarColor = (confidence: number) => {
    if (confidence >= 0.8) return "#22c55e" // green
    if (confidence >= 0.6) return "#eab308" // yellow
    return "#ef4444" // red
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="callId" label={{ value: "Call ID", position: "insideBottom", offset: -5 }} />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            label={{ value: "Confidence Score", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
            labelFormatter={(label: string) => `Call ID: ${label}`}
          />
          <Bar dataKey="confidence">
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.confidence)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>Low (&lt;60%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span>Medium (60-80%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>High (&gt;80%)</span>
        </div>
      </div>
    </div>
  )
}

