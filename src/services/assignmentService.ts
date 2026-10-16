import { supabase } from '../lib/supabase';
import type { AssessmentAssignment } from '../types';

export const assignmentService = {
  async getAll(): Promise<AssessmentAssignment[]> {
    const { data, error } = await supabase
      .from('assessment_assignments')
      .select('*, candidate:candidates(*), quiz:quizzes(*)')
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }

    return (data || []).map((a: any) => {
      let difficulty: 1 | 2 | 3 | undefined = undefined;
      if (a.quiz?.description && a.quiz.description.includes('[meta:')) {
        const match = a.quiz.description.match(/\[meta:([^\]]+)\]/);
        if (match) {
          for (const p of match[1].split('|')) {
            if (p.startsWith('diff=')) {
              const d = parseInt(p.replace('diff=', ''), 10);
              if (d === 1 || d === 2 || d === 3) difficulty = d as 1 | 2 | 3;
            }
          }
        }
      }

      return {
        id: a.id,
        candidateId: a.candidate_id,
        candidateName: a.candidate?.name || 'Candidate',
        candidateEmail: a.candidate?.email || '',
        roleApplied: a.candidate?.role_applied || '',
        quizId: a.quiz_id,
        quizTitle: a.quiz?.title || 'Assessment',
        difficulty,
        durationMinutes: a.answers?._duration_minutes,
        selectedQuestionIds: a.selected_question_ids || [],
        status: a.status,
        reviewStatus:
          a.answers?._review_status ||
          (a.status === 'completed'
            ? (a.score ?? 0) >= 50
              ? 'stand_by'
              : 'rejected'
            : undefined),
        score: a.score,
        totalQuestions: a.total_questions,
        correctAnswersCount: a.correct_answers_count,
        passedThreshold: a.passed_threshold,
        answers: a.answers || {},
        assignedAt: a.assigned_at
          ? new Date(a.assigned_at).toLocaleString([], {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
        completedAt: a.completed_at
          ? new Date(a.completed_at).toLocaleString([], {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : undefined,
      };
    });
  },

  async updateReviewStatus(
    assignmentId: string,
    reviewStatus: 'stand_by' | 'approved' | 'rejected',
    currentAnswers: Record<string, any> = {}
  ): Promise<void> {
    const updatedAnswers = { ...currentAnswers, _review_status: reviewStatus };
    const { error } = await supabase
      .from('assessment_assignments')
      .update({ answers: updatedAnswers })
      .eq('id', assignmentId);
    if (error) throw error;
  },

  async assignCustom(candidateIds: string[], quizId: string, selectedQuestionIds: string[], durationMinutes?: number): Promise<void> {
    const inserts = candidateIds.map(candId => ({
      candidate_id: candId,
      quiz_id: quizId,
      selected_question_ids: selectedQuestionIds,
      status: 'pending',
      total_questions: selectedQuestionIds.length,
      correct_answers_count: 0,
      passed_threshold: false,
      answers: durationMinutes ? { _duration_minutes: durationMinutes } : {},
    }));

    const { error } = await supabase.from('assessment_assignments').insert(inserts);
    if (error) throw error;
  },

  async assignCustomSuite(
    candidateIds: string[],
    suite: { quizId: string; selectedQuestionIds: string[]; durationMinutes?: number }[]
  ): Promise<void> {
    const inserts: any[] = [];
    for (const item of suite) {
      for (const candId of candidateIds) {
        inserts.push({
          candidate_id: candId,
          quiz_id: item.quizId,
          selected_question_ids: item.selectedQuestionIds,
          status: 'pending',
          total_questions: item.selectedQuestionIds.length,
          correct_answers_count: 0,
          passed_threshold: false,
          answers: item.durationMinutes ? { _duration_minutes: item.durationMinutes } : {},
        });
      }
    }
    if (inserts.length > 0) {
      const { error } = await supabase.from('assessment_assignments').insert(inserts);
      if (error) throw error;
    }
  },

  async submitAssessment(
    assignmentId: string,
    answers: Record<string, string[]>,
    score: number,
    correctCount: number,
    totalQuestions: number,
    passed: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from('assessment_assignments')
      .update({
        status: 'completed',
        score,
        correct_answers_count: correctCount,
        total_questions: totalQuestions,
        passed_threshold: passed,
        answers,
        completed_at: new Date().toISOString(),
      })
      .eq('id', assignmentId);

    if (error) throw error;
  },
};
