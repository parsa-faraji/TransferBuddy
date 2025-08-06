import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CourseCard = ({ course, isDragging = false, darkMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getPrerequisites = () => {
    // Simple prerequisite mapping - in a real app this would come from the data
    const prereqMap = {
      'CS 61B': ['CS 61A'],
      'CS 70': ['Math 1A', 'Math 1B'],
      'Math 1B': ['Math 1A'],
      'Math 54': ['Math 1A', 'Math 1B'],
      'Physics 7A': ['Math 1A'],
      'Physics 7B': ['Physics 7A', 'Math 1B'],
    };
    
    return prereqMap[course.ucbCourse] || [];
  };

  const getDifficultyColor = () => {
    // Simple difficulty assessment based on course
    const hardCourses = ['CS 70', 'Math 54', 'Physics 7A', 'Physics 7B'];
    const mediumCourses = ['CS 61B', 'Math 1B'];
    
    if (hardCourses.includes(course.ucbCourse)) {
      return 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20';
    } else if (mediumCourses.includes(course.ucbCourse)) {
      return 'border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20';
    }
    return 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20';
  };

  const prerequisites = getPrerequisites();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all
        ${isDragging ? 'shadow-lg scale-105' : 'shadow-sm hover:shadow-md'}
        ${getDifficultyColor()}
        ${darkMode ? 'text-white' : 'text-gray-800'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{course.ucbCourse}</h4>
          <p className="text-xs opacity-75">{course.units || 4} units</p>
          
          {prerequisites.length > 0 && (
            <div className="mt-1">
              <p className="text-xs opacity-60">
                Prerequisites: {prerequisites.join(', ')}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>
      
      {/* Course equivalents preview */}
      {course.equivalents && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <p className="text-xs opacity-60">
            Available at: {Object.entries(course.equivalents)
              .filter(([, eq]) => eq)
              .map(([college]) => college)
              .join(', ') || 'No equivalents'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseCard;