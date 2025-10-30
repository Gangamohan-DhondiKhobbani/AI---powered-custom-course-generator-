
import React from 'react';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';

interface ProgressTrackerProps {
    completedLessons: number;
    totalLessons: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ completedLessons, totalLessons }) => {
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    const motivationalQuotes = [
        "The secret of getting ahead is getting started.",
        "Believe you can and you're halfway there.",
        "Every accomplishment starts with the decision to try.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Well done is better than well said."
    ];
    
    const quote = motivationalQuotes[Math.floor((progressPercentage / 100) * (motivationalQuotes.length -1))];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-20 z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Your Progress</h3>
                <div className="flex items-center text-sm font-semibold text-indigo-600">
                    <ClipboardCheckIcon className="w-5 h-5 mr-1.5" />
                    <span>{completedLessons} / {totalLessons} Lessons</span>
                </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                <div 
                    className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
                <span>{quote}</span>
                <span className="font-semibold">{progressPercentage}% Complete</span>
            </div>
        </div>
    );
};
