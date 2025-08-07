import { useState, useEffect, useRef } from 'react';

const MentorChat = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMentors();
    // In a real app, this would establish WebSocket connection
    simulateConnection();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors');
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Fallback mock data
      setMentors([
        { 
          id: '1', 
          name: 'Sarah Chen', 
          major: 'Computer Science', 
          year: 'Senior', 
          university: 'UC Berkeley',
          online: true,
          rating: 4.9,
          specialties: ['Transfer Planning', 'STEM Courses']
        },
        { 
          id: '2', 
          name: 'Marcus Johnson', 
          major: 'Business Administration', 
          year: 'Junior', 
          university: 'UCLA',
          online: false,
          rating: 4.7,
          specialties: ['Business Programs', 'Internships']
        },
        { 
          id: '3', 
          name: 'Elena Rodriguez', 
          major: 'Biology', 
          year: 'Graduate', 
          university: 'UC San Diego',
          online: true,
          rating: 4.8,
          specialties: ['Pre-med', 'Research']
        }
      ]);
    }
  };

  const simulateConnection = () => {
    // Simulate WebSocket connection
    setTimeout(() => setIsConnected(true), 1000);
  };

  const selectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setMessages([
      {
        id: '1',
        sender: 'mentor',
        senderName: mentor.name,
        message: `Hi! I'm ${mentor.name}, a ${mentor.year} ${mentor.major} student at ${mentor.university}. How can I help you with your transfer journey today?`,
        timestamp: Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${mentor.name}&background=6366f1&color=fff`
      }
    ]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedMentor) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: 'You',
      message: newMessage,
      timestamp: Date.now(),
      avatar: 'https://ui-avatars.com/api/?name=You&background=10b981&color=fff'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate mentor response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on my experience with similar situations...",
        "I went through something similar when I was transferring. Here's what I learned...",
        "Let me share some insights that might help you with that...",
        "I recommend checking with your academic advisor, but here's my perspective...",
        "That's definitely manageable! When I was in your position, I found that...",
      ];
      
      const mentorResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        senderName: selectedMentor.name,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now() + 1000,
        avatar: `https://ui-avatars.com/api/?name=${selectedMentor.name}&background=6366f1&color=fff`
      };

      setMessages(prev => [...prev, mentorResponse]);
    }, 1500);
  };

  const MentorCard = ({ mentor, onClick, isSelected }) => (
    <div 
      onClick={() => onClick(mentor)}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? `${darkMode ? 'bg-indigo-800 border-indigo-400' : 'bg-indigo-50 border-indigo-300'}` 
          : `${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={`https://ui-avatars.com/api/?name=${mentor.name}&background=6366f1&color=fff`}
            alt={mentor.name}
            className="w-10 h-10 rounded-full"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
            mentor.online 
              ? 'bg-green-400 border-green-400' 
              : 'bg-gray-400 border-gray-400'
          }`}></div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{mentor.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.major} • {mentor.university}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-yellow-500">★ {mentor.rating}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              mentor.online 
                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
            }`}>
              {mentor.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {mentor.specialties.map((specialty) => (
              <span key={specialty} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300 rounded-full">
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold">💬</span>
        </div>
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Live Mentor Chat</h3>
        <div className={`ml-auto px-3 py-1 rounded-full text-sm ${
          isConnected 
            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' 
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300'
        }`}>
          {isConnected ? '● Connected' : '● Connecting...'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor List */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Available Mentors</h4>
          {mentors.map((mentor) => (
            <MentorCard 
              key={mentor.id}
              mentor={mentor}
              onClick={selectMentor}
              isSelected={selectedMentor?.id === mentor.id}
            />
          ))}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedMentor ? (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex items-center space-x-3`}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedMentor.name}&background=6366f1&color=fff`}
                  alt={selectedMentor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{selectedMentor.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMentor.major} at {selectedMentor.university}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} min-h-[300px] max-h-[400px]`}>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <img src={message.avatar} alt={message.senderName} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? `${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white` 
                            : `${darkMode ? 'bg-gray-600' : 'bg-white'} border`
                        }`}>
                          {message.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t dark:border-gray-600">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className={`flex-1 px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`h-96 flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <p className="text-gray-500 dark:text-gray-400">Select a mentor to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorChat;