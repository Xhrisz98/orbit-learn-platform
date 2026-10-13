-- ==============================================================================
-- SkillProof: Esquema Inicial de Base de Datos en Supabase (PostgreSQL)
-- Tablas: quizzes, questions, candidates, assessment_assignments
-- ==============================================================================

-- 1. Extensiones necesarias para UUIDs automáticos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLA: quizzes (Bancos de Preguntas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General Skills',
    description TEXT DEFAULT '',
    time_limit_minutes INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. TABLA: questions (Preguntas técnicas con opciones y claves)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category_tag TEXT DEFAULT '',
    explanation TEXT DEFAULT '',
    options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array: [{"id": "opt-1", "text": "..."}]
    correct_option_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array: ["opt-1", "opt-2"]
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);

-- ------------------------------------------------------------------------------
-- 4. TABLA: candidates (Directorio de postulantes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role_applied TEXT NOT NULL DEFAULT 'General Applicant',
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. TABLA: assessment_assignments (Pruebas Asignadas y Resultados)
-- Permite seleccionar manualmente qué preguntas (ej. 50 de 200) rendirá el candidato
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    selected_question_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de IDs de preguntas asignadas
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    score NUMERIC(5, 2) DEFAULT NULL, -- Porcentaje 0 a 100
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers_count INTEGER NOT NULL DEFAULT 0,
    passed_threshold BOOLEAN DEFAULT FALSE,
    answers JSONB DEFAULT '{}'::jsonb, -- {"q-id": ["opt-id"]}
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_assignments_candidate ON public.assessment_assignments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assignments_quiz ON public.assessment_assignments(quiz_id);

-- ------------------------------------------------------------------------------
-- 6. POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- Habilita RLS y permite operaciones autenticadas / clave anónima del demo
-- ------------------------------------------------------------------------------
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_assignments ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (anon) para el MVP
CREATE POLICY "Permitir todo en quizzes para demo" ON public.quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en questions para demo" ON public.questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en candidates para demo" ON public.candidates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en assessment_assignments para demo" ON public.assessment_assignments FOR ALL USING (true) WITH CHECK (true);
