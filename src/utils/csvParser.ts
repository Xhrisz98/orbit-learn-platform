import type { Question } from '../types';

/**
 * Standard CSV Template content generator
 */
export const generateCsvTemplate = (): string => {
  const headers = 'question_text,option_a,option_b,option_c,option_d,correct_options,explanation,category_tag,difficulty,target_roles';
  const sampleRows = [
    '"¿Qué instrumento se utiliza para medir la corriente eléctrica?","Voltímetro","Amperímetro","Óhmetro","Vatímetro","B","El amperímetro mide corriente en amperios conectándose en serie.","Electricidad","1","Electrician; Maintenance Worker"',
    '"¿Cuáles de los siguientes son protocolos de la capa de transporte?","TCP","UDP","IP","HTTP","A,B","TCP y UDP operan en la capa 4 de transporte del modelo OSI.","Redes & IT","2","IT Network Analyst; Network Specialist"',
    '"¿Cuál es el rango normal de presión arterial en un adulto en reposo?","120/80 mmHg","140/90 mmHg","90/60 mmHg","150/100 mmHg","A","120/80 mmHg es la referencia estándar según la OMS.","Signos Vitales","3","Clinical Nurse Specialist; Healthcare Analyst"',
  ];
  return `${headers}\n${sampleRows.join('\n')}\n`;
};

/**
 * Triggers a browser file download of the CSV template
 */
export const downloadCsvTemplate = () => {
  const csvContent = generateCsvTemplate();
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'plantilla_preguntas_skillproof.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Robust CSV line splitter that respects quoted strings containing commas
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parse CSV text into validated Question array
 */
export function parseQuestionsCsv(csvText: string): {
  questions: Question[];
  errors: string[];
  difficulty?: 1 | 2 | 3;
  targetRoles?: string[];
} {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { questions: [], errors: ['El archivo CSV está vacío o solo contiene encabezados.'] };
  }

  const headerTokens = splitCsvLine(lines[0]).map(h => h.toLowerCase().replace(/['"]/g, '').trim());
  
  // Find column indexes
  const colText = headerTokens.findIndex(h => h.includes('question') || h.includes('pregunta') || h.includes('text'));
  const colOptA = headerTokens.findIndex(h => h === 'option_a' || h === 'opcion_a' || h === 'a');
  const colOptB = headerTokens.findIndex(h => h === 'option_b' || h === 'opcion_b' || h === 'b');
  const colOptC = headerTokens.findIndex(h => h === 'option_c' || h === 'opcion_c' || h === 'c');
  const colOptD = headerTokens.findIndex(h => h === 'option_d' || h === 'opcion_d' || h === 'd');
  const colCorrect = headerTokens.findIndex(h => h.includes('correct') || h.includes('respuesta'));
  const colExpl = headerTokens.findIndex(h => h.includes('expl') || h.includes('justificacion'));
  const colTag = headerTokens.findIndex(h => h.includes('tag') || h.includes('cat') || h.includes('tema'));
  const colDiff = headerTokens.findIndex(h => h.includes('diff') || h.includes('dificultad') || h.includes('level') || h.includes('nivel'));
  const colRoles = headerTokens.findIndex(h => h.includes('role') || h.includes('clasificacion') || h.includes('classification') || h.includes('puesto') || h.includes('target'));

  if (colText === -1 || colOptA === -1 || colOptB === -1 || colCorrect === -1) {
    return {
      questions: [],
      errors: [
        'Formato CSV no reconocido. Las columnas obligatorias son: question_text, option_a, option_b, option_c, option_d, correct_options.',
      ],
    };
  }

  const questions: Question[] = [];
  const errors: string[] = [];
  let detectedDifficulty: 1 | 2 | 3 | undefined = undefined;
  const detectedRolesSet = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rawTokens = splitCsvLine(lines[i]);
    if (rawTokens.length === 0 || (rawTokens.length === 1 && !rawTokens[0])) continue;

    const text = rawTokens[colText]?.replace(/^"|"$/g, '').trim();
    const optA = rawTokens[colOptA]?.replace(/^"|"$/g, '').trim();
    const optB = rawTokens[colOptB]?.replace(/^"|"$/g, '').trim();
    const optC = colOptC !== -1 ? rawTokens[colOptC]?.replace(/^"|"$/g, '').trim() : '';
    const optD = colOptD !== -1 ? rawTokens[colOptD]?.replace(/^"|"$/g, '').trim() : '';
    const rawCorrect = rawTokens[colCorrect]?.replace(/^"|"$/g, '').trim() || '';
    const explanation = colExpl !== -1 ? rawTokens[colExpl]?.replace(/^"|"$/g, '').trim() : '';
    const categoryTag = colTag !== -1 ? rawTokens[colTag]?.replace(/^"|"$/g, '').trim() : '';

    if (colDiff !== -1 && !detectedDifficulty) {
      const rawDiff = rawTokens[colDiff]?.replace(/^"|"$/g, '').trim();
      const numDiff = parseInt(rawDiff, 10);
      if (numDiff === 1 || numDiff === 2 || numDiff === 3) {
        detectedDifficulty = numDiff as 1 | 2 | 3;
      }
    }

    if (colRoles !== -1) {
      const rawRoles = rawTokens[colRoles]?.replace(/^"|"$/g, '').trim();
      if (rawRoles) {
        rawRoles.split(';').map(r => r.trim()).filter(Boolean).forEach(r => detectedRolesSet.add(r));
      }
    }

    if (!text) {
      errors.push(`Fila ${i + 1}: El texto de la pregunta está vacío.`);
      continue;
    }

    if (!optA || !optB) {
      errors.push(`Fila ${i + 1}: Debe incluir al menos Opción A y Opción B.`);
      continue;
    }

    // Build options
    const options = [
      { id: 'opt-a', text: optA },
      { id: 'opt-b', text: optB },
    ];
    if (optC) options.push({ id: 'opt-c', text: optC });
    if (optD) options.push({ id: 'opt-d', text: optD });

    // Parse correct option ids
    // Matches A, B, C, D or 1, 2, 3, 4
    const correctOptionIds: string[] = [];
    const normalizedCorrect = rawCorrect.toUpperCase();

    if (normalizedCorrect.includes('A') || normalizedCorrect.includes('1')) correctOptionIds.push('opt-a');
    if (normalizedCorrect.includes('B') || normalizedCorrect.includes('2')) correctOptionIds.push('opt-b');
    if (normalizedCorrect.includes('C') || normalizedCorrect.includes('3')) correctOptionIds.push('opt-c');
    if (normalizedCorrect.includes('D') || normalizedCorrect.includes('4')) correctOptionIds.push('opt-d');

    if (correctOptionIds.length === 0) {
      errors.push(`Fila ${i + 1}: No se identificó ninguna respuesta correcta válida (usa A, B, C o D).`);
      continue;
    }

    questions.push({
      id: `q-csv-${Date.now()}-${i}`,
      text,
      options,
      correctOptionIds,
      explanation: explanation || '',
      categoryTag: categoryTag || '',
    });
  }

  return {
    questions,
    errors,
    difficulty: detectedDifficulty,
    targetRoles: detectedRolesSet.size > 0 ? Array.from(detectedRolesSet) : undefined,
  };
}
