import { supabase } from '../lib/supabase';
import type { Candidate } from '../types';
import { resolveCandidateGender } from '../utils/genderHelper';

export const candidateService = {
  async getAll(): Promise<Candidate[]> {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }

    return (data || []).map((c: any) => {
      let gender: 'male' | 'female' = 'male';
      let area = c.area || '';
      let secondaryAreas: string[] = [];

      if (c.avatar?.startsWith('gender:')) {
        const raw = c.avatar.replace('gender:', '');
        const parts = raw.split('|');
        for (const p of parts) {
          if (p === 'female' || p === 'male') gender = p;
          else if (p.startsWith('area:')) area = p.replace('area:', '');
          else if (p.startsWith('sec:')) {
            secondaryAreas = p.replace('sec:', '').split(';').map((s: string) => s.trim()).filter(Boolean);
          }
        }
      } else {
        gender = resolveCandidateGender({ name: c.name, avatar: c.avatar });
      }

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        roleApplied: c.role_applied,
        area: area || undefined,
        secondaryAreas: secondaryAreas.length > 0 ? secondaryAreas : undefined,
        avatar: c.avatar || `gender:${gender}`,
        gender,
        registeredAt: c.registered_at ? c.registered_at.split('T')[0] : '',
      };
    });
  },

  async create(candidateData: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'> & { gender?: 'male' | 'female'; area?: string; secondaryAreas?: string[] }): Promise<Candidate> {
    const secPart = candidateData.secondaryAreas && candidateData.secondaryAreas.length > 0
      ? `|sec:${candidateData.secondaryAreas.join(';')}`
      : '';
    const avatar = `gender:${candidateData.gender || 'male'}${candidateData.area ? `|area:${candidateData.area}` : ''}${secPart}`;

    const { data, error } = await supabase
      .from('candidates')
      .insert({
        name: candidateData.name,
        email: candidateData.email,
        role_applied: candidateData.roleApplied,
        avatar,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      roleApplied: data.role_applied,
      area: candidateData.area,
      secondaryAreas: candidateData.secondaryAreas,
      avatar: data.avatar,
      gender: candidateData.gender || 'male',
      registeredAt: data.registered_at ? data.registered_at.split('T')[0] : '',
    };
  },

  async update(
    candidateId: string,
    candidateData: { name: string; email: string; roleApplied: string; gender: 'male' | 'female'; area?: string; secondaryAreas?: string[] }
  ): Promise<Candidate> {
    const secPart = candidateData.secondaryAreas && candidateData.secondaryAreas.length > 0
      ? `|sec:${candidateData.secondaryAreas.join(';')}`
      : '';
    const avatar = `gender:${candidateData.gender}${candidateData.area ? `|area:${candidateData.area}` : ''}${secPart}`;

    const { data, error } = await supabase
      .from('candidates')
      .update({
        name: candidateData.name,
        email: candidateData.email,
        role_applied: candidateData.roleApplied,
        avatar,
      })
      .eq('id', candidateId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      roleApplied: data.role_applied,
      area: candidateData.area,
      secondaryAreas: candidateData.secondaryAreas,
      avatar: data.avatar,
      gender: candidateData.gender,
      registeredAt: data.registered_at ? data.registered_at.split('T')[0] : '',
    };
  },

  async delete(candidateId: string): Promise<void> {
    const { error } = await supabase.from('candidates').delete().eq('id', candidateId);
    if (error) throw error;
  },
};
