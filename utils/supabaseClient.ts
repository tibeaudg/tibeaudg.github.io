import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return { error, user: null };
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    console.error("Caught login error:", err.message);
    return { error: err, user: null };
  }
};

export const registerUser = async (email: string, password: string, username: string) => {
  try {
    console.log("Registering user with email:", email);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Error registering user:", signUpError.message);
      throw signUpError;
    }

    console.log("User registered successfully. Logging in...");

    // Log the user in automatically after registration
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Error logging in after registration:", signInError.message);
      throw signInError;
    }

    console.log("Updating username...");

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { username },
    });

    if (updateError) {
      console.error("Error updating username:", updateError.message);
      throw updateError;
    }

    console.log("Username updated successfully");
    return data.user;
  } catch (err: any) {
    console.error("Error during registration:", err.message);
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
  } catch (err: any) {
    console.error("Error sending password reset email:", err.message);
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
  } catch (err: any) {
    console.error("Error updating password:", err.message);
    throw err;
  }
};

export const confirmEmail = async (token: string) => {
  try {
    console.log("Confirming email with token:", token);
    const { error } = await supabase.auth.verifyOtp({
      token,
      type: "signup",
    });

    if (error) {
      console.error("Error confirming email:", error.message);
      throw error;
    }

    console.log("Email confirmed successfully");
  } catch (err: any) {
    console.error("Error confirming email:", err.message);
    throw err;
  }
};