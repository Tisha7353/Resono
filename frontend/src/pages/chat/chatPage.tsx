import Topbar from "@/components/TopBar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef} from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { ChevronRight } from "lucide-react";

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser,isOpen, fetchUsers, fetchMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser.clerkId);
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="h-[100dvh] bg-gradient-to-b from-zinc-800 to-zinc-900 flex flex-col">
      <div className="sticky top-0 z-50">
        <Topbar />
      </div>

      <div
        className={`grid flex-1 overflow-hidden ${
          isOpen ? "grid-cols-1 md:grid-cols-[300px_1fr]" : "grid-cols-1"
        }`}
      >
		
        <UsersList  />

      <div
  className={`flex flex-col pt-[104px] h-full overflow-hidden relative ${
    isOpen && selectedUser ? "pb-10" : ""
  }`}
>

          {selectedUser ? (
            <>
              {/* Chat Header */}
              <ChatHeader  />

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-start gap-3 ${
                      message.senderId === user?.id ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={
                          message.senderId === user?.id
                            ? user.imageUrl
                            : selectedUser.imageUrl
                        }
                      />
                    </Avatar>
                    <div
                      className={`rounded-lg p-2 max-w-[80%] text-sm break-words ${
                        message.senderId === user?.id
                          ? "bg-[#d63754]"
                          : "bg-zinc-800"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs text-zinc-300 mt-1 block">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Message Input */}
              <MessageInput />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <NoConversationPlaceholder />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;

const NoConversationPlaceholder = () => {
   const { isOpen, setIsOpen } = useChatStore();
  return( 
  <div className="flex flex-col p-4 items-center justify-center flex-1 space-y-6">
    <img src="/resono.png" alt="Resono" className="size-16 animate-bounce" />
    <div className="text-center">
      <h3 className="text-zinc-300 text-lg font-medium mb-1">
        No conversation selected
      </h3>
      <p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
    </div>
	 
    {!isOpen && (
      <button
        className="px-3 py-1 rounded-md bg-zinc-800 text-white text-sm flex items-center gap-1 hover:bg-zinc-700"
        onClick={() => setIsOpen(true)}
      >
        <ChevronRight className="h-4 w-4" /> Show Chats
      </button>
    )}
  </div>)
};
