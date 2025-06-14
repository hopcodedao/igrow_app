// src/components/common/AITutorModal.jsx
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios"; // Đảm bảo đã import axios
import ReactMarkdown from "react-markdown";

function AITutorModal({ isOpen, onClose, initialContext }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          text: `Xin chào! Bạn có câu hỏi gì về bài học **"${initialContext}"** không? Tôi có thể giúp bạn giải thích hoặc tìm thêm ví dụ.`,
          user: false,
        },
      ]);
    }
  }, [isOpen, initialContext]);

  const handleSendMessage = async () => {
    if (input.trim() && !loading) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      const currentInput = input;
      setInput("");
      setLoading(true);

      try {
        // Lấy API Key từ biến môi trường của Vite
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("API Key không được tìm thấy. Vui lòng kiểm tra tệp .env");
        }

        const fullPrompt = `Dựa trên ngữ cảnh bài học "${initialContext}", hãy trả lời câu hỏi sau: ${currentInput}`;

        // Gọi trực tiếp API của Google bằng axios
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: fullPrompt }] }],
          }
        );

        const botResponse = response.data.candidates[0].content.parts[0].text;
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        setMessages([
          ...newMessages,
          { text: `Lỗi: ${error.message}`, user: false },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Lớp phủ toàn màn hình
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Khung modal */}
      <div className="card relative flex h-[90vh] w-[95%] max-w-2xl flex-col rounded-lg">
        <div className="flex items-center justify-between border-b-2 border-primary p-4">
          <h2 className="text-xl font-bold text-primary dark:text-secondary">Trợ lý học tập iGrow</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:text-red-500">&times;</button>
        </div>

        {/* Khung chat */}
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.user ? "justify-end" : "justify-start"}`}>
              <div className={`prose dark:prose-invert max-w-full rounded-lg p-3 shadow-md ${msg.user ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && <div className="text-center">AI đang suy nghĩ...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Khung nhập tin nhắn */}
        <div className="flex gap-2 border-t p-4">
          <input
            type="text"
            className="flex-1 rounded-lg border p-2 outline-none dark:bg-dark"
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-4 text-white transition-all hover:bg-secondary disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AITutorModal;