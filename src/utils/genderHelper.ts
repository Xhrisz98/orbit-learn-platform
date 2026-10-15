import type { Candidate } from '../types';

const FEMALE_NAMES = new Set([
  'sofia', 'sophia', 'elena', 'maria', 'ana', 'laura', 'carmen',
  'isabella', 'valentina', 'camila', 'lucia', 'daniela', 'paula',
  'andrea', 'mariana', 'gabriela', 'carolina', 'natalia', 'claudia',
  'patricia', 'diana', 'monica', 'rosa', 'sandra', 'valeria',
  'jessica', 'victoria', 'alicia', 'beatriz', 'fernanda', 'adriana',
  'sarah', 'emily', 'jessica', 'emma', 'olivia', 'ava', 'charlotte'
]);

export function resolveCandidateGender(candidate: Partial<Candidate>): 'male' | 'female' {
  if (candidate.gender) return candidate.gender;

  if (candidate.avatar?.startsWith('gender:')) {
    const raw = candidate.avatar.replace('gender:', '').toLowerCase();
    const [gPart] = raw.split('|');
    if (gPart === 'female' || gPart === 'mujer') return 'female';
    if (gPart === 'male' || gPart === 'hombre') return 'male';
  }

  // Check unsplash photo URLs in mockData for known females
  if (candidate.avatar?.includes('1534528741775') || candidate.avatar?.includes('1573496359142') || candidate.avatar?.includes('1494790108377')) {
    // Note: Sofia Chen, Elena Gomez, and stock female photos
    if (candidate.name && !candidate.name.toLowerCase().includes('jose') && !candidate.name.toLowerCase().includes('christian')) {
      return 'female';
    }
  }

  if (candidate.name) {
    const firstName = candidate.name.trim().split(/\s+/)[0].toLowerCase();
    if (FEMALE_NAMES.has(firstName)) {
      return 'female';
    }
  }

  return 'male';
}

export function getCandidateInitials(name: string): string {
  if (!name) return '?';
  const trimmed = name.trim();
  return (trimmed[0] || '?').toUpperCase();
}
