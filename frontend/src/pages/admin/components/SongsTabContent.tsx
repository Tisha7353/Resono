import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, SortAsc, SortDesc } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import FilterSongsDialog from "./FilterSongsDialog";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore";

const SongsTabContent = () => {

  const { searchTerm, setSearchTerm, sortOrder, toggleSortOrder } = useMusicStore();

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Music className='size-5 text-[#D63754]' />
              Songs Library
            </CardTitle>
            <CardDescription>Manage your music tracks</CardDescription>
          </div>

          {/* Controls: Filter, Sort, Search, Add */}
          <div className='flex flex-row gap-2 md:items-center w-full md:w-auto'>
            {/* Filter Dialog */}
            <FilterSongsDialog

            />

            {/* Sort Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSortOrder}
              className="text-zinc-200 border-gray-200 rounded-md border-[0.5px] hover:text-white"
              title={`Sort ${sortOrder === "asc" ? "Newest First" : "Oldest First"}`}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4 text-zinc-400 hover:text-white" />
              ) : (
                <SortDesc className="w-4 h-4 text-zinc-400 hover:text-white" />
              )}
            </Button>

            {/* Search Input */}
            <Input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search songs...'
              className='border border-gray-200 text-gray-200 w-full md:max-w-xs'
            />

            {/* Add Song Dialog */}
            <AddSongDialog />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <SongsTable

        />
      </CardContent>
    </Card>
  );
};

export default SongsTabContent;