-- ==============================================================================
-- MIGRATION: 20261012_quiz_areas.sql
-- Descripción: Tabla de Áreas Profesionales dinámicas y catálogo de áreas semilla.
-- Permite que cada Quiz esté asignado a un área y que el Administrador cree
-- nuevas áreas en cualquier momento.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.quiz_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT 'Briefcase',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.quiz_areas ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso RLS
CREATE POLICY "Allow public read quiz_areas" 
    ON public.quiz_areas FOR SELECT USING (true);

CREATE POLICY "Allow public insert quiz_areas" 
    ON public.quiz_areas FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update quiz_areas" 
    ON public.quiz_areas FOR UPDATE USING (true);

CREATE POLICY "Allow public delete quiz_areas" 
    ON public.quiz_areas FOR DELETE USING (true);

-- Semilla de las 6 áreas profesionales principales
INSERT INTO public.quiz_areas (name, description, icon)
VALUES
    (
        'Tecnología & Software',
        'Desarrollo Frontend/Backend, Cloud Infrastructure, DevOps, Redes y Ciberseguridad.',
        'Laptop'
    ),
    (
        'Operaciones & Oficios Técnicos',
        'Electricidad Industrial, Mecánica, Mantenimiento de Planta, Soldadura y Sistemas HVAC.',
        'Wrench'
    ),
    (
        'Salud & Clínica',
        'Procedimientos clínicos, Farmacología, Enfermería, Asistencia Médica y Normas HIPAA.',
        'HeartPulse'
    ),
    (
        'Finanzas & Contabilidad',
        'Auditoría Financiera, Normas NIIF/IFRS, Impuestos Corporativos y Modelación Financiera.',
        'TrendingUp'
    ),
    (
        'Ventas & Marketing Digital',
        'Prospección B2B, Growth Marketing, Gestión de CRM, Estrategia SEM/SEO y Negociación.',
        'Megaphone'
    ),
    (
        'Recursos Humanos & Gestión',
        'Reclutamiento Técnico, Legislación Laboral, Compensaciones y Clima Organizacional.',
        'Users'
    )
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description, icon = EXCLUDED.icon;
