import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RecommendationsList({ data }: { data: any }) {
  const allRecommendations = data.flatMap((item: any) =>
    item.recommendations.map((rec: any) => ({
      ...rec,
      callId: item.callId,
      overall_confidence: item.overall_confidence,
    }))
  );

  return (
    <div className="space-y-4">
      {allRecommendations.map((recommendation: any, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Recommendation for Call ID: {recommendation.callId}</span>
              <Badge
                className={
                  recommendation.overall_confidence >= 0.8
                    ? "bg-green-500"
                    : recommendation.overall_confidence >= 0.6
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
              >
                {(recommendation.overall_confidence * 100).toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription>Overall Confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-2">For response:</p>
            <p className="mb-4 bg-gray-100 p-2 rounded">
              {recommendation.for_response}
            </p>
            <p className="font-semibold mb-2">Suggestion:</p>
            <p className="bg-blue-50 p-2 rounded">
              {recommendation.suggestion}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
