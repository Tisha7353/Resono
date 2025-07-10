import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else {
			// start playing the album from the beginning
			playAlbum(currentAlbum?.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;

		playAlbum(currentAlbum?.songs, index);
	};

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex  p-6 gap-6 pb-4 md:pb-8'>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className='w-[140px] h-[140px] md:w-[240px] md:h-[240px] shadow-xl rounded'
							/>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='text-4xl md:text-7xl font-bold my-2  md:my-4'>{currentAlbum?.title}</h1>
								<div className='flex items-center gap-1 md:gap-2 flex-wrap text-xs md:text-sm text-zinc-100'>
									<span className='font-normal md:font-medium  text-white'>{currentAlbum?.artist}</span>
									<span>• {currentAlbum?.songs.length} songs</span>
									<span>• {currentAlbum?.releaseYear}</span>
								</div>
							</div>
						</div>

						{/* play button */}
						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className='h-10 w-10 md:w-14 md:h-14 rounded-full bg-[#d63754] hover:bg-bg-[#d63754]-400 
                hover:scale-105 transition-all'
							>
								{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className=' h-7 w-7 text-black' />
								) : (
									<Play className='h-7 w-7 text-black' />
								)}
							</Button>
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
						  {/*  Mobile Header (Title + Duration only) */}
  <div className='flex justify-between text-sm text-zinc-400 px-8 py-2 md:hidden border-b border-white/5'>
     <div className='font-medium'>#</div>
    <div className='font-medium'>Title</div>
    <div className='font-medium'>Duration</div>
  </div>
							{/* table header */}
							<div
								className='hidden md:grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5'
							>
								<div>#</div>
								<div>Title</div>
								<div className="hidden md:block">Released Date</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
							</div>
                  
							{/* songs list */}

							<div className='px-4 sm:px-6'>
								<div className='space-y-2 py-4'>
									{currentAlbum?.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
					     className={`
              group cursor-pointer rounded-md px-4 py-2 text-sm text-zinc-400 hover:bg-white/5
              flex justify-between  items-center md:grid md:grid-cols-[16px_4fr_2fr_1fr] gap-4
            `}				>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-bg-[#d63754]-500'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{!isCurrentSong && (
														<Play className='h-4 w-4 hidden group-hover:block' />
													)}
												</div>

												<div className='w-[60%] flex items-start  gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10' />

													<div>
														<div className={`font-medium text-white`}>{song.title}</div>
														<div>{song.artist}</div>
													</div>
												</div>
												<div className='md:flex items-center hidden '>{song.createdAt.split("T")[0]}</div>
												<div  className='flex    justify-start  text-left'>{formatDuration(song.duration)}</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
export default AlbumPage;