"use client"
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"

const eventStatuses = [
  { id: 'active', label: 'Active' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'postponed', label: 'Postponed' },
  { id: 'predicted', label: 'Predicted' },
];

export default function StatusSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleStatusToggle = (statusId: string) => {
    setSelectedStatuses(prev =>
      prev.includes(statusId)
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStatuses(checked ? eventStatuses.map(status => status.id) : []);
  };

  const isAllSelected = selectedStatuses.length === eventStatuses.length;

  const handleApply = () => {
    // onApply(selectedStatuses);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between"
        >
          <span className="flex items-center gap-2">
            Event Status
            {selectedStatuses.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-600 rounded-full">
                {selectedStatuses.length}
              </span>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All
            </label>
          </div>
          {eventStatuses.map((status) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox
                id={status.id}
                checked={selectedStatuses.includes(status.id)}
                onCheckedChange={() => handleStatusToggle(status.id)}
              />
              <label
                htmlFor={status.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {status.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end p-2 border-t">
          <Button onClick={handleApply} className="bg-purple-600 hover:bg-purple-700 text-white">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}