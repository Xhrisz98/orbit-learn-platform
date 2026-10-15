import { supabase } from '../lib/supabase';
import { initialQuizzes, initialCandidates } from '../data/mockData';
import { orangeCountyQuizzes, orangeCountyAreas } from '../data/orangeCountyData';

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

      console.log('[SeedService] Empty database detected. Seeding initial SkillProof data...');

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

      console.log('[SeedService] Initial data loaded to Supabase successfully.');
      return true;
    } catch (err) {
      console.error('Error during auto-seed:', err);
      return false;
    }
  },

  async syncOrangeCountyBanks(): Promise<void> {
    try {
      // 1. Sync quiz areas if missing
      const { data: existingAreas } = await supabase.from('quiz_areas').select('name');
      const existingAreaNames = new Set(
        (existingAreas || []).map((a: any) => (a.name || '').toLowerCase().trim())
      );

      for (const ocArea of orangeCountyAreas) {
        if (!existingAreaNames.has(ocArea.name.toLowerCase().trim())) {
          await supabase.from('quiz_areas').insert({
            name: ocArea.name,
            description: ocArea.description || '',
            icon: ocArea.icon || 'Briefcase',
          });
          existingAreaNames.add(ocArea.name.toLowerCase().trim());
        }
      }

      // 2. Sync Orange County Question Banks & their 400 questions if missing
      const { data: existingQuizzes, error: qErr } = await supabase.from('quizzes').select('id, title');
      if (qErr) {
        console.warn('[SeedService] Error checking existing quizzes:', qErr.message);
        return;
      }

      const existingTitles = new Set(
        (existingQuizzes || []).map((q: any) => (q.title || '').toLowerCase().trim())
      );
      let syncedCount = 0;

      for (const ocQuiz of orangeCountyQuizzes) {
        if (!existingTitles.has(ocQuiz.title.toLowerCase().trim())) {
          const { data: insertedQuiz, error: insertErr } = await supabase
            .from('quizzes')
            .insert({
              title: ocQuiz.title,
              category: ocQuiz.category,
              description: ocQuiz.description,
              time_limit_minutes: ocQuiz.timeLimitMinutes || 20,
            })
            .select()
            .single();

          if (insertErr || !insertedQuiz) {
            console.warn('[SeedService] Failed to insert quiz ' + ocQuiz.title + ':', insertErr?.message);
            continue;
          }

          if (ocQuiz.questions && ocQuiz.questions.length > 0) {
            const questionsToInsert = ocQuiz.questions.map(q => ({
              quiz_id: insertedQuiz.id,
              text: q.text,
              category_tag: q.categoryTag || '',
              explanation: q.explanation || '',
              options: q.options,
              correct_option_ids: q.correctOptionIds,
            }));

            const { error: questErr } = await supabase.from('questions').insert(questionsToInsert);
            if (questErr) {
              console.warn('[SeedService] Failed to insert questions for ' + ocQuiz.title + ':', questErr.message);
            }
          }

          existingTitles.add(ocQuiz.title.toLowerCase().trim());
          syncedCount++;
        }
      }

      if (syncedCount > 0) {
        console.log(`[SeedService] Synchronized ${syncedCount} County of Orange question banks to Supabase.`);
      }
    } catch (err) {
      console.error('[SeedService] Error synchronizing Orange County banks:', err);
    }
  },
};
