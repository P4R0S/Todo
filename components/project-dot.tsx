interface ProjectDotProps { color: string; size?: 'sm' | 'md' }

export function ProjectDot({ color, size = 'sm' }: ProjectDotProps) {
  const px = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
  return <span className={`${px} rounded-full flex-shrink-0 inline-block`} style={{ background: color }} />
}
