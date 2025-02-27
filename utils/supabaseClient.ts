import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAuthError = (error: any) => {
  if (error) {
    console.error("Authentication error:", error.message);
    return { error, user: null };
  }
  return { error: null, user: null };
};

const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
return error ? handleAuthError(error) : { user: data.user, error: null };
};






export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    return await signIn(email, password);
  } catch (err: unknown) {
    console.error("Caught login error:", (err as Error).message);
    return { error: err, user: null };
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    console.log("Registering user with email:", email);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Error registering user:", signUpError.message);
      throw signUpError;
    }

    console.log("User registered successfully. Logging in...");
    const loginResult = await signIn(email, password);

    if (loginResult.error) {
      throw loginResult.error;
    }

    return loginResult.user;
  } catch (err: unknown) {
    console.error("Error during registration:", (err as Error).message);
    throw err;
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
      throw error;
    }

    console.log("Password reset email sent successfully");
  } catch (err: unknown) {
    console.error("Error sending password reset email:", (err as Error).message);
    throw err;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error.message);
      throw error;
    }

    console.log("Password updated successfully");
  } catch (err: unknown) {
    console.error("Error updating password:", (err as Error).message);
    throw err;
  }
};

export const confirmEmail = async (email: string, token: string) => {
  try {
    console.log("Confirming email with token:", token);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      console.error("Error confirming email:", error.message);
      throw error;
    }

    console.log("Email confirmed successfully");
  } catch (err: unknown) {
    console.error("Error confirming email:", (err as Error).message);
    throw err;
  }
};
