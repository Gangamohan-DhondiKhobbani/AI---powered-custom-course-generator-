
import React, { useState, useMemo } from 'react';
import { Course, Module, Lesson } from '../types';
import { ProgressTracker } from './ProgressTracker';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';

interface LearningPlanProps {
    course: Course;
    progress: Record<string, boolean>;
    onToggleLesson: (lessonTitle: string) => void;
    onFinishCourse: () => void;
    onGetAdvice: () => Promise<void>;
}

const LessonItem: React.FC<{ lesson: Lesson; isCompleted: boolean; onToggle: () => void; }> = ({ lesson, isCompleted, onToggle }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-b-0">
             <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center">
                    <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="mr-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                            {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                    </button>
                    <span className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{lesson.title}</span>
                </div>
                <div className="flex items-center text-sm text-slate-500">
                    <span className="mr-4">{lesson.estimatedTime}</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 bg-slate-50">
                    <div className="prose prose-sm max-w-none text-slate-600">
                        <p>{lesson.content}</p>
                        <h4 className="font-semibold mt-4">Practice Task:</h4>
                        <p>{lesson.practiceTask}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const ModuleItem: React.FC<{ module: Module; progress: Record<string, boolean>; onToggleLesson: (lessonTitle: string) => void; }> = ({ module, progress, onToggleLesson }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
            <div className="p-5 flex justify-between items-center cursor-pointer bg-white border-b border-slate-200" onClick={() => setIsOpen(!isOpen)}>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{module.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{module.objective}</p>
                </div>
                 <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div>
                    {module.lessons.map(lesson => (
                        <LessonItem 
                            key={lesson.title} 
                            lesson={lesson}
                            isCompleted={!!progress[lesson.title]}
                            onToggle={() => onToggleLesson(lesson.title)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const LearningPlan: React.FC<LearningPlanProps> = ({ course, progress, onToggleLesson, onFinishCourse, onGetAdvice }) => {
    const [isAdviceLoading, setIsAdviceLoading] = useState(false);
    const [advice, setAdvice] = useState<string | null>(null);

    const totalLessons = useMemo(() => course.modules.reduce((acc, module) => acc + module.lessons.length, 0), [course]);
    const completedLessons = useMemo(() => Object.values(progress).filter(Boolean).length, [progress]);

    const isCourseComplete = totalLessons > 0 && completedLessons === totalLessons;

    const handleGetAdvice = async () => {
        setIsAdviceLoading(true);
        setAdvice(null);
        await onGetAdvice();
        setIsAdviceLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900">{course.title}</h1>
                <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">{course.description}</p>
            </header>

            <ProgressTracker completedLessons={completedLessons} totalLessons={totalLessons} />

            <div className="mb-6">
                 {course.modules.map((module, index) => (
                    <ModuleItem key={index} module={module} progress={progress} onToggleLesson={onToggleLesson} />
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                    onClick={handleGetAdvice}
                    disabled={isAdviceLoading}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isAdviceLoading ? 'Getting Advice...' : "I'm Stuck! Get AI Advice"}
                </button>

                <button
                    onClick={onFinishCourse}
                    disabled={!isCourseComplete}
                    className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    <ClipboardCheckIcon className="w-5 h-5 mr-2" />
                    Finish & Get Certificate
                </button>
            </div>
        </div>
    );
};
