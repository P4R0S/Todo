'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Task, TaskWithSubtasks, Priority } from '@/lib/types'

export async function getTasksForProject(projectId: string): Promise<TaskWithSubtasks[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks(*)')
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as TaskWithSubtasks[]
}

export async function getTodayTasks(today: string): Promise<(TaskWithSubtasks & { project: { name: string; color: string } })[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks(*), project:projects(name, color)')
    .is('deleted_at', null)
    .eq('completed', false)
    .or(`due_date.lte.${today},priority.eq.urgent`)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as any
}

export async function getAllTasks(): Promise<(TaskWithSubtasks & { project: { id: string; name: string; color: string } })[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*, subtasks(*), project:projects(id, name, color)')
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as any
}

export async function createTask(input: {
  project_id: string
  title: string
  notes?: string
  due_date?: string
  priority?: Priority
}): Promise<Task> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, user_id: user.id, priority: input.priority ?? 'none' })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/', 'layout')
  return data
}

export async function updateTask(
  id: string,
  input: Partial<Pick<Task, 'title' | 'notes' | 'due_date' | 'priority' | 'completed' | 'completed_at'>>
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update(input).eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function completeTask(id: string, completed: boolean): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ completed, completed_at: completed ? new Date().toISOString() : null })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function softDeleteTask(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function restoreTask(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: null })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function hardDeleteTask(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}
