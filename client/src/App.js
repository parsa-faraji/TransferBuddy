import { useEffect, useState } from 'react';

function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('All');

  useEffect(() => {
    fetch('/api/ucb-majors')
      .then((res) => res.json())
      .then((data) => setMajors(data))
      .catch((err) => console.error('Error fetching majors:', err));
  }, []);

  // Save selected major and college to local storage
  useEffect(() => {
    const savedMajorId = localStorage.getItem('selectedMajorId');
    const savedCollege = localStorage.getItem('selectedCollege');
    if (savedMajorId) {
      const major = majors.find((m) => m.id === savedMajorId);
      if (major) setSelectedMajor(major);
    }
    if (savedCollege) setSelectedCollege(savedCollege);
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

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎓 TransferBuddy</h1>
      <h2>Select a UC Berkeley Major</h2>

      <select value={selectedMajor?.id || ''} onChange={handleMajorChange}>
        <option value="">-- Select Major --</option>
        {majors.map((m) => (
          <option key={m.id} value={m.id}>
            {m.major}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: '1rem' }}>Filter by Community College</h3>
      <select value={selectedCollege} onChange={handleCollegeChange}>
        <option value="All">All</option>
        <option value="BCC">BCC</option>
        <option value="Foothill">Foothill</option>
        <option value="De Anza">De Anza</option>
      </select>

      {selectedMajor && (
        <div style={{ marginTop: '2rem' }}>
          <h3>{selectedMajor.major} @ {selectedMajor.school}</h3>
          {selectedMajor.courses.map((course) => {
            const filteredEquivalents = selectedCollege === 'All'
              ? course.equivalents
              : course.equivalents.filter((eq) => eq.startsWith(selectedCollege));

            return (
              <div key={course.ucbCourse} style={{ marginBottom: '1rem' }}>
                <strong>{course.ucbCourse}</strong>
                <ul>
                  {filteredEquivalents.length > 0 ? (
                    filteredEquivalents.map((eq) => (
                      <li key={eq}>{eq}</li>
                    ))
                  ) : (
                    <li style={{ color: 'gray' }}>No articulated course found</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
