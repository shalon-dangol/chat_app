import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { messagesAPI } from "../services/api";
import { getSocket } from "../services/socket";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalMessages: 0 });

  useEffect(() => {
    loadChatHistory();
    loadStats();
    setupSocketListeners();

    return () => {
      const socket = getSocket();
      socket?.off("new_message");
      socket?.off("user_joined");
    };
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await messagesAPI.getHistory(50);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await messagesAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const setupSocketListeners = () => {
    const socket = getSocket();

    socket?.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
      setStats((prev) => ({ ...prev, totalMessages: prev.totalMessages + 1 }));
    });

    socket?.on("user_joined", (data) => {
      setMessages((prev) => [
        ...prev,
        { _id: Date.now().toString(), content: data.message, isSystem: true },
      ]);
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const socket = getSocket();
    socket?.emit("send_message", { content: newMessage }, (response) => {
      if (response.success) {
        setNewMessage("");
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Chat App</h1>
          <p className="text-xs text-gray-500">
            Users: {stats.totalUsers} | Messages: {stats.totalMessages}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hi, {user?.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map((msg) =>
          msg.isSystem ? (
            <div key={msg._id} className="flex justify-center">
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-200 rounded-full">
                {msg.content}
              </span>
            </div>
          ) : (
            <div
              key={msg._id}
              className={`flex ${msg.sender._id === user?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender._id === user?._id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border"
                }`}
              >
                {msg.sender._id !== user?._id && (
                  <p className="text-xs font-semibold text-blue-600 mb-1">
                    {msg.sender.username}
                  </p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 p-4 bg-white border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;