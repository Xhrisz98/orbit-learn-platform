import { supabase } from '../lib/supabase';
import { initialQuizzes, initialCandidates } from '../data/mockData';

export const seedService = {
  async seedIfEmpty(): Promise<boolean> {
    try {
      const { data: existingQuizzes, error: qErr } = await supabase.from('quizzes').select('id').limit(1);
      if (qErr) {
        console.warn('Cannot check quizzes for seed:', qErr.message);
        return false;
      }

      if (existingQuizzes && existingQuizzes.length > 0) {
        return false; // Already has data, no seed needed
      }

      console.log('🌱 Base de datos vacía detectada. Insertando datos iniciales de SkillProof...');

      // 1. Insert candidates
      const candidatesToInsert = initialCandidates.map(c => ({
        name: c.name,
        email: c.email,
        role_applied: c.roleApplied,
        avatar: c.avatar,
      }));

      const { data: insertedCandidates, error: cErr } = await supabase
        .from('candidates')
        .insert(candidatesToInsert)
        .select();

      if (cErr) console.warn('Seed candidates warning:', cErr.message);

      // 2. Insert quizzes & questions
      for (const quiz of initialQuizzes) {
        const { data: insertedQuiz, error: quizErr } = await supabase
          .from('quizzes')
          .insert({
            title: quiz.title,
            category: quiz.category,
            description: quiz.description,
            time_limit_minutes: quiz.timeLimitMinutes || 20,
          })
          .select()
          .single();

        if (quizErr || !insertedQuiz) continue;

        if (quiz.questions && quiz.questions.length > 0) {
          const questionsToInsert = quiz.questions.map(q => ({
            quiz_id: insertedQuiz.id,
            text: q.text,
            category_tag: q.categoryTag || '',
            explanation: q.explanation || '',
            options: q.options,
            correct_option_ids: q.correctOptionIds,
          }));

          await supabase.from('questions').insert(questionsToInsert);
        }
      }

      // 3. Insert initial assignments if candidates exist
      if (insertedCandidates && insertedCandidates.length >= 2) {
        const { data: dbQuizzes } = await supabase.from('quizzes').select('id, questions(id)').limit(2);
        if (dbQuizzes && dbQuizzes.length > 0) {
          const firstQuiz = dbQuizzes[0];
          const questionIds = ((firstQuiz as any).questions || []).map((q: any) => q.id);

          if (questionIds.length > 0) {
            await supabase.from('assessment_assignments').insert({
              candidate_id: insertedCandidates[0].id,
              quiz_id: firstQuiz.id,
              selected_question_ids: questionIds.slice(0, 4),
              status: 'pending',
              total_questions: Math.min(4, questionIds.length),
              correct_answers_count: 0,
              passed_threshold: false,
              answers: {},
            });
          }
        }
      }

      console.log('✅ Datos iniciales cargados en Supabase.');
      return true;
    } catch (err) {
      console.error('Error during auto-seed:', err);
      return false;
    }
  },
};
