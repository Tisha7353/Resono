import TopBar from "@/components/TopBar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import FeaturedSection from "./components/featuredSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/sectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    fetchSearchSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
    songs, 
  } = useMusicStore();

  const [greeting, setGreeting] = useState("Hello");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    if (!isSearching) {
      fetchFeaturedSongs();
      fetchMadeForYouSongs();
      fetchTrendingSongs();
    }
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, isSearching]);

  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleSearch = async (e:any) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setIsSearching(true);
      await fetchSearchSongs(searchQuery);
    } else {
      setIsSearching(false);
    }
  };

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <TopBar />

     

     <ScrollArea className="h-[calc(100vh-220px)]">
  <div className="p-4 sm:p-6">
    
    <div className="flex items-center justify-center md:justify-between mb-6 gap-4 ">
      <h1 className="hidden md:block text-2xl sm:text-3xl font-bold">{greeting}</h1>

      <form onSubmit={handleSearch} className="relative w-72 sm:w-80 md:w-80 ">
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="What do you want to play?"
  className="w-full pl-4 pr-5 md:pr-10 border-[#B3B3AE] py-2 rounded-full bg-[#313135] text-[#e9e9e4] 
             placeholder-[#B3B3AE] 
        
             transition shadow-md duration-300"
/>

  <button
    type="submit"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
      />
    </svg>
  </button>
</form>

    </div>

    {isSearching ? (
      <SectionGrid title="Search Results" songs={songs} isLoading={isLoading} />
    ) : (
      <>
        <FeaturedSection />
        <div className="space-y-8">
          <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading} />
          <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
        </div>
      </>
    )}
  </div>
</ScrollArea>

    </main>
  );
};

export default HomePage;
