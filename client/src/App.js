import { useEffect, useState } from 'react';
import SemesterPlanner from './components/SemesterPlanner';
import ProgressTracker from './components/ProgressTracker';

function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'planner'

  useEffect(() => {
    fetch('/api/majors')
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('✅ Majors fetched:', data);
        setMajors(data.majors);
      })
      .catch((err) => {
        console.error('❌ Error fetching majors:', err);
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

  const toggleCourse = (course) => {
    setCompletedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-100 text-gray-800'} min-h-screen p-8 font-sans transition-all`}>
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="https://media.istockphoto.com/id/177400275/photo/graduation.jpg?s=612x612&w=0&k=20&c=Qwj4o5gjMOt5KgnIGdHAjP3sr98WaSNH5RVl3Ij173s=" alt="Graduation Cap" className="h-10 w-10" />
          <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow">TransferBuddy</h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 text-sm font-medium rounded-md border shadow bg-white hover:bg-indigo-50 text-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">🎯 Select a UC Berkeley Major</h2>
        <select
          className="w-full max-w-md mb-6 px-4 py-3 border border-indigo-300 rounded-lg shadow"
          value={selectedMajor?.id || ''}
          onChange={handleMajorChange}
        >
          <option value="">-- Select Major --</option>
          {majors.map((m) => (
            <option key={m.id} value={m.id}>{m.major}</option>
          ))}
        </select>

        <h3 className="text-2xl font-semibold mb-2">🏫 Filter by Community College</h3>
        <select
          className="w-full max-w-sm mb-6 px-4 py-3 border border-indigo-300 rounded-lg shadow"
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

      {selectedMajor && (
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              📋 Course Overview
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'planner'
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              📅 Semester Planner
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
            <h4 className="text-lg font-semibold mb-2">✅ Select Completed Courses</h4>
            {selectedMajor.courses.map((course) => (
              <div key={course.ucbCourse} className="mb-1">
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={completedCourses.includes(course.ucbCourse)}
                    onChange={() => toggleCourse(course.ucbCourse)}
                  />
                  {course.ucbCourse}
                </label>
              </div>
            ))}
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
            <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">🚀 Transfer Roadmap</h4>
            {selectedMajor.courses
              .filter((course) => !completedCourses.includes(course.ucbCourse))
              .map((course) => (
                <p key={course.ucbCourse} className="text-yellow-700 dark:text-yellow-300">
                  ➤ You still need to complete: {course.ucbCourse}
                </p>
              ))}
            <p className="mt-4 font-semibold">
              ✅ Progress: {completedCourses.length}/{selectedMajor.courses.length} courses completed.
            </p>
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
    </div>
  );
}

export default App;
