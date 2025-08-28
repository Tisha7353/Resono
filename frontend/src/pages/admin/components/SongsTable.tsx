import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2, X } from "lucide-react";
import  { useMemo } from 'react';


const SongsTable = () => {
  const { songs, albums, fetchStats, isLoading, error, deleteSong,searchTerm,filters,clearFilters,sortOrder } = useMusicStore();

  // Apply all filters (search + advanced filters)
  const filteredSongs = useMemo(() => {
    let filtered = songs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((song) =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply album filter
    if (filters.albums.length > 0) {
      filtered = filtered.filter(song => 
        song.albumId && filters.albums.includes(song.albumId)
      );
    }

    // Apply artist filter
    if (filters.artists.length > 0) {
      filtered = filtered.filter(song => 
        filters.artists.includes(song.artist)
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(song => 
        new Date(song.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(song => 
        new Date(song.createdAt) <= new Date(filters.dateTo + 'T23:59:59')
      );
    }

    // Apply sorting
    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [songs, searchTerm, filters, sortOrder]);

  const hasActiveFilters = filters.albums.length > 0 || filters.artists.length > 0 || 
                          filters.dateFrom || filters.dateTo;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-zinc-400'>Loading songs...</div>
      </div>
    );
  }

  const getAlbumName = (albumId: string | null) => {
    if (!albumId) return "-";
    const album = albums.find((a) => a._id === albumId);
    return album ? album.title : "Unknown Album";
  };

  const deleteSongClick = async (songId: string) => {
    deleteSong(songId);
    await fetchStats();
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-red-400'>{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Status Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700">
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-300">
              Showing {filteredSongs.length} of {songs.length} songs
            </span>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              {filters.albums.length > 0 && (
                <span className="px-2 py-1 bg-purple-600 text-white rounded">
                  {filters.albums.length} Album{filters.albums.length !== 1 ? 's' : ''}
                </span>
              )}
              {filters.artists.length > 0 && (
                <span className="px-2 py-1 bg-blue-600 text-white rounded">
                  {filters.artists.length} Artist{filters.artists.length !== 1 ? 's' : ''}
                </span>
              )}
          
            </div>
          </div>
          
          {clearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className='hover:bg-zinc-800/50'>
            <TableHead className='w-[50px]'></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredSongs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center py-6 text-zinc-400'>
                {hasActiveFilters || searchTerm ? 'No songs match your filters.' : 'No songs found.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredSongs.map((song) => (
              <TableRow key={song._id} className='hover:bg-zinc-800/50'>
                <TableCell>
                  <img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
                </TableCell>
                <TableCell className='font-medium'>{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{getAlbumName(song.albumId)}</TableCell>
                <TableCell>
                  <span className='inline-flex items-center gap-1 text-zinc-400'>
                    <Calendar className='h-4 w-4' />
                    {song.createdAt.split("T")[0]}
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex gap-2 justify-end'>
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                      onClick={() => deleteSongClick(song._id)}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SongsTable;