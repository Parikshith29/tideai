import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Fish from './Fish';
import Turtle from './Turtle';
import Garbage from './Garbage';

const GARBAGE_TYPES = ['bottle', 'trash'];

const makeGarbage = () =>
  Array.from({ length: 14 }, (_, i) => ({
    id: `g${i}-${Date.now()}`,
    x: 5 + Math.random() * 88,
    y: 5 + Math.random() * 52,
    type: GARBAGE_TYPES[i % GARBAGE_TYPES.length],
    animDuration: 2.5 + Math.random() * 2.5,
    animDelay: Math.random() * 2,
    status: 'floating',
  }));

const INITIAL_CREWS = [
  { id: 'A1', grid: 'A', x: 10, y: 10, homeX: 10, homeY: 10, status: 'idle' },
  { id: 'A2', grid: 'A', x: 38, y: 22, homeX: 38, homeY: 22, status: 'idle' },
  { id: 'B1', grid: 'B', x: 58, y: 8,  homeX: 58, homeY: 8,  status: 'idle' },
  { id: 'B2', grid: 'B', x: 85, y: 20, homeX: 85, homeY: 20, status: 'idle' },
  { id: 'C1', grid: 'C', x: 12, y: 36, homeX: 12, homeY: 36, status: 'idle' },
  { id: 'C2', grid: 'C', x: 40, y: 50, homeX: 40, homeY: 50, status: 'idle' },
  { id: 'D1', grid: 'D', x: 60, y: 34, homeX: 60, homeY: 34, status: 'idle' },
  { id: 'D2', grid: 'D', x: 88, y: 48, homeX: 88, homeY: 48, status: 'idle' },
];

const GRID_DEFS = [
  { id: 'A', minX: 0,  maxX: 50, minY: 0,  maxY: 28 },
  { id: 'B', minX: 50, maxX: 100,minY: 0,  maxY: 28 },
  { id: 'C', minX: 0,  maxX: 50, minY: 28, maxY: 58 },
  { id: 'D', minX: 50, maxX: 100,minY: 28, maxY: 58 },
];

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  id: i, x: Math.random() * 100,
  size: 4 + Math.random() * 6,
  duration: 4 + Math.random() * 5,
  delay: Math.random() * 5,
}));

const FISHES = [
  { id: 0, y: 8,  speed: 26, goRight: true,  size: 0.55, delay: 0 },
  { id: 1, y: 18, speed: 34, goRight: false,  size: 0.7,  delay: -8 },
  { id: 2, y: 30, speed: 22, goRight: true,   size: 0.5,  delay: -14 },
  { id: 3, y: 42, speed: 30, goRight: false,  size: 0.65, delay: -6 },
];

const TURTLES = [
  { id: 0, x: 7,  y: 24, delay: 0 },
  { id: 1, x: 70, y: 44, delay: 1.5 },
];

const WAVE_LAYERS = [
  { color: '#1EB2F2', dur: '10s', path: 'M0,40 Q180,80 360,40 T720,40 T1080,40 T1440,40 L1440,100 L0,100 Z' },
  { color: '#5FD9FF', dur: '16s', path: 'M0,30 Q180,-10 360,30 T720,30 T1080,30 T1440,30 L1440,100 L0,100 Z' },
  { color: '#9DE8FF', dur: '8s',  path: 'M0,50 Q90,80 180,50 T360,50 T540,50 T720,50 T900,50 T1080,50 T1260,50 T1440,50 L1440,100 L0,100 Z' },
];

