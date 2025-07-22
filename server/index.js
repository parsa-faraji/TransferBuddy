const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Majors data moved outside the route for clarity
const majors = [
  {
    id: 'cs-ucb',
    major: 'Computer Science',
    school: 'UC Berkeley',
    courses: [
      { ucbCourse: 'CS 61A', equivalents: ['De Anza: CIS 22A', 'Foothill: CS 1A', 'BCC: CIS 5'] },
      { ucbCourse: 'CS 61B', equivalents: ['De Anza: CIS 22B', 'Foothill: CS 1B'] },
      { ucbCourse: 'CS 70', equivalents: [] },
      { ucbCourse: 'Math 1A', equivalents: ['Foothill: MATH 1A', 'BCC: Math 3A'] },
      { ucbCourse: 'Math 1B', equivalents: ['Foothill: MATH 1B', 'BCC: Math 3B'] }
    ]
  },
  {
    id: 'ds-ucb',
    major: 'Data Science',
    school: 'UC Berkeley',
    courses: [
      { ucbCourse: 'Data C8', equivalents: ['BCC: CIS 26 + Math 13', 'De Anza: CIS 41A + Math 1'] },
      { ucbCourse: 'Math 10A', equivalents: ['BCC: Math 13'] },
      { ucbCourse: 'STAT 20', equivalents: [] }
    ]
  },
  {
    id: 'bus-ucb',
    major: 'Business Administration',
    school: 'UC Berkeley',
    courses: [
      { ucbCourse: 'UGBA 10', equivalents: ['BCC: BUS 10', 'De Anza: BUS 10'] },
      { ucbCourse: 'Econ 1', equivalents: ['BCC: ECON 1', 'De Anza: ECON 1A'] },
      { ucbCourse: 'Math 16A', equivalents: ['BCC: Math 16A'] }
    ]
  },
  {
    id: 'mcb-ucb',
    major: 'Molecular & Cell Biology',
    school: 'UC Berkeley',
    courses: [
      { ucbCourse: 'Bio 1A', equivalents: ['BCC: BIOL 1A', 'De Anza: BIOL 6A'] },
      { ucbCourse: 'Bio 1B', equivalents: [] },
      { ucbCourse: 'Chem 1A', equivalents: ['BCC: CHEM 1A', 'Foothill: CHEM 1A'] },
      { ucbCourse: 'Chem 3A', equivalents: [] }
    ]
  },
  {
    id: 'mech-eng-ucb',
    major: 'Mechanical Engineering',
    school: 'UC Berkeley',
    courses: [
      { ucbCourse: 'Physics 7A', equivalents: ['BCC: PHYS 4A', 'De Anza: PHYS 4A'] },
      { ucbCourse: 'Physics 7B', equivalents: ['BCC: PHYS 4B'] },
      { ucbCourse: 'Engin 7', equivalents: ['De Anza: ENGR 37', 'Foothill: ENGR 50'] },
      { ucbCourse: 'Math 53', equivalents: ['BCC: Math 3E'] },
      { ucbCourse: 'Math 54', equivalents: [] }
    ]
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.status(200).send('TransferBuddy API is running 🚀');
});

app.get('/api/ucb-majors', (req, res) => {
  try {
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch majors.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
