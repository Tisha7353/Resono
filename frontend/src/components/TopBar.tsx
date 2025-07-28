import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons"
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";

const TopBar = () => {
	const { isAdmin } = useAuthStore();
	console.log({ isAdmin });
const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		console.log("Search:", searchQuery); // Handle the search logic here
	};
	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-2 items-center'>
				<img src='/resono.png' className='size-8' alt='Resono logo' />
				Resono
			</div>
			
			<div className='flex items-center  gap-4'>
				{/* Search Bar */}
			<form onSubmit={handleSearch} className='flex-1 max-w-56 mx-4'>
				<Input
							  type='text'
							  value={searchQuery}
							  onChange={(e) => setSearchQuery(e.target.value)}
							  placeholder='Search songs...'
							  className='border border-gray-200 text-gray-200 w-full md:max-w-xs'
							/>
			</form>
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
   <span className='hidden md:inline'>Admin Dashboard</span>
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};
export default TopBar;