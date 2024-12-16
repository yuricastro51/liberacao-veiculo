import { User } from "../entities/user";
import { supabase } from "../lib/supabase";

export function useUserRepository() {
  async function loginAsync(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.from("user").select("*").eq("username", username.trim());
    if (error) {
      throw error;
    }

    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      return null;
    }
    
    const user = data[0];

    if (user.password !== password) {
      return null;
    }

    return user;
  }

  return {
    loginAsync
  }
}