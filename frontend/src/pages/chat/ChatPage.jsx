import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiPlus, HiTrash, HiChat } from 'react-icons/hi';
import API from '../../config/api';
import { formatDate } from '../../utils/helpers';
import { LoadingSkeleton, EmptyState, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef();

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChat?.messages]);

  const fetchChats = async () => {
    try {
      const { data } = await API.get('/chat');
      setChats(data.chats);
    } catch { console.error(); }
  };

  const createChat = async () => {
    try {
      const { data } = await API.post('/chat', { title: 'New Conversation' });
      setChats([data.chat, ...chats]);
      setActiveChat(data.chat);
    } catch { toast.error('Failed to create chat'); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    try {
      setSending(true);
      const { data } = await API.post(`/chat/${activeChat._id}/message`, { message });
      setActiveChat(data.chat);
      setMessage('');
      fetchChats();
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const deleteChat = async (id) => {
    try {
      await API.delete(`/chat/${id}`);
      setChats(chats.filter(c => c._id !== id));
      if (activeChat?._id === id) setActiveChat(null);
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="page-container h-[calc(100vh-2rem)]">
      <div className="flex h-full gap-4">
        <div className="w-80 flex-shrink-0 glass-card flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-600">
            <button onClick={createChat} className="btn-primary w-full flex items-center justify-center gap-2">
              <HiPlus className="w-5 h-5" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {chats.map(chat => (
              <div key={chat._id} onClick={() => setActiveChat(chat)}
                className={`p-3 rounded-xl cursor-pointer mb-1 flex items-center justify-between group ${activeChat?._id === chat._id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <HiChat className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 glass-card flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-slate-600">
                <h3 className="font-bold">{activeChat.title}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.messages?.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-slate-800/50 rounded-bl-md'}`}>
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-muted'}`}>
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex gap-2">
                  <input value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about your health..." className="input-field flex-1" disabled={sending} />
                  <button type="submit" disabled={sending || !message.trim()} className="btn-primary px-6">
                    <HiPaperAirplane className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState icon={HiChat} title="Start a conversation"
                description="Ask our AI health assistant anything about your health, reports, or medical conditions."
                action={<button onClick={createChat} className="btn-primary">Start Chat</button>} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
