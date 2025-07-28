import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [ userId, checkAdminStatus, initSocket, disconnectSocket]);


	useEffect(() => {
		const refreshToken = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
			} catch (err) {
				console.warn("Token refresh failed", err);
			}
		};

		const interval = setInterval(refreshToken, 1000*60 ); // every 5 minutes

		return () => clearInterval(interval);
	}, []);


	if (loading)
		return (
			<div className="flex h-screen w-full justify-center  items-center ">
  <div className="flex items-end h-14 gap-2">
    {[0.3, 0.7, 0.5, 0.9, 0.2].map((height, index) => (
      <div 
        key={index}
        className="w-2 bg-gradient-to-r from-[#D63754] to-purple-900 rounded-full"
        style={{
          height: `${height * 100}%`,
          animation: `equalize 1.5s ease-in-out infinite ${index * 0.1}s`,
          transformOrigin: 'bottom'
        }}
      />
    ))}
  </div>
  
</div>

		);

	return <>{children}</>;
};
export default AuthProvider;