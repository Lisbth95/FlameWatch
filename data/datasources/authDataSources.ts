import { supabase } from "@/lib/supabase";

export class AuthDataSource {
  static async register(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  static async forgotPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
    if (error) throw error;
    return data;
  }

  static async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId);
    if (error) throw error;
    return data;
  }
}
