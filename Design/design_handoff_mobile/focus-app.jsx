// focus-app.jsx — Root app, bottom nav, create/detail sheets, screen router

// ── CREATE TASK SHEET ────────────────────────────────────────
function CreateTaskSheet() {
  const { T, PC, projects, showCreate, setShowCreate, addTask, selProject } = useApp();
  const [title,    setTitle   ] = useState('');
  const [projId,   setProjId  ] = useState('');
  const [priority, setPriority] = useState('none');
  const [dueDate,  setDueDate ] = useState('');
  const [notes,    setNotes   ] = useState('');

  useEffect(() => {
    if (showCreate) {
      setProjId(selProject?.id || projects[0]?.id || '');
      setTitle(''); setPriority('none'); setDueDate(''); setNotes('');
    }
  }, [showCreate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !projId) return;
    addTask({ project_id:projId, title:title.trim(), priority, due_date:dueDate||null, notes:notes.trim()||null });
    setShowCreate(false);
  }

  const PRIOS = ['none','low','medium','high','urgent'];

  return (
    <Sheet open={showCreate} onClose={() => setShowCreate(false)} title="New Task">
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18, paddingTop:16 }}>
        {/* Title */}
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          style={{
            background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
            borderRadius:12, padding:'13px 14px', fontSize:15, fontWeight:600,
            color:T.text1, fontFamily:T.fontBody, outline:'none', width:'100%',
            transition:'border-color 0.2s',
          }}
          onFocus={e=>e.target.style.borderColor='rgba(124,111,247,0.5)'}
          onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
        />

        {/* Project */}
        {projects.length > 1 && (
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>Project</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {projects.map(p => (
                <button key={p.id} type="button" onClick={() => setProjId(p.id)} style={{
                  display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:10,
                  border: projId===p.id ? `1px solid rgba(255,255,255,0.2)` : `1px solid ${T.border}`,
                  background: projId===p.id ? `${p.color}18` : 'transparent',
                  color: projId===p.id ? T.text1 : T.text3, cursor:'pointer',
                  fontSize:12, fontWeight:600, fontFamily:T.fontBody, transition:'all 0.15s',
                }}>
                  <div style={{ width:7,height:7,borderRadius:'50%',background:p.color,boxShadow:projId===p.id?`0 0 5px ${p.color}99`:'none' }}/>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Priority */}
        <div>
          <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>Priority</p>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {PRIOS.map(p => {
              const pc = PC[p];
              const active = priority === p;
              return (
                <button key={p} type="button" onClick={() => setPriority(p)} style={{
                  padding:'6px 12px', borderRadius:10, cursor:'pointer',
                  border: active ? `1px solid ${pc.border}` : `1px solid ${T.border}`,
                  background: active ? pc.bg : 'transparent',
                  color: active ? pc.text : T.text3,
                  fontSize:11, fontWeight:700, fontFamily:T.fontDisplay, letterSpacing:'0.03em',
                  transition:'all 0.15s', textTransform:'capitalize',
                }}>
                  {pc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Due date */}
        <div>
          <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>
            Due Date <span style={{ textTransform:'none', letterSpacing:0, fontWeight:500 }}>(optional)</span>
          </p>
          <input
            type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
            style={{
              width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
              borderRadius:12, padding:'11px 14px', fontSize:13, color:T.text1,
              fontFamily:T.fontBody, outline:'none', colorScheme:'dark', transition:'border-color 0.2s',
            }}
            onFocus={e=>e.target.style.borderColor='rgba(124,111,247,0.5)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
          />
        </div>

        {/* Notes */}
        <div>
          <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>
            Notes <span style={{ textTransform:'none', letterSpacing:0, fontWeight:500 }}>(optional)</span>
          </p>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any extra details…" rows={2}
            style={{
              width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
              borderRadius:12, padding:'11px 14px', fontSize:13, color:T.text1,
              fontFamily:T.fontBody, outline:'none', resize:'none', transition:'border-color 0.2s',
            }}
            onFocus={e=>e.target.style.borderColor='rgba(124,111,247,0.5)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.09)'}
          />
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10 }}>
          <button type="button" onClick={() => setShowCreate(false)} style={{
            flex:1, padding:'13px', borderRadius:13, border:`1px solid ${T.border}`,
            background:'rgba(255,255,255,0.03)', color:T.text2, fontSize:13, fontWeight:600,
            fontFamily:T.fontBody, cursor:'pointer',
          }}>Cancel</button>
          <button type="submit" disabled={!title.trim()} style={{
            flex:2, padding:'13px', borderRadius:13, border:'none',
            background:`linear-gradient(135deg, ${T.accent}, ${T.accentBlue})`,
            color:'white', fontSize:13, fontWeight:700, fontFamily:T.fontBody, cursor:'pointer',
            boxShadow:`0 0 20px rgba(124,111,247,0.3)`, opacity: title.trim() ? 1 : 0.45,
            transition:'opacity 0.2s',
          }}>Create Task</button>
        </div>
      </form>
    </Sheet>
  );
}

// ── TASK DETAIL SHEET ────────────────────────────────────────
function TaskDetailSheet() {
  const { T, PC, selTask, setSelTask, updateTask, deleteTask, tasks } = useApp();
  const [title,    setTitle   ] = useState('');
  const [notes,    setNotes   ] = useState('');
  const [dueDate,  setDueDate ] = useState('');
  const [priority, setPriority] = useState('none');
  const [newSub,   setNewSub  ] = useState('');

  const liveTask = selTask ? (tasks.find(t => t.id === selTask.id) || selTask) : null;

  useEffect(() => {
    if (liveTask) {
      setTitle(liveTask.title); setNotes(liveTask.notes||'');
      setDueDate(liveTask.due_date||''); setPriority(liveTask.priority);
    }
  }, [selTask?.id]);

  function save(field) { if (liveTask) updateTask(liveTask.id, field); }
  function handleDelete() { if (liveTask) { deleteTask(liveTask.id); setSelTask(null); } }

  function handleAddSub(e) {
    if (e.key !== 'Enter' || !newSub.trim() || !liveTask) return;
    const st = { id:'s'+Date.now(), title:newSub.trim(), completed:false };
    updateTask(liveTask.id, { subtasks:[...(liveTask.subtasks||[]), st] });
    setNewSub('');
  }

  function toggleSub(id) {
    if (!liveTask) return;
    updateTask(liveTask.id, { subtasks: liveTask.subtasks.map(s => s.id===id?{...s,completed:!s.completed}:s) });
  }

  const PRIOS = ['none','low','medium','high','urgent'];

  return (
    <Sheet open={!!selTask} onClose={() => setSelTask(null)} title="Task Details">
      {liveTask && (
        <div style={{ display:'flex', flexDirection:'column', gap:20, paddingTop:16 }}>
          {/* Title + delete */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              onBlur={() => title.trim() && save({title:title.trim()})}
              style={{
                flex:1, background:'transparent', border:'none', outline:'none',
                fontSize:17, fontWeight:700, color:T.text1, fontFamily:T.fontBody, lineHeight:1.4,
              }}
            />
            <button onClick={handleDelete} style={{
              background:'none', border:'none', color:T.text3, cursor:'pointer', padding:6,
              borderRadius:8, flexShrink:0, transition:'color 0.15s',
            }}
              onMouseEnter={e=>e.currentTarget.style.color=T.danger}
              onMouseLeave={e=>e.currentTarget.style.color=T.text3}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>

          {/* Priority */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>Priority</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {PRIOS.map(p => {
                const pc = PC[p]; const active = priority===p;
                return (
                  <button key={p} type="button" onClick={() => { setPriority(p); save({priority:p}); }} style={{
                    padding:'6px 12px', borderRadius:10, cursor:'pointer',
                    border: active ? `1px solid ${pc.border}` : `1px solid ${T.border}`,
                    background: active ? pc.bg : 'transparent',
                    color: active ? pc.text : T.text3,
                    fontSize:11, fontWeight:700, fontFamily:T.fontDisplay,
                    transition:'all 0.15s', textTransform:'capitalize',
                  }}>{pc.label}</button>
                );
              })}
            </div>
          </div>

          {/* Due date */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>Due Date</p>
            <input
              type="date" value={dueDate}
              onChange={e => { setDueDate(e.target.value); save({due_date:e.target.value||null}); }}
              style={{
                width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
                borderRadius:12, padding:'11px 14px', fontSize:13, color:T.text1,
                fontFamily:T.fontBody, outline:'none', colorScheme:'dark',
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:8 }}>Notes</p>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              onBlur={() => save({notes:notes||null})}
              placeholder="Add notes…" rows={3}
              style={{
                width:'100%', background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.09)`,
                borderRadius:12, padding:'11px 14px', fontSize:13, color:T.text1,
                fontFamily:T.fontBody, outline:'none', resize:'none',
              }}
            />
          </div>

          {/* Subtasks */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay, marginBottom:10 }}>Subtasks</p>
            <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:10 }}>
              {(liveTask.subtasks||[]).map(st => (
                <div key={st.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0' }}>
                  <div onClick={() => toggleSub(st.id)} style={{
                    width:18,height:18,borderRadius:'50%',flexShrink:0,cursor:'pointer',
                    border: st.completed ? 'none' : `1.5px solid rgba(255,255,255,0.2)`,
                    background: st.completed ? T.accent : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow: st.completed ? `0 0 8px rgba(124,111,247,0.4)` : 'none',
                    transition:'all 0.2s',
                  }}>
                    {st.completed && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ flex:1, fontSize:13, color:st.completed?T.text3:T.text2, textDecoration:st.completed?'line-through':'none', fontFamily:T.fontBody, fontWeight:500 }}>{st.title}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:18,height:18,borderRadius:'50%',border:`1.5px dashed rgba(255,255,255,0.15)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <input
                value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={handleAddSub}
                placeholder="Add subtask… (Enter to save)"
                style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:13, color:T.text1, fontFamily:T.fontBody, fontWeight:500 }}
              />
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}

// ── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav() {
  const { T, activeTab, navigate } = useApp();
  const TABS = [
    { id:'today',    label:'Today',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { id:'all',      label:'All',      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
    { id:'projects', label:'Projects', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
    { id:'stats',    label:'Stats',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  ];

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-around',
      padding:'8px 0 4px', borderTop:`1px solid ${T.border}`,
      background:'rgba(4,4,10,0.95)', backdropFilter:'blur(20px)',
      flexShrink:0,
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            background:'none', border:'none', cursor:'pointer', padding:'6px 0',
            color: active ? T.accent : T.text3, transition:'color 0.2s',
          }}>
            <div style={{ opacity: active ? 1 : 0.6, transition:'opacity 0.2s', transform: active ? 'scale(1.08)' : 'scale(1)', transition:'all 0.2s cubic-bezier(0.16,1,0.3,1)' }}>
              {tab.icon}
            </div>
            <span style={{ fontSize:10, fontWeight:active?700:500, fontFamily:T.fontDisplay, letterSpacing:'0.02em' }}>
              {tab.label}
            </span>
            {active && <div style={{ width:4,height:4,borderRadius:'50%',background:T.accent,boxShadow:`0 0 6px ${T.accent}` }} />}
          </button>
        );
      })}
    </div>
  );
}

// ── SCREEN WRAPPER with slide transition ─────────────────────
function ScreenWrapper({ children, screenKey }) {
  const [visible, setVisible] = useState(false);
  const { transDir } = useApp();
  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    return () => cancelAnimationFrame(raf);
  }, [screenKey]);

  return (
    <div style={{
      flex:1, display:'flex', flexDirection:'column', overflow:'hidden',
      transform: visible ? 'translateX(0)' : `translateX(${transDir * 24}px)`,
      opacity: visible ? 1 : 0,
      transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
    }}>
      {children}
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────
function AppInner() {
  const { T, screen, showCreate, setShowCreate, selTask } = useApp();

  const isLogin = screen === 'login';

  function renderScreen() {
    switch(screen) {
      case 'login':          return <LoginScreen />;
      case 'today':          return <TodayScreen />;
      case 'all':            return <AllTasksScreen />;
      case 'projects':       return <ProjectsScreen />;
      case 'project-detail': return <ProjectDetailScreen />;
      case 'stats':          return <StatsScreen />;
      default:               return <TodayScreen />;
    }
  }

  return (
    <div style={{
      width:'100%', height:'100%', display:'flex', flexDirection:'column',
      background: T.bg, color: T.text1,
      backgroundImage:`
        radial-gradient(ellipse 600px 500px at -5% -5%, rgba(124,111,247,0.1) 0%, transparent 60%),
        radial-gradient(ellipse 400px 500px at 110% 110%, rgba(59,130,246,0.06) 0%, transparent 60%)
      `,
      fontFamily: T.fontBody,
      position:'relative', overflow:'hidden',
    }}>
      <ScreenWrapper screenKey={screen}>
        {renderScreen()}
      </ScreenWrapper>

      {!isLogin && <BottomNav />}
      {!isLogin && !['login','project-detail'].includes(screen) && (
        <FAB onClick={() => setShowCreate(true)} />
      )}

      <CreateTaskSheet />
      <TaskDetailSheet />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <IOSDevice>
        <AppInner />
      </IOSDevice>
    </AppProvider>
  );
}
