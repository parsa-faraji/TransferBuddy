import { useState, useEffect } from 'react';

const ClassResources = ({ selectedMajor, darkMode }) => {
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMajor) {
      loadResources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMajor]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resources/${selectedMajor.id}`);
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      // Mock resources for demonstration
      setResources([
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
        },
        {
          id: '4',
          title: 'Organic Chemistry Reaction Mechanisms',
          description: 'Interactive diagrams and practice problems for reaction mechanisms',
          type: 'interactive',
          course: 'CHEM 3A',
          downloads: 1156,
          rating: 4.7,
          author: 'Chemistry Tutors',
          fileType: 'html',
          size: '5.2 MB',
          tags: ['mechanisms', 'organic', 'reactions']
        },
        {
          id: '5',
          title: 'Linear Algebra Cheat Sheet',
          description: 'Comprehensive cheat sheet with formulas and examples',
          type: 'reference',
          course: 'MATH 54',
          downloads: 2341,
          rating: 4.9,
          author: 'Math Department',
          fileType: 'pdf',
          size: '0.8 MB',
          tags: ['matrices', 'eigenvalues', 'vector-spaces']
        },
        {
          id: '6',
          title: 'Statistics Practice Exams with Solutions',
          description: 'Past midterms and finals with detailed solutions',
          type: 'practice-exam',
          course: 'STAT 20',
          downloads: 1876,
          rating: 4.8,
          author: 'Statistics Study Group',
          fileType: 'pdf',
          size: '3.7 MB',
          tags: ['hypothesis-testing', 'regression', 'probability']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resourceTypes = [
    { value: 'all', label: 'All Resources', icon: '📚' },
    { value: 'study-guide', label: 'Study Guides', icon: '📖' },
    { value: 'video', label: 'Video Lectures', icon: '🎥' },
    { value: 'practice-exam', label: 'Practice Exams', icon: '📝' },
    { value: 'lab-report', label: 'Lab Reports', icon: '🧪' },
    { value: 'interactive', label: 'Interactive', icon: '💻' },
    { value: 'reference', label: 'Reference', icon: '📋' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getFileIcon = (fileType) => {
    const icons = {
      'pdf': '📄',
      'video': '🎥',
      'docx': '📝',
      'html': '🌐',
      'pptx': '📊'
    };
    return icons[fileType] || '📄';
  };

  const ResourceCard = ({ resource }) => (
    <div className={`p-6 rounded-lg border transition-all hover:shadow-lg ${
      darkMode 
        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
        : 'bg-white border-gray-200 hover:bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getFileIcon(resource.fileType)}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}>
            {resource.course}
          </span>
        </div>
        <div className="text-right">
          <div className="flex items-center text-yellow-500 mb-1">
            <span>⭐</span>
            <span className="text-sm ml-1">{resource.rating}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {resource.downloads} downloads
          </div>
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        {resource.title}
      </h4>
      
      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
        {resource.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.map((tag) => (
          <span key={tag} className={`px-2 py-1 text-xs rounded ${
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div>By {resource.author}</div>
          <div>{resource.fileType.toUpperCase()} • {resource.size || resource.duration}</div>
        </div>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            darkMode 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}>
            Download
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}>
            ❤️
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold">📚</span>
        </div>
        <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Class Resources</h3>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources, courses, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type.value
                    ? `${darkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'}`
                    : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {filteredResources.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Available Resources</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {resources.reduce((sum, r) => sum + r.downloads, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length || 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {new Set(resources.map(r => r.course)).size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Courses Covered</div>
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading resources...</div>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h4 className="text-xl font-semibold mb-2">No resources found</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      {/* Upload Section */}
      <div className={`mt-8 p-6 border-2 border-dashed rounded-lg text-center ${
        darkMode 
          ? 'border-gray-600 bg-gray-700' 
          : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="text-4xl mb-4">📤</div>
        <h4 className="text-lg font-semibold mb-2">Share Your Resources</h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Help fellow students by sharing your study materials, notes, and guides
        </p>
        <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          darkMode 
            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        }`}>
          Upload Resource
        </button>
      </div>
    </div>
  );
};

export default ClassResources;