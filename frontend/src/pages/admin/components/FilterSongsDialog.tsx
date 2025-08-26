import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useMusicStore } from '@/stores/useMusicStore';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react'

// Custom Multi-Select Component designed for modal contexts
const MultiSelect = ({ 
  options, 
  selected, 
  onChange, 
  placeholder, 
  searchable = true,
  
}: {
  options: any[]
  selected: any[]
  onChange: (selected: any[]) => void
  placeholder?: string
  searchable?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter((option:any) => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const handleToggleOption = (value:any) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item:any) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemoveSelected = (value:any, e:any) => {
    e.stopPropagation();
    const newSelected = selected.filter((item:any) => item !== value);
    onChange(newSelected);
  };

  const getSelectedLabels = () => {
    return selected.map((value:any )=> 
      options.find((opt:any) => opt.value === value)?.label || value
    );
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <div
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-600 rounded-md cursor-pointer hover:bg-zinc-700 focus:border-zinc-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-zinc-400">{placeholder}</span>
          ) : selected.length <= 2 ? (
            getSelectedLabels().map((label:any) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded"
              >
                {label}
                <X 
                  className="w-3 h-3 cursor-pointer hover:bg-purple-700 rounded"
                  onClick={(e) => handleRemoveSelected(
                    selected.find((val:any) => options.find((opt:any) => opt.value === val)?.label === label),
                    e
                  )}
                />
              </span>
            ))
          ) : (
            <span className="text-white">{selected.length} items selected</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
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
                className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400"
                autoFocus
              />
            </div>
          )}
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-zinc-400 text-center">
                {searchTerm ? 'No results found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option:any) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-zinc-700 cursor-pointer transition-colors"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <Checkbox
                    checked={selected.includes(option.value)}
                    className="pointer-events-none"
                  />
                  <span className="flex-1">{option.label}</span>
                </div>
              ))
            )}
          </div>

          {/* Select All / Clear All Actions */}
          {filteredOptions.length > 0 && (
            <div className="flex justify-between p-2 border-t border-zinc-600">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-400 hover:text-purple-300"
                onClick={() => {
                  const allValues = filteredOptions.map((opt:any) => opt.value);
                  const hasAll = allValues.every((val:any) => selected.includes(val));
                  if (hasAll) {
                    onChange(selected.filter((val:any) => !allValues.includes(val)));
                  } else {
                    onChange([...new Set([...selected, ...allValues])]);
                  }
                }}
              >
                {filteredOptions.every((opt:any) => selected.includes(opt.value)) ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-400 hover:text-zinc-300"
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

interface FilterSongsDialogProps {
  onFiltersApply: (filters: {
    albums: string[];
    artists: string[];
    dateFrom: string;
    dateTo: string;
  }) => void;
  activeFilters: {
    albums: string[];
    artists: string[];
    dateFrom: string;
    dateTo: string;
  };
  onClearFilters?: () => void;
}

const FilterSongsDialog: React.FC<FilterSongsDialogProps> = ({ 
  onFiltersApply, 
  activeFilters, 
  
}) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const { albums, songs } = useMusicStore();

  // Local state for the filter dialog
  const [albumFilter, setAlbumFilter] = useState<string[]>(activeFilters.albums);
  const [artistFilter, setArtistFilter] = useState<string[]>(activeFilters.artists);
  const [dateFrom, setDateFrom] = useState(activeFilters.dateFrom);
  const [dateTo, setDateTo] = useState(activeFilters.dateTo);

  // Update local state when activeFilters prop changes
  useEffect(() => {
    setAlbumFilter(activeFilters.albums);
    setArtistFilter(activeFilters.artists);
    setDateFrom(activeFilters.dateFrom);
    setDateTo(activeFilters.dateTo);
  }, [activeFilters]);

  const uniqueArtists = [...new Set(songs.map((s) => s.artist))];

  // Prepare options for multi-select components
  const albumOptions = albums.map(album => ({
    value: album._id,
    label: album.title
  }));

  const artistOptions = uniqueArtists.map(artist => ({
    value: artist,
    label: artist
  }));

  const resetFilters = () => {
    setAlbumFilter([]);
    setArtistFilter([]);
    setDateFrom("");
    setDateTo("");
  };

  const applyFilters = () => {
    const newFilters = {
      albums: albumFilter,
      artists: artistFilter,
      dateFrom,
      dateTo
    };
    
    onFiltersApply(newFilters);
    setFilterDialogOpen(false);
  };

  const hasActiveFilters = albumFilter.length > 0 || artistFilter.length > 0 || dateFrom || dateTo;
  const hasGlobalActiveFilters = activeFilters.albums.length > 0 || activeFilters.artists.length > 0 || 
                                 activeFilters.dateFrom || activeFilters.dateTo;

  return (
    <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`text-zinc-200 border border-zinc-600 rounded-md hover:text-white transition-colors ${
            hasGlobalActiveFilters ? 'bg-purple-600 hover:bg-purple-700 border-purple-500' : 'border-gray-200'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
          {hasGlobalActiveFilters && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-white text-purple-600 rounded-full">
              {activeFilters.albums.length + activeFilters.artists.length + 
               (activeFilters.dateFrom ? 1 : 0) + (activeFilters.dateTo ? 1 : 0)}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Songs</DialogTitle>
          <DialogDescription>Apply filters to refine your music library</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Album Filter */}
          <div className="space-y-2">
            <h3 className="text-sm text-zinc-300 font-medium">Albums</h3>
            <MultiSelect
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
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
              </div>
              <span className="text-zinc-400 text-sm">to</span>
              <div className="flex-1">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-zinc-800 border-zinc-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="space-y-2 p-3 bg-zinc-800 rounded-lg">
              <h4 className="text-sm font-medium text-zinc-300">Current Selection:</h4>
              <div className="text-xs text-zinc-400 space-y-1">
                {albumFilter.length > 0 && (
                  <div>Albums: {albumFilter.length} selected</div>
                )}
                {artistFilter.length > 0 && (
                  <div>Artists: {artistFilter.length} selected</div>
                )}
                {(dateFrom || dateTo) && (
                  <div>
                    Date: {dateFrom || 'Any'} to {dateTo || 'Any'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-2 pt-4 border-t border-zinc-700">
            <Button 
              variant="outline" 
              onClick={resetFilters} 
              className="flex-1"
            >
              Reset All
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 flex-1"
              onClick={applyFilters}
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