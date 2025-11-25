import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Wrench } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: '안녕하세요! 스피드모터스 AI 정비사입니다. 🚗\n무엇을 도와드릴까요? (예: 엔진오일 가격, 영업시간)' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // 스크롤 자동 내리기
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // 메시지 전송 함수
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Spring Boot로 전송 (포트 8484 사용)
      const response = await axios.post('http://localhost:8484/api/react/chat', {
        message: userMsg.text
      });

      const botMsg = { type: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { type: 'bot', text: '죄송합니다. 서버 연결이 원활하지 않습니다. 😥' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans">
      
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* 헤더 */}
          <div className="bg-teal-500 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Wrench size={18} />
              </div>
              <span className="font-bold">AI 정비 상담</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm whitespace-pre-wrap ${
                    msg.type === 'user' 
                      ? 'bg-teal-500 text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
                  }`}
                  // 👇 [수정] 이 부분을 추가해야 HTML 태그가 클릭 가능한 링크로 변환됩니다.
                  dangerouslySetInnerHTML={{ __html: msg.text }} 
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl border border-gray-200 rounded-tl-none flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="궁금한 점을 물어보세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-teal-500 text-white p-2.5 rounded-full hover:bg-teal-600 transition shadow-md disabled:opacity-50"
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 둥둥 떠있는 버튼 (토글) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'rotate-90 scale-0' : 'scale-100'} transition-all duration-300 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center group`}
      >
        <MessageCircle size={32} className="group-hover:scale-110 transition-transform"/>
      </button>
    </div>
  );
}