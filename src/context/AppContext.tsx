import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, Quiz, Candidate, AssessmentAssignment, QuizArea } from '../types';
import { initialQuizzes, initialCandidates, initialAssignments } from '../data/mockData';
import { translations } from '../i18n/translations';
import type { Language } from '../i18n/translations';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { quizService } from '../services/quizService';
import { candidateService } from '../services/candidateService';
import { assignmentService } from '../services/assignmentService';
import { seedService } from '../services/seedService';
import { areaService, initialDefaultAreas } from '../services/areaService';

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
  areas: QuizArea[];
  isLiveDatabase: boolean;
  loading: boolean;
  createArea: (name: string, description?: string) => Promise<QuizArea>;
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Promise<void>;
  updateQuiz: (quizId: string, updatedData: Partial<Quiz>) => Promise<void>;
  createCandidate: (candidate: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'> & { gender?: 'male' | 'female' }) => Promise<void>;
  assignQuiz: (candidateId: string, quizId: string, selectedQuestionIds?: string[]) => void;
  assignCustomQuiz: (candidateIds: string[], quizId: string, selectedQuestionIds: string[]) => Promise<void>;
  submitAssessment: (assignmentId: string, userAnswers: Record<string, string[]>) => SubmitResult;
  updateAssignmentReviewStatus: (assignmentId: string, reviewStatus: 'stand_by' | 'approved' | 'rejected') => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  deleteCandidate: (candidateId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('skillproof_lang') as Language;
    return saved === 'es' || saved === 'en' ? saved : 'en'; // English is default
  });

  const [activeRole, setActiveRole] = useState<Role>('recruiter');
  const [activeCandidateId, setActiveCandidateId] = useState<string>('cand-4');
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const isLiveDatabase = isSupabaseConfigured;

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('skillproof_quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('skillproof_candidates');
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [assignments, setAssignments] = useState<AssessmentAssignment[]>(() => {
    const saved = localStorage.getItem('skillproof_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [areas, setAreas] = useState<QuizArea[]>(initialDefaultAreas);

  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('skillproof_lang', lang);
  };

  // Sync state with Supabase cloud on mount
  useEffect(() => {
    async function initData() {
      if (!isSupabaseConfigured) return;

      try {
        setLoading(true);
        // Auto-seed if database tables are currently empty
        await seedService.seedIfEmpty();
        // Sync County of Orange standardized banks if missing
        await seedService.syncOrangeCountyBanks();

        const [remoteQuizzes, remoteCandidates, remoteAssignments, remoteAreas] = await Promise.all([
          quizService.getAll(),
          candidateService.getAll(),
          assignmentService.getAll(),
          areaService.getAll(),
        ]);

        if (remoteQuizzes && remoteQuizzes.length > 0) {
          setQuizzes(remoteQuizzes);
        }
        if (remoteCandidates && remoteCandidates.length > 0) {
          setCandidates(remoteCandidates);
          setActiveCandidateId(prev =>
            remoteCandidates.some(c => c.id === prev) ? prev : remoteCandidates[0].id
          );
        }
        if (remoteAreas && remoteAreas.length > 0) {
          setAreas(remoteAreas);
        }
        setAssignments(remoteAssignments || []);
      } catch (err) {
        console.error('Failed to sync data with Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  // Supabase Realtime: Sincronización en vivo sin recargar pantalla
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('skillproof-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assessment_assignments' },
        async (payload) => {
          console.log('[Realtime] Assessment change detected:', payload.eventType);
          try {
            const refreshed = await assignmentService.getAll();
            setAssignments(refreshed);
          } catch (err) {
            console.error('Error refreshing assignments via Realtime:', err);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'candidates' },
        async () => {
          try {
            const refreshed = await candidateService.getAll();
            setCandidates(refreshed);
          } catch (err) {
            console.error('Error refreshing candidates via Realtime:', err);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quizzes' },
        async () => {
          try {
            const refreshed = await quizService.getAll();
            setQuizzes(refreshed);
          } catch (err) {
            console.error('Error refreshing quizzes via Realtime:', err);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Live channel connected to Supabase');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('skillproof_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('skillproof_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('skillproof_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const createQuiz = async (newQuizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    if (isSupabaseConfigured) {
      try {
        const created = await quizService.create(newQuizData);
        setQuizzes(prev => [created, ...prev]);
        return;
      } catch (err) {
        console.error('Error creating quiz on Supabase:', err);
      }
    }
    const created: Quiz = {
      ...newQuizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuizzes(prev => [created, ...prev]);
  };

  const updateQuiz = async (quizId: string, updatedData: Partial<Quiz>) => {
    if (isSupabaseConfigured) {
      try {
        await quizService.update(quizId, updatedData);
        const refreshed = await quizService.getAll();
        setQuizzes(refreshed);
        return;
      } catch (err) {
        console.error('Error updating quiz on Supabase:', err);
      }
    }
    setQuizzes(prev =>
      prev.map(q => (q.id === quizId ? { ...q, ...updatedData } : q))
    );
    if (updatedData.title) {
      setAssignments(prev =>
        prev.map(a => (a.quizId === quizId ? { ...a, quizTitle: updatedData.title! } : a))
      );
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (isSupabaseConfigured) {
      try {
        await quizService.delete(quizId);
      } catch (err) {
        console.error('Error deleting quiz on Supabase:', err);
      }
    }
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setAssignments(prev => prev.filter(a => a.quizId !== quizId));
  };

  const createCandidate = async (newCandData: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'> & { gender?: 'male' | 'female' }) => {
    if (isSupabaseConfigured) {
      try {
        const created = await candidateService.create(newCandData);
        setCandidates(prev => [created, ...prev]);
        return;
      } catch (err) {
        console.error('Error creating candidate on Supabase:', err);
      }
    }
    const created: Candidate = {
      ...newCandData,
      id: `cand-${Date.now()}`,
      avatar: `gender:${newCandData.gender || 'male'}`,
      gender: newCandData.gender || 'male',
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setCandidates(prev => [created, ...prev]);
  };

  const deleteCandidate = async (candidateId: string) => {
    if (isSupabaseConfigured) {
      try {
        await candidateService.delete(candidateId);
      } catch (err) {
        console.error('Error deleting candidate on Supabase:', err);
      }
    }
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
    setAssignments(prev => prev.filter(a => a.candidateId !== candidateId));
  };

  const assignQuiz = (candidateId: string, quizId: string, selectedQuestionIds?: string[]) => {
    const candidate = candidates.find(c => c.id === candidateId);
    const quiz = quizzes.find(q => q.id === quizId);
    if (!candidate || !quiz) return;

    const chosenIds = selectedQuestionIds && selectedQuestionIds.length > 0
      ? selectedQuestionIds
      : quiz.questions.map(q => q.id);

    const newAssignment: AssessmentAssignment = {
      id: `assign-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      roleApplied: candidate.roleApplied,
      quizId: quiz.id,
      quizTitle: quiz.title,
      selectedQuestionIds: chosenIds,
      status: 'pending',
      totalQuestions: chosenIds.length,
      assignedAt: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };

    setAssignments(prev => [newAssignment, ...prev]);
  };

  const assignCustomQuiz = async (candidateIds: string[], quizId: string, selectedQuestionIds: string[]) => {
    if (isSupabaseConfigured) {
      try {
        await assignmentService.assignCustom(candidateIds, quizId, selectedQuestionIds);
        const refreshed = await assignmentService.getAll();
        setAssignments(refreshed);
        return;
      } catch (err) {
        console.error('Error assigning custom quiz on Supabase:', err);
      }
    }

    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz || candidateIds.length === 0 || selectedQuestionIds.length === 0) return;

    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    const newAssignments: AssessmentAssignment[] = candidateIds.map((cId, idx) => {
      const candidate = candidates.find(c => c.id === cId);
      return {
        id: `assign-${Date.now()}-${idx}`,
        candidateId: cId,
        candidateName: candidate?.name || 'Candidate',
        candidateEmail: candidate?.email || 'email@candidate.com',
        roleApplied: candidate?.roleApplied || 'Applicant',
        quizId: quiz.id,
        quizTitle: quiz.title,
        selectedQuestionIds: selectedQuestionIds,
        status: 'pending',
        totalQuestions: selectedQuestionIds.length,
        assignedAt: nowStr,
      };
    });

    setAssignments(prev => [...newAssignments, ...prev]);
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

    const questionsToGrade = assignment.selectedQuestionIds && assignment.selectedQuestionIds.length > 0
      ? quiz.questions.filter(q => assignment.selectedQuestionIds!.includes(q.id))
      : quiz.questions;

    let correctCount = 0;

    questionsToGrade.forEach(q => {
      const selected = (userAnswers[q.id] || []).slice().sort();
      const expected = q.correctOptionIds.slice().sort();

      const isMatch =
        selected.length === expected.length &&
        selected.every((val, index) => val === expected[index]);

      if (isMatch) {
        correctCount += 1;
      }
    });

    const totalQuestions = questionsToGrade.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= 75;

    const completedAt = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    if (isSupabaseConfigured) {
      assignmentService.submitAssessment(
        assignmentId,
        userAnswers,
        score,
        correctCount,
        totalQuestions,
        passed
      ).catch(err => console.error('Error submitting assessment to Supabase:', err));
    }

    const defaultReviewStatus = score >= 50 ? 'stand_by' : 'rejected';

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          return {
            ...a,
            status: 'completed',
            reviewStatus: defaultReviewStatus,
            score,
            totalQuestions,
            correctAnswersCount: correctCount,
            passedThreshold: passed,
            answers: { ...userAnswers, _review_status: defaultReviewStatus },
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

  const updateAssignmentReviewStatus = async (
    assignmentId: string,
    reviewStatus: 'stand_by' | 'approved' | 'rejected'
  ) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (isSupabaseConfigured) {
      try {
        await assignmentService.updateReviewStatus(assignmentId, reviewStatus, target?.answers || {});
      } catch (err) {
        console.error('Error updating review status on Supabase:', err);
      }
    }

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          return {
            ...a,
            reviewStatus,
            answers: { ...(a.answers || {}), _review_status: reviewStatus },
          };
        }
        return a;
      })
    );
  };

  const createArea = async (name: string, description: string = ''): Promise<QuizArea> => {
    if (isSupabaseConfigured) {
      try {
        const created = await areaService.create(name, description);
        setAreas(prev => [...prev.filter(a => a.id !== created.id), created]);
        return created;
      } catch (err) {
        console.error('Error creating area on Supabase:', err);
      }
    }
    const created: QuizArea = {
      id: `area-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
    };
    setAreas(prev => [...prev, created]);
    return created;
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
        areas,
        isLiveDatabase,
        loading,
        createArea,
        createQuiz,
        updateQuiz,
        createCandidate,
        assignQuiz,
        assignCustomQuiz,
        submitAssessment,
        updateAssignmentReviewStatus,
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
