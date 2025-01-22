import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function InteractionList({ interactions }) {
  const getConfidenceColor = (score) => {
    if (score >= 0.8) return "bg-green-500"
    if (score >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <Card key={interaction._id} className="overflow-hidden">
          <CardHeader className="bg-gray-100">
            <CardTitle className="flex justify-between items-center">
              <span>Call ID: {interaction.callId}</span>
              <Badge className={getConfidenceColor(interaction.overall_confidence)}>
                {(interaction.overall_confidence * 100).toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription>Overall Confidence</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-4">
              {interaction.confidence_scores.map((score, index) => (
                <li key={index} className="border-b pb-4 last:border-b-0">
                  <p className="font-semibold mb-1">Q: {score.client_question}</p>
                  <p className="mb-1">A: {score.bot_response}</p>
                  <Badge className={getConfidenceColor(score.confidence_score)}>
                    Confidence: {(score.confidence_score * 100).toFixed(2)}%
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

