"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  Search,
} from "lucide-react";
import { Pagination } from "./pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type Interaction } from "./dashboard";

interface UnifiedViewProps {
  data: {
    _id: string
    callId: string | number
    confidence_scores: {
      client_question: string
      bot_response: string
      confidence_score: number
    }[]
    overall_confidence: number
    low_confidence_instances: {
      bot_response: string
      confidence_score: number
      reason: string
    }[]
    recommendations: {
      for_response: string
      suggestion: string
    }[]
  }[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  currentPage: number
  onPageChange: (page: number) => void
}

export function UnifiedView({ data, pagination, currentPage, onPageChange }: UnifiedViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter data based on search term and confidence filter
  const filteredData = data.filter((interaction) => {
    const matchesSearch =
      interaction.confidence_scores.some(
        (score) =>
          score.client_question
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          score.bot_response.toLowerCase().includes(searchTerm.toLowerCase())
      ) || interaction.callId.toString().includes(searchTerm);

    const confidenceScore = interaction.overall_confidence;
    const matchesConfidence =
      confidenceFilter === "all" ||
      (confidenceFilter === "high" && confidenceScore >= 0.8) ||
      (confidenceFilter === "medium" &&
        confidenceScore >= 0.6 &&
        confidenceScore < 0.8) ||
      (confidenceFilter === "low" && confidenceScore < 0.6);

    return matchesSearch && matchesConfidence;
  });

  const renderConfidenceSticks = (score: number) => {
    const filledSticks = Math.round(score * 10);
    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className={`w-1 h-4 rounded-sm transition-colors ${
              index < filledSticks
                ? score >= 0.8
                  ? "bg-green-500"
                  : score >= 0.6
                  ? "bg-yellow-500"
                  : "bg-red-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Call ID, question, or response..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by confidence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Confidence</SelectItem>
            <SelectItem value="high">High (≥80%)</SelectItem>
            <SelectItem value="medium">Medium (60-79%)</SelectItem>
            <SelectItem value="low">Low (≤59%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px] md:h-[800px]">
        <div className="space-y-2">
          {filteredData.map((interaction) => (
            <Collapsible
              key={interaction._id}
              open={openItems.includes(interaction._id)}
              onOpenChange={() => toggleItem(interaction._id)}
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        Call ID: {interaction.callId}
                      </span>

                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-3 w-3" />
                          {interaction.confidence_scores.length}
                        </Badge>
                        {/* {interaction.low_confidence_instances.length > 0 && (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {interaction.low_confidence_instances.length}
                          </Badge>
                        )} */}
                        {interaction.recommendations.length > 0 && (
                          <Badge
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            <Lightbulb className="h-3 w-3" />
                            {interaction.recommendations.length}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {renderConfidenceSticks(interaction.overall_confidence)}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openItems.includes(interaction._id)
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="p-4 border-t bg-gray-50">
                    {/* Conversation Timeline */}
                    <div className="space-y-4">
                      {interaction.confidence_scores.map((score, idx) => (
                        <div key={idx} className="relative pl-6">
                          {/* Timeline connector */}
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                          <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-gray-400" />

                          <div className="space-y-2">
                            {/* User Message */}
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                User Question
                              </p>
                              <p>{score.client_question}</p>
                            </div>

                            {/* Bot Response */}
                            <div className="ml-12 p-3 bg-blue-50 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-blue-600 mb-1">
                                    Assistant Response
                                  </p>
                                  <p>{score.bot_response}</p>
                                </div>
                                <div className="ml-4">
                                  {renderConfidenceSticks(
                                    score.confidence_score
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Issues and Recommendations */}
                    {(interaction.low_confidence_instances.length > 0 ||
                      interaction.recommendations.length > 0) && (
                      <div className="mt-6 border-t pt-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex gap-4">
                            {/* Low Confidence Issues */}
                            {interaction.low_confidence_instances.length >
                              0 && (
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="bg-red-100 p-2 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  </div>
                                  <h3 className="font-medium text-gray-900">
                                    Potential Issues
                                  </h3>
                                  <Badge variant="destructive">
                                    {
                                      interaction.low_confidence_instances
                                        .length
                                    }
                                  </Badge>
                                </div>
                                <div className="space-y-3">
                                  {interaction.low_confidence_instances.map(
                                    (instance, idx) => (
                                      <div
                                        key={idx}
                                        className="relative group rounded-lg border border-red-100 transition-all hover:shadow-md"
                                      >
                                        <div className="p-3 space-y-2">
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                              <p className="text-sm font-medium text-gray-900">
                                                {instance.bot_response}
                                              </p>
                                            </div>
                                            {renderConfidenceSticks(
                                              instance.confidence_score
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-red-600">
                                            <AlertTriangle className="h-4 w-4" />
                                            <p>{instance.reason}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Vertical Divider */}
                            {interaction.low_confidence_instances.length > 0 &&
                              interaction.recommendations.length > 0 && (
                                <div className="w-px bg-gray-200" />
                              )}

                            {/* Recommendations */}
                            {interaction.recommendations.length > 0 && (
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="bg-blue-100 p-2 rounded-lg">
                                    <Lightbulb className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <h3 className="font-medium text-gray-900">
                                    Improvement Tips
                                  </h3>
                                  <Badge variant="default">
                                    {interaction.recommendations.length}
                                  </Badge>
                                </div>
                                <div className="space-y-3">
                                  {interaction.recommendations.map(
                                    (rec, idx) => (
                                      <div
                                        key={idx}
                                        className="relative group rounded-lg border border-blue-100 transition-all hover:shadow-md"
                                      >
                                        <div className="p-3 space-y-2">
                                          <p className="text-sm font-medium text-gray-900">
                                            {rec.for_response}
                                          </p>
                                          <div className="flex items-center gap-2 text-xs text-blue-600">
                                            <Lightbulb className="h-4 w-4" />
                                            <p>{rec.suggestion}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>

      <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
