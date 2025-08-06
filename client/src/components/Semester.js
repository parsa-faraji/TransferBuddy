import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CourseCard from './CourseCard';

const Semester = ({ semester, onRemove, onNameChange, canRemove, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(semester.name);

  const { setNodeRef, isOver } = useDroppable({
    id: semester.id,
  });

  const handleNameSubmit = () => {
    onNameChange(semester.id, tempName);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setTempName(semester.name);
      setIsEditing(false);
    }
  };

  const getTotalUnits = () => {
    return semester.courses.reduce((total, course) => total + (course.units || 4), 0);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        p-4 rounded-lg border-2 transition-all duration-200 min-h-[300px]
        ${isOver 
          ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        }
        ${darkMode ? 'shadow-lg' : 'shadow-md'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyPress}
              className="text-lg font-semibold bg-transparent border-b-2 border-indigo-400 focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {semester.name}
            </h3>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {semester.courses.length} courses • {getTotalUnits()} units
          </p>
        </div>
        
        {canRemove && (
          <button
            onClick={() => onRemove(semester.id)}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
            title="Remove semester"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <SortableContext items={semester.courses.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {semester.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              darkMode={darkMode}
            />
          ))}
          
          {semester.courses.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">Drop courses here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Semester;