import { supabase } from '../lib/supabase';
import type { Candidate } from '../types';

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

      if (c.avatar?.startsWith('gender:')) {
        const raw = c.avatar.replace('gender:', '');
        const [gPart, aPart] = raw.split('|');
        if (gPart === 'female' || gPart === 'male') gender = gPart;
        if (aPart?.startsWith('area:')) {
          area = aPart.replace('area:', '');
        }
      }

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        roleApplied: c.role_applied,
        area: area || undefined,
        avatar: c.avatar || 'gender:male',
        gender,
        registeredAt: c.registered_at ? c.registered_at.split('T')[0] : '',
      };
    });
  },

  async create(candidateData: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'> & { gender?: 'male' | 'female'; area?: string }): Promise<Candidate> {
    const avatar = `gender:${candidateData.gender || 'male'}${candidateData.area ? `|area:${candidateData.area}` : ''}`;

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
      avatar: data.avatar,
      gender: candidateData.gender || 'male',
      registeredAt: data.registered_at ? data.registered_at.split('T')[0] : '',
    };
  },

  async delete(candidateId: string): Promise<void> {
    const { error } = await supabase.from('candidates').delete().eq('id', candidateId);
    if (error) throw error;
  },
};
