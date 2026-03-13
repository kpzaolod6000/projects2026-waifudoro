import { useState, useRef, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { ChatMessage } from '../components/ChatMessage';
import { Send } from 'lucide-react';
import { chat as chatApi, ApiMessage, ApiError } from '../lib/api';

const WAIFU_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuANoXVA0N3mXNqZV-GOmaYJkQoQ6di51K1LOTsJtmFeHebwVKo2Emo9Z5GNkeMalbOzH4vzWr2E9CeNOSTeOB9rG6ecY7bsVd07uOVtCgA4Pf-sNjhp55slwdMEoI_E8NoQKhUjV_r7g8reo1eX0EdaA4Hk2tKouAEz4oMVjVMdyAoV0vsGAW0ytygZarBJs2K8WxeFja30WS0ZMWnx6Zob7HkhWgU2KEmzHfMmRaK55tiPcxEr5YYsf4L6Gm3ZK8HZPPEJIG-0_ZLb';

export function ChatPage() {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatApi.history().then(res => setMessages(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    try {
      const { userMessage, waifuReply } = await chatApi.send(text);
      setMessages(prev => [...prev, userMessage, waifuReply]);
    } catch (err) {
      if (err instanceof ApiError) {
        // Restore input on error
        setInput(text);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout headerTitle="Chat with your waifu">
      <div className="h-full flex gap-6 p-6 min-h-0">

        <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-primary/10 shadow-sm relative">
          <img src={WAIFU_IMAGE} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Companion character" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-2">Hina</h3>
            <p className="text-sm italic leading-relaxed">
              "I am very proud of all the effort you have put in today! If you are feeling tired, I'm always here to support you."
            </p>
          </div>
        </div>

        <div className="w-96 flex-none flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-3xl border border-primary/10 shadow-sm">
          <div className="flex-none p-6 border-b border-primary/10">
            <h4 className="font-bold text-lg dark:text-white">Interactive Chat</h4>
            <p className="text-xs text-green-500 font-bold mt-1 tracking-wider uppercase flex items-center gap-1">
              <span className="size-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.length === 0 && (
              <p className="text-center text-slate-400 text-sm mt-4">Say hi to Hina! 👋</p>
            )}
            {messages.map(msg => (
              <ChatMessage key={msg.id} isUser={msg.isUser} message={msg.message} />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex-none p-4 bg-primary/5 dark:bg-slate-800/50 rounded-b-3xl flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border-none text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-slate-200 disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="size-12 flex-none bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
