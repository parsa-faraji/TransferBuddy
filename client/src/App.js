import { useEffect, useState } from 'react';

function App() {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/majors')
      .then((res) => {
        console.log("Raw response:", res);
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        console.log("Majors fetched:", data);
        setMajors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching majors:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎓 TransferBuddy</h1>
      <h2>Select a Major & View Requirements</h2>

      {loading && <p>Loading majors...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {majors.map((major) => (
        <div key={major.id} style={{ marginTop: '1rem' }}>
          <h3>{major.major} @ {major.school}</h3>
          <ul>
            {major.requiredCourses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
