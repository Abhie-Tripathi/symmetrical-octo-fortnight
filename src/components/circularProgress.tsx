"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface NestedCircularProgressProps {
  outerValue: number;
  innerValue: number;
  size?: number;
}

export default function NestedCircularProgress({
  outerValue,
  innerValue,
  size = 200,
}: NestedCircularProgressProps) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <CircularProgressbar
        value={outerValue}
        strokeWidth={8}
        styles={buildStyles({
          strokeLinecap: "round",
          pathColor: "#5055A3",
          trailColor: "#E9E9E9",
        })}
      />
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "14%",
          width: "72%",
          height: "72%",
        }}
      >
        <CircularProgressbar
          value={innerValue}
          strokeWidth={8}
          styles={buildStyles({
            strokeLinecap: "round",
            pathColor: "#9D50A3",
            trailColor: "#E9E9E9",
          })}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="text-sm font-bold text-gray-800">{innerValue}</span>
        <span className="text-[10px] text-gray-600">Events</span>
      </div>
    </div>
  );
}
