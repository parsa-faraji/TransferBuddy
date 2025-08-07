import { useEffect, useState } from 'react';
import SemesterPlanner from './components/SemesterPlanner';
import ProgressTracker from './components/ProgressTracker';
import AIAdvisor from './components/AIAdvisor';
import MentorChat from './components/MentorChat';
import CommunityChat from './components/CommunityChat';
import ClassResources from './components/ClassResources';
import ImageGallery from './components/ImageGallery';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';

function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'planner', 'ai-advisor', 'mentor-chat', 'community', 'resources', 'gallery'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch('/api/majors')
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('✅ Majors fetched:', data);
        setMajors(data.majors);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error fetching majors:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedMajorId = localStorage.getItem('selectedMajorId');
    const savedCollege = localStorage.getItem('selectedCollege');
    const savedTheme = localStorage.getItem('darkMode');
    if (savedMajorId) {
      const major = majors.find((m) => m.id === savedMajorId);
      if (major) setSelectedMajor(major);
    }
    if (savedCollege) setSelectedCollege(savedCollege);
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));
  }, [majors]);

  const handleMajorChange = (e) => {
    const major = majors.find((m) => m.id === e.target.value);
    setSelectedMajor(major);
    localStorage.setItem('selectedMajorId', e.target.value);
    setCompletedCourses([]);
    if (major) {
      showToast(`Selected major: ${major.major}`, 'info');
    }
  };

  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
    localStorage.setItem('selectedCollege', e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', JSON.stringify(!prev));
      return !prev;
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleCourse = (course) => {
    const isCompleting = !completedCourses.includes(course);
    setCompletedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
    
    if (isCompleting) {
      showToast(`🎉 Course ${course} completed!`, 'success');
    } else {
      showToast(`Course ${course} unmarked`, 'info');
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-100 text-gray-800'} min-h-screen p-8 font-sans transition-all`}>
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src="https://media.istockphoto.com/id/177400275/photo/graduation.jpg?s=612x612&w=0&k=20&c=Qwj4o5gjMOt5KgnIGdHAjP3sr98WaSNH5RVl3Ij173s=" 
              alt="Graduation Cap" 
              className="h-12 w-12 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 hover:rotate-12" 
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-300 cursor-default">
            TransferBuddy
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search majors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-64 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 text-sm font-medium rounded-md border shadow bg-white hover:bg-indigo-50 text-gray-700 dark:bg-gray-800 dark:text-white transform hover:scale-105 transition-all duration-300"
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner message="Loading majors..." />
      ) : (
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">🎯 Select a UC Berkeley Major</h2>
          <select
            className="w-full max-w-md mb-6 px-4 py-3 border border-indigo-300 rounded-lg shadow transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
            value={selectedMajor?.id || ''}
            onChange={handleMajorChange}
          >
            <option value="">-- Select Major --</option>
            {majors
              .filter(m => searchTerm === '' || m.major.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((m) => (
                <option key={m.id} value={m.id}>{m.major}</option>
              ))}
          </select>

        <h3 className="text-2xl font-semibold mb-2">🏫 Filter by Community College</h3>
        <select
          className="w-full max-w-sm mb-6 px-4 py-3 border border-indigo-300 rounded-lg shadow transform hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-indigo-500"
          value={selectedCollege}
          onChange={handleCollegeChange}
        >
          <option value="All">All</option>
          <option value="BCC">BCC</option>
          <option value="Laney">Laney</option>
          <option value="Merritt">Merritt</option>
          <option value="CoA">College of Alameda</option>
        </select>
      </section>
      )}

      {selectedMajor && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              📋 Course Overview
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'planner'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              📅 Semester Planner
            </button>
            <button
              onClick={() => setActiveTab('ai-advisor')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'ai-advisor'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              🤖 AI Advisor
            </button>
            <button
              onClick={() => setActiveTab('mentor-chat')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'mentor-chat'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              💬 Live Mentors
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'community'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              👥 Community
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'resources'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              📚 Resources
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`tab-button px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              🖼️ Gallery
            </button>
          </div>
        </div>
      )}

      {selectedMajor && activeTab === 'overview' && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {selectedMajor.major} @ {selectedMajor.school}
          </h3>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ✅ Select Completed Courses
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({completedCourses.length}/{selectedMajor.courses.length})
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedMajor.courses.map((course, index) => (
                <div 
                  key={course.ucbCourse} 
                  className={`course-card p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer animate-slideInUp ${
                    completedCourses.includes(course.ucbCourse)
                      ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => toggleCourse(course.ucbCourse)}
                >
                  <label className="cursor-pointer flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 transition-all"
                      checked={completedCourses.includes(course.ucbCourse)}
                      onChange={() => toggleCourse(course.ucbCourse)}
                    />
                    <div className="flex-1">
                      <div className={`font-medium transition-colors ${
                        completedCourses.includes(course.ucbCourse) 
                          ? 'text-green-800 dark:text-green-300 line-through' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {course.ucbCourse}
                      </div>
                    </div>
                    {completedCourses.includes(course.ucbCourse) && (
                      <div className="text-green-500 text-xl animate-bounce-custom">🎉</div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">📋 Articulated Courses</h4>
            {selectedMajor.courses.map((course) => {
              const equivalents = Object.entries(course.equivalents)
                .filter(([college, eq]) => selectedCollege === 'All' || college === selectedCollege)
                .map(([college, eq]) => eq ? `${college}: ${eq}` : `${college}: No equivalent`);

              return (
                <div key={course.ucbCourse} className="mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-white">{course.ucbCourse}</h5>
                  <ul className="list-disc list-inside ml-4">
                    {equivalents.map((eq, idx) => (
                      <li key={idx} className="text-gray-600 dark:text-gray-300">{eq}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-4">🚀 Transfer Roadmap</h4>
            
            <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round((completedCourses.length / selectedMajor.courses.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out animate-pulse-custom"
                  style={{width: `${(completedCourses.length / selectedMajor.courses.length) * 100}%`}}
                ></div>
              </div>
              <div className="text-center">
                <span className="font-semibold text-lg">
                  {completedCourses.length}/{selectedMajor.courses.length} courses completed
                </span>
                {completedCourses.length === selectedMajor.courses.length && (
                  <div className="mt-2 text-2xl animate-bounce-custom">🎓 Ready to Transfer! 🎉</div>
                )}
              </div>
            </div>

            {selectedMajor.courses.filter((course) => !completedCourses.includes(course.ucbCourse)).length > 0 && (
              <div>
                <h5 className="font-medium mb-3 text-yellow-700 dark:text-yellow-300">Remaining Courses:</h5>
                <div className="space-y-2">
                  {selectedMajor.courses
                    .filter((course) => !completedCourses.includes(course.ucbCourse))
                    .map((course, index) => (
                      <div key={course.ucbCourse} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md animate-slideInUp" style={{animationDelay: `${index * 0.1}s`}}>
                        <span className="text-yellow-500">📝</span>
                        <span className="text-yellow-700 dark:text-yellow-300 font-medium">{course.ucbCourse}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {selectedMajor && activeTab === 'planner' && (
        <div className="space-y-6">
          <ProgressTracker selectedMajor={selectedMajor} darkMode={darkMode} />
          <SemesterPlanner 
            selectedMajor={selectedMajor} 
            completedCourses={completedCourses}
            setCompletedCourses={setCompletedCourses}
            darkMode={darkMode}
          />
        </div>
      )}

      {selectedMajor && activeTab === 'ai-advisor' && (
        <AIAdvisor 
          selectedMajor={selectedMajor}
          completedCourses={completedCourses}
          darkMode={darkMode}
        />
      )}

      {selectedMajor && activeTab === 'mentor-chat' && (
        <MentorChat darkMode={darkMode} />
      )}

      {selectedMajor && activeTab === 'community' && (
        <CommunityChat selectedMajor={selectedMajor} darkMode={darkMode} />
      )}

      {selectedMajor && activeTab === 'resources' && (
        <ClassResources selectedMajor={selectedMajor} darkMode={darkMode} />
      )}

      {activeTab === 'gallery' && (
        <ImageGallery darkMode={darkMode} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
