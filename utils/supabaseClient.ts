// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Login gebruiker
export const loginUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
};

// Registratie gebruiker
export const registerUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
};

// Wachtwoord reset
export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) throw error;
};

// E-mail bevestiging
export const confirmEmail = async (token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    token,
    type: 'signup',
  });

  if (error) throw error;
};
