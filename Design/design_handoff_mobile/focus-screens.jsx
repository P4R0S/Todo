// focus-screens.jsx — All app screens

// ── LOGIN ────────────────────────────────────────────────────
function LoginScreen() {
  const { T, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // login | signup

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('today'); }, 900);
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'32px 24px 40px', overflowY:'auto' }}>
      {/* Logo */}
      <div style={{ marginTop:24, marginBottom:40 }}>
        <div style={{
          width:52, height:52, borderRadius:14,
          background:`linear-gradient(135deg, ${T.accent}, ${T.accentBlue})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 0 24px rgba(124,111,247,0.45)`,
          marginBottom:20,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h1 style={{ fontFamily:T.fontDisplay, fontSize:28, fontWeight:800, color:T.text1, lineHeight:1.1, marginBottom:8 }}>
          {mode==='login' ? 'Welcome back' : 'Get started'}
        </h1>
        <p style={{ fontSize:14, color:T.text2, fontFamily:T.fontBody }}>
          {mode==='login' ? 'Sign in to your Focus workspace' : 'Create your Focus account'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <label style={{ fontSize:10, fontWeight:700, color:T.text3, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:T.fontDisplay, display:'block', marginBottom:6 }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
              borderRadius:12, padding:'12px 14px', fontSize:14, color:T.text1,
              fontFamily:T.fontBody, outline:'none',
              transition:'border-color 0.2s',
            }}
            onFocus={e=>e.target.style.borderColor='rgba(124,111,247,0.5)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
          />
        </div>
        <div>
          <label style={{ fontSize:10, fontWeight:700, color:T.text3, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:T.fontDisplay, display:'block', marginBottom:6 }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
              borderRadius:12, padding:'12px 14px', fontSize:14, color:T.text1,
              fontFamily:T.fontBody, outline:'none', transition:'border-color 0.2s',
            }}
            onFocus={e=>e.target.style.borderColor='rgba(124,111,247,0.5)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
          />
        </div>

        <button type="submit" disabled={loading} style={{
          width:'100%', padding:'14px', borderRadius:14, border:'none', cursor:'pointer',
          background:`linear-gradient(135deg, ${T.accent}, ${T.accentBlue})`,
          color:'white', fontSize:14, fontWeight:700, fontFamily:T.fontBody,
          boxShadow:`0 0 24px rgba(124,111,247,0.35)`,
          opacity: loading ? 0.7 : 1, transition:'opacity 0.2s, transform 0.15s',
          marginTop:4,
        }}>
          {loading ? 'Signing in…' : (mode==='login' ? 'Sign in' : 'Create account')}
        </button>

        <button type="button" onClick={() => navigate('today')} style={{
          background:'none', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:14,
          color:T.text2, fontSize:13, fontFamily:T.fontBody, padding:'13px', cursor:'pointer',
        }}>
          Continue as guest →
        </button>
      </form>

      <div style={{ marginTop:28, textAlign:'center' }}>
        <span style={{ fontSize:13, color:T.text3, fontFamily:T.fontBody }}>
          {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
        </span>
        <button onClick={() => setMode(m => m==='login'?'signup':'login')} style={{
          background:'none', border:'none', color:T.accent, fontSize:13, cursor:'pointer',
          fontWeight:600, fontFamily:T.fontBody,
        }}>
          {mode==='login' ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}

// ── TODAY ────────────────────────────────────────────────────
function TodayScreen() {
  const { T, tasks, projects, setShowCreate } = useApp();
  const todayTasks = tasks.filter(t => t.due_date === today || (!t.due_date && !t.completed));
  const done = todayTasks.filter(t => t.completed).length;
  const total = todayTasks.length;
  const pct = total ? Math.round((done/total)*100) : 0;

  const dayLabel = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  const activeTasks = todayTasks.filter(t => !t.completed);
  const completedTasks = todayTasks.filter(t => t.completed);

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'0 16px' }}>
      {/* Header */}
      <div style={{ padding:'20px 4px 16px' }}>
        <p style={{ fontSize:11, color:T.text3, fontFamily:T.fontDisplay, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:4 }}>{dayLabel}</p>
        <h2 style={{ fontSize:26, fontWeight:800, color:T.text1, fontFamily:T.fontDisplay, lineHeight:1.1 }}>Today</h2>

        {/* Progress bar */}
        <div style={{ marginTop:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:11, color:T.text3, fontFamily:T.fontBody, fontWeight:500 }}>{done} of {total} complete</span>
            <span style={{ fontSize:11, color:T.accent, fontFamily:T.fontDisplay, fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,0.05)', borderRadius:99, overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:99, width:`${pct}%`,
              background:`linear-gradient(90deg, ${T.accent}, ${T.accentBlue})`,
              boxShadow:`0 0 8px rgba(124,111,247,0.5)`,
              transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}/>
          </div>
        </div>
      </div>

      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <>
          <SectionHeader label="To do" count={activeTasks.length} />
          {activeTasks.map(t => <TaskRow key={t.id} task={t} showProject />)}
        </>
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <>
          <SectionHeader label="Completed" count={completedTasks.length} />
          {completedTasks.map(t => <TaskRow key={t.id} task={t} showProject />)}
        </>
      )}

      {total === 0 && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 0', gap:12 }}>
          <div style={{ width:52,height:52,borderRadius:16,background:'rgba(124,111,247,0.08)',border:'1px solid rgba(124,111,247,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <p style={{ fontSize:14,fontWeight:700,color:T.text1,fontFamily:T.fontDisplay }}>All clear!</p>
          <p style={{ fontSize:13,color:T.text2,fontFamily:T.fontBody,textAlign:'center',lineHeight:1.5 }}>No tasks for today. Add one to get started.</p>
        </div>
      )}

      <div style={{ height:100 }} />
    </div>
  );
}

