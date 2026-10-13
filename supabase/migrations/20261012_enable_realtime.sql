-- ==============================================================================
-- MIGRATION: 20261012_enable_realtime.sql
-- Habilita la replicación en tiempo real (Supabase Realtime) para que
-- el Dashboard del Reclutador reciba eventos automáticos cuando los candidatos
-- completen sus exámenes sin tener que recargar la página.
-- ==============================================================================

DO $$
BEGIN
    -- Agregar assessment_assignments a la publicación realtime si no está
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'assessment_assignments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assessment_assignments;
    END IF;

    -- Agregar candidates a la publicación realtime
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'candidates'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
    END IF;

    -- Agregar quizzes a la publicación realtime
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'quizzes'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
    END IF;
END $$;
