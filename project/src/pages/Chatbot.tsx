import { useState } from 'react';
import { api } from '../lib/api';
import { Send, Bot, User as UserIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  type: 'user' | 'bot';
  text: string;
  complaintId?: string;
  timestamp: Date;
}

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: "Hello! I'm your civic complaint assistant. You can ask me about the status of your complaints, how to report issues, or provide a complaint ID to get details.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chatbotQuery(input);

      const botMessage: Message = {
        type: 'bot',
        text: response.reply,
        complaintId: response.complaint?._id,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        type: 'bot',
        text: err instanceof Error ? err.message : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-orange-500">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <Bot className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Civic Assistant</h1>
                <p className="text-orange-100">Ask me anything about complaints</p>
              </div>
            </div>
          </div>

          {!user && (
            <div className="bg-yellow-50 border-b-2 border-yellow-200 p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-yellow-800 text-sm">
                  You're using the chatbot as a guest. For personalized assistance,{' '}
                  <Link to="/login" className="font-semibold underline hover:text-yellow-900">
                    sign in
                  </Link>{' '}
                  to your account.
                </p>
              </div>
            </div>
          )}

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`p-2 rounded-full ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 ml-3'
                        : 'bg-gradient-to-br from-green-500 to-green-600 mr-3'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <UserIcon className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.complaintId && (
                        <Link
                          to={`/complaints/${message.complaintId}`}
                          className="inline-block mt-2 text-xs font-semibold underline hover:opacity-80"
                        >
                          View Complaint Details
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-green-600 mr-3">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example: "What's the status of my complaint 64a..." or "How to report an issue"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
