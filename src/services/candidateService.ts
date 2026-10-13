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

    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      roleApplied: c.role_applied,
      avatar: c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      registeredAt: c.registered_at ? c.registered_at.split('T')[0] : '',
    }));
  },

  async create(candidateData: Omit<Candidate, 'id' | 'registeredAt' | 'avatar'>): Promise<Candidate> {
    const avatars = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    ];

    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

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
      avatar: data.avatar,
      registeredAt: data.registered_at ? data.registered_at.split('T')[0] : '',
    };
  },

  async delete(candidateId: string): Promise<void> {
    const { error } = await supabase.from('candidates').delete().eq('id', candidateId);
    if (error) throw error;
  },
};
