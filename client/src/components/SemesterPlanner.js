import { useState, useEffect } from 'react';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import Semester from './Semester';
import CourseCard from './CourseCard';
import CourseBank from './CourseBank';

const SemesterPlanner = ({ selectedMajor, completedCourses, setCompletedCourses, darkMode }) => {
  const [semesters, setSemesters] = useState([
    { id: 'semester-1', name: 'Fall 2024', courses: [] },
    { id: 'semester-2', name: 'Spring 2025', courses: [] },
    { id: 'semester-3', name: 'Fall 2025', courses: [] },
    { id: 'semester-4', name: 'Spring 2026', courses: [] },
  ]);

  const [activeId, setActiveId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'

  // Load semester plan when major changes
  useEffect(() => {
    if (!selectedMajor) return;

    const loadSemesterPlan = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/semester-plan/${selectedMajor.id}`);
        if (response.ok) {
          const data = await response.json();
          setSemesters(data.semesters);
        }
      } catch (error) {
        console.error('Failed to load semester plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSemesterPlan();
  }, [selectedMajor]);

  // Auto-save semester plan when it changes
  useEffect(() => {
    if (!selectedMajor || isLoading) return;

    const saveSemesterPlan = async () => {
      setSaveStatus('saving');
      try {
        const response = await fetch(`/api/semester-plan/${selectedMajor.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ semesters }),
        });
        
        if (response.ok) {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(''), 2000);
        } else {
          setSaveStatus('error');
        }
      } catch (error) {
        console.error('Failed to save semester plan:', error);
        setSaveStatus('error');
      }
    };

    const timeoutId = setTimeout(saveSemesterPlan, 1000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [semesters, selectedMajor, isLoading]);

  const addSemester = () => {
    const newSemester = {
      id: `semester-${uuidv4()}`,
      name: `Semester ${semesters.length + 1}`,
      courses: []
    };
    setSemesters([...semesters, newSemester]);
  };

  const removeSemester = (semesterId) => {
    if (semesters.length <= 1) return;
    
    const semesterToRemove = semesters.find(s => s.id === semesterId);
    if (semesterToRemove && semesterToRemove.courses.length > 0) {
      if (!window.confirm('This semester has courses. Are you sure you want to remove it?')) {
        return;
      }
    }
    
    setSemesters(semesters.filter(s => s.id !== semesterId));
  };

  const updateSemesterName = (semesterId, newName) => {
    setSemesters(semesters.map(s => 
      s.id === semesterId ? { ...s, name: newName } : s
    ));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeCourse = findCourse(activeId);
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const containerIndex = semesters.findIndex(s => s.id === activeContainer);
      const activeIndex = semesters[containerIndex].courses.findIndex(c => c.id === activeId);
      const overIndex = semesters[containerIndex].courses.findIndex(c => c.id === overId);

      if (activeIndex !== overIndex) {
        setSemesters(prev => {
          const newSemesters = [...prev];
          newSemesters[containerIndex].courses = arrayMove(
            newSemesters[containerIndex].courses,
            activeIndex,
            overIndex
          );
          return newSemesters;
        });
      }
    } else {
      const activeContainerIndex = semesters.findIndex(s => s.id === activeContainer);
      const overContainerIndex = semesters.findIndex(s => s.id === overContainer);
      const activeIndex = semesters[activeContainerIndex].courses.findIndex(c => c.id === activeId);

      setSemesters(prev => {
        const newSemesters = [...prev];
        const [movedCourse] = newSemesters[activeContainerIndex].courses.splice(activeIndex, 1);
        
        if (overContainer === 'course-bank') {
          // Moving back to course bank - remove from completed courses
          setCompletedCourses(prev => prev.filter(c => c !== movedCourse.ucbCourse));
        } else {
          // Moving to a semester
          const overIndex = newSemesters[overContainerIndex].courses.findIndex(c => c.id === overId);
          if (overIndex >= 0) {
            newSemesters[overContainerIndex].courses.splice(overIndex, 0, movedCourse);
          } else {
            newSemesters[overContainerIndex].courses.push(movedCourse);
          }
        }
        
        return newSemesters;
      });
    }
  };

  const findContainer = (id) => {
    if (id === 'course-bank') return 'course-bank';
    
    for (const semester of semesters) {
      if (semester.id === id) return semester.id;
      if (semester.courses.find(c => c.id === id)) return semester.id;
    }
    return null;
  };

  const findCourse = (id) => {
    for (const semester of semesters) {
      const course = semester.courses.find(c => c.id === id);
      if (course) return course;
    }
    return null;
  };

  const handleCourseAdd = (course, semesterId) => {
    const courseWithId = {
      ...course,
      id: `${course.ucbCourse}-${uuidv4()}`
    };

    setSemesters(prev => prev.map(s => 
      s.id === semesterId 
        ? { ...s, courses: [...s.courses, courseWithId] }
        : s
    ));

    // Mark course as completed when added to semester
    if (!completedCourses.includes(course.ucbCourse)) {
      setCompletedCourses(prev => [...prev, course.ucbCourse]);
    }
  };

  const getTotalUnits = () => {
    return semesters.reduce((total, semester) => {
      return total + semester.courses.reduce((semesterTotal, course) => {
        return semesterTotal + (course.units || 4); // Default to 4 units if not specified
      }, 0);
    }, 0);
  };

  const getScheduledCourses = () => {
    const scheduled = new Set();
    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        scheduled.add(course.ucbCourse);
      });
    });
    return scheduled;
  };

  if (!selectedMajor) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Select a major to start planning your semester schedule
        </h3>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
            📅 Semester Planner
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-h-[300px] animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          📅 Semester Planner
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">
            Total Units: <span className="text-indigo-600 dark:text-indigo-400">{getTotalUnits()}</span>
          </span>
          
          {/* Save Status Indicator */}
          {saveStatus && (
            <span className={`text-xs px-2 py-1 rounded ${
              saveStatus === 'saving' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                : saveStatus === 'saved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {saveStatus === 'saving' && '💾 Saving...'}
              {saveStatus === 'saved' && '✅ Saved'}
              {saveStatus === 'error' && '❌ Save failed'}
            </span>
          )}
          
          <button
            onClick={addSemester}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Semester
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {semesters.map((semester) => (
                <Semester
                  key={semester.id}
                  semester={semester}
                  onRemove={removeSemester}
                  onNameChange={updateSemesterName}
                  canRemove={semesters.length > 1}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <CourseBank
              courses={selectedMajor.courses}
              scheduledCourses={getScheduledCourses()}
              onCourseAdd={handleCourseAdd}
              semesters={semesters}
              darkMode={darkMode}
            />
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <CourseCard course={findCourse(activeId)} isDragging darkMode={darkMode} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SemesterPlanner;