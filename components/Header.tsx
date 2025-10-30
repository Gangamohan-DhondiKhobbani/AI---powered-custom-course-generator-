
import React from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';

export const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                        <h1 className="text-xl font-bold text-slate-800">
                            AI Course Generator
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};
