import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !user || !newMessage.trim()) return;
		sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className="w-full px-2 py-2 border-t border-zinc-800 bg-zinc-900">
	<form
		onSubmit={(e) => {
			e.preventDefault();
			handleSend();
		}}
		className="flex items-center gap-2"
	>
		<Input
			placeholder="Type a message"
			value={newMessage}
			onChange={(e) => setNewMessage(e.target.value)}
			className="w-full bg-zinc-800 border-none text-sm px-3 py-2"
		/>

		<Button
			type="submit"
			size="icon"
			className="shrink-0 w-10 h-10 flex items-center justify-center"
			disabled={!newMessage.trim()}
		>
			<Send className="w-4 h-4" />
		</Button>
	</form>
</div>

	);
};

export default MessageInput;
