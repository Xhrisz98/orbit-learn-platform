-- ==============================================================================
-- SkillProof: Datos Iniciales de Prueba (Seed Data)
-- Bancos: Industrial Electrician, IT Systems, Healthcare + Candidatos iniciales
-- ==============================================================================

-- 1. Insertar Candidatos
INSERT INTO public.candidates (id, name, email, role_applied, avatar, registered_at)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Sofia Chen', 'sofia.chen@skillproof-talent.com', 'Industrial Electrician (Journeyman)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', now()),
  ('c0000000-0000-0000-0000-000000000002', 'Mateo Rodriguez', 'mateo.rodriguez@skillproof-talent.com', 'Network Systems Administrator', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', now()),
  ('c0000000-0000-0000-0000-000000000003', 'Elena Gomez', 'elena.gomez@skillproof-talent.com', 'Certified Clinical Medical Assistant', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', now()),
  ('c0000000-0000-0000-0000-000000000004', 'Lucas Vance', 'lucas.vance@skillproof-talent.com', 'Electrical Apprentice / Maintenance Tech', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', now())
ON CONFLICT (email) DO NOTHING;

-- 2. Insertar Bancos de Preguntas (Quizzes)
INSERT INTO public.quizzes (id, title, category, description, time_limit_minutes, created_at)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Industrial Electrician & Trade Systems Bank', 'Construction & Skilled Trades', 'Comprehensive technical bank covering National Electrical Code (NEC), schematic interpretation, trade math, and Lockout/Tagout safety.', 30, now()),
  ('b0000000-0000-0000-0000-000000000002', 'IT Systems, Networking & Cloud Infrastructure Bank', 'IT & Technical', 'Technical questions covering IPv4 subnetting, DNS resolution, firewall security rules, Linux administration, and network troubleshooting.', 25, now()),
  ('b0000000-0000-0000-0000-000000000003', 'Healthcare & Clinical Safety Knowledge Bank', 'Healthcare & Clinical', 'Clinical procedures, patient safety protocols, HIPAA compliance standards, and dosage calculations for verified medical candidates.', 20, now())
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar Preguntas para Electricidad Industrial (Banco 1)
INSERT INTO public.questions (id, quiz_id, text, category_tag, explanation, options, correct_option_ids)
VALUES
  (
    'q0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Using Ohm''s Law, what is the current (Amps) flowing through a 240V industrial circuit with an impedance of 12 Ohms?',
    'Trade Math',
    'According to Ohm''s Law, Current (I) = Voltage (V) / Resistance (R). 240V / 12 Ohms = 20 Amps.',
    '[{"id":"opt-1","text":"10 Amps"},{"id":"opt-2","text":"20 Amps (I = V / R = 240 / 12)"},{"id":"opt-3","text":"2,880 Amps"},{"id":"opt-4","text":"0.05 Amps"}]'::jsonb,
    '["opt-2"]'::jsonb
  ),
  (
    'q0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'What is the mandatory first step before servicing an energized 480V 3-phase motor control center (MCC)?',
    'OSHA Safety',
    'NFPA 70E and OSHA mandate formal Lockout/Tagout followed by a live-dead-live zero voltage test.',
    '[{"id":"opt-1","text":"Verify de-energization using a calibrated multimeter (Zero-Energy State Verification)"},{"id":"opt-2","text":"Apply a single zip tie to the main breaker"},{"id":"opt-3","text":"Turn off the lights in the electrical room"},{"id":"opt-4","text":"Touch the conductors with the back of a leather glove"}]'::jsonb,
    '["opt-1"]'::jsonb
  ),
  (
    'q0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'Which conductor insulation color is reserved exclusively for Equipment Grounding Conductors under NEC standards?',
    'NEC Code',
    'NEC Article 250 requires equipment grounding conductors to be bare, covered, or insulated in green/yellow.',
    '[{"id":"opt-1","text":"Solid White or Natural Gray"},{"id":"opt-2","text":"Green or Green with Yellow stripes"},{"id":"opt-3","text":"Solid Black"},{"id":"opt-4","text":"Orange"}]'::jsonb,
    '["opt-2"]'::jsonb
  ),
  (
    'q0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000001',
    'In programmable logic controller (PLC) ladder logic, what condition makes an Examine If Closed (XIC / --[ ]--) instruction evaluate as True?',
    'PLC & Automation',
    'An XIC instruction tests for an ON (1) condition at the assigned address bit in data memory.',
    '[{"id":"opt-1","text":"When the referenced bit address in memory is equal to 1 (active/energized)"},{"id":"opt-2","text":"When the physical contact is open circuit"},{"id":"opt-3","text":"Only during PLC reboot"},{"id":"opt-4","text":"When analog voltage drops below 0V"}]'::jsonb,
    '["opt-1"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar Preguntas para IT & Networking (Banco 2)
INSERT INTO public.questions (id, quiz_id, text, category_tag, explanation, options, correct_option_ids)
VALUES
  (
    'q0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000002',
    'In IPv4 subnetting, how many usable host addresses are available in a /26 subnet mask (255.255.255.192)?',
    'Networking',
    'A /26 subnet leaves 6 host bits. 2^6 = 64 addresses. Subtracting network and broadcast yields 62 usable hosts.',
    '[{"id":"opt-1","text":"62 usable hosts (64 total minus Network and Broadcast)"},{"id":"opt-2","text":"64 usable hosts"},{"id":"opt-3","text":"126 usable hosts"},{"id":"opt-4","text":"30 usable hosts"}]'::jsonb,
    '["opt-1"]'::jsonb
  ),
  (
    'q0000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000002',
    'Which default network port is utilized by encrypted Secure Shell (SSH) connections?',
    'Network Security',
    'SSH operates on TCP port 22 by default.',
    '[{"id":"opt-1","text":"Port 22"},{"id":"opt-2","text":"Port 80"},{"id":"opt-3","text":"Port 443"},{"id":"opt-4","text":"Port 3389"}]'::jsonb,
    '["opt-1"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
