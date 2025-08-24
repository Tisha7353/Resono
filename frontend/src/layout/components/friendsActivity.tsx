import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Users } from "lucide-react";
import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
const FriendsActivity = () => {
	const { users, fetchUsers, onlineUsers,setSelectedUser,setIsOpen } = useChatStore();
	const { user } = useUser();
const navigate=useNavigate();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	const onlineFriends = users.filter((u) => onlineUsers.has(u.clerkId) && u.clerkId !== user?.id);
    const handleFriendClick=(friend:any)=>{
		setSelectedUser(friend)
		setIsOpen(false)
      navigate('/chat')
	}
	return (
		<div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
			<div className='p-4 flex justify-between items-center border-b border-zinc-800'>
				<div className='flex items-center gap-2'>
					<Users className='size-5 shrink-0' />
					<h2 className='font-semibold'>Online Friends</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{user && onlineFriends.length === 0 && (
						<div className="text-zinc-400 text-sm text-center">No friends are online right now.</div>
					)}

					{onlineFriends.map((friend) => {
  const activity = useChatStore.getState().userActivities.get(friend.clerkId) || "Idle";

  return (
    <div
      key={friend._id}
	  onClick={()=>handleFriendClick(friend)}
      className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
    >
      <div className='flex items-start gap-3'>
        <div className='relative'>
          <Avatar className='size-10 border border-zinc-800'>
            <AvatarImage src={friend.imageUrl} alt={friend.fullName} />
            <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
          </Avatar>
          <div
            className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-[#22c55e]'
            aria-hidden='true'
          />
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='font-medium text-sm text-white'>{friend.fullName}</span>
          </div>
          <p className='text-xs text-zinc-400 truncate'>
            {activity}
          </p>
        </div>
      </div>
    </div>
  );
})}

				</div>
			</ScrollArea>
		</div>
	);
};

export default FriendsActivity;

const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-[#D63754] to-purple-400 rounded-full blur-lg opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative bg-zinc-900 rounded-full p-4'>
				<Users className='size-8 text-[#D63754]' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>See Who's Online</h3>
			<p className='text-sm text-zinc-400'>Login to discover which of your friends are online right now</p>
		</div>
	</div>
);
