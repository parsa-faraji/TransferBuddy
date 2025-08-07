import { useState, useEffect, useRef } from 'react';

const CommunityChat = ({ selectedMajor, darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const channels = [
    { id: 'general', name: '# General', description: 'General transfer discussions' },
    { id: 'course-planning', name: '# Course Planning', description: 'Help with course selection' },
    { id: 'application-help', name: '# Application Help', description: 'UC application assistance' },
    { id: 'success-stories', name: '# Success Stories', description: 'Share your transfer journey' },
    { id: 'study-groups', name: '# Study Groups', description: 'Find study partners' },
    { id: 'major-specific', name: `# ${selectedMajor?.major || 'Major'}-Specific`, description: 'Major-specific discussions' }
  ];

  useEffect(() => {
    loadChannelMessages(activeChannel);
    loadOnlineUsers();
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChannelMessages = async (channelId) => {
    try {
      const response = await fetch(`/api/community/${channelId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Mock messages for demonstration
      setMessages([
        {
          id: '1',
          user: { name: 'Alex Rivera', avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=10b981&color=fff', major: 'Computer Science' },
          message: 'Has anyone taken CS 61A at Berkeley? How was the transition from community college?',
          timestamp: Date.now() - 3600000,
          likes: 5,
          replies: 3
        },
        {
          id: '2',
          user: { name: 'Maya Patel', avatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=f59e0b&color=fff', major: 'Biology' },
          message: 'The key is to review discrete math and practice Python before starting. The jump is manageable if you prepare!',
          timestamp: Date.now() - 3000000,
          likes: 12,
          replies: 1
        },
        {
          id: '3',
          user: { name: 'Jordan Kim', avatar: 'https://ui-avatars.com/api/?name=Jordan+Kim&background=8b5cf6&color=fff', major: 'Business' },
          message: 'Just got accepted to UC Berkeley for Business! Happy to answer any questions about the application process 🎉',
          timestamp: Date.now() - 1800000,
          likes: 25,
          replies: 8
        }
      ]);
    }
  };

  const loadOnlineUsers = () => {
    // Mock online users
    setOnlineUsers([
      { name: 'Alex Rivera', avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=10b981&color=fff', status: 'Studying for finals' },
      { name: 'Maya Patel', avatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=f59e0b&color=fff', status: 'Transfer planning' },
      { name: 'Jordan Kim', avatar: 'https://ui-avatars.com/api/?name=Jordan+Kim&background=8b5cf6&color=fff', status: 'Recently transferred' },
      { name: 'Sam Chen', avatar: 'https://ui-avatars.com/api/?name=Sam+Chen&background=ef4444&color=fff', status: 'Application season' },
      { name: 'Riley Johnson', avatar: 'https://ui-avatars.com/api/?name=Riley+Johnson&background=06b6d4&color=fff', status: 'Course selection' }
    ]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: { 
        name: 'You', 
        avatar: 'https://ui-avatars.com/api/?name=You&background=6366f1&color=fff',
        major: selectedMajor?.major || 'Transfer Student'
      },
      message: newMessage,
      timestamp: Date.now(),
      likes: 0,
      replies: 0
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      await fetch(`/api/community/${activeChannel}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const likeMessage = async (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold">👥</span>
        </div>
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Community Chat</h3>
        <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {onlineUsers.length} members online
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Channels</h4>
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeChannel === channel.id
                  ? `${darkMode ? 'bg-green-800 text-green-300' : 'bg-green-50 text-green-700'} border-l-4 border-green-500`
                  : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} text-gray-600 dark:text-gray-400`
              }`}
            >
              <div className="font-medium">{channel.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{channel.description}</div>
            </button>
          ))}

          {/* Online Users */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Online Now</h4>
            <div className="space-y-2">
              {onlineUsers.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Channel Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h4 className="font-semibold text-lg">
              {channels.find(c => c.id === activeChannel)?.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {channels.find(c => c.id === activeChannel)?.description}
            </p>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} min-h-[400px] max-h-[500px]`}>
            {messages.map((message) => (
              <div key={message.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} border dark:border-gray-500`}>
                <div className="flex items-start space-x-3">
                  <img src={message.user.avatar} alt={message.user.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold">{message.user.name}</h5>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 rounded-full">
                        {message.user.major}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{message.message}</p>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => likeMessage(message.id)}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <span>❤️</span>
                        <span>{message.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                        <span>💬</span>
                        <span>{message.replies}</span>
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        Share
                      </button>
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
                placeholder={`Message ${channels.find(c => c.id === activeChannel)?.name}`}
                className={`flex-1 px-4 py-3 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;