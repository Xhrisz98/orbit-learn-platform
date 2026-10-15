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
  categoryTag?: string;
  imageUrl?: string;
}

export interface QuizArea {
  id: string;
  name: string;
  description?: string;
  classifications?: string[];
  icon?: string;
  createdAt?: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  supportedClassifications?: string[];
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
  gender?: 'male' | 'female';
  registeredAt: string;
}

export type AssessmentStatus = 'pending' | 'in_progress' | 'completed';
export type RecruiterReviewStatus = 'stand_by' | 'approved' | 'rejected';

export interface AssessmentAssignment {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  roleApplied: string;
  quizId: string;
  quizTitle: string;
  selectedQuestionIds?: string[]; // IDs of questions manually picked by recruiter
  status: AssessmentStatus;
  reviewStatus?: RecruiterReviewStatus;
  score?: number; // 0 to 100
  totalQuestions: number;
  correctAnswersCount?: number;
  answers?: Record<string, any>; // questionId -> selectedOptionIds, plus _review_status
  assignedAt: string;
  completedAt?: string;
  passedThreshold?: boolean; // e.g. score >= 75
}
