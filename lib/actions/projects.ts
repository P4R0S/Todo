'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/lib/types'

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createProject(input: {
  name: string; color: string; emoji?: string
}): Promise<Project> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/', 'layout')
  return data
}

export async function updateProject(
  id: string,
  input: Partial<Pick<Project, 'name' | 'color' | 'emoji'>>
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update(input).eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}
