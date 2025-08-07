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

// AI Advisor endpoint
app.post('/api/ai-advice', (req, res) => {
  const { majorId, completedCourses, message, type } = req.body;
  
  // Mock AI responses for demonstration
  const responses = {
    initial: [
      "Welcome! I'm your AI academic advisor. Based on your major selection, I can help you prioritize your remaining courses and optimize your transfer timeline.",
      "Great choice on your major! I see you've completed some courses already. Let me help you plan the most efficient path to transfer.",
      "Hello! I'm here to provide personalized academic guidance based on your progress and goals. What would you like to know about your transfer journey?"
    ],
    chat: [
      "That's an excellent question! Based on similar students' experiences, I'd recommend focusing on prerequisite courses first.",
      "I can help with that! Many successful transfer students have found that taking these courses in sequence works best.",
      "Great question! Here's my analysis of your situation and some actionable recommendations.",
      "Based on your current progress, I'd suggest prioritizing courses that are required by multiple UC campuses.",
      "That's a smart approach! Let me share some insights from successful transfer patterns I've observed."
    ]
  };

  const advice = type === 'initial' 
    ? responses.initial[Math.floor(Math.random() * responses.initial.length)]
    : responses.chat[Math.floor(Math.random() * responses.chat.length)];

  res.json({ advice });
});

// Mentors endpoint
app.get('/api/mentors', (req, res) => {
  const mentors = [
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
  ];
  
  res.json({ mentors });
});

// Community Chat endpoints
app.get('/api/community/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  
  const mockMessages = [
    {
      id: '1',
      user: { 
        name: 'Alex Rivera', 
        avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=10b981&color=fff', 
        major: 'Computer Science' 
      },
      message: 'Has anyone taken CS 61A at Berkeley? How was the transition from community college?',
      timestamp: Date.now() - 3600000,
      likes: 5,
      replies: 3
    },
    {
      id: '2',
      user: { 
        name: 'Maya Patel', 
        avatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=f59e0b&color=fff', 
        major: 'Biology' 
      },
      message: 'The key is to review discrete math and practice Python before starting. The jump is manageable if you prepare!',
      timestamp: Date.now() - 3000000,
      likes: 12,
      replies: 1
    }
  ];
  
  res.json({ messages: mockMessages });
});

app.post('/api/community/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  const message = req.body;
  
  // In a real app, save to database
  res.json({ success: true, message: 'Message posted successfully' });
});

// Class Resources endpoint
app.get('/api/resources/:majorId', (req, res) => {
  const { majorId } = req.params;
  
  const mockResources = [
    {
      id: '1',
      title: 'CS 61A: Structure and Interpretation of Computer Programs',
      description: 'Complete study guide with practice problems and solutions',
      type: 'study-guide',
      course: 'CS 61A',
      downloads: 1523,
      rating: 4.8,
      author: 'Berkeley Study Group',
      fileType: 'pdf',
      size: '2.4 MB',
      tags: ['python', 'recursion', 'higher-order-functions']
    },
    {
      id: '2',
      title: 'Calculus II Video Lecture Series',
      description: 'In-depth video explanations of integration techniques and series',
      type: 'video',
      course: 'MATH 1B',
      downloads: 892,
      rating: 4.9,
      author: 'Math Tutoring Center',
      fileType: 'video',
      duration: '12 hours',
      tags: ['integration', 'series', 'applications']
    },
    {
      id: '3',
      title: 'Physics 7A Lab Reports & Data Analysis',
      description: 'Sample lab reports with proper data analysis and error calculations',
      type: 'lab-report',
      course: 'PHYSICS 7A',
      downloads: 634,
      rating: 4.6,
      author: 'Physics Study Circle',
      fileType: 'docx',
      size: '1.8 MB',
      tags: ['mechanics', 'data-analysis', 'error-calculation']
    }
  ];
  
  res.json({ resources: mockResources });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
