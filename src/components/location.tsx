"use client";

import { useState } from "react";
import { Search, Loader2, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useSWR from "swr";

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useGooglePlacesAutocomplete = (input: string) => {
  const { data, error } = useSWR(
    input
      ? `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=AIzaSyB2l3cMq_y6soADmXiDH8JfNBd4xIzh3Ro`
      : null,
    fetcher
  );

  return {
    predictions: data?.predictions ?? [],
    isLoading: !error && !data,
    isError: error,
  };
};

const useSavedLocationAutocomplete = (input: string) => {
  const { data, error } = useSWR(
    input
      ? `https://api.eventeli.com/me/v1/saved-locations?query=${encodeURIComponent(
          input
        )}`
      : null,
    fetcher
  );

  return {
    predictions: data?.savedLocations ?? [],
    isLoading: !error && !data,
    isError: error,
  };
};

const useDatabaseLocationcomplete = (input: string) => {
  const { data, error } = useSWR(
    input
      ? `https://api.eventeli.com/locations?query=${encodeURIComponent(
          input
        )}`
      : null,
    fetcher
  );

  return {
    predictions: data?.formattedLocations ?? [],
    isLoading: !error && !data,
    isError: error,
  };
};

const getPlaceDetails = async (placeId: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyB2l3cMq_y6soADmXiDH8JfNBd4xIzh3Ro`
  );
  const data = await response.json();
  const location = data.result.geometry.location;
  return location; // { lat: number, lng: number }
};

interface AutocompleteInputProps {
  type: "SavedLocations" | "LocationId" | "GeoCoordinate";
  placeholder: string;
  onSelect: (location: any) => void;
}

const AutocompleteInput = ({
  type,
  placeholder,
  onSelect,
}: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { predictions, isLoading, isError } =
    useGooglePlacesAutocomplete(value);

  const handleSelect = async (description: string, placeId: string) => {
    setValue(description);
    setOpen(false);

    const location = await getPlaceDetails(placeId);
    onSelect({
      lat: location.lat,
      lng: location.lng,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value ? value : placeholder}</span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Searching...</span>
              </div>
            ) : isError ? (
              "Error fetching locations."
            ) : (
              "No locations found."
            )}
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {predictions?.map((prediction: any) => {
                const description =
                  type == "GeoCoordinate"
                    ? prediction.description
                    : type == "SavedLocations" ? prediction.locationName : prediction.displayName;
                const placeId =
                  type == "GeoCoordinate" ? prediction.place_id : prediction.id;
                return (
                  <CommandItem
                    key={prediction.place_id}
                    onSelect={() =>
                      handleSelect(description, placeId)
                    }
                  >
                    {description}
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function LocationSelector({
  open,
  onOpenChange,
}: LocationSelectorProps) {
  const [activeTab, setActiveTab] = useState("saved");
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [showLocationSelector, setShowLocationSelector] = useState(true);

  const handleAddLocation = (location: string) => {
    console.log(location);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <Button
          className="bg-primary"
          variant="default"
          onClick={() => setShowLocationSelector(!showLocationSelector)}
        >
          Location Selector
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-lg border rounded-md shadow-sm p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-medium">Location</span>
          <Button
            variant="link"
            className="text-primary"
            onClick={() => onOpenChange(false)}
          >
            Apply
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved">Saved Locations</TabsTrigger>
            <TabsTrigger value="city">City, State, Country</TabsTrigger>
            <TabsTrigger value="center">Center Point & Radius</TabsTrigger>
          </TabsList>
          <TabsContent value="saved" className="p-4 space-y-4">
            <AutocompleteInput
              type="SavedLocations"
              placeholder="Search Locations"
              onSelect={handleAddLocation}
            />
            <Button className="text-primary" variant="link">
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Add Location</span>
            </Button>
            {savedLocations.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Saved Locations:</h3>
                <ul className="space-y-2">
                  {/* {savedLocations.map((location, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-muted p-2 rounded"
                    >
                      <span>{location}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLocation(location)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove {location}</span>
                      </Button>
                    </li>
                  ))} */}
                </ul>
              </div>
            )}
          </TabsContent>
          <TabsContent value="city" className="p-4">
            <AutocompleteInput
              type="LocationId"
              placeholder="E.g. Bangalore, Karnataka"
              onSelect={() => {}}
            />
          </TabsContent>
          <TabsContent value="center" className="p-4 space-y-4">
            <AutocompleteInput
              type="GeoCoordinate"
              placeholder="E.g. Novotel, Hyderabad"
              onSelect={() => {}}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="radius" className="text-sm font-medium">
                  Radius
                </label>
                <Input id="radius" type="number" className="mt-1" />
              </div>
              <div>
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </label>
                <Select defaultValue="km">
                  <SelectTrigger id="unit" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Km</SelectItem>
                    <SelectItem value="mi">Mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="text-sm font-medium">
                  Latitude
                </label>
                <Input id="latitude" type="number" className="mt-1" />
              </div>
              <div>
                <label htmlFor="longitude" className="text-sm font-medium">
                  Longitude
                </label>
                <Input id="longitude" type="number" className="mt-1" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
