import { supabase } from '../supabaseClient'

export const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    });

    if (error) {
      console.log(error.error_description || error.message);
      return false;
    }

    return true;
}