// ── ALL TASKS ────────────────────────────────────────────────
function AllTasksScreen() {
  const { T, tasks, projects } = useApp();
  const [filter, setFilter] = useState('all'); // all | active | completed

  const filtered = tasks.filter(t =>
    filter==='all' ? true : filter==='active' ? !t.completed : t.completed
  );

  // Group by project
  const byProject = {};
  filtered.forEach(t => {
    if (!byProject[t.project_id]) byProject[t.project_id] = [];
    byProject[t.project_id].push(t);
  });

  const tabs = ['all','active','completed'];

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'0 16px' }}>
      <div style={{ padding:'20px 4px 16px' }}>
        <h2 style={{ fontSize:26, fontWeight:800, color:T.text1, fontFamily:T.fontDisplay }}>All Tasks</h2>
        <p style={{ fontSize:12, color:T.text3, fontFamily:T.fontBody, marginTop:3 }}>{tasks.length} total</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:4, background:T.surface1, borderRadius:12, padding:4 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            flex:1, padding:'7px 0', borderRadius:9, border:'none', cursor:'pointer',
            background: filter===tab ? 'rgba(124,111,247,0.18)' : 'transparent',
            color: filter===tab ? T.accent : T.text3,
            fontSize:12, fontWeight:700, fontFamily:T.fontDisplay, letterSpacing:'0.02em',
            textTransform:'capitalize', transition:'all 0.2s',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      {projects.map(proj => {
        const pts = byProject[proj.id];
        if (!pts || !pts.length) return null;
        return (
          <div key={proj.id}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'16px 0 8px' }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:proj.color,boxShadow:`0 0 6px ${proj.color}99` }} />
              <span style={{ fontSize:11,fontWeight:700,color:T.text3,textTransform:'uppercase',letterSpacing:'0.08em',fontFamily:T.fontDisplay }}>{proj.name}</span>
              <span style={{ fontSize:10,color:T.text3,background:T.surface2,padding:'1px 6px',borderRadius:99,fontWeight:700 }}>{pts.length}</span>
            </div>
            {pts.map(t => <TaskRow key={t.id} task={t} />)}
          </div>
        );
      })}
      <div style={{ height:100 }} />
    </div>
  );
}

