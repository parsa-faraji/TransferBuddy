import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

const CourseBank = ({ courses, scheduledCourses, onCourseAdd, semesters, darkMode }) => {
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'available', 'scheduled'

  const { setNodeRef, isOver } = useDroppable({
    id: 'course-bank',
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.ucbCourse.toLowerCase().includes(searchTerm.toLowerCase());
    const isScheduled = scheduledCourses.has(course.ucbCourse);
    
    if (filterType === 'scheduled') return matchesSearch && isScheduled;
    if (filterType === 'available') return matchesSearch && !isScheduled;
    return matchesSearch;
  });

  const handleQuickAdd = (course) => {
    if (selectedSemester && !scheduledCourses.has(course.ucbCourse)) {
      onCourseAdd(course, selectedSemester);
    }
  };

  const getCourseTypeCount = (type) => {
    switch (type) {
      case 'available':
        return courses.filter(c => !scheduledCourses.has(c.ucbCourse)).length;
      case 'scheduled':
        return scheduledCourses.size;
      default:
        return courses.length;
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${
      darkMode 
        ? 'bg-gray-800 border-gray-600' 
        : 'bg-white border-gray-300'
    } shadow-md`}>
      <h3 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-400">
        📚 Course Bank
      </h3>
      
      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-3 py-2 rounded border text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
        
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All', count: getCourseTypeCount('all') },
            { key: 'available', label: 'Available', count: getCourseTypeCount('available') },
            { key: 'scheduled', label: 'Scheduled', count: getCourseTypeCount('scheduled') }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filterType === key
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Section */}
      <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded border">
        <p className="text-xs font-medium mb-2">Quick Add to Semester:</p>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className={`w-full text-xs p-1 rounded border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          }`}
        >
          {semesters.map(semester => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </select>
      </div>

      {/* Courses List */}
      <div
        ref={setNodeRef}
        className={`space-y-2 max-h-96 overflow-y-auto ${
          isOver ? 'bg-indigo-50 dark:bg-indigo-900/10 rounded p-2' : ''
        }`}
      >
        {filteredCourses.map((course) => {
          const isScheduled = scheduledCourses.has(course.ucbCourse);
          const hasEquivalents = Object.values(course.equivalents).some(eq => eq);
          
          return (
            <div
              key={course.ucbCourse}
              className={`p-3 rounded border-2 cursor-pointer transition-all ${
                isScheduled
                  ? darkMode
                    ? 'bg-gray-700 border-gray-600 opacity-60'
                    : 'bg-gray-100 border-gray-300 opacity-60'
                  : darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-indigo-500'
                    : 'bg-white border-gray-300 hover:border-indigo-400'
              }`}
              onClick={() => !isScheduled && handleQuickAdd(course)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold flex items-center">
                    {course.ucbCourse}
                    {isScheduled && (
                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1 rounded">
                        ✓
                      </span>
                    )}
                  </h4>
                  <p className="text-xs opacity-70 mt-1">
                    {hasEquivalents ? 'Available at community colleges' : 'Take at UC Berkeley'}
                  </p>
                </div>
                
                {!isScheduled && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(course);
                    }}
                    className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    disabled={!selectedSemester}
                  >
                    Add
                  </button>
                )}
              </div>
              
              {/* Show equivalents preview */}
              {hasEquivalents && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs opacity-60">
                    {Object.entries(course.equivalents)
                      .filter(([, eq]) => eq)
                      .slice(0, 2)
                      .map(([college, eq]) => `${college}: ${eq}`)
                      .join(', ')}
                    {Object.values(course.equivalents).filter(eq => eq).length > 2 && '...'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No courses found</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 Tip: Drag courses to semesters or use quick add
        </p>
      </div>
    </div>
  );
};

export default CourseBank;