"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "react-big-calendar/lib/css/react-big-calendar.css";

const Views = {
  YEAR: "year",
  MONTH: "month",
  WEEK: "week",
  WORK_WEEK: "work_week",
  DAY: "day",
  AGENDA: "agenda",
};

const localizer = momentLocalizer(moment);

// Event data (unchanged)
const events = [
  {
    id: 1,
    title: "International Conference ",
    start: new Date(2024, 7, 1),
    end: new Date(2024, 7, 2),
    type: "conference",
  },
  {
    id: 2,
    title: "International Internet of Things Exhibition (IOTE)",
    start: new Date(2024, 7, 3),
    end: new Date(2024, 7, 4),
    type: "exhibition",
  },
  {
    id: 3,
    title: "China International...",
    start: new Date(2024, 7, 5),
    end: new Date(2024, 7, 5),
    type: "conference",
  },
  {
    id: 4,
    title: "India Cloud Summit",
    start: new Date(2024, 7, 2),
    end: new Date(2024, 7, 4),
    type: "conference",
  },
  {
    id: 5,
    title: "ISC Expo",
    start: new Date(2024, 7, 1),
    end: new Date(2024, 7, 2),
    type: "exhibition",
  },
  {
    id: 6,
    title: "HealthCare Innovation s...",
    start: new Date(2024, 7, 2),
    end: new Date(2024, 7, 2),
    type: "conference",
  },
  {
    id: 7,
    title:
      "International Conference on Artificial Intelligence and Soft Computing (ICAISC)",
    start: new Date(2024, 7, 2),
    end: new Date(2024, 7, 5),
    type: "conference",
  },
  {
    id: 8,
    title: "Microsoft TechCon365",
    start: new Date(2024, 7, 2),
    end: new Date(2024, 7, 2),
    type: "conference",
  },
  {
    id: 9,
    title: "Farmer's Protest",
    start: new Date(2024, 7, 3),
    end: new Date(2024, 7, 4),
    type: "other",
  },
  {
    id: 10,
    title: "Annual Technology, I...",
    start: new Date(2024, 7, 1),
    end: new Date(2024, 7, 1),
    type: "conference",
  },
  {
    id: 11,
    title: "CRE Converge",
    start: new Date(2024, 7, 2),
    end: new Date(2024, 7, 2),
    type: "conference",
  },
  {
    id: 12,
    title: "Computer Vision Summit",
    start: new Date(2024, 7, 1),
    end: new Date(2024, 7, 1),
    type: "conference",
  },
  {
    id: 13,
    title: "TECHSPO Sydney",
    start: new Date(2024, 7, 2),
    end: new Date(2024, 7, 2),
    type: "exhibition",
  },
];

const eventTypeIcons = {
  conference: <Users className="w-4 h-4" />,
  exhibition: <Building2 className="w-4 h-4" />,
  other: <Laptop className="w-4 h-4" />,
};

const eventTypeColors = {
  conference: "#e0e7ff",
  exhibition: "#dbeafe",
  other: "#f3f4f6",
};

