'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import { User } from "@supabase/supabase-js"


export async function authAction(formData: FormData): Promise<User | null> {
  const action = formData.get("action");

  if (action === "login") {
    return login(formData);
  }

  if (action === "signup") {
    return signup(formData);
  }

  return null;
}


async function login(formData: FormData): Promise<User> {
  const supabase = await createClient()
  const userData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const { data, error } = await supabase.auth.signInWithPassword(userData)
  if (error) {
    throw error;
  }
  return data.user;
}


async function signup(formData: FormData): Promise<User | null> {
  const supabase = await createClient()
  const userData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signUp(userData)
  if (error) {
    throw error;
  }
  return data.user;
}


export async function signout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      redirect('/error')
    }
    return true;
}
