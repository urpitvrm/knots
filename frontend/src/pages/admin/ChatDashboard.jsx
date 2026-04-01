import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import ChatBox from '../../components/chat/ChatBox';

export default function ChatDashboard() {
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const [chats, setChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadChats = () => {
    setLoading(true);
    setError('');
    api
      .get('/chat/admin')
      .then((res) => {
        const list = res.data.items || [];
        setChats(list);
        if (list.length > 0 && !selectedUserId) {
          setSelectedUserId(String(list[0].user._id));
        }
      })
      .catch(() => setError('Failed to load conversations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleIncoming = () => loadChats();
    socket.on('receive_message', handleIncoming);
    return () => socket.off('receive_message', handleIncoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedUserId]);

  const selectedChat = chats.find(
    (chat) => String(chat.user._id) === String(selectedUserId)
  );
  const showConversation = !!(selectedUserId && user);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-deep">
          Customer Chats
        </h1>
        <p className="text-sm text-deep/70">
          Monitor and reply to all customer conversations in real-time.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      {/* MAIN GRID */}
      <div className="grid gap-4 lg:grid-cols-[320px,1fr] lg:h-[calc(100vh-180px)]">

        {/* SIDEBAR */}
        <aside
          className={`rounded-2xl border border-beige/60 bg-white p-3 shadow-soft overflow-y-auto max-h-[40vh] lg:max-h-none ${
            showConversation ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="mb-3 flex items-center justify-between px-2">
            <h2 className="text-sm font-semibold text-deep">Conversations</h2>
            <span className="text-xs text-deep/50">{chats.length}</span>
          </div>

          {loading && (
            <p className="px-2 text-sm text-deep/60">
              Loading chats...
            </p>
          )}

          {!loading && chats.length === 0 && (
            <p className="px-2 text-sm text-deep/60">
              No conversations yet.
            </p>
          )}

          <div className="space-y-2">
            {chats.map((chat) => {
              const online = isUserOnline(chat.user._id);
              const active =
                String(chat.user._id) === String(selectedUserId);

              return (
                <button
                  key={chat.user._id}
                  type="button"
                  onClick={() =>
                    setSelectedUserId(String(chat.user._id))
                  }
                  className={`w-full rounded-xl p-3 text-left transition ${
                    active
                      ? 'bg-accent/15'
                      : 'bg-cream/70 hover:bg-beige/60'
                  }`}
                >
                  <p className="truncate text-sm font-semibold text-deep">
                    {chat.user.name}
                  </p>

                  <p className="truncate text-xs text-deep/70">
                    {chat.lastMessage}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-medium ${
                        online
                          ? 'text-green-600'
                          : 'text-deep/50'
                      }`}
                    >
                      {online ? 'Online' : 'Offline'}
                    </span>

                    <span className="text-[11px] text-deep/50">
                      {new Date(
                        chat.lastMessageAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CHAT SECTION */}
        <section
          className={`min-h-[65vh] overflow-hidden lg:min-h-0 ${
            showConversation ? 'block' : 'hidden lg:block'
          }`}
        >
          {showConversation ? (
            <div className="mb-2 flex lg:hidden">
              <button
                type="button"
                onClick={() => setSelectedUserId('')}
                className="rounded-xl border border-beige bg-white px-3 py-1.5 text-xs font-medium text-deep"
              >
                Back to conversations
              </button>
            </div>
          ) : null}

          {showConversation ? (
            <div className="h-[65vh] overflow-y-auto lg:h-full">
              <ChatBox
                currentUser={user}
                targetUserId={selectedUserId}
                title={
                  selectedChat
                    ? selectedChat.user.name
                    : 'Conversation'
                }
                subtitle={
                  selectedChat
                    ? selectedChat.user.email
                    : 'Select a conversation'
                }
                className="h-full"
              />
            </div>
          ) : (
            <div className="flex h-[65vh] items-center justify-center rounded-2xl border border-beige/60 bg-white text-sm text-deep/60 shadow-soft lg:h-full">
              Select a conversation to start chatting.
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}