import { createClient } from '@supabase/supabase-js';
import { api } from './api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

// Auth helper supporting Supabase Auth, local SQLite DB auth, and offline fallback
export const authService = {
  async signIn(email: string, password: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    // Try SQLite backend database first
    try {
      const res = await api.loginLocalDb(email);
      if (res.user) {
        return {
          user: {
            id: res.user.id,
            email: res.user.email,
            user_metadata: {
              username: res.user.username,
              full_name: res.user.fullName,
              avatar_url: res.user.avatarUrl,
            },
          },
        };
      }
    } catch {
      // Offline demo fallback
    }

    await new Promise((res) => setTimeout(res, 300));
    return {
      user: {
        id: 'usr-demo-' + Math.random().toString(36).substring(7),
        email,
        user_metadata: {
          username: email.split('@')[0],
          full_name: email.split('@')[0],
          avatar_url:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      },
    };
  },

  async signUp(email: string, password: string, username?: string) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            full_name: username || email.split('@')[0],
          },
        },
      });
      if (error) throw error;
      return data;
    }

    // Try SQLite backend database first
    try {
      const res = await api.signupLocalDb(email, username);
      if (res.user) {
        return {
          user: {
            id: res.user.id,
            email: res.user.email,
            user_metadata: {
              username: res.user.username,
              full_name: res.user.fullName,
              avatar_url: res.user.avatarUrl,
            },
          },
        };
      }
    } catch {
      // Offline demo fallback
    }

    await new Promise((res) => setTimeout(res, 300));
    return {
      user: {
        id: 'usr-demo-' + Math.random().toString(36).substring(7),
        email,
        user_metadata: {
          username: username || email.split('@')[0],
          full_name: username || email.split('@')[0],
          avatar_url:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      },
    };
  },

  async signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },
};
