
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { CourseSetupData, Course, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const courseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'The title of the course. Should be concise and engaging.' },
        description: { type: Type.STRING, description: 'A brief, 2-3 sentence engaging description of what the user will learn in the course.' },
        modules: {
            type: Type.ARRAY,
            description: 'An array of modules that make up the course. The number of modules should be appropriate for the requested duration.',
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'The title of the module.' },
                    objective: { type: Type.STRING, description: 'A single sentence describing the learning objective for this module.' },
                    lessons: {
                        type: Type.ARRAY,
                        description: 'An array of lessons within the module.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: 'The title of the lesson.' },
                                content: { type: Type.STRING, description: 'The core learning material for the lesson, formatted in Markdown. Should be detailed and educational.' },
                                estimatedTime: { type: Type.STRING, description: 'An estimate of how long the lesson will take, e.g., "45 minutes".' },
                                practiceTask: { type: Type.STRING, description: 'A small, practical task or a couple of questions to reinforce learning.' }
                            },
                            required: ['title', 'content', 'estimatedTime', 'practiceTask']
                        }
                    }
                },
                required: ['title', 'objective', 'lessons']
            }
        }
    },
    required: ['title', 'description', 'modules']
};


export const generateCourse = async (setupData: CourseSetupData): Promise<Course> => {
    const { topic, pace, goal, duration } = setupData;
    const prompt = `
        Please generate a personalized learning course with the following details:
        - Topic: ${topic}
        - Desired Learning Pace: ${pace}
        - Primary Goal: ${goal}
        - Course Duration: ${duration}

        Structure the course into logical modules and lessons. For each lesson, provide detailed content, an estimated completion time, and a practical task. 
        The content should be educational and well-structured. The number of modules and lessons should be realistic for the specified duration and pace.
        Return the output in the specified JSON format.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: courseSchema,
            },
        });
        const courseJson = JSON.parse(response.text);
        return courseJson as Course;
    } catch (error) {
        console.error("Error generating course:", error);
        throw new Error("Failed to generate the course. The model may have returned an invalid format.");
    }
};

export const getAIAdvice = async (courseTitle: string, progressPercentage: number): Promise<string> => {
    const prompt = `
        I am a student taking a course called "${courseTitle}". I am currently ${progressPercentage}% complete with the course.
        I'm feeling a bit stuck or need some motivation. 
        Please provide some encouraging advice, a useful tip related to the course topic, or a suggestion for what I should focus on next.
        Keep the advice concise, positive, and under 100 words.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
};

let chat: Chat | null = null;

export const startChat = (courseTitle: string) => {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly and helpful AI assistant for a student taking a course on "${courseTitle}". Answer their questions about the course material, provide clarifications, and help them with their learning journey. Be encouraging and supportive.`,
        },
    });
};


export const sendMessageToBot = async (message: string): Promise<string> => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startChat first.");
    }
    
    const response = await chat.sendMessage({ message });
    return response.text;
};
