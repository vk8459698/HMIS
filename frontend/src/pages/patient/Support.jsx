import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  
  // API configuration - using environment variables
  const API_KEY = 'YOURAPIKEY'
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([
      { 
        text: "Hello! I'm your Hospital Management System support assistant. How can I help you today?", 
        sender: 'bot' 
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      const response = await callGeminiAPI(input);
      setIsTyping(false);
      
      if (response) {
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      } else {
        setMessages(prev => [
          ...prev, 
          { text: "I'm sorry, I couldn't process your request. Please try again.", sender: 'bot' }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { text: "I'm sorry, there was an error processing your request. Please try again later.", sender: 'bot' }
      ]);
    }
  };

  const callGeminiAPI = async (message) => {
    console.log('Making API call to Gemini with message:', message);

    // Check if API key is available
    if (!API_KEY) {
      console.error('API key is not defined in environment variables');
      throw new Error('API key is missing');
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful assistant for a Hospital Management System. 
                    Respond to the following question with helpful information: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected API response format:', data);
        return null;
      }
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Main content area - full screen */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full h-full bg-white overflow-hidden flex flex-col shadow-lg">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
            <h1 className="text-2xl font-bold">Support Assistant</h1>
            <p className="text-sm opacity-90">Powered by Gemini Flash</p>
          </div>
          
          {/* Chat messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-6 overflow-y-auto flex flex-col space-y-6"
            style={{ height: 'calc(100vh - 140px)', backgroundImage: 'radial-gradient(circle at center, #f3f4f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-100 text-emerald-600 ml-2' 
                      : 'bg-teal-100 text-teal-600 mr-2'
                  }`}>
                    <FontAwesomeIcon icon={msg.sender === 'user' ? faUser : faRobot} size="sm" />
                  </div>
                  <div 
                    className={`p-4 rounded-2xl shadow-sm transition-all duration-300 ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-gray-800 border-emerald-200 border' 
                        : 'bg-white hover:bg-gray-50 text-gray-800 border-teal-200 border'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 mr-2">
                    <FontAwesomeIcon icon={faRobot} size="sm" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the hospital system..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-teal-400 transition-colors"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
                disabled={!input.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;