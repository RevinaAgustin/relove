import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Search, CheckCheck, Store, MessageSquare, ArrowLeft, ShieldCheck, User, Star } from 'lucide-react';

interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerRating: number;
  productName?: string;
  productImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

interface MessagesViewProps {
  navigate: (screen: any) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({ navigate }) => {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('re_love_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    return [
      {
        id: 'chat-1',
        sellerName: 'Studio Vintage JKT',
        sellerRating: 4.9,
        productName: 'Jaket Denim Vintage Classic',
        productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7wNUa7UfVaHOj4tcRjHiAPDLJEsJgvVKfcMS_ChAwOr8-SnSP7SVKHcX7epJNB4BwaCu6GFsWDmuvIi6af0cJ682kwunY4gt0mpxc3kC9dM7kbQFf7NOqtPxAW-AOreu6E2XBd5MIINaStAXk1AOsh03RMB1jyhCW4w7M01YB6ZT4Vjb9ARtALwvBB0R9B5OfJKz44ICs-ZsWP3KfZ4jxlJs9bkpzM-Rqjg7-zbn5igPEpGW8OV28ionyrGnYi2l3KdLvzhM_xjeK',
        lastMessage: 'Betul kak, oversized retro khas era 90-an. Lebar dada sekitar 62cm. Sangat cocok buat style layering!',
        lastMessageTime: '10.45',
        unread: true,
        messages: [
          {
            id: 'm1',
            sender: 'seller',
            text: 'Halo Kak! Ada yang bisa kami bantu mengenai Jaket Denim Vintage Classic-nya? Kondisinya sangat mulus lho kak, original Balenciaga.',
            timestamp: '10.30',
          },
          {
            id: 'm2',
            sender: 'buyer',
            text: 'Halo Kak! Apakah ukurannya L-nya oversized banget ya? Saya biasa pakai size M tapi suka style longgar.',
            timestamp: '10.35',
          },
          {
            id: 'm3',
            sender: 'seller',
            text: 'Betul kak, oversized retro khas era 90-an. Lebar dada sekitar 62cm. Sangat cocok buat style layering!',
            timestamp: '10.45',
          },
        ],
      },
      {
        id: 'chat-2',
        sellerName: 'UrbanArchive Vintage',
        sellerRating: 4.8,
        productName: 'Sepatu Boots Kulit',
        productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvoMg3VzgLSzYsclwQT5TJ8egglJgiFkH8AqZADcp_3iAZricvzL6gTbKHy_kOCweg1XQhVfR57X18nrt0BWc--hD4Xiq-18h6_U8hLDqn9W-Uo-R9YvGATAURewIiqNuqKcCMtj47ha4waTap2wPrkjWp6bfN46DYKDQC5pfS4lI8NWaPgxwXCSJGbZ5bq2pGDZyrbZhpWUpr2DS4r4twWIFd7YZy70IfFRWSaayGpFJNQr9trpBuQarv0rFSwt6PSV-ygX4H2zHq',
        lastMessage: 'Pas untuk kaki 26.5cm - 27cm kak. Insolenya empuk sekali.',
        lastMessageTime: 'Kemarin',
        unread: false,
        messages: [
          {
            id: 'm4',
            sender: 'seller',
            text: 'Halo kak, Sepatu Boots Kulit Common Projects-nya masih ready ya kak. Kulit asli full-grain premium, jarang ada di pasaran.',
            timestamp: 'Kemarin 14.15',
          },
          {
            id: 'm5',
            sender: 'buyer',
            text: 'Kira-kira kalau ukuran 42 ini pas untuk panjang kaki berapa cm kak? Takut kesempitan.',
            timestamp: 'Kemarin 14.20',
          },
          {
            id: 'm6',
            sender: 'seller',
            text: 'Pas untuk kaki 26.5cm - 27cm kak. Insolenya empuk sekali.',
            timestamp: 'Kemarin 14.22',
          },
        ],
      },
      {
        id: 'chat-3',
        sellerName: 'Dinda Thrift Store',
        sellerRating: 4.7,
        productName: 'Celana Cargo Corduroy',
        productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'Ada sedikit defect kikis pemakaian di ujung saku belakang kak, tapi samar banget.',
        lastMessageTime: '3 Hari Lalu',
        unread: false,
        messages: [
          {
            id: 'm7',
            sender: 'buyer',
            text: 'Misi kak, celana cargonya ada defect sobek atau noda bandel ga ya?',
            timestamp: '3 Hari Lalu',
          },
          {
            id: 'm8',
            sender: 'seller',
            text: 'Ada sedikit defect kikis pemakaian di ujung saku belakang kak, tapi samar banget.',
            timestamp: '3 Hari Lalu',
          },
        ],
      },
    ];
  });

  const [activeThreadId, setActiveThreadId] = useState<string>('chat-1');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mobileActiveThread, setMobileActiveThread] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of the chat container without moving the browser window
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId, isTyping]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'buyer',
      text: inputText,
      timestamp: timeString,
    };

    // Update messages local array
    const updatedThreads = threads.map((t) => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          unread: false,
          lastMessage: inputText,
          lastMessageTime: timeString,
          messages: [...t.messages, userMsg],
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    localStorage.setItem('re_love_chats', JSON.stringify(updatedThreads));
    const currentInput = inputText;
    setInputText('');

    // Trigger seller reply simulator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyString = getSellerReply(activeThread.sellerName, currentInput);
      const replyTime = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const sellerMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'seller',
        text: replyString,
        timestamp: replyTime,
      };

      const finalThreads = updatedThreads.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: replyString,
            lastMessageTime: replyTime,
            messages: [...t.messages, sellerMsg],
          };
        }
        return t;
      });

      setThreads(finalThreads);
      localStorage.setItem('re_love_chats', JSON.stringify(finalThreads));
    }, 1500);
  };

  // Pre-configured response logic for maximum conversational quality
  const getSellerReply = (sellerName: string, query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('harga') || q.includes('nego') || q.includes('kurang')) {
      return `Halo kak! Untuk barang preloved berkualitas ini harga kami sudah pas ya kak. Tapi tenang saja, sudah sirkular dan kami pack premium dengan kotak kertas daur ulang sirkular gratis kak! 😊`;
    }
    if (q.includes('kirim') || q.includes('ongkir') || q.includes('kapan')) {
      return `Jika pembayaran diverifikasi sebelum jam 16.00 WIB, paket langsung kami pickup sore ini juga melalui kurir SiCepat/JNE pilihan kakak. Yuk silakan diselesaikan checkout-nya! 🚚`;
    }
    if (q.includes('kondisi') || q.includes('minus') || q.includes('cacat')) {
      return `Kondisi produk sangat prima sesuai dengan deskripsi dan foto di etalase kami kak. Semua telah melalui uji kurasi sterilisasi ozon sirkular kami, dijamin bersih, wangi, siap pakai! ✨`;
    }
    return `Makasih pertanyaannya kak! Kemeja / baju ini super recommended banget. Silakan langsung checklist di keranjang atau klik 'Beli Sekarang' agar ga keduluan pembeli lain ya kak, karena stok preloved kami hanya ada 1 buah saja per item! 🙏💚`;
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    setMobileActiveThread(true);
    // Mark as read
    const updated = threads.map((t) => {
      if (t.id === id) {
        return { ...t, unread: false };
      }
      return t;
    });
    setThreads(updated);
    localStorage.setItem('re_love_chats', JSON.stringify(updated));
  };

  // Filter threads based on search
  const filteredThreads = threads.filter((t) =>
    t.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 py-4 min-h-[75vh]">
      {/* Page Title Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('explore')}
          className="p-2 rounded-full hover:bg-white border border-[#c1c8c2]/20 shadow-xs text-[#414944] hover:text-[#002d1c] transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="font-display text-[#002d1c] text-3xl font-extrabold tracking-tight">Kotak Masuk Pesan</h2>
          <p className="font-body text-xs text-[#414944] mt-1.5">Diskusikan kondisi pakaian preloved sirkular Anda langsung dengan para penjual terverifikasi.</p>
        </div>
      </div>

      {/* Messages Grid Container */}
      <div className="bg-white rounded-[28px] border border-[#c1c8c2]/35 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] h-[650px] relative">
        
        {/* Left Pane: Chat list (hidden on mobile if thread is active) */}
        <div className={`md:col-span-4 border-r border-[#f0edec] flex flex-col ${mobileActiveThread ? 'hidden md:flex' : 'flex'}`}>
          {/* Search box */}
          <div className="p-4 border-b border-[#f0edec] bg-[#fcf9f8]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#414944]/60" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama toko penjual..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#c1c8c2]/50 rounded-xl outline-none focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] transition-all"
              />
            </div>
          </div>

          {/* List of Chats */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0edec]">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#414944]/60 space-y-2">
                <MessageSquare className="mx-auto text-[#c1c8c2]" size={36} />
                <p>Tidak ada percakapan ditemukan.</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread.id)}
                    className={`w-full p-4 flex gap-3 text-left transition-all relative ${
                      isActive ? 'bg-[#1a4331]/5' : 'hover:bg-[#fcf9f8]'
                    }`}
                  >
                    {/* Unread dot */}
                    {thread.unread && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#002d1c]" />
                    )}

                    {/* Shop avatar mockup */}
                    <div className="w-10 h-10 rounded-full bg-[#002d1c]/10 text-[#002d1c] flex items-center justify-center font-bold font-display text-sm relative flex-shrink-0">
                      {thread.sellerName[0]}
                      <div className="absolute right-0 bottom-0 bg-[#c0edd3] w-3 h-3 rounded-full border-2 border-white flex items-center justify-center">
                        <Store size={8} className="text-[#002d1c]" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 font-geist">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-xs font-black text-[#1c1b1b] truncate">{thread.sellerName}</h4>
                        <span className="text-[10px] text-[#414944]/60 font-mono flex-shrink-0">{thread.lastMessageTime}</span>
                      </div>

                      {/* Product snippet indicator if any */}
                      {thread.productName && (
                        <p className="text-[10px] text-[#002d1c] font-bold truncate mb-1">
                          Ref: {thread.productName}
                        </p>
                      )}

                      <p className={`text-xs truncate ${thread.unread ? 'font-bold text-[#1c1b1b]' : 'text-[#414944]'}`}>
                        {thread.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation Box (hidden on mobile if no active thread) */}
        <div className={`md:col-span-8 flex flex-col bg-[#fcf9f8] ${!mobileActiveThread ? 'hidden md:flex' : 'flex'}`}>
          {activeThread ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-4 bg-white border-b border-[#f0edec] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  {/* Back button for mobile */}
                  <button
                    onClick={() => setMobileActiveThread(false)}
                    className="p-1.5 rounded-lg hover:bg-[#f6f3f2] text-[#414944] md:hidden cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-[#002d1c] text-white flex items-center justify-center font-bold font-display text-sm">
                    {activeThread.sellerName[0]}
                  </div>

                  <div className="font-geist">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black text-[#1c1b1b]">{activeThread.sellerName}</h3>
                      <div className="flex items-center gap-0.5 bg-[#d4e5c7]/50 px-1.5 py-0.5 rounded text-[9px] text-[#54634b] font-bold">
                        <Star size={10} className="fill-current" />
                        <span>{activeThread.sellerRating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#414944]/80">
                      <ShieldCheck size={12} className="text-[#002d1c]" />
                      <span>Penjual Terverifikasi Re-Love</span>
                    </div>
                  </div>
                </div>

                {/* Attached Product Mini Card */}
                {activeThread.productName && (
                  <div className="hidden sm:flex items-center gap-2 bg-[#fcf9f8] border border-[#c1c8c2]/30 p-2 rounded-xl max-w-[200px]">
                    {activeThread.productImage && (
                      <img
                        src={activeThread.productImage}
                        alt="Product Attachment"
                        className="w-8 h-8 object-cover rounded-lg bg-white"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="min-w-0 text-[10px] font-geist">
                      <p className="font-bold text-[#1c1b1b] truncate">{activeThread.productName}</p>
                      <span className="text-[#002d1c] font-black">Preloved</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Message Bubble List container */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeThread.messages.map((msg) => {
                  const isMe = msg.sender === 'buyer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex flex-col max-w-[75%] gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Bubble bubble body */}
                        <div
                          className={`p-4 rounded-2xl text-xs leading-relaxed font-geist ${
                            isMe
                              ? 'bg-[#002d1c] text-white rounded-tr-none shadow-sm'
                              : 'bg-white text-[#1c1b1b] border border-[#f0edec] rounded-tl-none shadow-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>

                        {/* Timestamp & Info footer */}
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="text-[9px] text-[#414944]/60 font-mono">{msg.timestamp}</span>
                          {isMe && <CheckCheck size={12} className="text-[#002d1c]/60" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing status loader */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="bg-white px-4 py-3 border border-[#f0edec] rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
                        <span className="text-[11px] text-[#414944] italic font-geist font-medium">{activeThread.sellerName} sedang mengetik</span>
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#002d1c] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#002d1c] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#002d1c] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input Bottom Panel */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#f0edec] flex gap-2 items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Tanyakan stok, detail ukuran, atau ongkos kirim..."
                  className="flex-1 bg-[#fcf9f8] text-xs font-geist p-3 border border-[#c1c8c2]/40 rounded-xl outline-none focus:border-[#002d1c] focus:ring-1 focus:ring-[#002d1c] transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-3 bg-[#002d1c] hover:opacity-90 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-xs text-[#414944]/60 space-y-3 font-geist">
              <MessageSquare className="text-[#c1c8c2]" size={48} />
              <h4 className="font-bold text-[#1c1b1b]">Pilih Percakapan</h4>
              <p>Mulai diskusi sirkular Anda dengan para penjual terpercaya kami.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
