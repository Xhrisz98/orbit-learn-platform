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
    const val = candidate.avatar.replace('gender:', '').toLowerCase();
    if (val === 'female' || val === 'mujer') return 'female';
    if (val === 'male' || val === 'hombre') return 'male';
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
  if (!name) return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