function CrewBoat({ x, y, status }) {
  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: 'spring', stiffness: 40, damping: 20, mass: 1 }}
      style={{ transform: 'translate(-50%,-50%)' }}
    >
      <motion.div
        animate={{
          rotate: status === 'moving' ? [-1, 1, -1] : [0, 0.8, 0],
          y: status === 'idle' ? [0, 3, 0] : 0,
        }}
        transition={{ repeat: Infinity, duration: status === 'moving' ? 0.4 : 2.5 }}
      >
        <svg width="115" height="65" viewBox="0 0 320 180" style={{ filter: 'drop-shadow(4px 4px 0px #111)' }}>
          {/* Hull base */}
          <path d="M58 122 C90 132, 140 138, 200 130 C225 127, 238 122, 250 118 L232 142 C190 152, 130 158, 75 142 C65 138, 60 132, 58 122 Z" fill="#FF7549" stroke="#111" strokeWidth="6" strokeLinejoin="round"/>
          {/* Hull top */}
          <path d="M50 102 C90 85, 150 82, 210 95 C230 100, 245 102, 250 105 L248 120 C200 130, 130 135, 70 120 C55 115, 52 108, 50 102 Z" fill="#5FD9FF" stroke="#111" strokeWidth="6" strokeLinejoin="round"/>
          {/* Deck */}
          <path d="M95 92 C120 85, 170 88, 205 92 L205 108 C170 110, 120 108, 95 104 Z" fill="#E8F5FF" stroke="#111" strokeWidth="6" strokeLinejoin="round"/>
          {/* Cabin base */}
          <path d="M125 72 C135 68, 185 68, 195 72 L195 92 C180 95, 140 95, 125 92 Z" fill="#FFFFFF" stroke="#111" strokeWidth="6" strokeLinejoin="round"/>
          {/* Cabin top */}
          <path d="M145 52 C150 48, 180 48, 185 52 L185 70 C175 72, 155 72, 145 70 Z" fill="#111" stroke="#111" strokeWidth="6" strokeLinejoin="round"/>
          {/* Windows */}
          <rect x="138" y="78" width="12" height="9" rx="0" fill="#B9FF68" stroke="#111" strokeWidth="4"/>
          <rect x="155" y="78" width="12" height="9" rx="0" fill="#B9FF68" stroke="#111" strokeWidth="4"/>
          <rect x="172" y="78" width="12" height="9" rx="0" fill="#B9FF68" stroke="#111" strokeWidth="4"/>
          {/* Mast */}
          <path d="M182 30 L186 30 L186 72 L182 72 Z" fill="#111"/>
          {/* Antenna */}
          <path d="M185 30 C190 25, 198 22, 205 20" stroke="#111" strokeWidth="4" fill="none"/>
          {/* Crane arm */}
          <path d="M110 88 C95 80, 80 75, 65 70" stroke="#111" strokeWidth="5" fill="none"/>
          {/* Crane cable */}
          <path d="M65 70 C64 78, 63 85, 62 95" stroke="#111" strokeWidth="3" fill="none"/>
          {/* Railing */}
          <path d="M90 90 C100 90, 115 90, 130 90" stroke="#111" strokeWidth="4"/>
          {/* Portholes */}
          <circle cx="178" cy="112" r="4" fill="#111"/>
          <circle cx="195" cy="110" r="4" fill="#111"/>
          <circle cx="212" cy="108" r="4" fill="#111"/>
        </svg>

        {status === 'cleaning' && (
          <>
            <div className="absolute animate-collect-ring rounded-full border-2 border-[#B9FF68]"
              style={{ width: 20, height: 20, left: '50%', top: '50%' }} />
            <div className="absolute animate-collect-ring rounded-full border-2 border-[#5FD9FF]"
              style={{ width: 20, height: 20, left: '50%', top: '50%', animationDelay: '0.35s' }} />
            <motion.div
              className="absolute text-xs font-comic font-bold px-2 py-0.5 whitespace-nowrap shadow-neo-sm"
              style={{ left: '50%', transform: 'translateX(-50%)', top: '-2.5rem', background: '#B9FF68', color: '#111', border: '2px solid #111' }}
              animate={{ scale: [1, 1.15, 1], rotate: [2, -2, 2] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              CLEANING!
            </motion.div>
          </>
        )}

        {status === 'moving' && (
          <div className="absolute animate-wake rounded-full"
            style={{ left: '0%', top: '60%', transform: 'translate(-30%, -50%)', background: '#FFFFFF', border: '2px solid #111' }} />
        )}
      </motion.div>
    </motion.div>
  );
}

export default function OceanCanvas({ onCollect, onAreaSelected, resetKey }) {
  const containerRef = useRef(null);
  const [garbage, setGarbage] = useState(makeGarbage);
  const [crews,   setCrews]   = useState(INITIAL_CREWS);
  const [poofs,   setPoofs]   = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart,  setDragStart]  = useState({ x: 0, y: 0 });
  const [dragEnd,    setDragEnd]    = useState({ x: 0, y: 0 });

  const crewsRef   = useRef(crews);
  const garbageRef = useRef(garbage);
  useEffect(() => { crewsRef.current   = crews;   }, [crews]);
  useEffect(() => { garbageRef.current = garbage; }, [garbage]);

  // Reset ocean when parent triggers
  useEffect(() => {
    if (!resetKey) return;
    setGarbage(makeGarbage());
    setCrews(INITIAL_CREWS.map(c => ({ ...c })));
    setPoofs([]);
  }, [resetKey]);

  // Replenish when all cleared
  useEffect(() => {
    if (garbage.length === 0) {
      const t = setTimeout(() => setGarbage(makeGarbage()), 2500);
      return () => clearTimeout(t);
    }
  }, [garbage]);

  const getRelCoords = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width)  * 100,
      y: ((clientY - rect.top)  / rect.height) * 100,
    };
  };

  const onDown = (e) => {
    const c = getRelCoords(e);
    setIsDragging(true);
    setDragStart({ x: c.x, y: c.y });
    setDragEnd({ x: c.x, y: c.y });
    e.preventDefault();
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const c = getRelCoords(e);
    setDragEnd({ x: c.x, y: c.y });
  };

  const onUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const minX = Math.min(dragStart.x, dragEnd.x);
    const maxX = Math.max(dragStart.x, dragEnd.x);
    const minY = Math.min(dragStart.y, dragEnd.y);
    const maxY = Math.max(dragStart.y, dragEnd.y);
    if (maxX - minX < 2 || maxY - minY < 2) return;

    const currentGarbage = garbageRef.current;
    const currentCrews   = crewsRef.current;
    const rect = containerRef.current.getBoundingClientRect();

    // Find selected trash
    const targets = currentGarbage.filter(g =>
      g.status === 'floating' &&
      g.x >= minX && g.x <= maxX &&
      g.y >= minY && g.y <= maxY
    );

    // Group by grid
    const targetsByGrid = {};
    GRID_DEFS.forEach(g => { targetsByGrid[g.id] = []; });
    targets.forEach(t => {
      const grid = GRID_DEFS.find(g =>
        t.x >= g.minX && t.x <= g.maxX && t.y >= g.minY && t.y <= g.maxY
      );
      targetsByGrid[grid ? grid.id : GRID_DEFS[0].id].push(t);
    });
    const activeGridIds = GRID_DEFS.filter(g => targetsByGrid[g.id].length > 0).map(g => g.id);

    // Notify parent (including mission info for console)
    onAreaSelected({
      left:   rect.left + (minX / 100) * rect.width,
      top:    rect.top  + (minY / 100) * rect.height,
      width:  ((maxX - minX) / 100) * rect.width,
      height: ((maxY - minY) / 100) * rect.height,
      trashCount: targets.length,
      gridIds: activeGridIds,
    });

    if (targets.length === 0) return;

    // Mark targeted
    const targetIds = new Set(targets.map(g => g.id));
    setGarbage(prev => prev.map(g => targetIds.has(g.id) ? { ...g, status: 'targeted' } : g));

    // Dispatch per grid — NEAREST-FIRST greedy assignment
    GRID_DEFS.forEach(gridDef => {
      const gridTargets = targetsByGrid[gridDef.id];
      if (gridTargets.length === 0) return;

      const available = currentCrews.filter(c => c.grid === gridDef.id && c.status === 'idle');
      if (available.length === 0) return;

      // Greedy: always assign the next closest (crew, trash) pair
      const assignments = new Map(available.map(c => [c.id, []]));
      const remaining   = [...gridTargets];

      while (remaining.length > 0) {
        let bestCrewId = null, bestTrashIdx = null, bestDist = Infinity;
        available.forEach(crew => {
          const list = assignments.get(crew.id);
          const last = list[list.length - 1];
          const curX = last ? last.x : crew.x;
          const curY = last ? last.y : crew.y;
          remaining.forEach((trash, ti) => {
            const d = Math.hypot(trash.x - curX, trash.y - curY);
            if (d < bestDist) { bestDist = d; bestCrewId = crew.id; bestTrashIdx = ti; }
          });
        });
        assignments.get(bestCrewId).push(remaining[bestTrashIdx]);
        remaining.splice(bestTrashIdx, 1);
      }

      available.forEach(crew => {
        const myTargets = assignments.get(crew.id);
        if (myTargets.length === 0) return;

        setCrews(prev => prev.map(c =>
          c.id === crew.id ? { ...c, status: 'moving', x: myTargets[0].x, y: myTargets[0].y } : c
        ));

        const step = (queue, baseDelay) => {
          if (queue.length === 0) {
            setTimeout(() => {
              setCrews(prev => prev.map(c =>
                c.id === crew.id ? { ...c, status: 'moving', x: c.homeX, y: c.homeY } : c
              ));
              setTimeout(() => setCrews(prev => prev.map(c =>
                c.id === crew.id ? { ...c, status: 'idle' } : c
              )), 2200);
            }, baseDelay + 200);
            return;
          }
          const target = queue[0];
          const rest   = queue.slice(1);
          const TRAVEL = 1600;

          setTimeout(() => {
            setCrews(prev => prev.map(c =>
              c.id === crew.id ? { ...c, status: 'cleaning' } : c
            ));
          }, baseDelay + TRAVEL);

          setTimeout(() => {
            setPoofs(prev => [...prev, { id: `p${target.id}`, x: target.x, y: target.y }]);
            setGarbage(prev => prev.filter(g => g.id !== target.id));
            onCollect(1);
            setTimeout(() => setPoofs(prev => prev.filter(p => p.id !== `p${target.id}`)), 700);
            if (rest.length > 0) {
              setCrews(prev => prev.map(c =>
                c.id === crew.id ? { ...c, status: 'moving', x: rest[0].x, y: rest[0].y } : c
              ));
            }
            step(rest, 300);
          }, baseDelay + TRAVEL + 1400);
        };

        step(myTargets, 0);
      });
    });
  }, [isDragging, dragStart, dragEnd, onAreaSelected, onCollect]);

  const selBox = isDragging ? {
    left:   `${Math.min(dragStart.x, dragEnd.x)}%`,
    top:    `${Math.min(dragStart.y, dragEnd.y)}%`,
    width:  `${Math.abs(dragEnd.x - dragStart.x)}%`,
    height: `${Math.abs(dragEnd.y - dragStart.y)}%`,
  } : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-crosshair"
      style={{ background: 'linear-gradient(175deg, #1EB2F2 0%, #5FD9FF 60%, #9DE8FF 100%)' }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    >
      {/* Full Canvas Animated Waves */}
      <div className="absolute inset-x-0 top-0 bottom-[29%] pointer-events-none overflow-hidden z-10">
        <div className="absolute inset-0 bg-[#0ea5e9]" /> {/* Deep ocean background padding */}
        {[...Array(12)].map((_, i) => {
          const topPct = i * 7.5; // Starts at 0, goes down to 82.5%
          const isSlow = i % 2 === 0;
          const colorIndex = i % 3;
          let color;
          // Loop between primary teal/cyan blue variants
          if (colorIndex === 0) color = '#1EB2F2';
          else if (colorIndex === 1) color = '#5FD9FF';
          else color = '#9DE8FF';
          
          const dur = 10 + (i % 4) * 4; // 10, 14, 18, 22
          
          let path;
          // Vary the wave shapes and frequencies
          if (i % 3 === 0) {
            path = 'M0,40 Q180,80 360,40 T720,40 T1080,40 T1440,40 L1440,140 L0,140 Z';
          } else if (i % 3 === 1) {
            path = 'M0,30 Q180,-10 360,30 T720,30 T1080,30 T1440,30 L1440,140 L0,140 Z';
          } else {
            path = 'M0,50 Q90,80 180,50 T360,50 T540,50 T720,50 T900,50 T1080,50 T1260,50 T1440,50 L1440,140 L0,140 Z';
          }

          return (
            <div key={i} className="absolute inset-x-0 bottom-0"
              style={{ top:`${topPct}%`, zIndex: i }}>
              <div className={isSlow ? 'wave-animate-slow' : 'wave-animate'} style={{ width: '200%', height:'100%', animationDuration:`${dur}s` }}>
                <svg viewBox="0 0 1440 95" preserveAspectRatio="none" className="w-full h-16 block">
                  <path d={path} fill={color} stroke="#111" strokeWidth="2.5"/>
                </svg>
                <div className="w-full" style={{ height: 'calc(100% - 4rem + 2px)', marginTop: '-1px', backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sun rays */}
      {[32,50,68].map((xp, i) => (
        <div key={i} className="absolute top-0 w-1 h-full pointer-events-none"
          style={{ left:`${xp}%`, background:`linear-gradient(180deg,rgba(186,230,253,${0.07-i*0.01}) 0%,transparent 100%)`, transform:`rotate(${(i-1)*4}deg)`, transformOrigin:'top' }}/>
      ))}

      {/* Bubbles */}
      {BUBBLES.map(b => (
        <div key={b.id} className="bubble absolute pointer-events-none"
          style={{ left:`${b.x}%`, bottom:'29%', width:b.size, height:b.size, animationDuration:`${b.duration}s`, animationDelay:`${b.delay}s`, border:'1px solid rgba(186,230,253,0.35)', background:'rgba(186,230,253,0.08)' }}/>
      ))}

      {/* Realistic Wavy Shoreline */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
        viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ height:'30%' }}>
        {/* Sand base & outline */}
        <path d="M0,130 C 400,150 800,20 1440,0 L1440,300 L0,300 Z" fill="#FFD777"/>
        <path d="M0,130 C 400,150 800,20 1440,0" fill="none" stroke="#111" strokeWidth="8"/>
        
        {/* Wet sand rim */}
        <path d="M0,150 C 400,170 800,40 1440,20" fill="none" stroke="#eab308" strokeWidth="2" opacity="0.3"/>
        <path d="M0,200 C 400,220 800,90 1440,70" fill="none" stroke="#ca8a04" strokeWidth="1.5" opacity="0.2"/>
        
        {/* Sand textures */}
        <circle cx="100" cy="200" r="2" fill="#111" opacity="0.15" />
        <circle cx="250" cy="180" r="1.5" fill="#111" opacity="0.2" />
        <circle cx="350" cy="240" r="2" fill="#111" opacity="0.1" />
        <circle cx="500" cy="120" r="1.5" fill="#111" opacity="0.15" />
        <circle cx="850" cy="100" r="2" fill="#111" opacity="0.2" />
        <circle cx="1050" cy="80" r="1.5" fill="#111" opacity="0.1" />
        <circle cx="1200" cy="180" r="2" fill="#111" opacity="0.15" />
        <circle cx="1300" cy="60" r="1.5" fill="#111" opacity="0.2" />

        {/* Rocks with highlights */}
        <g stroke="#111">
          <ellipse cx="80"  cy="240" rx="38" ry="22" fill="#475569" strokeWidth="4"/>
          <ellipse cx="70"  cy="235" rx="15" ry="8"  fill="#64748b" strokeWidth="0"/>
          
          <ellipse cx="118" cy="252" rx="26" ry="15" fill="#64748b" strokeWidth="3"/>
          <ellipse cx="112" cy="248" rx="10" ry="5"  fill="#94a3b8" strokeWidth="0"/>
          
          <ellipse cx="50"  cy="258" rx="22" ry="12" fill="#334155" strokeWidth="3"/>
          <ellipse cx="45"  cy="255" rx="8"  ry="4"  fill="#475569" strokeWidth="0"/>
          
          <ellipse cx="680" cy="210" rx="30" ry="17" fill="#475569" strokeWidth="4"/>
          <ellipse cx="672" cy="205" rx="12" ry="6"  fill="#64748b" strokeWidth="0"/>
          
          <ellipse cx="716" cy="222" rx="20" ry="11" fill="#64748b" strokeWidth="3"/>
          <ellipse cx="710" cy="218" rx="8"  ry="4"  fill="#94a3b8" strokeWidth="0"/>
        </g>

        {/* Realistic Manga Crab */}
        <g transform="translate(180, 260)">
          {/* Legs */}
          <path d="M-15,0 Q-25,-10 -30,0" fill="none" stroke="#111" strokeWidth="2.5"/>
          <path d="M-12,5 Q-22,-5 -25,10" fill="none" stroke="#111" strokeWidth="2.5"/>
          <path d="M15,0 Q25,-10 30,0" fill="none" stroke="#111" strokeWidth="2.5"/>
          <path d="M12,5 Q22,-5 25,10" fill="none" stroke="#111" strokeWidth="2.5"/>
          {/* Claws */}
          <path d="M-10,-5 C-20,-20 -5,-30 -15,-35 C-20,-20 -25,-25 -10,-5" fill="#FFED65" stroke="#111" strokeWidth="2"/>
          <path d="M10,-5 C20,-20 5,-30 15,-35 C20,-20 25,-25 10,-5" fill="#FFED65" stroke="#111" strokeWidth="2"/>
          {/* Shell */}
          <ellipse cx="0" cy="0" rx="16" ry="10" fill="#FF7549" stroke="#111" strokeWidth="2.5"/>
          {/* Eyes */}
          <circle cx="-5" cy="-8" r="3" fill="#FFF" stroke="#111" strokeWidth="1.5"/>
          <circle cx="-5" cy="-8" r="1" fill="#111"/>
          <circle cx="5" cy="-8" r="3" fill="#FFF" stroke="#111" strokeWidth="1.5"/>
          <circle cx="5" cy="-8" r="1" fill="#111"/>
        </g>
        
        {/* Starfish */}
        <g transform="translate(900, 220) rotate(15)">
          <path d="M0,-15 L4,-5 L15,-4 L7,4 L10,14 L0,8 L-10,14 L-7,4 L-15,-4 L-4,-5 Z" fill="#FF7549" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="0" cy="0" r="1" fill="#111"/>
          <circle cx="0" cy="-4" r="1" fill="#111"/>
          <circle cx="3" cy="2" r="1" fill="#111"/>
          <circle cx="-3" cy="2" r="1" fill="#111"/>
        </g>
        {/* Realistic Coral Umbrella Area */}
        <g transform="translate(1185, 60)">
          {/* Shadow */}
          <ellipse cx="25" cy="80" rx="45" ry="15" fill="rgba(0,0,0,0.15)" />
          
          {/* Lounge Chair 1 */}
          <g transform="translate(-30, 85) rotate(-10)">
            <rect x="0" y="5" width="40" height="15" fill="rgba(0,0,0,0.15)"/>
            <rect x="-2" y="-2" width="44" height="19" rx="1" fill="#e2e8f0" stroke="#111" strokeWidth="2.5"/>
            <rect x="0" y="0" width="22" height="15" fill="#5FD9FF" stroke="#111" strokeWidth="2"/>
            <path d="M 22 0 L 36 -5 L 36 10 L 22 15 Z" fill="#FFED65" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
          </g>

          {/* Lounge Chair 2 */}
          <g transform="translate(25, 80) rotate(5)">
            <rect x="0" y="5" width="40" height="15" fill="rgba(0,0,0,0.15)"/>
            <rect x="-2" y="-2" width="44" height="19" rx="1" fill="#e2e8f0" stroke="#111" strokeWidth="2.5"/>
            <rect x="0" y="0" width="22" height="15" fill="#B9FF68" stroke="#111" strokeWidth="2"/>
            <path d="M 22 0 L 36 -5 L 36 10 L 22 15 Z" fill="#ffffff" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
          </g>

          {/* Pole */}
          <rect x="-3" y="0" width="6" height="80" fill="#a16207" stroke="#111" strokeWidth="2.5" />
          <ellipse cx="0" cy="80" rx="10" ry="4" fill="#ca8a04" stroke="#111" strokeWidth="2" />
          
          {/* Panels */}
          <path d="M 0 -45 C -30 -40, -50 -20, -65 0 Q -47 -3, -30 5 Q -15 -15, 0 -45 Z" fill="#FF7549" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 0 -45 Q -15 -15, -30 5 Q -15 0, 0 8 Q 0 -15, 0 -45 Z" fill="#ffffff" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 0 -45 Q 0 -15, 0 8 Q 15 0, 30 5 Q 15 -15, 0 -45 Z" fill="#FF7549" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 0 -45 Q 15 -15, 30 5 Q 47 -3, 65 0 C 50 -20, 30 -40, 0 -45 Z" fill="#ffffff" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          
          {/* Thick Outer Border */}
          <path d="M 0 -45 C -30 -40, -50 -20, -65 0 Q -47 -3, -30 5 Q -15 0, 0 8 Q 15 0, 30 5 Q 47 -3, 65 0 C 50 -20, 30 -40, 0 -45 Z" fill="none" stroke="#111" strokeWidth="4.5" strokeLinejoin="round" />
          
          {/* Finial */}
          <path d="M -3 -45 L 3 -45 L 0 -54 Z" fill="#facc15" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        
        {/* Realistic Cyan/Lime Umbrella Area */}
        <g transform="translate(384, 110) scale(0.85)">
          {/* Shadow */}
          <ellipse cx="25" cy="80" rx="45" ry="15" fill="rgba(0,0,0,0.15)" />
          
          {/* Lounge Chair 1 */}
          <g transform="translate(-25, 85) rotate(-5)">
            <rect x="0" y="5" width="40" height="15" fill="rgba(0,0,0,0.15)"/>
            <rect x="-2" y="-2" width="44" height="19" rx="1" fill="#e2e8f0" stroke="#111" strokeWidth="2.5"/>
            <rect x="0" y="0" width="22" height="15" fill="#FF7549" stroke="#111" strokeWidth="2"/>
            <path d="M 22 0 L 36 -5 L 36 10 L 22 15 Z" fill="#FFED65" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
          </g>

          {/* Pole */}
          <rect x="-3" y="0" width="6" height="80" fill="#a16207" stroke="#111" strokeWidth="2.5" />
          <ellipse cx="0" cy="80" rx="10" ry="4" fill="#ca8a04" stroke="#111" strokeWidth="2" />
          
          {/* Panels */}
          <path d="M 0 -45 C -30 -40, -50 -20, -65 0 Q -47 -3, -30 5 Q -15 -15, 0 -45 Z" fill="#5FD9FF" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 0 -45 Q -15 -15, -30 5 Q -15 0, 0 8 Q 0 -15, 0 -45 Z" fill="#B9FF68" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 0 -45 Q 0 -15, 0 8 Q 15 0, 30 5 Q 15 -15, 0 -45 Z" fill="#5FD9FF" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 0 -45 Q 15 -15, 30 5 Q 47 -3, 65 0 C 50 -20, 30 -40, 0 -45 Z" fill="#B9FF68" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
          
          {/* Thick Outer Border */}
          <path d="M 0 -45 C -30 -40, -50 -20, -65 0 Q -47 -3, -30 5 Q -15 0, 0 8 Q 15 0, 30 5 Q 47 -3, 65 0 C 50 -20, 30 -40, 0 -45 Z" fill="none" stroke="#111" strokeWidth="4.5" strokeLinejoin="round" />
          
          {/* Finial */}
          <path d="M -3 -45 L 3 -45 L 0 -54 Z" fill="#ff7549" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        {/* Lighthouse */}
        <g transform="translate(1320, -10)">
          {/* Sweeping Light Beams (Hard Graphic Style) */}
          <g transform="translate(30, 15)">
            <g>
              <animateTransform attributeName="transform" type="rotate" values="-15 0 0; 35 0 0; -15 0 0" dur="6s" repeatCount="indefinite" />
              <path d="M0,0 L-600,150 L-600,-150 Z" fill="rgba(255,237,101,0.15)" />
              <path d="M0,0 L-500,40 L-500,-40 Z" fill="rgba(255,237,101,0.25)" />
              <path d="M0,0 L-200,10 L-200,-10 Z" fill="rgba(255,237,101,0.4)" />
            </g>
            <g>
               <animateTransform attributeName="transform" type="rotate" values="165 0 0; 215 0 0; 165 0 0" dur="6s" repeatCount="indefinite" />
               <path d="M0,0 L-400,80 L-400,-80 Z" fill="rgba(255,237,101,0.15)" />
            </g>
          </g>

          {/* Background rocky base element */}
          <path d="M0,130 Q30,120 60,130 L60,140 L0,140 Z" fill="#64748b" stroke="#111" strokeWidth="3"/>

          {/* Tower Base */}
          <polygon points="15,130 45,130 35,30 25,30" fill="#f8fafc" stroke="#111" strokeWidth="4" strokeLinejoin="round"/>
          
          {/* Wrapper Stripes */}
          <polygon points="16,110 44,110 42,85 18,85" fill="#FF7549" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
          <polygon points="21,55 39,55 37,35 23,35" fill="#FF7549" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>

          {/* 3D Core Shadow (right side) */}
          <polygon points="30,130 45,130 35,30 30,30" fill="rgba(0,0,0,0.15)"/>
          
          {/* Highlight line (left side) */}
          <line x1="20" y1="125" x2="28" y2="35" stroke="#fff" strokeWidth="2" opacity="0.8"/>

          {/* Door */}
          <path d="M25 130 L 25 110 C 25 105, 35 105, 35 110 L 35 130 Z" fill="#334155" stroke="#111" strokeWidth="2.5"/>
          <rect x="29" y="112" width="2" height="18" fill="#111"/> 
          
          {/* Windows with glowing reflections */}
          <g>
            <rect x="27" y="90" width="6" height="10" rx="0" fill="#3b82f6" stroke="#111" strokeWidth="2"/>
            <line x1="29" y1="92" x2="31" y2="98" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            <rect x="27" y="42" width="6" height="8" rx="0" fill="#3b82f6" stroke="#111" strokeWidth="2"/>
            <line x1="29" y1="44" x2="31" y2="48" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </g>

          {/* Lantern Room Platform & Brutalist Railing */}
          <rect x="12" y="30" width="36" height="5" rx="0" fill="#1f2937" stroke="#111" strokeWidth="3"/>
          <polygon points="18,30 42,30 38,27 22,27" fill="#64748b" stroke="#111" strokeWidth="2.5"/>
          <path d="M 10 20 L 50 20 M 12 30 L 12 20 M 20 30 L 20 20 M 30 30 L 30 20 M 40 30 L 40 20 M 48 30 L 48 20" stroke="#111" strokeWidth="3"/>
          
          {/* Lantern Room Glowing Core */}
          <rect x="22" y="7" width="16" height="20" fill="#FFED65" stroke="#111" strokeWidth="3"/>
          <circle cx="30" cy="17" r="4" fill="#fff" stroke="#FF7549" strokeWidth="1.5"/>
          <line x1="27" y1="7" x2="27" y2="27" stroke="#111" strokeWidth="2"/>
          <line x1="33" y1="7" x2="33" y2="27" stroke="#111" strokeWidth="2"/>
          
          {/* Roof */}
          <path d="M 17 7 L 30 -8 L 43 7 Z" fill="#FF7549" stroke="#111" strokeWidth="3" strokeLinejoin="round"/>
          <polygon points="30,-8 43,7 30,7" fill="rgba(0,0,0,0.15)"/>
          
          <circle cx="30" cy="-8" r="3" fill="#B9FF68" stroke="#111" strokeWidth="2"/>
        </g>
      </svg>

      {/* Entities */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
        {TURTLES.map(t => (
          <Turtle key={t.id} style={{ position:'absolute', left:`${t.x}%`, top:`${t.y}%`, animationDelay:`${t.delay}s` }}/>
        ))}

        {FISHES.map(f => (
          <div key={f.id} className="absolute"
            style={{
              top: `${f.y}%`,
              left: 0,
              transform: f.goRight ? 'none' : 'scaleX(-1)', // Leave scale to component
              animation: `${f.goRight ? 'swim-right' : 'swim-left'} ${f.speed}s linear ${f.delay}s infinite`,
            }}>
            <Fish size={f.size}/>
          </div>
        ))}

        {garbage.map(g => (
          <div key={g.id} className="animate-float absolute"
            style={{
              left: `${g.x}%`, top: `${g.y}%`,
              animationDuration: `${g.animDuration}s`,
              animationDelay: `${g.animDelay}s`,
              opacity: g.status === 'targeted' ? 0.55 : 1,
            }}>
            <Garbage type={g.type}/>
          </div>
        ))}

        {poofs.map(p => (
          <div key={p.id} className="animate-poof absolute pointer-events-none"
            style={{ left:`${p.x}%`, top:`${p.y}%`, zIndex: 60 }}>
            <span className="font-comic text-3xl font-black"
              style={{ color: '#FF7549', textShadow:'2px 2px 0 #111,-2px -2px 0 #111,2px -2px 0 #111,-2px 2px 0 #111' }}>
              POOF!
            </span>
          </div>
        ))}

        {crews.map(c => (
          <CrewBoat key={c.id} x={c.x} y={c.y} status={c.status}/>
        ))}
      </div>

      {/* Drag selection box */}
      {isDragging && selBox && (
        <div className="absolute pointer-events-none" style={{ ...selBox, zIndex: 50 }}>
          <div className="absolute inset-0 backdrop-saturate-[1.5] backdrop-brightness-[1.2] backdrop-contrast-[1.2]" style={{ background:'rgba(255, 237, 101, 0.25)', border: '2px solid rgba(17, 17, 17, 0.4)' }}/>
          {[
            'top-[-2px] left-[-2px] border-t-[4px] border-l-[4px]',
            'top-[-2px] right-[-2px] border-t-[4px] border-r-[4px]',
            'bottom-[-2px] left-[-2px] border-b-[4px] border-l-[4px]',
            'bottom-[-2px] right-[-2px] border-b-[4px] border-r-[4px]',
          ].map((cls, i) => (
            <div key={i} className={`absolute w-4 h-4 ${cls} border-[#111]`}/>
          ))}
          <div className="absolute left-1/2 animate-jitter font-comic text-xs font-black px-2 py-0.5 whitespace-nowrap"
            style={{ top: '-2rem', transform: 'translateX(-50%)', background: '#FFED65', color: '#111', border: '2px solid #111' }}>
            SCAN
          </div>
        </div>
      )}
    </div>
  );
}
