"use client";

import React from "react";
import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CircularProgressProps {
  value: number;
  label: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  label,
}) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="text-center">
      <div className="relative inline-flex">
        <svg className="w-[52px] h-[52px]" aria-hidden="true">
          <circle
            className="text-gray-200"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="26"
            cy="26"
          />
          <circle
            className="text-purple-600"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (value / 100) * circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="26"
            cy="26"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
          aria-hidden="true"
        >
          {value}
        </span>
      </div>
      <p className="text-xs border-[#EBEBEB] border bg-white rounded p-1">
        {label}
      </p>
    </div>
  );
};

export default function EventAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="bg-white rounded-lg border border-[#EBEBEB] shadow-sm relative"
      >
        <div className="absolute w-[6px] h-full bg-purple-700 left-0 top-0 rounded-lg"></div>
        <div className="p-6">
          <div className="grid grid-cols-10 gap-4">
            {/* First column - Event details and tags */}
            <div className="col-span-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  China International New Energy Industry Expo 2024
                </h2>
                <p className="text-sm">
                  24/1, Vittal Mallya Rd, KG Halli, Shanthala Nagar, Ashok
                  Nagar, Bengaluru, Karnataka 560001, India
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Fri, 09 Aug 2024 - Sun, 11 Aug 2024 (3 days)
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-pink-100 text-pink-800 hover:bg-pink-100"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  COMMUNITY
                </Badge>
                {[
                  "Management & Consulting",
                  "Consumer goods",
                  "Science & Technology",
                ].map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-gray-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Second column - More Details trigger */}
            <div className="col-span-2 flex items-end justify-center ">
              <AccordionTrigger className="text-pink-600 hover:text-pink-700 mt-auto">
                <span className="text-sm font-medium mr-2">More Details</span>
              </AccordionTrigger>
            </div>

            {/* Third column - Event statistics and progress indicators */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Predicted Event Spend
                  </p>
                  <p className="text-lg font-semibold text-purple-700">
                    2,000,000
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Event Attendance
                  </p>
                  <p className="text-lg font-semibold text-purple-700">
                    230,410
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border border-[#EBEBEB] bg-[#FAFAFA] p-2 rounded">
                <CircularProgress value={80} label="EIS" />
                <CircularProgress value={72} label="Inbound" />
                <CircularProgress value={72} label="International" />
              </div>
            </div>
          </div>
        </div>
        <AccordionContent>
          <div className="px-6 pt-4 space-y-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Date & Time
                </h3>
                <div className="flex items-center gap-8">
                  <span>
                    <p className="text-sm text-gray-600">Fri, 09 Aug 2024</p>
                    <p className="text-sm text-gray-600">10:00 am</p>
                  </span>
                  <span>
                    <p className="text-sm text-gray-600">Sun, 11 Aug 2024</p>
                    <p className="text-sm text-gray-600">04:00 pm</p>
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Venue
                </h3>
                <p className="text-sm text-gray-600">The Ritz Carlton</p>
                <p className="text-sm text-gray-600">
                  24/1, Vittal Mallya Rd, KG Halli, Shanthala Nagar, Ashok
                  Nagar, Bengaluru, Karnataka 560001, India
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Duration
                </h3>
                <p className="text-sm text-gray-600">3 days</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  About
                </h3>
                <p className="text-sm text-gray-600">Sample description here</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Timezone
              </h3>
              <p className="text-sm text-gray-600">
                GMT +5:30, Indian Standard Time (IST)
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
