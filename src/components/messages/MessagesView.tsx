import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { threads, sendMessage } = useApp();

  const [selectedThreadId, setSelectedThreadId] = useState(threads[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    sendMessage(activeThread.id, inputText);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DF] shadow-xs overflow-hidden flex flex-col md:flex-row h-[620px]">
      {/* Threads Sidebar */}
      <div className="w-full md:w-80 border-r border-[#E8E4DF] flex flex-col bg-[#F8F6F3]/50">
        <div className="p-4 border-b border-[#E8E4DF] bg-white">
          <h2 className="text-base font-bold text-[#1A2332]">
            Comunicaciones Escolares & Tutores
          </h2>
          <p className="text-xs text-[#52697C]">
            Canales organizados por estudiante y materia
          </p>
        </div>

        <div className="divide-y divide-[#E8E4DF] overflow-y-auto flex-1">
          {threads.map(thread => {
            const isSelected = thread.id === activeThread?.id;
            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  isSelected ? 'bg-white border-l-4 border-[#0D8B8B] shadow-xs' : 'hover:bg-gray-100/60'
                }`}
              >
                <img
                  src={thread.avatar}
                  alt={thread.recipientName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-xs text-[#1A2332] truncate">
                      {thread.recipientName}
                    </h3>
                    <span className="text-[10px] text-[#52697C]">{thread.lastTimestamp}</span>
                  </div>

                  <p className="text-[11px] font-semibold text-[#0D8B8B] mt-0.5">
                    {thread.recipientRole} {thread.studentTag && `• ${thread.studentTag}`}
                  </p>

                  <p className="text-xs text-[#52697C] truncate mt-1">
                    {thread.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 flex flex-col bg-white">
        {activeThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#E8E4DF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeThread.avatar}
                  alt={activeThread.recipientName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#1A2332]">
                    {activeThread.recipientName}
                  </h3>
                  <p className="text-xs text-[#52697C]">
                    {activeThread.recipientRole} {activeThread.studentTag && `(Estudiante: ${activeThread.studentTag})`}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#0D8B8B]">
                Canal Oficial Orbit
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F6F3]/30">
              {activeThread.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    msg.isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!msg.isCurrentUser && (
                    <img
                      src={msg.avatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isCurrentUser
                        ? 'bg-[#0D8B8B] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-[#1A2332] border border-[#E8E4DF] rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {!msg.isCurrentUser && (
                      <p className="font-bold text-[11px] text-[#0D8B8B] mb-0.5">
                        {msg.senderName} ({msg.senderRole})
                      </p>
                    )}
                    <p>{msg.content}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        msg.isCurrentUser ? 'text-teal-100' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#E8E4DF] flex items-center gap-2">
              <input
                type="text"
                placeholder={`Responder a ${activeThread.recipientName}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-[#E8E4DF] focus:outline-none focus:ring-1 focus:ring-[#0D8B8B] bg-[#F8F6F3]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 bg-[#0D8B8B] text-white rounded-xl text-xs font-semibold hover:bg-[#096363] disabled:opacity-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#52697C]">
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  );
};
