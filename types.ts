
export interface Lesson {
  title: string;
  content: string;
  estimatedTime: string;
  practiceTask: string;
}

export interface Module {
  title: string;
  objective: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  description: string;
  modules: Module[];
}

export interface CourseSetupData {
  topic: string;
  pace: string;
  goal: string;
  duration: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
