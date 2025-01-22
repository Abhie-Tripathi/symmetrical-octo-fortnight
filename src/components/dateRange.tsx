"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isBefore,
  subMonths,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";

const presets = [
  { label: "Custom", value: "custom" },
  { label: "This week", value: "this-week" },
  { label: "This month", value: "this-month" },
  { label: "3 months", value: "3-months" },
  { label: "6 months", value: "6-months" },
  { label: "9 Months", value: "9-months" },
  { label: "12 months", value: "12-months" },
];

const comparisonOptions = [
  "Preceding Period (match day of the week)",
  "Same period last year (match day of the week)",
  "Preceding Period",
  "Same Period Last year",
];

export default function DateRangeSelector() {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());
  const [selectedPreset, setSelectedPreset] = React.useState("this-month");
  const [compareEnabled, setCompareEnabled] = React.useState(false);
  const [selectedComparison, setSelectedComparison] = React.useState(
    comparisonOptions[0]
  );
  const [numberOfMonths, setNumberOfMonths] = React.useState(1);
  const enableCompareOptions = pathName === "/trends";

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const currentDate = new Date();
    let from: Date, to: Date;
    switch (preset) {
      case "this-week":
        from = startOfWeek(currentDate);
        to = endOfWeek(currentDate);
        break;
      case "this-month":
        from = startOfMonth(currentDate);
        to = endOfMonth(currentDate);
        break;
      case "3-months":
        from = startOfMonth(subMonths(currentDate, 2));
        to = endOfMonth(currentDate);
        break;
      case "6-months":
        from = startOfMonth(subMonths(currentDate, 5));
        to = endOfMonth(currentDate);
        break;
      case "9-months":
        from = startOfMonth(subMonths(currentDate, 8));
        to = endOfMonth(currentDate);
        break;
      case "12-months":
        from = startOfMonth(subMonths(currentDate, 11));
        to = endOfMonth(currentDate);
        break;
      default:
        return;
    }
    setDateRange({ from, to });
    setCalendarDate(from);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelectedPreset("custom");
      if (!dateRange.from || (dateRange.from && dateRange.to)) {
        setDateRange({ from: selectedDate, to: undefined });
      } else if (
        dateRange.from &&
        !dateRange.to &&
        isBefore(selectedDate, dateRange.from)
      ) {
        setDateRange({ from: selectedDate, to: dateRange.from });
      } else {
        setDateRange((prev) => ({ ...prev, to: selectedDate }));
      }
    }
  };

  const toggleCalendarSize = () => {
    setNumberOfMonths(numberOfMonths === 1 ? 2 : 1);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[240px] justify-start text-left font-normal")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from && dateRange.to ? (
            `${format(dateRange.from, "MMM d, yyyy")} - ${format(
              dateRange.to,
              "MMM d, yyyy"
            )}`
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Date Range</h2>
            <Button
              variant="link"
              className="text-primary pr-0"
              onClick={() => setIsOpen(false)}
            >
              APPLY
            </Button>
          </div>
          <div className="flex space-x-4 border rounded-md p-4">
            <div className="space-y-2 flex flex-col justify-between min-w-36">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  variant="outline"
                  className={cn(
                    "w-full font-normal",
                    selectedPreset === preset.value &&
                      "bg-purple-100 text-purple-600"
                  )}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="border-l" />
            <div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from) handleDateSelect(range.from);
                  if (range?.to) handleDateSelect(range.to);
                }}
                month={calendarDate}
                numberOfMonths={1}
                onMonthChange={setCalendarDate}
              />
            </div>
          </div>
          {enableCompareOptions && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">Compare with Past data</h3>
                <Switch
                  checked={compareEnabled}
                  onCheckedChange={setCompareEnabled}
                />
              </div>
              {compareEnabled && (
                <div className="space-y-2 flex flex-col">
                  {comparisonOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => setSelectedComparison(option)}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        selectedComparison === option && "bg-[#F2F2F2]"
                      )}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
