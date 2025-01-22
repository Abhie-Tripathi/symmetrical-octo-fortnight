"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, AlertTriangle, Lightbulb, MessageCircle } from "lucide-react"

interface OverallStatsProps {
  data: {
    results: any[]
    averageOverallConfidence: number
    pagination: {
      total: number
    }
  }
}

export function OverallStats({ data }: OverallStatsProps) {
  const confidenceColor =
    data.averageOverallConfidence >= 0.8
      ? "text-green-700"
      : data.averageOverallConfidence >= 0.6
        ? "text-yellow-600"
        : "text-red-700"

  const totalInteractions = data.results.reduce((sum, result) => sum + result.confidence_scores.length, 0)
  const totalLowConfidence = data.results.reduce((sum, result) => sum + result.low_confidence_instances.length, 0)
  const totalRecommendations = data.results.reduce((sum, result) => sum + result.recommendations.length, 0)

  const renderConfidenceBar = (score: number) => {
    const percentage = score * 100
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div className={`h-2.5 rounded-full ${confidenceColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${confidenceColor}`}>
            {(data.averageOverallConfidence * 100).toFixed(2)}%
          </div>
          {renderConfidenceBar(data.averageOverallConfidence)}
          <p className="text-xs text-muted-foreground">+2.1% from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
          <MessageCircle className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInteractions}</div>
          <p className="text-xs text-muted-foreground">Across {data.pagination.total} calls</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Confidence Instances</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLowConfidence}</div>
          <p className="text-xs text-muted-foreground">
            {((totalLowConfidence / totalInteractions) * 100).toFixed(2)}% of total interactions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
          <Lightbulb className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecommendations}</div>
          <p className="text-xs text-muted-foreground">
            {(totalRecommendations / data.pagination.total).toFixed(2)} per call
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

