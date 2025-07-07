import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Library, SortAsc, SortDesc } from "lucide-react";
import AlbumsTable from "./AlbumsTable";
import AddAlbumDialog from "./AddAlbumDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const AlbumsTabContent = () => {
	const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder,setSortOrder]=useState<"asc" | "desc">("desc");
	return (
		<Card className='bg-zinc-800/50 border-zinc-700/50'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<Library className='h-5 w-5 text-violet-500' />
							Albums Library
						</CardTitle>
						<CardDescription>Manage your album collection</CardDescription>
					</div>
					<div className='flex gap-2 items-center'>
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
							placeholder='Search albums...'
							className=' border border-gray-200 text-gray-200 max-w-xs'
						/>
						<AddAlbumDialog />
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<AlbumsTable searchTerm={searchTerm} sortOrder={sortOrder} />
			</CardContent>
		</Card>
	);
};
export default AlbumsTabContent;