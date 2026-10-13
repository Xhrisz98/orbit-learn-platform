import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export const authService = {
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Error fetching Supabase session:', error.message);
      return null;
    }
    return data.session;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Recruiter',
      role: user.user_metadata?.role || 'recruiter',
    };
  },

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      // Local fallback for development if Supabase not configured
      const mockUser: AuthUser = {
        id: 'recruiter-admin-local',
        email,
        name: email.split('@')[0],
        role: 'recruiter',
      };
      localStorage.setItem('skillproof_admin_session', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Recruiter',
      role: 'recruiter',
    };

    localStorage.setItem('skillproof_admin_session', JSON.stringify(user));
    return { user, error: null };
  },

  async signUp(email: string, password: string, fullName: string = ''): Promise<{ user: AuthUser | null; error: string | null; requiresEmailConfirmation?: boolean }> {
    if (!isSupabaseConfigured) {
      const mockUser: AuthUser = {
        id: 'recruiter-admin-local',
        email,
        name: fullName || email.split('@')[0],
        role: 'recruiter',
      };
      localStorage.setItem('skillproof_admin_session', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'recruiter',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user && !data.session) {
      // Supabase has email confirmation enabled
      return { user: null, error: null, requiresEmailConfirmation: true };
    }

    const user: AuthUser = {
      id: data.user?.id || 'admin-user',
      email: data.user?.email || '',
      name: fullName || data.user?.email?.split('@')[0] || 'Recruiter',
      role: 'recruiter',
    };

    localStorage.setItem('skillproof_admin_session', JSON.stringify(user));
    return { user, error: null };
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('skillproof_admin_session');
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },
};
