import { getTodayString, sortTasks, priorityOrder } from '@/lib/utils'

describe('getTodayString', () => {
  it('returns YYYY-MM-DD string', () => {
    const result = getTodayString()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('priorityOrder', () => {
  it('urgent is highest (lowest number)', () => {
    expect(priorityOrder('urgent')).toBeLessThan(priorityOrder('high'))
    expect(priorityOrder('high')).toBeLessThan(priorityOrder('medium'))
    expect(priorityOrder('medium')).toBeLessThan(priorityOrder('low'))
    expect(priorityOrder('low')).toBeLessThan(priorityOrder('none'))
  })
})

describe('sortTasks', () => {
  const base = {
    user_id: 'u1', project_id: 'p1', notes: null, due_date: null,
    completed: false, completed_at: null, deleted_at: null, updated_at: '',
  }

  it('sorts urgent before high', () => {
    const tasks = [
      { ...base, id: '1', title: 'A', priority: 'high' as const,   created_at: '2024-01-01' },
      { ...base, id: '2', title: 'B', priority: 'urgent' as const, created_at: '2024-01-02' },
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].id).toBe('2')
  })

  it('sorts same-priority by due_date ASC, nulls last', () => {
    const tasks = [
      { ...base, id: '1', title: 'A', priority: 'high' as const, due_date: null,         created_at: '2024-01-01' },
      { ...base, id: '2', title: 'B', priority: 'high' as const, due_date: '2024-06-01', created_at: '2024-01-02' },
      { ...base, id: '3', title: 'C', priority: 'high' as const, due_date: '2024-05-01', created_at: '2024-01-03' },
    ]
    const sorted = sortTasks(tasks)
    expect(sorted.map(t => t.id)).toEqual(['3', '2', '1'])
  })

  it('tie-breaks same priority + due_date by created_at ASC', () => {
    const tasks = [
      { ...base, id: '1', title: 'A', priority: 'low' as const, due_date: '2024-06-01', created_at: '2024-01-02' },
      { ...base, id: '2', title: 'B', priority: 'low' as const, due_date: '2024-06-01', created_at: '2024-01-01' },
    ]
    const sorted = sortTasks(tasks)
    expect(sorted[0].id).toBe('2')
  })
})
