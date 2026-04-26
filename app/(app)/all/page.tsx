import { getAllTasks } from '@/lib/actions/tasks'
import { getProjects } from '@/lib/actions/projects'
import { AllTasksClient } from '@/components/all-tasks-client'

export default async function AllPage() {
  const [tasks, projects] = await Promise.all([getAllTasks(), getProjects()])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-5 pb-0 flex-shrink-0">
        <h1
          className="text-[26px] font-extrabold text-[#f0f0f5] leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          All Tasks
        </h1>
        <p className="text-[12px] text-[#454a5c] mt-0.5">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        <AllTasksClient tasks={tasks as any} projects={projects} />
      </div>
    </div>
  )
}
