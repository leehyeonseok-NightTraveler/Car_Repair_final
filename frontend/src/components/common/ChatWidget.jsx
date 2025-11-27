import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, Wrench } from 'lucide-react'; 

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: '안녕하세요! 스피드모터스 AI 정비사입니다. 🚗\n어떤 도움이 필요하신가요?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { 
    scrollToBottom(); 
    if (isOpen && !isLoading && inputRef.current) {
        inputRef.current.focus();
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMsg = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/react/chat', { message: userMsg.text });
      setMessages(prev => [...prev, { type: 'bot', text: res.data.response }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { type: 'bot', text: '죄송합니다. 서버 연결이 불안정합니다. 😥 서버(8484)와 React(5173)가 모두 실행 중인지 확인해 주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: '"Malgun Gothic", sans-serif' }}>
      
      {/* 챗봇 위젯 (isOpen일 때 표시) */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '640px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #e0e0e0'
        }}>
          
          {/* 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Bot size={36} style={{ minWidth: '36px' }} /> 
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>AI 정비 상담사</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>항상 온라인 ∙ 빠른 답변</div>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)} 
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    fontSize: '28px',
                    cursor: 'pointer'
                }}>×</button>
          </div>

          {/* 메시지 영역 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                <div style={{
                  display: 'inline-block',
                  maxWidth: '80%',
                  padding: '14px 18px',
                  borderRadius: '24px',
                  background: msg.type === 'user' ? '#14b8a6' : 'white',
                  color: msg.type === 'user' ? 'white' : '#1f2937',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '15px',
                  lineHeight: '1.5'
                }} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }} />
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'inline-block', padding: '14px 18px', background: 'white', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <span style={{ display: 'inline-block', animation: 'bounce 1.2s infinite' }}>점</span>
                  <span style={{ display: 'inline-block', animation: 'bounce 1.2s infinite 0.2s' }}>점</span>
                  <span style={{ display: 'inline-block', animation: 'bounce 1.2s infinite 0.4s' }}>점</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="궁금한 점을 입력하세요..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '30px',
                  outline: 'none',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  borderColor: '#e0e0e0'
                }}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                style={{
                  background: '#14b8a6',
                  color: 'white',
                  border: 'none',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(20,184,166,0.4)',
                  opacity: (!inputValue.trim() || isLoading) ? 0.6 : 1,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#0d9488'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#14b8a6'}
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 (위젯이 닫혀있을 때만 표시: !isOpen) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(20,184,166,0.5)',
            transition: 'all 0.3s',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={36} />
        </button>
      )}

      {/* CSS 애니메이션 키프레임 */}
      <style>{`
        @keyframes chat-dot-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}