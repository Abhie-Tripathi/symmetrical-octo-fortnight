import React, { useState, useRef, useEffect } from "react";

const InteractiveAttendanceChart = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [thresholdPosition, setThresholdPosition] = useState(370);
  const [thresholdValue, setThresholdValue] = useState(0);
  const thresholdHandleRef = useRef(null);
  const chartContainerRef = useRef(null);

  // Chart data points
  const dataPoints = [
    { date: "9 Dec", value: 83 },
    { date: "14 Dec", value: 329 },
    { date: "19 Dec", value: 56 },
    { date: "24 Dec", value: 273 },
    { date: "29 Dec", value: 282 },
    { date: "3 Jan", value: 196 },
    { date: "8 Jan", value: 295 },
  ];

  // Calculate threshold value based on position
  const calculateThresholdValue = (position) => {
    const maxValue = 60000;
    const chartHeight = 340;
    return Math.round(maxValue * (1 - (position - 30) / chartHeight));
  };

  // Threshold dragging logic
  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!chartContainerRef.current) return;

    const rect = chartContainerRef.current.getBoundingClientRect();
    const newPosition = e.clientY - rect.top;

    // Constrain within chart area
    const constrainedPosition = Math.max(30, Math.min(newPosition, 370));
    setThresholdPosition(constrainedPosition);
    setThresholdValue(calculateThresholdValue(constrainedPosition));
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Cleanup event listeners
  useEffect(() => {
    setThresholdValue(calculateThresholdValue(thresholdPosition));
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-[743px] mx-auto"
      ref={chartContainerRef}
    >
      <svg className="line-chart" height="400" width="743">
        <g transform="translate(60,30)">
          {/* Y-Axis Label */}
          <text
            x="-170"
            y="-45"
            className="y-axis-label"
            textAnchor="middle"
            transform="rotate(270)"
          >
            Daily Total Attendance
          </text>

          {/* Chart Area Background */}
          <rect
            width="623"
            height="340"
            className="chart-area"
            fill="#f9f9f9"
          />

          {/* Y-Axis */}
          <g
            className="axis y-chart"
            transform="translate(623, 0)"
            fill="none"
            fontSize="10"
            fontFamily="sans-serif"
            textAnchor="end"
          >
            {/* Y-Axis ticks (same as original SVG) */}
            <path
              className="domain"
              stroke="currentColor"
              d="M-623,340H0V0H-623"
            ></path>
            {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(
              (value, index) => (
                <g
                  key={value}
                  className="tick"
                  opacity="1"
                  transform={`translate(0,${340 - index * 50})`}
                >
                  <line stroke="currentColor" x2="-623"></line>
                  <text fill="currentColor" x="-633" dy="0.32em">
                    {value === 0 ? "0" : `${value / 1000}k`}
                  </text>
                </g>
              )
            )}
          </g>

          {/* X-Axis */}
          <g
            className="axis x-chart"
            transform="translate(0, 340)"
            fill="none"
            fontSize="10"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            <path
              className="domain"
              stroke="currentColor"
              d="M0,6V0H623V6"
            ></path>
            {[
              "9 Dec",
              "14 Dec",
              "19 Dec",
              "24 Dec",
              "29 Dec",
              "3 Jan",
              "8 Jan",
            ].map((date, index) => (
              <g
                key={date}
                className="tick"
                opacity="1"
                transform={`translate(${index * 103.83},0)`}
              >
                <line stroke="currentColor" y2="6"></line>
                <text fill="currentColor" y="16" dy="0.71em">
                  {date}
                </text>
              </g>
            ))}
          </g>

          {/* Dynamic Gradient Definition */}
          <defs>
            <linearGradient
              id="__area-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="340"
            >
              <stop offset="0" stopColor="#f23580"></stop>
              <stop
                offset={`${(thresholdPosition - 30) / 340}`}
                stopColor="#f23580"
              ></stop>
              <stop
                offset={`${(thresholdPosition - 30) / 340}`}
                stopColor="#39c1a2"
              ></stop>
              <stop offset="1" stopColor="#39c1a2"></stop>
            </linearGradient>
          </defs>

          {/* Line Path and Area Fill - keep original path data */}
          <path
            d="M0,83.275L20.767,329.652L41.533,56.667L62.3,273.084L83.067,282.456L103.833,196.909L124.6,295.736L145.367,331.682L166.133,327.272L186.9,303.157L207.667,285.152L228.433,273.823L249.2,265.88L269.967,320.438L290.733,339.443L311.5,340L332.267,340L353.033,339.492L373.8,339.507L394.567,337.344L415.333,337.383L436.1,338.906L456.867,340L477.633,340L498.4,340L519.167,339.581L539.933,340L560.7,340L581.467,337.536L602.233,307.971L623,307.971"
            fill="none"
            stroke="url(#__area-gradient)"
            strokeWidth="2"
          ></path>
          <path
            d="M0,83.275L20.767,329.652L41.533,56.667L62.3,273.084L83.067,282.456L103.833,196.909L124.6,295.736L145.367,331.682L166.133,327.272L186.9,303.157L207.667,285.152L228.433,273.823L249.2,265.88L269.967,320.438L290.733,339.443L311.5,340L332.267,340L353.033,339.492L373.8,339.507L394.567,337.344L415.333,337.383L436.1,338.906L456.867,340L477.633,340L498.4,340L519.167,339.581L539.933,340L560.7,340L581.467,337.536L602.233,307.971L623,307.971L623,340L602.233,340L581.467,340L560.7,340L539.933,340L519.167,340L498.4,340L477.633,340L456.867,340L436.1,340L415.333,340L394.567,340L373.8,340L353.033,340L332.267,340L311.5,340L290.733,340L269.967,340L249.2,340L228.433,340L207.667,340L186.9,340L166.133,340L145.367,340L124.6,340L103.833,340L83.067,340L62.3,340L41.533,340L20.767,340L0,340Z"
            fill="url(#__area-gradient)"
            opacity="0.1"
          ></path>

          {/* Threshold Label */}
          <text
            x="628"
            y={thresholdPosition - 25}
            fill="#f23380"
            fontSize="12"
            textAnchor="start"
          >
            {thresholdValue.toLocaleString()}
          </text>

          {/* Average Line */}
          <line
            stroke="#fb952c"
            strokeWidth="1"
            strokeDasharray="2"
            x1="0"
            x2="623"
            y1="300.9780458158018"
            y2="300.9780458158018"
          ></line>
          <text x="628" y="305" fill="#fb952c" fontSize="12" textAnchor="start">
            Average
          </text>
        </g>
      </svg>

      {/* Threshold Handle */}
      <div
        className="absolute left-[60px] w-[623px] cursor-pointer h-[0.5px] bg-pink-500 flex items-center justify-center touch-none will-change-transform"
        style={{ top: `${thresholdPosition}px` }}
        ref={thresholdHandleRef}
      >
        <div className="handle" onMouseDown={handleMouseDown}>
          <div className="rotate-[-180deg]  pointer-events-none w-0 h-0 border-4 border-t-pink-500 border-r-transparent border-l-transparent border-b-transparent"></div>
          <div className="pointer-events-none w-0 h-0 border-4 border-t-pink-500 border-r-transparent border-l-transparent border-b-transparent"></div>
        </div>
      </div>

      {/* Tooltip (currently hidden, can be expanded) */}
      {tooltipVisible && (
        <div className="absolute bg-white border rounded shadow-lg p-2">
          Tooltip Content
        </div>
      )}
    </div>
  );
};

export default InteractiveAttendanceChart;
