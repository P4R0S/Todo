-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects
CREATE TABLE projects (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  color      text NOT NULL DEFAULT '#5E6AD2',
  emoji      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        text NOT NULL,
  notes        text,
  due_date     date,
  priority     text NOT NULL DEFAULT 'none'
                 CHECK (priority IN ('none','low','medium','high','urgent')),
  completed    boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  deleted_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Subtasks
CREATE TABLE subtasks (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id    uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title      text NOT NULL,
  completed  boolean NOT NULL DEFAULT false,
  position   integer NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX idx_tasks_user_id    ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_due_date   ON tasks(due_date);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: enable
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- RLS: projects
CREATE POLICY "projects_select" ON projects FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "projects_insert" ON projects FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "projects_update" ON projects FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "projects_delete" ON projects FOR DELETE USING (user_id = auth.uid());

-- RLS: tasks (also verifies project ownership on write)
CREATE POLICY "tasks_select" ON tasks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "tasks_insert" ON tasks FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
  );

CREATE POLICY "tasks_update" ON tasks FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
  );

CREATE POLICY "tasks_delete" ON tasks FOR DELETE USING (user_id = auth.uid());

-- RLS: subtasks (via parent task ownership)
CREATE POLICY "subtasks_select" ON subtasks FOR SELECT
  USING (EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()));

CREATE POLICY "subtasks_insert" ON subtasks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()));

CREATE POLICY "subtasks_update" ON subtasks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()));

CREATE POLICY "subtasks_delete" ON subtasks FOR DELETE
  USING (EXISTS (SELECT 1 FROM tasks WHERE id = task_id AND user_id = auth.uid()));
