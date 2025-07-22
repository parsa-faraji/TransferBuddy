const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('TransferBuddy API is running 🚀');
});

app.get('/api/majors', (req, res) => {
  res.json([
    {
      id: 'cs-ucb',
      major: 'Computer Science',
      school: 'UC Berkeley',
      requiredCourses: ['CS 61A', 'CS 61B', 'Math 1A', 'Math 1B', 'Math 54'],
    },
    {
      id: 'ds-ucd',
      major: 'Data Science',
      school: 'UC Davis',
      requiredCourses: ['Math 1A', 'Math 1B', 'Stats 2', 'CS 10'],
    },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

