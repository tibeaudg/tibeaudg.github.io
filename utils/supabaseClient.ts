import { createClient } from "@supabase/supabase-js";

// Make sure these environment variables are correctly set in .env.local
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Improved error handling with better type safety
const handleAuthError = (error: Error | null) => {
  if (error) {
    console.error("Authentication error:", error.message);
    return { error, user: null };
  }
  return { error: null, user: null };
};

const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) return handleAuthError(error);
    return { user: data.user, error: null };
  } catch (err) {
    return handleAuthError(err as Error);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    return await signIn(email, password);
  } catch (err: unknown) {
    console.error("Caught login error:", (err as Error).message);
    return { error: err as Error, user: null };
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    console.log("Registering user with email:", email);
    
    // More detailed signup with redirect URL configuration
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (signUpError) {
      console.error("Full signup error:", JSON.stringify(signUpError));
      return { user: null, error: signUpError, emailConfirmationRequired: false };
    }

    // Check if email confirmation is required
    if (!data.user?.confirmed_at || (data.user?.identities && data.user.identities.length === 0)) {
      console.log("Email confirmation required before login");
      return { 
        user: null, 
        error: null, 
        emailConfirmationRequired: true 
      };
    }

    // Only sign in automatically if email confirmation is not required
    console.log("User registered successfully. Logging in...");
    const loginResult = await signIn(email, password);

    return { 
      user: loginResult.user, 
      error: loginResult.error,
      emailConfirmationRequired: false
    };
  } catch (err: unknown) {
    console.error("Error during registration:", (err as Error).message);
    return { 
      user: null, 
      error: err as Error,
      emailConfirmationRequired: false 
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    console.log("Resetting password for email:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Error resetting password:", error.message);
      return { success: false, error };
    }

    console.log("Password reset email sent successfully");
    return { success: true, error: null };
  } catch (err: unknown) {
    console.error("Error sending password reset email:", (err as Error).message);
    return { success: false, error: err as Error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    if (newPassword.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      return { success: false, error };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error.message);
      return { success: false, error };
    }

    console.log("Password updated successfully");
    return { success: true, error: null };
  } catch (err: unknown) {
    console.error("Error updating password:", (err as Error).message);
    return { success: false, error: err as Error };
  }
};

export const confirmEmail = async (email: string, token: string) => {
  try {
    console.log("Confirming email for:", email);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      console.error("Error confirming email:", error.message);
      return { success: false, error };
    }

    console.log("Email confirmed successfully");
    return { success: true, error: null };
  } catch (err: unknown) {
    console.error("Error confirming email:", (err as Error).message);
    return { success: false, error: err as Error };
  }
};

// New helper to check if a user already exists
export const checkUserExists = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });
    
    // If there's no error about user not found, the user likely exists
    const userExists = !error || !error.message.includes("user not found");
    
    return { exists: userExists, error: null };
  } catch (err) {
    return { exists: false, error: err as Error };
  }
};

// New function to get the current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { 
      session: data.session, 
      user: data.session?.user || null,
      error: null 
    };
  } catch (err) {
    return { session: null, user: null, error: err as Error };
  }
};

// New function to sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err as Error };
  }
};