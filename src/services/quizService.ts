import { supabase } from '../lib/supabase';
import type { Quiz } from '../types';
import { orangeCountyQuizzes } from '../data/orangeCountyData';

export const quizService = {
  async getAll(): Promise<Quiz[]> {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }

    return (quizzes || []).map((q: any) => {
      const matchedOcQuiz = orangeCountyQuizzes.find(
        oq =>
          oq.title.toLowerCase().trim() === (q.title || '').toLowerCase().trim() ||
          oq.category.toLowerCase().trim() === (q.category || '').toLowerCase().trim()
      );

      let cleanDesc = q.description || '';
      let difficulty: 1 | 2 | 3 = matchedOcQuiz?.difficulty || 2;
      let supportedClassifications = q.supported_classifications || matchedOcQuiz?.supportedClassifications || [];

      if (cleanDesc.includes('[meta:')) {
        const match = cleanDesc.match(/\[meta:([^\]]+)\]/);
        if (match) {
          const metaStr = match[1];
          const parts = metaStr.split('|');
          for (const p of parts) {
            if (p.startsWith('diff=')) {
              const d = parseInt(p.replace('diff=', ''), 10);
              if (d === 1 || d === 2 || d === 3) difficulty = d as 1 | 2 | 3;
            } else if (p.startsWith('roles=')) {
              const roles = p.replace('roles=', '').split(';').map((s: string) => s.trim()).filter(Boolean);
              if (roles.length > 0) supportedClassifications = roles;
            }
          }
          cleanDesc = cleanDesc.replace(/\[meta:[^\]]+\]/, '').trim();
        }
      }

      return {
        id: q.id,
        title: q.title,
        category: q.category,
        description: cleanDesc,
        difficulty,
        timeLimitMinutes: q.time_limit_minutes || 60,
        createdAt: q.created_at ? q.created_at.split('T')[0] : '',
        supportedClassifications,
        questions: (q.questions || []).map((quest: any) => ({
          id: quest.id,
          text: quest.text,
          categoryTag: quest.category_tag || '',
          explanation: quest.explanation || '',
          options: quest.options || [],
          correctOptionIds: quest.correct_option_ids || [],
        })),
      };
    });
  },

  async create(quizData: Omit<Quiz, 'id' | 'createdAt'>): Promise<Quiz> {
    const metaParts: string[] = [];
    if (quizData.difficulty) metaParts.push(`diff=${quizData.difficulty}`);
    if (quizData.supportedClassifications && quizData.supportedClassifications.length > 0) {
      metaParts.push(`roles=${quizData.supportedClassifications.join(';')}`);
    }
    const fullDesc = metaParts.length > 0
      ? `${quizData.description || ''}\n\n[meta:${metaParts.join('|')}]`.trim()
      : quizData.description || '';

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: quizData.title,
        category: quizData.category,
        description: fullDesc,
        time_limit_minutes: quizData.timeLimitMinutes || 60,
      })
      .select()
      .single();

    if (quizError) throw quizError;

    if (quizData.questions && quizData.questions.length > 0) {
      const questionsToInsert = quizData.questions.map(q => ({
        quiz_id: quiz.id,
        text: q.text,
        category_tag: q.categoryTag || '',
        explanation: q.explanation || '',
        options: q.options,
        correct_option_ids: q.correctOptionIds,
      }));

      const { error: questError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questError) {
        console.error('Error inserting questions:', questError);
      }
    }

    return this.getById(quiz.id);
  },

  async update(quizId: string, updatedData: Partial<Quiz>): Promise<void> {
    const toUpdate: Record<string, any> = {};
    if (updatedData.title !== undefined) toUpdate.title = updatedData.title;
    if (updatedData.category !== undefined) toUpdate.category = updatedData.category;
    if (updatedData.timeLimitMinutes !== undefined) toUpdate.time_limit_minutes = updatedData.timeLimitMinutes;

    if (
      updatedData.description !== undefined ||
      updatedData.difficulty !== undefined ||
      updatedData.supportedClassifications !== undefined
    ) {
      const metaParts: string[] = [];
      if (updatedData.difficulty) metaParts.push(`diff=${updatedData.difficulty}`);
      if (updatedData.supportedClassifications && updatedData.supportedClassifications.length > 0) {
        metaParts.push(`roles=${updatedData.supportedClassifications.join(';')}`);
      }
      const rawDesc = updatedData.description !== undefined ? updatedData.description : '';
      toUpdate.description = metaParts.length > 0
        ? `${rawDesc}\n\n[meta:${metaParts.join('|')}]`.trim()
        : rawDesc;
    }

    if (Object.keys(toUpdate).length > 0) {
      const { error } = await supabase
        .from('quizzes')
        .update(toUpdate)
        .eq('id', quizId);

      if (error) throw error;
    }

    if (updatedData.questions !== undefined) {
      await supabase.from('questions').delete().eq('quiz_id', quizId);

      const questionsToInsert = updatedData.questions.map(q => {
        const item: any = {
          quiz_id: quizId,
          text: q.text,
          category_tag: q.categoryTag || '',
          explanation: q.explanation || '',
          options: q.options,
          correct_option_ids: q.correctOptionIds,
        };
        // Preservar el UUID existente si es válido para mantener integridad con selected_question_ids
        if (q.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q.id)) {
          item.id = q.id;
        }
        return item;
      });

      if (questionsToInsert.length > 0) {
        const { error: questError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questError) throw questError;
      }
    }
  },

  async delete(quizId: string): Promise<void> {
    const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
    if (error) throw error;
  },

  async getById(quizId: string): Promise<Quiz> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', quizId)
      .single();

    if (error) throw error;

    let cleanDesc = data.description || '';
    let difficulty: 1 | 2 | 3 = 2;
    let supportedClassifications: string[] = [];

    if (cleanDesc.includes('[meta:')) {
      const match = cleanDesc.match(/\[meta:([^\]]+)\]/);
      if (match) {
        const metaStr = match[1];
        const parts = metaStr.split('|');
        for (const p of parts) {
          if (p.startsWith('diff=')) {
            const d = parseInt(p.replace('diff=', ''), 10);
            if (d === 1 || d === 2 || d === 3) difficulty = d as 1 | 2 | 3;
          } else if (p.startsWith('roles=')) {
            const roles = p.replace('roles=', '').split(';').map((s: string) => s.trim()).filter(Boolean);
            if (roles.length > 0) supportedClassifications = roles;
          }
        }
        cleanDesc = cleanDesc.replace(/\[meta:[^\]]+\]/, '').trim();
      }
    }

    return {
      id: data.id,
      title: data.title,
      category: data.category,
      description: cleanDesc,
      difficulty,
      supportedClassifications,
      timeLimitMinutes: data.time_limit_minutes || 60,
      createdAt: data.created_at ? data.created_at.split('T')[0] : '',
      questions: (data.questions || []).map((quest: any) => ({
        id: quest.id,
        text: quest.text,
        categoryTag: quest.category_tag || '',
        explanation: quest.explanation || '',
        options: quest.options || [],
        correctOptionIds: quest.correct_option_ids || [],
      })),
    };
  },
};
