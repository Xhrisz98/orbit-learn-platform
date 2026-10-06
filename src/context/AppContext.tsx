import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, Quiz, Candidate, AssessmentAssignment } from '../types';
import { initialQuizzes, initialCandidates, initialAssignments } from '../data/mockData';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';

interface SubmitResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeCandidateId: string;
  setActiveCandidateId: (id: string) => void;
  quizzes: Quiz[];
  candidates: Candidate[];
  assignments: AssessmentAssignment[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  createCandidate: (candidate: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'>) => void;
  assignQuiz: (candidateId: string, quizId: string) => void;
  submitAssessment: (assignmentId: string, userAnswers: Record<string, string[]>) => SubmitResult;
  deleteQuiz: (quizId: string) => void;
  deleteCandidate: (candidateId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('talent_lang') as Language;
    return saved === 'es' || saved === 'en' ? saved : 'en'; // English is default
  });

  const [activeRole, setActiveRole] = useState<Role>('recruiter');
  const [activeCandidateId, setActiveCandidateId] = useState<string>('cand-4'); // Lucas Vance (has pending test)

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('talent_quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('talent_candidates');
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [assignments, setAssignments] = useState<AssessmentAssignment[]>(() => {
    const saved = localStorage.getItem('talent_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('talent_lang', lang);
  };

  useEffect(() => {
    localStorage.setItem('talent_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('talent_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('talent_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const createQuiz = (newQuizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const created: Quiz = {
      ...newQuizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuizzes(prev => [created, ...prev]);
  };

  const createCandidate = (newCandData: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'>) => {
    const avatars = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    ];
    const created: Candidate = {
      ...newCandData,
      id: `cand-${Date.now()}`,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setCandidates(prev => [created, ...prev]);
  };

  const assignQuiz = (candidateId: string, quizId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    const quiz = quizzes.find(q => q.id === quizId);
    if (!candidate || !quiz) return;

    const newAssignment: AssessmentAssignment = {
      id: `assign-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      roleApplied: candidate.roleApplied,
      quizId: quiz.id,
      quizTitle: quiz.title,
      status: 'pending',
      totalQuestions: quiz.questions.length,
      assignedAt: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };

    setAssignments(prev => [newAssignment, ...prev]);
  };

  const submitAssessment = (assignmentId: string, userAnswers: Record<string, string[]>): SubmitResult => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) {
      return { score: 0, correctCount: 0, totalQuestions: 0, passed: false };
    }

    const quiz = quizzes.find(q => q.id === assignment.quizId);
    if (!quiz) {
      return { score: 0, correctCount: 0, totalQuestions: 0, passed: false };
    }

    let correctCount = 0;

    // Check each question in the quiz
    quiz.questions.forEach(q => {
      const selected = (userAnswers[q.id] || []).slice().sort();
      const expected = q.correctOptionIds.slice().sort();

      const isMatch =
        selected.length === expected.length &&
        selected.every((val, index) => val === expected[index]);

      if (isMatch) {
        correctCount += 1;
      }
    });

    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= 75;

    const completedAt = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'completed',
            score,
            totalQuestions,
            correctAnswersCount: correctCount,
            passedThreshold: passed,
            answers: userAnswers,
            completedAt,
          };
        }
        return a;
      })
    );

    return {
      score,
      correctCount,
      totalQuestions,
      passed,
    };
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setAssignments(prev => prev.filter(a => a.quizId !== quizId));
  };

  const deleteCandidate = (candidateId: string) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
    setAssignments(prev => prev.filter(a => a.candidateId !== candidateId));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeRole,
        setActiveRole,
        activeCandidateId,
        setActiveCandidateId,
        quizzes,
        candidates,
        assignments,
        createQuiz,
        createCandidate,
        assignQuiz,
        submitAssessment,
        deleteQuiz,
        deleteCandidate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
