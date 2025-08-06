const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get('/api/majors', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'ucb_course_equivalents.json');

  // Ensure the file exists before reading
  fs.readFile(dataPath, 'utf-8', (err, fileData) => {
    if (err) {
      console.error("❌ Error reading majors file:", err);
      return res.status(500).json({ error: 'Failed to load majors data' });
    }

    try {
      const json = JSON.parse(fileData);
      if (!json || !json.majors) {
        return res.status(500).json({ error: 'Invalid majors format' });
      }
      res.json({ majors: json.majors });
    } catch (parseError) {
      console.error("❌ JSON parsing error:", parseError);
      res.status(500).json({ error: 'Invalid JSON format in majors file' });
    }
  });
});

// In-memory storage for semester plans (in production, use a database)
let semesterPlans = {};

// Get semester plan for a major
app.get('/api/semester-plan/:majorId', (req, res) => {
  const { majorId } = req.params;
  const plan = semesterPlans[majorId] || {
    semesters: [
      { id: 'semester-1', name: 'Fall 2024', courses: [] },
      { id: 'semester-2', name: 'Spring 2025', courses: [] },
      { id: 'semester-3', name: 'Fall 2025', courses: [] },
      { id: 'semester-4', name: 'Spring 2026', courses: [] },
    ]
  };
  res.json(plan);
});

// Save semester plan for a major
app.post('/api/semester-plan/:majorId', (req, res) => {
  const { majorId } = req.params;
  const { semesters } = req.body;
  
  if (!semesters || !Array.isArray(semesters)) {
    return res.status(400).json({ error: 'Invalid semester plan data' });
  }
  
  semesterPlans[majorId] = { semesters, updatedAt: new Date().toISOString() };
  res.json({ success: true, message: 'Semester plan saved successfully' });
});

// Get progress analytics for a major
app.get('/api/progress/:majorId', (req, res) => {
  const { majorId } = req.params;
  
  const dataPath = path.join(__dirname, 'data', 'ucb_course_equivalents.json');
  
  fs.readFile(dataPath, 'utf-8', (err, fileData) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load major data' });
    }
    
    try {
      const json = JSON.parse(fileData);
      const major = json.majors.find(m => m.id === majorId);
      
      if (!major) {
        return res.status(404).json({ error: 'Major not found' });
      }
      
      const plan = semesterPlans[majorId];
      const scheduledCourses = new Set();
      
      if (plan) {
        plan.semesters.forEach(semester => {
          semester.courses.forEach(course => {
            scheduledCourses.add(course.ucbCourse);
          });
        });
      }
      
      const totalCourses = major.courses.length;
      const scheduledCount = scheduledCourses.size;
      const remainingCourses = major.courses.filter(course => 
        !scheduledCourses.has(course.ucbCourse)
      );
      
      res.json({
        totalCourses,
        scheduledCount,
        completionPercentage: Math.round((scheduledCount / totalCourses) * 100),
        remainingCourses: remainingCourses.map(c => c.ucbCourse),
        semesterBreakdown: plan ? plan.semesters.map(s => ({
          name: s.name,
          courseCount: s.courses.length,
          totalUnits: s.courses.reduce((sum, c) => sum + (c.units || 4), 0)
        })) : []
      });
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse major data' });
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
