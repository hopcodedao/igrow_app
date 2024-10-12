import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../chatbot.css';

function Chatbot() {
  const [input, setInput] = useState(''); // Trạng thái cho nội dung ô nhập
  const [messages, setMessages] = useState([]); // Trạng thái cho danh sách tin nhắn
  const [isLoading, setIsLoading] = useState(false); // State to indicate loading

  // Replace with your Gemini project ID and API key
  const projectId = '983256648044';
  const apiKey = 'AIzaSyA1U2na4dM4afkhYiNYRNhd03SmEBfR5fM';

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (input.trim()) {
      setIsLoading(true); // Set loading state

      const userMessage = { sender: 'user', text: input }; // User message
      setMessages([...messages, userMessage]); // Add user message to list

      try {
        const response = await axios.post(
          `https://api.gemini.ai/v1/projects/${projectId}/dialogs`,
          {
            prompt: input,
            api_key: apiKey,
            model: "gemini-1.5-flash",
            // Additional options can be added here, refer to Gemini API documentation
          }
        );

        const botMessage = { sender: 'bot', text: response.data.result.text || "Không tìm thấy kết quả" };
        setMessages([...messages, botMessage]);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setMessages([...messages, { sender: 'bot', text: 'Có lỗi xảy ra, vui lòng thử lại sau' }]);
      } finally {
        setInput(''); // Clear input field
        setIsLoading(false); // Reset loading state
      }
    }
  };

  // Function to handle fetching initial messages (optional)
  const fetchInitialMessages = async () => {
    // Implement logic to fetch initial messages from Gemini if needed
  };

  useEffect(() => {
    fetchInitialMessages(); // Call on component mount (optional)
  }, []); // Empty dependency array for one-time execution

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div>Loading...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update input state
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} // Send message on Enter
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;