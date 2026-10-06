export type Role = 'recruiter' | 'candidate';

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionIds: string[]; // Supports single or multiple correct answers
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  timeLimitMinutes?: number;
  questions: Question[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  roleApplied: string;
  avatar: string;
  registeredAt: string;
}

export type AssessmentStatus = 'pending' | 'in_progress' | 'completed';

export interface AssessmentAssignment {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleApplied: string;
  quizId: string;
  quizTitle: string;
  status: AssessmentStatus;
  score?: number; // 0 to 100
  totalQuestions: number;
  correctAnswersCount?: number;
  answers?: Record<string, string[]>; // questionId -> selectedOptionIds
  assignedAt: string;
  completedAt?: string;
  passedThreshold?: boolean; // e.g. score >= 75
}
