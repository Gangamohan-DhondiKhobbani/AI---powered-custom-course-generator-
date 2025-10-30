
import React, { useState } from 'react';
import { CourseSetupData } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface CourseSetupProps {
    onCourseGenerate: (data: CourseSetupData) => void;
    isLoading: boolean;
}

export const CourseSetup: React.FC<CourseSetupProps> = ({ onCourseGenerate, isLoading }) => {
    const [topic, setTopic] = useState('');
    const [pace, setPace] = useState('Moderate');
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('1 Month');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCourseGenerate({ topic, pace, goal, duration });
    };

    const isButtonDisabled = !topic || !goal || isLoading;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Design Your Personalized Learning Journey</h2>
                <p className="mt-4 text-lg text-slate-600">Tell us what you want to learn, and our AI will craft the perfect course for you.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700">What do you want to learn?</label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., 'React for Beginners', 'The History of Ancient Rome'"
                        />
                    </div>

                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-slate-700">What is your main goal?</label>
                        <textarea
                            id="goal"
                            rows={3}
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., 'Build a personal portfolio website', 'Prepare for a history quiz'"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Learning Pace</label>
                            <div className="mt-2 grid grid-cols-3 gap-3">
                                {['Casual', 'Moderate', 'Intense'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPace(p)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors ${
                                            pace === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-slate-700">Course Duration</label>
                            <select
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option>1 Week</option>
                                <option>1 Month</option>
                                <option>3 Months</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Crafting Your Course...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                    Generate My Course
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
