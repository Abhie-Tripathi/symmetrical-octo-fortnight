"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UnifiedView } from "./unified-view";
import { OverallStats } from "./overall-stats";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface ConfidenceScore {
  client_question: string;
  bot_response: string;
  confidence_score: number;
  _id: string;
}

interface LowConfidenceInstance {
  bot_response: string;
  confidence_score: number;
  reason: string;
  _id: string;
}

interface Recommendation {
  for_response: string;
  suggestion: string;
  _id: string;
}

export interface Interaction {
  _id: string;
  callId: number;
  overall_confidence: number;
  confidence_scores: ConfidenceScore[];
  low_confidence_instances: LowConfidenceInstance[];
  recommendations: Recommendation[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    results: Interaction[];
    averageOverallConfidence: number;
    pagination: PaginationData;
  };
}

async function fetchData(page: number, limit: number): Promise<ApiResponse> {
  const response = await fetch(
    `https://demo.agentspanel.com/confidence?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function AgentsPanelDashboard() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery<ApiResponse, Error>({
    queryKey: ["confidence-data", page],
    queryFn: () => fetchData(page, limit),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 space-y-4 md:space-y-6">
      <OverallStats data={data.data} />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Interaction Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <UnifiedView
            data={data.data.results}
            pagination={data.data.pagination}
            currentPage={page}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
