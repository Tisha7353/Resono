import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, SortAsc, SortDesc } from "lucide-react";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SongsTabContent = () => {
	const [searchTerm, setSearchTerm] = useState("");
		const [sortOrder,setSortOrder]=useState<"asc" | "desc">("desc");
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
					{/* Controls: Sort, Search, Add */}
      <div className='flex  flex-row gap-2 md:items-center w-full md:w-auto'>
					   {/* Search Input */}
							  <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="text-zinc-200 border-gray-200 rounded-md border-[0.5px] hover:text-white"
        >
          {sortOrder === "asc" ? (
            <SortAsc className="w-4 h-4 text-zinc-400 hover:text-white" />
          ) : (
            <SortDesc className="w-4 h-4 text-zinc-400 hover:text-white" />
          )}
        </Button>
							<Input
							  type='text'
							  value={searchTerm}
							  onChange={(e) => setSearchTerm(e.target.value)}
							  placeholder='Search songs...'
							  className='border border-gray-200 text-gray-200 w-full md:max-w-xs'
							/>
					<AddSongDialog />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable searchTerm={searchTerm} sortOrder={sortOrder} />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;