import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { ChevronRight } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, onlineUsers,isOpen,setIsOpen } = useChatStore();

  if (!selectedUser) return null;

  return (
    <div className="p-3 border-b border-[#bcbcc755] flex items-center justify-between">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser.imageUrl} />
          <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{selectedUser.fullName}</h2>
          <p className="text-sm text-zinc-400">
            {onlineUsers.has(selectedUser.clerkId) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Show button (only when user list is hidden) */}
      {!isOpen && (
        <button
          className="px-2 py-1 rounded-md bg-zinc-800 text-white text-sm flex items-center gap-1 hover:bg-zinc-700"
          onClick={() => setIsOpen(true)}
        >
          <ChevronRight className="h-4 w-4" /> Show 
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
