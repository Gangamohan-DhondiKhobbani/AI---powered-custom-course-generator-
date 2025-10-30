import React, { useEffect } from 'react';
// FIX: Corrected the import for SparklesIcon. It should be imported from its own file.
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface CertificateProps {
    courseTitle: string;
    onStartNewCourse: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ courseTitle, onStartNewCourse }) => {
    useEffect(() => {
        // Simple confetti effect
        const confettiCount = 100;
        const container = document.getElementById('certificate-container');
        if (!container) return;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'absolute rounded-full';
            confetti.style.width = `${Math.random() * 8 + 4}px`;
            confetti.style.height = confetti.style.width;
            const color = ['bg-yellow-400', 'bg-pink-500', 'bg-indigo-500', 'bg-green-400'][Math.floor(Math.random() * 4)];
            confetti.classList.add(color);
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `${Math.random() * -50 - 50}px`;
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`;
            container.appendChild(confetti);
        }

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        return () => {
             document.head.removeChild(style);
        }

    }, []);

    const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div id="certificate-container" className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-4xl w-full border-4 border-indigo-200 relative z-10 text-center">
                <div className="absolute top-4 right-4 text-yellow-400">
                    <SparklesIcon className="w-10 h-10" />
                </div>
                <div className="absolute bottom-4 left-4 text-yellow-400">
                     <SparklesIcon className="w-10 h-10" />
                </div>
                <AcademicCapIcon className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-slate-500 uppercase tracking-widest">Certificate of Completion</h1>
                <p className="text-lg text-slate-600 mt-6">This certificate is proudly presented to</p>
                <h2 className="text-4xl font-bold text-slate-900 my-4">A Valued Learner</h2>
                <p className="text-lg text-slate-600">for successfully completing the course</p>
                <h3 className="text-3xl font-semibold text-indigo-700 my-6 italic">"{courseTitle}"</h3>
                <p className="text-md text-slate-500">Completed on: {completionDate}</p>
            </div>
            <button
                onClick={onStartNewCourse}
                className="mt-8 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 z-10"
            >
                Create a New Course
            </button>
        </div>
    );
};
