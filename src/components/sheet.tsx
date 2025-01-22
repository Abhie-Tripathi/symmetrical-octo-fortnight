import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  type: 'COMMUNITY' | 'CONFERENCE'
  title: string
  location: string
  date: string
}

interface EventSheetProps {
  date: string
  eventsFound: number
  events: Event[]
}

export default function EventSheet({ date, eventsFound, events }: EventSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Event Sheet</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 bg-white">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-xl font-semibold text-purple-700">{date}</SheetTitle>
          </SheetHeader>

          <div className="p-4 bg-red-100 border-l-4 border-red-500 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2" />
              <p className="text-sm">
                Possibility of <span className="font-bold text-red-500">HEAVY RAINFALL</span> on this day
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-600 text-white text-lg font-semibold px-3 py-1 rounded">
                {eventsFound}
              </div>
              <span className="text-gray-700 font-semibold">Events Found</span>
            </div>
            <div className="flex space-x-2">
              <div className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded">
                230
              </div>
              <div className="bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded">
                36
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-auto px-4">
            {events.map((event, index) => (
              <div key={index} className={cn(
                "mb-4 p-4 rounded-lg",
                event.type === 'COMMUNITY' ? "bg-purple-100" : "bg-indigo-100"
              )}>
                <div className={cn(
                  "text-xs font-semibold mb-2",
                  event.type === 'COMMUNITY' ? "text-purple-600" : "text-indigo-600"
                )}>
                  {event.type}
                </div>
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
            ))}
          </div>

          <div className="border-t p-4 flex items-center justify-between">
            <Button variant="ghost" className="text-purple-600 hover:text-purple-800 flex items-center">
              <ChevronLeft className="mr-1" size={20} />
              <span>Prev</span>
            </Button>
            <span className="text-sm text-gray-600">1 - 14 of 432</span>
            <Button variant="ghost" className="text-purple-600 hover:text-purple-800 flex items-center">
              <span>Next</span>
              <ChevronRight className="ml-1" size={20} />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}