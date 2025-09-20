'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import { User } from "@supabase/supabase-js"
import { updateUserEmailVerification } from '@/database/Users';


export async function authAction(formData: FormData): Promise<{ success: boolean, user?: User, error?: string }> {
  const action = formData.get("action");

  if (action === "login") {
    return login(formData);
  }

  if (action === "signup") {
    return signup(formData);
  }

  return { success: false };
}


async function login(formData: FormData): Promise<{ success: boolean, user?: User, error?: string }> {
  const supabase = await createClient()
  const userData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const { data, error } = await supabase.auth.signInWithPassword(userData)
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, user: data.user };
}


async function signup(formData: FormData): Promise<{ success: boolean, user?: User, error?: string }> {
  const supabase = await createClient()
  const userData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signUp(userData)
  if (error) {
    return { success: false, error: error.message };
  }

  await updateUserEmailVerification(data.user?.id ?? "");
  return login(formData);
}


export async function signout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      redirect('/error')
    }
    return true;
}
