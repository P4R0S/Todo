export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  user_id: string
  name: string
  color: string
  emoji: string | null
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id: string
  title: string
  notes: string | null
  due_date: string | null   // YYYY-MM-DD
  priority: Priority
  completed: boolean
  completed_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Subtask {
  id: string
  task_id: string
  title: string
  completed: boolean
  position: number
}

export interface TaskWithSubtasks extends Task {
  subtasks: Subtask[]
}

export interface TaskWithProject extends Task {
  project: Project
}
