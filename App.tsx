
import React, { useState, useCallback, useEffect } from 'react';
import { Course, CourseSetupData, ChatMessage } from './types';
import { generateCourse, getAIAdvice, startChat, sendMessageToBot } from './services/geminiService';
import { Header } from './components/Header';
import { CourseSetup } from './components/CourseSetup';
import { LearningPlan } from './components/LearningPlan';
import { Certificate } from './components/Certificate';
import { Chatbot } from './components/Chatbot';

type AppState = 'setup' | 'learning' | 'certificate';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('setup');
    const [course, setCourse] = useState<Course | null>(null);
    const [progress, setProgress] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);


    useEffect(() => {
        if (appState === 'learning' && course) {
            startChat(course.title);
            setChatMessages([{ role: 'model', text: `Hi! I'm your AI assistant for the "${course.title}" course. How can I help you today?` }]);
        }
    }, [appState, course]);

    const handleCourseGenerate = async (data: CourseSetupData) => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedCourse = await generateCourse(data);
            setCourse(generatedCourse);
            setAppState('learning');
            setProgress({});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            // Stay on setup page if error occurs
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleLesson = useCallback((lessonTitle: string) => {
        setProgress(prev => ({
            ...prev,
            [lessonTitle]: !prev[lessonTitle]
        }));
    }, []);

    const handleFinishCourse = () => {
        if (course) {
            setAppState('certificate');
        }
    };
    
    const handleStartNewCourse = () => {
        setCourse(null);
        setProgress({});
        setAppState('setup');
        setError(null);
        setChatMessages([]);
    };

    const handleGetAdvice = async () => {
        if (!course) return;
        const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        const completedLessons = Object.values(progress).filter(Boolean).length;
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        try {
            const advice = await getAIAdvice(course.title, progressPercentage);
            // This is a simple way to show advice. A modal would be better in a real app.
            alert(`AI Advice: ${advice}`);
        } catch (err) {
            alert("Sorry, I couldn't get any advice at the moment.");
        }
    };
    
    const handleSendMessage = async (message: string) => {
        const userMessage: ChatMessage = { role: 'user', text: message };
        setChatMessages(prev => [...prev, userMessage]);
        setIsBotTyping(true);
        try {
            const botResponse = await sendMessageToBot(message);
            const modelMessage: ChatMessage = { role: 'model', text: botResponse };
            setChatMessages(prev => [...prev, modelMessage]);
        } catch (err) {
             const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later." };
             setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsBotTyping(false);
        }
    };


    const renderContent = () => {
        switch (appState) {
            case 'setup':
                return <CourseSetup onCourseGenerate={handleCourseGenerate} isLoading={isLoading} />;
            case 'learning':
                if (course) {
                    return <LearningPlan course={course} progress={progress} onToggleLesson={handleToggleLesson} onFinishCourse={handleFinishCourse} onGetAdvice={handleGetAdvice} />;
                }
                return null; // or a loading/error state
            case 'certificate':
                if (course) {
                    return <Certificate courseTitle={course.title} onStartNewCourse={handleStartNewCourse} />;
                }
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {appState !== 'certificate' && <Header />}
            <main>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-2xl mx-auto my-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {renderContent()}
            </main>
            {appState === 'learning' && <Chatbot messages={chatMessages} onSendMessage={handleSendMessage} isBotTyping={isBotTyping} />}
        </div>
    );
};

export default App;
