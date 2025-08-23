import UsersListSkeleton from "@/components/skeletons/UserListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { ChevronLeft } from "lucide-react";

const UsersList = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
    useChatStore();
  const { user } = useUser();
  const loggedInClerkId = user?.id;

 if (!isOpen) return null;

  return (
    <div className="border-r border-[#bcbcc755]">
      <div className="flex flex-col h-full">
       <div
  className={`flex justify-between border-b border-white/20 p-4 ${
    selectedUser ? "pt-28 md:pt-32" : ""
  }`}
>
          <div className="">All Chats</div>
          <button
            className="px-2 py-1 rounded-md bg-zinc-800 text-white text-sm flex items-center gap-1 hover:bg-zinc-700 "
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" /> Hide
          </button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2 p-4">
            {isLoading ? (
              <UsersListSkeleton />
            ) : (
              users.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setSelectedUser(u);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
                    ${
                      selectedUser?.clerkId === u.clerkId
                        ? "bg-zinc-800"
                        : "hover:bg-zinc-800/50"
                    }`}
                >
                  <div className="relative">
                    <Avatar className="size-8 md:size-12">
                      <AvatarImage src={u.imageUrl} />
                      <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                        ${
                          onlineUsers.has(u.clerkId)
                            ? "bg-[#d63754]"
                            : "bg-zinc-500"
                        }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0 lg:block ">
                    <span className="font-medium truncate">
                      {u.fullName} {u.clerkId === loggedInClerkId ? "(you)" : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UsersList;
