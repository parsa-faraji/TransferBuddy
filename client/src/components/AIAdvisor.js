import { useState, useEffect } from 'react';

const AIAdvisor = ({ selectedMajor, completedCourses, darkMode }) => {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const generateInitialAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          majorId: selectedMajor.id,
          completedCourses,
          type: 'initial'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory([{ type: 'ai', message: data.advice, timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error('Error getting AI advice:', error);
      setChatHistory([{ type: 'ai', message: 'Welcome! I\'m your AI academic advisor. I can help you plan your transfer journey, recommend courses, and answer questions about your major requirements.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMajor) {
      generateInitialAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMajor, completedCourses]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { type: 'user', message: userMessage, timestamp: Date.now() };
    setChatHistory(prev => [...prev, newMessage]);
    
    setLoading(true);
    setUserMessage('');

    try {
      const response = await fetch('/api/ai-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          majorId: selectedMajor.id,
          completedCourses,
          message: userMessage,
          type: 'chat'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          message: data.advice, 
          timestamp: Date.now() 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: 'Sorry, I encountered an error. Please try again.', 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = () => {
    if (!selectedMajor) return [];
    
    const remaining = selectedMajor.courses.filter(course => 
      !completedCourses.includes(course.ucbCourse)
    );
    
    return remaining.slice(0, 3);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold">AI</span>
        </div>
        <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">AI Academic Advisor</h3>
      </div>

      {/* Recommendations Panel */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">📚 Course Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {getRecommendations().map((course, index) => (
            <div key={course.ucbCourse} className={`p-3 rounded-lg border-2 border-dashed ${darkMode ? 'border-purple-400 bg-gray-700' : 'border-purple-300 bg-purple-50'}`}>
              <div className="font-medium text-purple-700 dark:text-purple-300">{course.ucbCourse}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Priority: {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">💬 Ask Your AI Advisor</h4>
        
        {/* Chat History */}
        <div className={`h-64 overflow-y-auto p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border`}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                msg.type === 'user' 
                  ? `${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white` 
                  : `${darkMode ? 'bg-gray-600' : 'bg-white'} border`
              }`}>
                {msg.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className={`inline-block p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about course planning, requirements, or transfer tips..."
            className={`flex-1 px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !userMessage.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;