import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Login gebruiker
export const loginUser = async (email: string, password: string) => {
  console.log("Logging in user with email:", email);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }

  console.log("Login successful");
};

// Registratie gebruiker
export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  console.log("Registering user with email:", email);
  const { error: signUpError, user } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error("Error registering user:", signUpError.message);
    throw signUpError;
  }

  console.log("User registered successfully. Updating username...");

  // Voeg het username toe aan user_metadata na succesvolle registratie
  const { error: updateError } = await supabase.auth.updateUser({
    data: { username }, // Voeg de username toe aan user_metadata
  });

  if (updateError) {
    console.error("Error updating username:", updateError.message);
    throw updateError;
  }

  console.log("Username updated successfully");
  return user;
};

// Wachtwoord reset
export const resetPassword = async (email: string) => {
  console.log("Resetting password for email:", email);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error("Error resetting password:", error.message);
    throw error;
  }

  console.log("Password reset email sent successfully");
};

// Wachtwoord bijwerken
export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Error updating password:", error.message);
    throw error;
  }

  console.log("Password updated successfully");
};

// E-mail bevestiging
export const confirmEmail = async (token: string) => {
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
};
