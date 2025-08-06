import { useState, useEffect } from 'react';

const ProgressTracker = ({ selectedMajor, darkMode }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedMajor) {
      setProgress(null);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/progress/${selectedMajor.id}`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedMajor]);

  if (!selectedMajor || loading) {
    return (
      <div className={`p-6 rounded-xl shadow-lg border ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) return null;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg border ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
        🎯 Transfer Progress
      </h3>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Course Completion</span>
          <span className={`text-sm font-bold ${getProgressColor(progress.completionPercentage)}`}>
            {progress.scheduledCount}/{progress.totalCourses} courses ({progress.completionPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(progress.completionPercentage)}`}
            style={{ width: `${progress.completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Semester Breakdown */}
      {progress.semesterBreakdown.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">📅 Semester Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progress.semesterBreakdown.map((semester, index) => (
              <div key={index} className={`p-3 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <h5 className="font-medium text-sm">{semester.name}</h5>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>{semester.courseCount} courses</span>
                  <span>{semester.totalUnits} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Courses */}
      {progress.remainingCourses.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3 text-yellow-700 dark:text-yellow-400">
            ⚠️ Unscheduled Courses ({progress.remainingCourses.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {progress.remainingCourses.slice(0, 6).map(course => (
              <span key={course} className={`px-2 py-1 text-xs rounded ${
                darkMode 
                  ? 'bg-yellow-900 text-yellow-200' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course}
              </span>
            ))}
            {progress.remainingCourses.length > 6 && (
              <span className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{progress.remainingCourses.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {progress.completionPercentage === 100 && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-200">
                Congratulations!
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                You've scheduled all required courses for your transfer to UC Berkeley!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;