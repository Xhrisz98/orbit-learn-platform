export interface DatabaseQuizArea {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface DatabaseQuiz {
  id: string;
  title: string;
  category: string;
  description: string;
  time_limit_minutes: number;
  created_at: string;
}

export interface DatabaseQuestion {
  id: string;
  quiz_id: string;
  text: string;
  category_tag: string;
  explanation: string;
  options: { id: string; text: string }[];
  correct_option_ids: string[];
  created_at: string;
}

export interface DatabaseCandidate {
  id: string;
  name: string;
  email: string;
  role_applied: string;
  avatar: string;
  registered_at: string;
}

export interface DatabaseAssignment {
  id: string;
  candidate_id: string;
  quiz_id: string;
  selected_question_ids: string[];
  status: 'pending' | 'in_progress' | 'completed';
  score: number | null;
  total_questions: number;
  correct_answers_count: number;
  passed_threshold: boolean;
  answers: Record<string, string[]>;
  assigned_at: string;
  completed_at: string | null;
}
