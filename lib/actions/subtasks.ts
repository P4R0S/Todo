'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Subtask } from '@/lib/types'

export async function createSubtask(taskId: string, title: string, position: number): Promise<Subtask> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subtasks')
    .insert({ task_id: taskId, title, position })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/', 'layout')
  return data
}

export async function updateSubtask(id: string, input: Partial<Pick<Subtask, 'title' | 'completed'>>): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('subtasks').update(input).eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}

export async function deleteSubtask(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('subtasks').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/', 'layout')
}
