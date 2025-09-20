'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';




export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.admin.updateUserById(userId, 
      { "role": role }
    );

    if (error) {
      redirect('/error')
    }
    revalidatePath('/', 'layout')
    redirect('/');
    return data.user
}


export async function getUser() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return undefined;
    }
    return data.user
}