const YearView = ({ date, events }) => {
  const months = moment.months();

  const getMonthEvents = (month) => {
    const monthIndex = months.indexOf(month);
    return events.filter((event) => moment(event.start).month() === monthIndex);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {months.map((month, index) => {
        const monthEvents = getMonthEvents(month);
        const totalEvents = monthEvents.length;
        const conferenceEvents = monthEvents.filter(
          (event) => event.type === "conference"
        ).length;
        const exhibitionEvents = monthEvents.filter(
          (event) => event.type === "exhibition"
        ).length;
        const otherEvents = monthEvents.filter(
          (event) => event.type === "other"
        ).length;

        return (
          <div key={month}>
            <h3 className="font-semibold mb-4 flex justify-between">
              {month}
              {totalEvents > 0 && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {totalEvents} Events
                </span>
              )}
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (day) => (
                      <th
                        key={day}
                        className="border font-medium text-[#666666] h-12 w-[calc(100%/7)] text-xs bg-[#FAFAFA]"
                      >
                        {day}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, weekIndex) => (
                  <tr key={weekIndex}>
                    {[...Array(7)].map((_, dayIndex) => {
                      const dayOfMonth =
                        weekIndex * 7 +
                        dayIndex -
                        moment(`${date.getFullYear()}-${index + 1}-01`).day() +
                        1;
                      const isCurrentMonth =
                        dayOfMonth > 0 &&
                        dayOfMonth <=
                          moment(
                            `${date.getFullYear()}-${index + 1}`,
                            "YYYY-MM"
                          ).daysInMonth();
                      return (
                        <td
                          key={dayIndex}
                          className="p-2 h-20 aspect-square border align-top"
                        >
                          <div className="text-end text-base">
                            {isCurrentMonth ? dayOfMonth : ""}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default function Component() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 1));
  const [view, setView] = useState(Views.WEEK);

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const label = () => {
      const date = moment(toolbar.date);
      if (view === Views.YEAR) {
        return date.format("YYYY");
      }
      return view === Views.MONTH
        ? date.format("MMMM YYYY")
        : `${date.startOf("week").format("D MMMM")} - ${date
            .endOf("week")
            .format("D MMMM, YYYY")}`;
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <Select
          value={view}
          onValueChange={(newView) => setView(newView as any)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Views.WEEK}>Weekly</SelectItem>
            <SelectItem value={Views.MONTH}>Monthly</SelectItem>
            <SelectItem value={Views.YEAR}>Yearly</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={goToBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">{label()}</span>
          <Button variant="ghost" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="social">Social Events</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const CustomEvent = ({ event }) => (
    <div
      className="mt-3 flex items-center p-2 gap-2 h-16 rounded-sm text-sm text-[#171717]"
      style={{
        backgroundColor: eventTypeColors[event.type],
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "wrap",
      }}
    >
      {eventTypeIcons[event.type]}
      <span className="ml-1">{event.title}</span>
    </div>
  );

  const CustomDayHeader = ({ date, label }) => (
    <div
      className={`h-16 text-center w-full flex items-center justify-center flex-col  ${
        date.getDate() === 1
          ? "bg-red-50 border border-red-200"
          : "border bg-[#FAFAFA]"
      }`}
    >
      <div
        className={`text-sm font-semibold ${
          date.getDate() === 1 ? "text-red-500" : ""
        }`}
      >
        {moment(date).format("D MMM")}
      </div>
      {date.getDate() === 1 && (
        <div className="text-xs text-red-500">High Impact</div>
      )}
    </div>
  );

  const CustomMonthHeader = ({ date, label }) => (
    <div
      className={`h-16 text-center w-full flex items-center justify-center flex-col border bg-[#FAFAFA]`}
    >
      <div className="text-sm font-semibold">{moment(date).format("ddd")}</div>
    </div>
  );

  const CustomMonthEvent = ({ event }) => (
    <div className="text-xs bg-gray-100 p-1 rounded truncate">
      {event.title}
    </div>
  );

  const CustomDateHeader = ({ date, label }) => {
    const eventsForDay = events.filter((event) =>
      moment(event.start).isSame(date, "day")
    );
    const socialEvents = eventsForDay.filter(
      (event) => event.type === "social"
    ).length;
    const otherEvents = eventsForDay.filter(
      (event) => event.type === "other"
    ).length;
    const totalEvents = socialEvents + otherEvents;

    const isHighImpact = [1, 17, 19, 29].includes(date.getDate());

    return (
      <div className={`p-2 h-36 ${isHighImpact ? "bg-red-50" : ""}`}>
        <div className="text-lg font-semibold text-end mr-2">
          {date.getDate()}
        </div>
        {totalEvents > 0 && (
          <div className="relative w-16 h-16 mx-auto my-2">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#e6e6e6"
                strokeWidth="3"
              ></circle>
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke={eventTypeColors.social}
                strokeWidth="3"
                strokeDasharray={`${(socialEvents / totalEvents) * 100} ${
                  100 - (socialEvents / totalEvents) * 100
                }`}
                strokeDashoffset="25"
              ></circle>
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke={eventTypeColors.other}
                strokeWidth="3"
                strokeDasharray={`${(otherEvents / totalEvents) * 100} ${
                  100 - (otherEvents / totalEvents) * 100
                }`}
                strokeDashoffset={25 - (socialEvents / totalEvents) * 100}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold">{totalEvents}</span>
              <span className="text-xs">Events</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white custom-calendar">
      {view === Views.YEAR ? (
        <div>
          <CustomToolbar
            date={currentDate}
            onNavigate={(action) => {
              const newDate = new Date(currentDate);
              if (action === "PREV")
                newDate.setFullYear(currentDate.getFullYear() - 1);
              if (action === "NEXT")
                newDate.setFullYear(currentDate.getFullYear() + 1);
              setCurrentDate(newDate);
            }}
          />
          <YearView date={currentDate} events={events} />
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          view={view}
          onView={setView as any}
          components={{
            toolbar: CustomToolbar,
            event: view === Views.WEEK ? CustomEvent : CustomMonthEvent,
            week: { header: CustomDayHeader },
            month: {
              header: CustomMonthHeader,
              dateHeader: CustomDateHeader,
            },
          }}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          style={{ height: 850 }}
        />
      )}
    </div>
  );
}
