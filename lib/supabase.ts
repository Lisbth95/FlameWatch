import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "@/config/supabaseConfig";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);