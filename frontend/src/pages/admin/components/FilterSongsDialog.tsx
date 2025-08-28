import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useMusicStore } from '@/stores/useMusicStore';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import  { useState, useMemo, useEffect, useRef } from 'react'

// ---------------------------
// MultiSelect Component
// ---------------------------

// Global dropdown open event
const DROPDOWN_EVENT = "multi-select-open";

const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder,
  searchable = true,
  id,
}: {
  options: any[];
  selected: any[];
  onChange: (selected: any[]) => void;
  placeholder?: string;
  searchable?: boolean;
  id: string; // unique id for each dropdown
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter((option: any) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const handleToggleOption = (value: any) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item: any) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemoveSelected = (value: any, e: any) => {
    e.stopPropagation();
    const newSelected = selected.filter((item: any) => item !== value);
    onChange(newSelected);
  };

  const getSelectedLabels = () => {
    return selected.map(
      (value: any) =>
        options.find((opt: any) => opt.value === value)?.label || value
    );
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close when another MultiSelect opens
  useEffect(() => {
    const handleOtherDropdown = (e: CustomEvent) => {
      if (e.detail !== id) {
        setIsOpen(false);
      }
    };
    window.addEventListener(DROPDOWN_EVENT, handleOtherDropdown as EventListener);
    return () => {
      window.removeEventListener(DROPDOWN_EVENT, handleOtherDropdown as EventListener);
    };
  }, [id]);

  const toggleDropdown = () => {
    if (!isOpen) {
      // notify others to close
      window.dispatchEvent(new CustomEvent(DROPDOWN_EVENT, { detail: id }));
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <div
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-600 rounded-md cursor-pointer hover:bg-zinc-700 focus:border-zinc-400 transition-colors"
        onClick={toggleDropdown}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-zinc-400">{placeholder}</span>
          ) : selected.length <= 2 ? (
            getSelectedLabels().map((label: any) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded"
              >
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{label}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:bg-purple-700 rounded flex-shrink-0"
                  onClick={(e) =>
                    handleRemoveSelected(
                      selected.find(
                        (val: any) =>
                          options.find((opt: any) => opt.value === val)?.label ===
                          label
                      ),
                      e
                    )
                  }
                />
              </span>
            ))
          ) : (
            <span className="text-white">{selected.length} items selected</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        )}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-600 rounded-md shadow-lg z-50">
          {searchable && (
            <div className="p-2 border-b border-zinc-600">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 text-sm"
                autoFocus
              />
            </div>
          )}

          <div className="max-h-40 sm:max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-zinc-400 text-center">
                {searchTerm ? "No results found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option: any) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-zinc-700 cursor-pointer transition-colors"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <Checkbox
                    checked={selected.includes(option.value)}
                    className="pointer-events-none flex-shrink-0"
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                </div>
              ))
            )}
          </div>

          {/* Select All / Done */}
          {filteredOptions.length > 0 && (
            <div className="flex justify-between p-2 border-t border-zinc-600 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-400 hover:text-purple-300 flex-1"
                onClick={() => {
                  const allValues = filteredOptions.map((opt: any) => opt.value);
                  const hasAll = allValues.every((val: any) =>
                    selected.includes(val)
                  );
                  if (hasAll) {
                    onChange(selected.filter((val: any) => !allValues.includes(val)));
                  } else {
                    onChange([...new Set([...selected, ...allValues])]);
                  }
                }}
              >
                {filteredOptions.every((opt: any) =>
                  selected.includes(opt.value)
                )
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-400 hover:text-zinc-300 flex-1"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------
// FilterSongsDialog Component
// ---------------------------

const FilterSongsDialog=() => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { albums, songs,filters,applyFilters } = useMusicStore();
  
  const [albumFilter, setAlbumFilter] = useState<string[]>(filters.albums);
  const [artistFilter, setArtistFilter] = useState<string[]>(filters.artists);
  const [dateFrom, setDateFrom] = useState(filters.dateFrom);
  const [dateTo, setDateTo] = useState(filters.dateTo);

  useEffect(() => {
    setAlbumFilter(filters.albums);
    setArtistFilter(filters.artists);
    setDateFrom(filters.dateFrom);
    setDateTo(filters.dateTo);
  }, [filters]);

  const uniqueArtists = [...new Set(songs.map((s) => s.artist))];

  const albumOptions = albums.map((album) => ({
    value: album._id,
    label: album.title,
  }));

  const artistOptions = uniqueArtists.map((artist) => ({
    value: artist,
    label: artist,
  }));

  const resetFilters = () => {
    setAlbumFilter([]);
    setArtistFilter([]);
    setDateFrom("");
    setDateTo("");
  };

  const applyNewFilters = () => {
    const newFilters = {
      albums: albumFilter,
      artists: artistFilter,
      dateFrom,
      dateTo,
    };

    applyFilters(newFilters);
    setFilterDialogOpen(false);
  };

  const hasActiveFilters =
    albumFilter.length > 0 || artistFilter.length > 0 || dateFrom || dateTo;
  const hasGlobalActiveFilters =
    filters.albums.length > 0 ||
    filters.artists.length > 0 ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
      
          className={`text-zinc-200 border-zinc-600 rounded-md hover:text-white border-[0.5px] transition-colors ${
            hasGlobalActiveFilters
              ? "bg-purple-600 hover:bg-purple-700 border-purple-500"
              : "border-gray-200"
          }`}
        >
          <Filter className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Filter</span>
          {hasGlobalActiveFilters && (
            <span className="ml-1 sm:ml-2 px-1.5 py-0.5 text-xs bg-white text-purple-600 rounded-full">
              {filters.albums.length +
                filters.artists.length +
                (filters.dateFrom ? 1 : 0) +
                (filters.dateTo ? 1 : 0)}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[90vh] sm:max-h-[85vh] overflow-auto w-[95vw] sm:w-full max-w-[400px] sm:max-w-md mx-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Filter Songs</DialogTitle>
          <DialogDescription className="text-sm">
            Apply filters to refine your music library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-2">
          {/* Album Filter */}
          <div className="space-y-2">
            <h3 className="text-sm text-zinc-300 font-medium">Albums</h3>
            <MultiSelect
              id="albums"
              options={albumOptions}
              selected={albumFilter}
              onChange={setAlbumFilter}
              placeholder="Select albums..."
              searchable={true}
            />
          </div>

          {/* Artist Filter */}
          <div className="space-y-2">
            <h3 className="text-sm text-zinc-300 font-medium">Artists</h3>
            <MultiSelect
              id="artists"
              options={artistOptions}
              selected={artistFilter}
              onChange={setArtistFilter}
              placeholder="Select artists..."
              searchable={true}
            />
          </div>

          {/* Release Date Filter */}
          <div className="space-y-2">
            <h3 className="text-sm text-zinc-300 font-medium">Release Date</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex-1">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-zinc-800 border-zinc-600 text-white text-sm w-full"
                />
              </div>
              <span className="text-zinc-400 text-sm text-center sm:text-left sm:px-2">to</span>
              <div className="flex-1">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-zinc-800 border-zinc-600 text-white text-sm w-full"
                />
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="space-y-2 p-3 bg-zinc-800 rounded-lg">
              <h4 className="text-sm font-medium text-zinc-300">
                Current Selection:
              </h4>
              <div className="text-xs text-zinc-400 space-y-1">
                {albumFilter.length > 0 && (
                  <div>Albums: {albumFilter.length} selected</div>
                )}
                {artistFilter.length > 0 && (
                  <div>Artists: {artistFilter.length} selected</div>
                )}
                {(dateFrom || dateTo) && (
                  <div className="break-words">
                    Date: {dateFrom || "Any"} to {dateTo || "Any"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t border-zinc-700">
            <Button 
              variant="outline" 
              onClick={resetFilters} 
              className="w-full sm:flex-1 text-sm"
            >
              Reset All
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full sm:flex-1 text-sm"
              onClick={applyNewFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterSongsDialog;