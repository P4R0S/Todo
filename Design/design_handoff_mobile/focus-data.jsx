// focus-data.jsx — App context, mock data, design tokens, TaskRow

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// ── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  bg: '#04040a', bgCard: '#08080f',
  accent: '#7C6FF7', accentBlue: '#5E9EF7',
  text1: '#f0f0f5', text2: '#9099b0', text3: '#454a5c',
  surface1: 'rgba(255,255,255,0.02)', surface2: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.06)', borderStrong: 'rgba(255,255,255,0.12)',
  success: '#34d399', danger: '#f87171', warning: '#fbbf24',
  fontBody: "'Plus Jakarta Sans', sans-serif",
  fontDisplay: "'Syne', sans-serif",
};

const PC = {
  urgent: { bg:'rgba(248,113,113,0.1)', text:'#f87171', border:'rgba(248,113,113,0.25)', label:'Urgent' },
  high:   { bg:'rgba(251,146,60,0.1)',  text:'#fb923c', border:'rgba(251,146,60,0.25)',  label:'High'   },
  medium: { bg:'rgba(251,191,36,0.1)',  text:'#fbbf24', border:'rgba(251,191,36,0.25)',  label:'Med'    },
  low:    { bg:'rgba(56,189,248,0.1)',  text:'#38bdf8', border:'rgba(56,189,248,0.25)',  label:'Low'    },
  none:   { bg:'transparent', text:T.text3, border:'transparent', label:'None' },
};

// ── MOCK DATA ────────────────────────────────────────────────
const d0 = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const today     = fmt(d0);
const yesterday = fmt(new Date(d0.getTime() - 86400000));
const tomorrow  = fmt(new Date(d0.getTime() + 86400000));
const nextWeek  = fmt(new Date(d0.getTime() + 6*86400000));

const INIT_PROJECTS = [
  { id:'p1', name:'Work',     color:'#7C6FF7', emoji:null },
  { id:'p2', name:'Personal', color:'#34d399', emoji:null },
  { id:'p3', name:'Health',   color:'#f87171', emoji:null },
  { id:'p4', name:'Learning', color:'#fbbf24', emoji:null },
];

const INIT_TASKS = [
  { id:'t1', project_id:'p1', title:'Review Q2 roadmap',          priority:'urgent', due_date:today,     completed:false, notes:'Check with team first', subtasks:[{id:'s1',title:'Read draft',completed:true},{id:'s2',title:'Add comments',completed:false}] },
  { id:'t2', project_id:'p1', title:'Ship auth refactor',          priority:'high',   due_date:today,     completed:false, notes:null, subtasks:[] },
  { id:'t3', project_id:'p2', title:'Buy groceries',               priority:'medium', due_date:today,     completed:true,  notes:null, subtasks:[] },
  { id:'t4', project_id:'p3', title:'Morning run',                 priority:'low',    due_date:today,     completed:false, notes:'5km target', subtasks:[] },
  { id:'t5', project_id:'p1', title:'Prepare all-hands slides',    priority:'high',   due_date:tomorrow,  completed:false, notes:null, subtasks:[] },
  { id:'t6', project_id:'p2', title:'Call mom',                    priority:'none',   due_date:yesterday, completed:false, notes:null, subtasks:[] },
  { id:'t7', project_id:'p4', title:'Read SICP chapter 3',         priority:'medium', due_date:nextWeek,  completed:false, notes:null, subtasks:[] },
  { id:'t8', project_id:'p3', title:'Meditation — 10 min',         priority:'low',    due_date:today,     completed:true,  notes:null, subtasks:[] },
  { id:'t9', project_id:'p1', title:'Fix navigation bug',          priority:'urgent', due_date:yesterday, completed:false, notes:null, subtasks:[] },
  { id:'t10',project_id:'p2', title:'Book dentist appointment',    priority:'medium', due_date:nextWeek,  completed:false, notes:null, subtasks:[] },
  { id:'t11',project_id:'p4', title:'Watch TypeScript deep dive',  priority:'low',    due_date:nextWeek,  completed:false, notes:null, subtasks:[] },
  { id:'t12',project_id:'p3', title:'Meal prep for the week',      priority:'medium', due_date:tomorrow,  completed:false, notes:null, subtasks:[] },
];

// ── CONTEXT ──────────────────────────────────────────────────
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