// ── PROJECTS LIST ────────────────────────────────────────────
function ProjectsScreen() {
  const { T, projects, tasks, navigate, setSelProject } = useApp();

  function openProject(p) { setSelProject(p); navigate('project-detail'); }

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'0 16px' }}>
      <div style={{ padding:'20px 4px 16px' }}>
        <h2 style={{ fontSize:26, fontWeight:800, color:T.text1, fontFamily:T.fontDisplay }}>Projects</h2>
        <p style={{ fontSize:12, color:T.text3, fontFamily:T.fontBody, marginTop:3 }}>{projects.length} projects</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {projects.map(proj => {
          const ptasks = tasks.filter(t => t.project_id === proj.id);
          const done = ptasks.filter(t => t.completed).length;
          const pct = ptasks.length ? Math.round((done/ptasks.length)*100) : 0;
          const overdue = ptasks.filter(t => !t.completed && t.due_date && t.due_date < today).length;

          return (
            <button key={proj.id} onClick={() => openProject(proj)} style={{
              background:T.surface1, border:`1px solid ${T.border}`, borderRadius:16,
              padding:16, cursor:'pointer', textAlign:'left', transition:'all 0.2s',
              display:'flex', flexDirection:'column', gap:12,
            }}
              onMouseDown={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
              onMouseUp={e=>e.currentTarget.style.background=T.surface1}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{
                    width:36, height:36, borderRadius:10,
                    background:`${proj.color}18`, border:`1px solid ${proj.color}30`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <div style={{ width:12,height:12,borderRadius:'50%',background:proj.color,boxShadow:`0 0 8px ${proj.color}` }} />
                  </div>
                  <div>
                    <p style={{ fontSize:15,fontWeight:700,color:T.text1,fontFamily:T.fontDisplay }}>{proj.name}</p>
                    <p style={{ fontSize:11,color:T.text3,fontFamily:T.fontBody,marginTop:1 }}>{ptasks.length} tasks · {done} done</p>
                  </div>
                </div>
                {overdue > 0 && (
                  <span style={{ fontSize:10,fontWeight:700,color:T.danger,background:'rgba(248,113,113,0.1)',border:'1px solid rgba(248,113,113,0.2)',padding:'3px 8px',borderRadius:99,fontFamily:T.fontDisplay }}>
                    {overdue} late
                  </span>
                )}
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:10,color:T.text3,fontFamily:T.fontBody }}>{pct}% complete</span>
                </div>
                <div style={{ height:3, background:'rgba(255,255,255,0.05)', borderRadius:99 }}>
                  <div style={{ height:'100%', borderRadius:99, width:`${pct}%`, background:proj.color, boxShadow:`0 0 6px ${proj.color}80`, transition:'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ height:100 }} />
    </div>
  );
}

// ── PROJECT DETAIL ───────────────────────────────────────────
function ProjectDetailScreen() {
  const { T, selProject, tasks, navigate, goBack } = useApp();
  if (!selProject) return null;
  const proj = selProject;
  const ptasks = tasks.filter(t => t.project_id === proj.id);
  const active = ptasks.filter(t => !t.completed);
  const done   = ptasks.filter(t => t.completed);
  const pct    = ptasks.length ? Math.round((done.length/ptasks.length)*100) : 0;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Project header */}
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}` }}>
        <button onClick={goBack} style={{ background:'none',border:'none',color:T.text3,cursor:'pointer',display:'flex',alignItems:'center',gap:5,marginBottom:14,padding:0,fontFamily:T.fontBody,fontSize:13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Projects
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40,height:40,borderRadius:11,background:`${proj.color}18`,border:`1px solid ${proj.color}30`,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <div style={{ width:14,height:14,borderRadius:'50%',background:proj.color,boxShadow:`0 0 8px ${proj.color}` }} />
          </div>
          <div>
            <h2 style={{ fontSize:20,fontWeight:800,color:T.text1,fontFamily:T.fontDisplay }}>{proj.name}</h2>
            <p style={{ fontSize:11,color:T.text3,fontFamily:T.fontBody }}>{done.length}/{ptasks.length} tasks complete</p>
          </div>
        </div>
        <div style={{ marginTop:12 }}>
          <div style={{ height:3,background:'rgba(255,255,255,0.05)',borderRadius:99 }}>
            <div style={{ height:'100%',borderRadius:99,width:`${pct}%`,background:proj.color,boxShadow:`0 0 8px ${proj.color}99`,transition:'width 0.6s cubic-bezier(0.16,1,0.3,1)' }}/>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'0 16px' }}>
        {active.length > 0 && (
          <>
            <SectionHeader label="Active" count={active.length} />
            {active.map(t => <TaskRow key={t.id} task={t} />)}
          </>
        )}
        {done.length > 0 && (
          <>
            <SectionHeader label="Completed" count={done.length} />
            {done.map(t => <TaskRow key={t.id} task={t} />)}
          </>
        )}
        {ptasks.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <p style={{ color:T.text3, fontFamily:T.fontBody, fontSize:13 }}>No tasks yet</p>
          </div>
        )}
        <div style={{ height:100 }} />
      </div>
    </div>
  );
}

// ── STATS ────────────────────────────────────────────────────
function StatsScreen() {
  const { T, PC, tasks, projects } = useApp();
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue   = tasks.filter(t => !t.completed && t.due_date && t.due_date < today).length;
  const todayTasks= tasks.filter(t => t.due_date === today).length;
  const pct       = total ? Math.round((completed/total)*100) : 0;

  // Animated ring
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  const r = 52, circ = 2 * Math.PI * r;
  const dash = circ * (1 - animPct/100);

  const PRIORITY_COUNTS = Object.entries(PC).map(([key, val]) => ({
    key, label: val.label, color: val.text,
    count: tasks.filter(t => t.priority===key && !t.completed).length,
  })).filter(x => x.count > 0);

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'0 16px' }}>
      <div style={{ padding:'20px 4px 16px' }}>
        <h2 style={{ fontSize:26, fontWeight:800, color:T.text1, fontFamily:T.fontDisplay }}>Stats</h2>
      </div>

      {/* Ring + overall */}
      <div style={{ background:T.surface1,border:`1px solid ${T.border}`,borderRadius:20,padding:'24px 20px',display:'flex',alignItems:'center',gap:24,marginBottom:12 }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
            <circle cx="60" cy="60" r={r} fill="none"
              stroke={`url(#grad)`} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition:'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={T.accent}/>
                <stop offset="100%" stopColor={T.accentBlue}/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column' }}>
            <span style={{ fontSize:22,fontWeight:800,color:T.text1,fontFamily:T.fontDisplay,lineHeight:1 }}>{animPct}%</span>
            <span style={{ fontSize:9,color:T.text3,fontFamily:T.fontDisplay,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginTop:2 }}>done</span>
          </div>
        </div>
        <div style={{ flex:1 }}>
          <StatLine label="Total tasks" value={total} />
          <StatLine label="Completed" value={completed} color={T.success} />
          <StatLine label="Overdue" value={overdue} color={overdue>0?T.danger:T.text3} />
          <StatLine label="Due today" value={todayTasks} color={T.warning} />
        </div>
      </div>

      {/* By project */}
      <SectionHeader label="By Project" />
      {projects.map(proj => {
        const pt = tasks.filter(t => t.project_id===proj.id);
        const pd = pt.filter(t => t.completed).length;
        const pp = pt.length ? Math.round((pd/pt.length)*100) : 0;
        return (
          <div key={proj.id} style={{ marginBottom:10,background:T.surface1,border:`1px solid ${T.border}`,borderRadius:14,padding:'12px 14px' }}>
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8 }}>
              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:proj.color,boxShadow:`0 0 6px ${proj.color}80` }}/>
                <span style={{ fontSize:13,fontWeight:600,color:T.text1,fontFamily:T.fontBody }}>{proj.name}</span>
              </div>
              <span style={{ fontSize:11,color:T.text2,fontFamily:T.fontBody }}>{pd}/{pt.length}</span>
            </div>
            <div style={{ height:3,background:'rgba(255,255,255,0.05)',borderRadius:99 }}>
              <div style={{ height:'100%',borderRadius:99,width:`${pp}%`,background:proj.color,transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}/>
            </div>
          </div>
        );
      })}

      {/* Priority breakdown */}
      {PRIORITY_COUNTS.length > 0 && (
        <>
          <SectionHeader label="Open by Priority" />
          <div style={{ background:T.surface1,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden' }}>
            {PRIORITY_COUNTS.map((p,i) => (
              <div key={p.key} style={{ display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderBottom: i<PRIORITY_COUNTS.length-1?`1px solid ${T.border}`:'none' }}>
                <span style={{ fontSize:10,fontWeight:700,color:p.color,fontFamily:T.fontDisplay,letterSpacing:'0.04em',width:44 }}>{p.label}</span>
                <div style={{ flex:1,height:4,background:'rgba(255,255,255,0.05)',borderRadius:99 }}>
                  <div style={{ height:'100%',borderRadius:99,background:p.color,width:`${(p.count/total)*100}%`,opacity:0.7 }}/>
                </div>
                <span style={{ fontSize:12,fontWeight:700,color:T.text2,fontFamily:T.fontDisplay,width:16,textAlign:'right' }}>{p.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ height:100 }} />
    </div>
  );
}

function StatLine({ label, value, color }) {
  const { T } = useApp();
  return (
    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
      <span style={{ fontSize:12,color:T.text3,fontFamily:T.fontBody }}>{label}</span>
      <span style={{ fontSize:16,fontWeight:800,color:color||T.text1,fontFamily:T.fontDisplay }}>{value}</span>
    </div>
  );
}

Object.assign(window, { LoginScreen, TodayScreen, AllTasksScreen, ProjectsScreen, ProjectDetailScreen, StatsScreen });
