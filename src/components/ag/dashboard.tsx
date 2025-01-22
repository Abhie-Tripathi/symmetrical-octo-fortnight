"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UnifiedView } from "./unified-view";
import { OverallStats } from "./overall-stats";
import { Search } from "lucide-react";

import sampleData from "./sample-data.json";

export default function AgentsPanelDashboard() {
  const [data] = useState(sampleData.data);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = data.results.filter(
    (result) =>
      result.confidence_scores.some(
        (score) =>
          score.client_question
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          score.bot_response.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      result.recommendations.some(
        (rec) =>
          rec.suggestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.for_response.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      result.low_confidence_instances.some(
        (instance) =>
          instance.bot_response
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          instance.reason.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <OverallStats data={data} />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Interaction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedView data={filteredResults} />
        </CardContent>
      </Card>
    </div>
  );
}