function AppProvider({ children }) {
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [tasks,    setTasks   ] = useState(INIT_TASKS);
  const [screen,      setScreen     ] = useState('login');
  const [prevScreen,  setPrevScreen ] = useState(null);
  const [activeTab,   setActiveTab  ] = useState('today');
  const [selProject,  setSelProject ] = useState(null);
  const [selTask,     setSelTask    ] = useState(null);
  const [showCreate,  setShowCreate ] = useState(false);
  const [transDir,    setTransDir   ] = useState(1); // 1=forward, -1=back

  const navigate = useCallback((s, dir = 1) => {
    setTransDir(dir);
    setPrevScreen(screen);
    setScreen(s);
    if (['today','all','projects','stats'].includes(s)) setActiveTab(s);
  }, [screen]);

  const goBack = useCallback(() => {
    const prev = prevScreen || 'today';
    navigate(prev, -1);
  }, [navigate, prevScreen]);

  const completeTask = useCallback((id) =>
    setTasks(ts => ts.map(t => t.id===id ? {...t,completed:!t.completed} : t)), []);

  const deleteTask = useCallback((id) =>
    setTasks(ts => ts.filter(t => t.id!==id)), []);

  const addTask = useCallback((task) => {
    setTasks(ts => [...ts, { ...task, id:'t'+Date.now(), completed:false, subtasks:[], notes:task.notes||null }]);
  }, []);

  const updateTask = useCallback((id, updates) =>
    setTasks(ts => ts.map(t => t.id===id ? {...t,...updates} : t)), []);

  const addProject = useCallback((proj) =>
    setProjects(ps => [...ps, {...proj, id:'p'+Date.now()}]), []);

  const openTask = useCallback((task) => setSelTask(task), []);

  return (
    <AppCtx.Provider value={{
      T, PC, projects, tasks, screen, prevScreen, activeTab, selProject, selTask,
      showCreate, transDir,
      navigate, goBack,
      setSelProject, setSelTask, setShowCreate,
      completeTask, deleteTask, addTask, updateTask, addProject, openTask,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

// ── TASK ROW ─────────────────────────────────────────────────
function TaskRow({ task, showProject = false }) {
  const { T, PC, completeTask, deleteTask, projects, openTask, tasks } = useApp();
  const [dx, setDx] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [flash, setFlash] = useState(false);
  const startX = useRef(null);
  const project = projects.find(p => p.id === task.project_id);
  const isOverdue = !task.completed && task.due_date && task.due_date < today;
  const dateLabel = task.due_date
    ? new Date(task.due_date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})
    : null;
  const pc = PC[task.priority] || PC.none;

  // live task from state (for completion updates)
  const liveTask = tasks.find(t => t.id === task.id) || task;

  function onTouchStart(e) { startX.current = e.touches[0].clientX; setSnapping(false); }
  function onTouchMove(e) {
    if (startX.current === null) return;
    const d = e.touches[0].clientX - startX.current;
    setDx(Math.max(-130, Math.min(130, d)));
  }
  function onTouchEnd() {
    setSnapping(true);
    if (dx > 65) {
      setFlash(true);
      setTimeout(() => { completeTask(liveTask.id); setFlash(false); setDx(0); }, 280);
    } else if (dx < -65) {
      setTimeout(() => deleteTask(liveTask.id), 120);
    } else {
      setDx(0);
    }
    startX.current = null;
  }

  const rowBg = flash ? 'rgba(22,163,74,0.12)' : '#08080f';

  return (
    <div style={{ position:'relative', overflow:'hidden', borderRadius:14, marginBottom:3 }}>
      {/* Left reveal — complete */}
      {dx > 5 && (
        <div style={{ position:'absolute', inset:0, background:'#16a34a', display:'flex', alignItems:'center', paddingLeft:16, gap:8, borderRadius:14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{color:'white',fontSize:11,fontWeight:700,fontFamily:T.fontDisplay}}>Done</span>
        </div>
      )}
      {/* Right reveal — delete */}
      {dx < -5 && (
        <div style={{ position:'absolute', inset:0, background:'#dc2626', display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:16, gap:8, borderRadius:14 }}>
          <span style={{color:'white',fontSize:11,fontWeight:700,fontFamily:T.fontDisplay}}>Delete</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </div>
      )}

      {/* Main row */}
      <div
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onClick={() => openTask(liveTask)}
        style={{
          transform: `translateX(${dx}px)`,
          background: liveTask.completed ? 'rgba(255,255,255,0.015)' : rowBg,
          display:'flex', alignItems:'center', gap:10,
          padding:'0 14px', borderRadius:14, cursor:'pointer',
          border: liveTask.completed ? `1px solid rgba(255,255,255,0.04)` : `1px solid ${T.border}`,
          minHeight:52, userSelect:'none',
          transition: snapping
            ? 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s'
            : 'background 0.3s',
        }}
      >
        {/* Checkbox */}
        <div
          onClick={e => { e.stopPropagation(); setFlash(true); setTimeout(()=>{completeTask(liveTask.id);setFlash(false);},250); }}
          style={{
            width:22, height:22, borderRadius:'50%', flexShrink:0, cursor:'pointer',
            border: liveTask.completed ? 'none' : `1.5px solid rgba(255,255,255,0.22)`,
            background: liveTask.completed ? T.accent : 'transparent',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: liveTask.completed ? `0 0 12px rgba(124,111,247,0.5)` : 'none',
            transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {liveTask.completed && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>

        {showProject && project && (
          <div style={{ width:7,height:7,borderRadius:'50%',background:project.color,flexShrink:0,boxShadow:`0 0 5px ${project.color}99` }} />
        )}

        <span style={{
          flex:1, fontSize:13.5, fontWeight:500, fontFamily:T.fontBody,
          color: liveTask.completed ? T.text3 : T.text1,
          textDecoration: liveTask.completed ? 'line-through' : 'none',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          transition:'color 0.2s',
        }}>
          {liveTask.title}
        </span>

        <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
          {!liveTask.completed && liveTask.priority !== 'none' && (
            <span style={{
              fontSize:9.5, fontWeight:700, padding:'2px 7px', borderRadius:99,
              background:pc.bg, color:pc.text, border:`1px solid ${pc.border}`,
              fontFamily:T.fontDisplay, letterSpacing:'0.04em',
            }}>{pc.label}</span>
          )}
          {dateLabel && !liveTask.completed && (
            <span style={{fontSize:11,color:isOverdue?T.danger:T.text3,fontWeight:500}}>{isOverdue?'Late':dateLabel}</span>
          )}
          {liveTask.completed && (
            <button
              onClick={e => { e.stopPropagation(); deleteTask(liveTask.id); }}
              style={{
                background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.18)',
                borderRadius:8, color:T.danger, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                width:28, height:28, flexShrink:0, transition:'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(248,113,113,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(248,113,113,0.08)'; }}
              aria-label="Remove completed task"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SECTION HEADER ───────────────────────────────────────────
function SectionHeader({ label, count, right }) {
  const { T } = useApp();
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 0 8px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay }}>{label}</span>
        {count !== undefined && (
          <span style={{ fontSize:10, fontWeight:700, color:T.text3, background:T.surface2, padding:'1px 7px', borderRadius:99 }}>{count}</span>
        )}
      </div>
      {right}
    </div>
  );
}

// ── SHEET (bottom drawer) ────────────────────────────────────
function Sheet({ open, onClose, children, title }) {
  const { T } = useApp();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStart = useRef(null);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    if (open) { setMounted(true); requestAnimationFrame(() => setVisible(true)); }
    else { setVisible(false); setTimeout(() => setMounted(false), 380); }
  }, [open]);

  function onDragStart(e) { dragStart.current = e.touches[0].clientY; }
  function onDragMove(e) {
    if (!dragStart.current) return;
    const d = e.touches[0].clientY - dragStart.current;
    if (d > 0) setDragY(d);
  }
  function onDragEnd() {
    if (dragY > 80) onClose();
    else setDragY(0);
    dragStart.current = null;
  }

  if (!mounted) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)',
        zIndex:50, opacity: visible ? 1 : 0, transition:'opacity 0.3s',
      }} />
      <div
        onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}
        style={{
          position:'absolute', bottom:0, left:0, right:0, zIndex:51,
          background:'rgba(8,8,18,0.98)', backdropFilter:'blur(40px)',
          borderRadius:'20px 20px 0 0',
          border:'1px solid rgba(255,255,255,0.08)', borderBottom:'none',
          transform: visible ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragY > 0 ? 'none' : 'transform 0.42s cubic-bezier(0.16,1,0.3,1)',
          maxHeight:'88%', display:'flex', flexDirection:'column',
        }}
      >
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 0' }}>
          <div style={{ width:36,height:4,borderRadius:99,background:'rgba(255,255,255,0.18)' }} />
        </div>
        {/* Header */}
        {title && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:T.fontDisplay }}>{title}</span>
            <button onClick={onClose} style={{ background:'none', border:'none', color:T.text3, cursor:'pointer', padding:4, borderRadius:8, display:'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
        <div style={{ flex:1, overflowY:'auto', padding:'0 20px 40px' }}>
          {children}
        </div>
      </div>
    </>
  );
}

// ── FAB ──────────────────────────────────────────────────────
function FAB({ onClick }) {
  const { T } = useApp();
  return (
    <button onClick={onClick} style={{
      position:'absolute', right:20, bottom:88, width:52, height:52, borderRadius:'50%',
      background:`linear-gradient(135deg, ${T.accent}, ${T.accentBlue})`,
      border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:`0 0 24px rgba(124,111,247,0.5), 0 4px 12px rgba(0,0,0,0.4)`,
      zIndex:30, transition:'transform 0.2s cubic-bezier(0.16,1,0.3,1)',
    }}
      onMouseDown={e => e.currentTarget.style.transform='scale(0.92)'}
      onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
  );
}

Object.assign(window, { T, PC, AppProvider, useApp, TaskRow, SectionHeader, Sheet, FAB, today });
