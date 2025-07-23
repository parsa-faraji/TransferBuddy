import { useEffect, useState } from 'react';

function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('/api/ucb-majors')
      .then((res) => res.json())
      .then((data) => setMajors(data))
      .catch((err) => console.error('Error fetching majors:', err));
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

  return (
    <div className={
      `${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-100 text-gray-800'} min-h-screen p-8 font-sans transition-all`
    }>
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
          className="w-full max-w-md mb-6 px-4 py-3 border border-indigo-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={selectedMajor?.id || ''}
          onChange={handleMajorChange}
        >
          <option value="">-- Select Major --</option>
          {majors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.major}
            </option>
          ))}
        </select>

        <h3 className="text-2xl font-semibold mb-2">🏫 Filter by Community College</h3>
        <select
          className="w-full max-w-sm mb-6 px-4 py-3 border border-indigo-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={selectedCollege}
          onChange={handleCollegeChange}
        >
          <option value="All">All</option>
          <option value="BCC">BCC</option>
          <option value="Foothill">Foothill</option>
          <option value="De Anza">De Anza</option>
        </select>
      </section>

      {selectedMajor && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {selectedMajor.major} @ {selectedMajor.school}
          </h3>
          <div className="space-y-6">
            {selectedMajor.courses.map((course) => {
              const filteredEquivalents =
                selectedCollege === 'All'
                  ? course.equivalents
                  : course.equivalents.filter((eq) => eq.startsWith(selectedCollege));

              return (
                <div key={course.ucbCourse} className="transition hover:scale-[1.01]">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-white mb-1">
                    {course.ucbCourse}
                  </h4>
                  <ul className="list-disc list-inside ml-4">
                    {filteredEquivalents.length > 0 ? (
                      filteredEquivalents.map((eq) => (
                        <li key={eq} className="text-gray-600 dark:text-gray-300">{eq}</li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">No articulated course found</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
