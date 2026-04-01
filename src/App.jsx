import { useState, useRef, useCallback } from 'react';
import OceanCanvas from './components/OceanCanvas';
import AIConsole from './components/AIConsole';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function App() {
  const [collected, setCollected] = useState(0);
  const [areasCleaned, setAreasCleaned] = useState(0);
  const [screenshots, setScreenshots] = useState([]);
  const [scanFlash, setScanFlash] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // AI Console state
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);

  const robotBadgeRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const handleReset = useCallback(() => {
    setCollected(0);
    setAreasCleaned(0);
    setResetKey(k => k + 1);
  }, []);

  const handleCollect = useCallback((count) => {
    setCollected(prev => prev + count);
  }, []);

  const addConsoleLog = useCallback((text, type, delay) => {
    setTimeout(() => {
      setConsoleLogs(prev => [...prev, { text, type }]);
    }, delay);
  }, []);

  const handleAreaSelected = useCallback((pixelRect) => {
    const { trashCount = 0, gridIds = [] } = pixelRect;
    setAreasCleaned(prev => prev + 1);

    // Flash
    setScanFlash(true);
    setTimeout(() => setScanFlash(false), 200);

    // Screenshot fly animation to robot badge
    if (robotBadgeRef.current && canvasContainerRef.current) {
      const tgt = robotBadgeRef.current.getBoundingClientRect();
      const shotId = Date.now();
      const shot = {
        id: shotId,
        startLeft: pixelRect.left,
        startTop: pixelRect.top,
        w: Math.max(pixelRect.width || 80, 20),
        h: Math.max(pixelRect.height || 80, 20),
        endLeft: tgt.left + tgt.width / 2 - 24,
        endTop: tgt.top + tgt.height / 2 - 24,
        imgData: null,
      };

      // Remove immediate injection so we don't show the grid. 

      // Take physical cropped snapshot asynchronously to avoid blocking the Interaction (fixes INP)
      setTimeout(() => {
        if (!canvasContainerRef.current) return;
        html2canvas(canvasContainerRef.current, { scale: 1, backgroundColor: null }).then(canvas => {
          const rect = canvasContainerRef.current.getBoundingClientRect();
          const cropX = pixelRect.left - rect.left;
          const cropY = pixelRect.top - rect.top;
  
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = shot.w;
          cropCanvas.height = shot.h;
          const ctx = cropCanvas.getContext('2d');
          ctx.drawImage(canvas, cropX, cropY, shot.w, shot.h, 0, 0, shot.w, shot.h);
          const dataUrl = cropCanvas.toDataURL();
  
          const finalShot = { ...shot, imgData: dataUrl };
          setScreenshots(prev => [...prev, finalShot]);
          setTimeout(() => setScreenshots(prev => prev.filter(s => s.id !== shotId)), 2200);
        });
      }, 70);
    }

    // ── AI Console: open and stream logs ─────────────────────────────────────
    setConsoleLogs([]);
    setConsoleOpen(true);

    addConsoleLog('Analyzing selected zone...', 'scan', 300);
    addConsoleLog(`Satellite imagery processed.`, 'scan', 800);

    if (trashCount === 0) {
      addConsoleLog('No pollution detected in zone.', 'detect', 1300);
      addConsoleLog('Standing by.', 'separator', 1800);
      setTimeout(() => setConsoleOpen(false), 4000);
      return;
    }

    addConsoleLog(`⚠ Detected ${trashCount} pollution unit${trashCount !== 1 ? 's' : ''}.`, 'detect', 1300);
    addConsoleLog(`Active grids: ${gridIds.join(', ') || 'NONE'}`, 'detect', 1700);

    let dispatchTime = 2100;
    gridIds.forEach((gid, i) => {
      addConsoleLog(`Dispatching Grid-${gid} cleanup crew...`, 'dispatch', dispatchTime + i * 350);
    });

    const afterDispatch = dispatchTime + gridIds.length * 350 + 200;
    addConsoleLog('All crews en route. ETA ~1.6s per target.', 'dispatch', afterDispatch);
    addConsoleLog('⚡ CLEANUP IN PROGRESS...', 'cleaning', afterDispatch + 500);

    // Estimate mission duration: travel + cleaning per trash item
    const missionDuration = trashCount * 1800 + 3500;
    addConsoleLog(`✅ Mission complete — ${trashCount} unit${trashCount !== 1 ? 's' : ''} removed!`, 'complete', missionDuration);
    addConsoleLog('Crews returning to home positions.', 'separator', missionDuration + 400);

    // Auto-close console
    setTimeout(() => {
      setConsoleOpen(false);
    }, missionDuration + 2800);
  }, [addConsoleLog]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8"
      style={{ background: '#E8F5FF', backgroundImage: 'radial-gradient(circle,rgba(17,17,17,0.08) 2px,transparent 2px)', backgroundSize: '32px 32px' }}>

      <div className="flex flex-col h-full rounded-none overflow-hidden"
        style={{ background: '#F8FAFC', border: '4px solid #111', boxShadow: '16px 16px 0px 0px #111', minHeight: 'calc(100vh - 4rem)' }}>

        {/* ── HEADER ── */}
        <header className="shrink-0 flex items-center justify-between gap-4 px-6 py-3"
          style={{ background: '#5FD9FF', borderBottom: '4px solid #111' }}>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 -rotate-6 rounded-md flex items-center justify-center"
              style={{ background: '#FFED65', border: '3px solid #111', boxShadow: '4px 4px 0 #111' }}>
              <Radar size={24} className="sm:w-[28px] sm:h-[28px]" strokeWidth={3} color="#111" />
            </div>
            <span className="font-comic text-xl sm:text-3xl tracking-widest text-white uppercase whitespace-nowrap"
              style={{ textShadow: '2px 2px 0 #111' }}>
              TIDE.AI
            </span>
            <span className="font-comic text-xs sm:text-sm px-2 py-0.5 rotate-2 animate-pulse ml-0 sm:ml-1 whitespace-nowrap"
              style={{ background: '#FF7549', color: 'white', border: '2px solid #111', boxShadow: '2px 2px 0 #111' }}>
              LIVE SIM
            </span>
          </div>

        </header>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6" style={{ minHeight: 0 }}>

          {/* Sidebar */}
          <aside className="md:w-56 shrink-0 flex flex-col gap-4">

            <div className="panel-neo p-4 -rotate-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🗑️</span>
                <span className="font-sans font-black text-xs uppercase tracking-widest" style={{ color: '#111' }}>Trash Cleared</span>
              </div>
              <motion.div key={collected}
                initial={{ scale: 1.5, color: '#FF7549' }}
                animate={{ scale: 1, color: '#111' }}
                className="font-comic text-5xl leading-none" style={{ color: '#111' }}>
                {collected}
              </motion.div>
            </div>

            <div className="panel-neo p-4 rotate-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📡</span>
                <span className="font-sans font-black text-xs uppercase tracking-widest" style={{ color: '#111' }}>Areas Scanned</span>
              </div>
              <motion.div key={areasCleaned}
                initial={{ scale: 1.5, color: '#5FD9FF' }}
                animate={{ scale: 1, color: '#111' }}
                className="font-comic text-5xl leading-none" style={{ color: '#111' }}>
                {areasCleaned}
              </motion.div>
            </div>

            <button onClick={handleReset} className="w-full btn-neo text-lg"
              style={{ background: '#FF7549', color: '#111' }}>
              ↺ Reset Ocean
            </button>

            <div className="-rotate-1 p-3 panel-neo" style={{ background: '#5FD9FF' }}>
              <p className="font-comic text-base uppercase tracking-wide leading-snug" style={{ color: '#111' }}>
                🖱️ Drag on ocean<br />to scan & deploy<br />cleanup crew!
              </p>
            </div>

            {/* AI Uplink moved from header to bottom left */}
            <div className="relative mt-auto">
              {/* Console opens UP from badge */}
              <div className="absolute left-0 bottom-[108%] mb-2 z-50">
                <AIConsole isOpen={consoleOpen} logs={consoleLogs} />
              </div>

              <div
                ref={robotBadgeRef}
                className="flex items-center gap-4 cursor-pointer transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#111] p-4 w-full"
                style={{ background: '#B9FF68', border: '2px solid #111', boxShadow: '4px 4px 0px 0px #111' }}
              >
                <motion.span
                  className="text-4xl"
                  animate={consoleOpen ? { rotate: [0, -15, 15, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  🤖
                </motion.span>
                <div>
                  <div className="font-sans text-sm font-black uppercase tracking-widest" style={{ color: '#111' }}>AI Uplink</div>
                  <div className="font-comic text-xl leading-none" style={{ color: '#111' }}>
                    {consoleOpen ? 'PROCESSING' : 'STANDBY'}
                  </div>
                </div>
                {consoleOpen && (
                  <motion.div
                    className="ml-auto w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: '#111' }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  />
                )}
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <div ref={canvasContainerRef} className="flex-1 min-h-[460px] overflow-hidden"
            style={{ border: '2px solid #111', boxShadow: '6px 6px 0 #111' }}>
            <OceanCanvas
              onCollect={handleCollect}
              onAreaSelected={handleAreaSelected}
              resetKey={resetKey}
            />
          </div>
        </div>

        {/* Screen flash */}
        <AnimatePresence>
          {scanFlash && (
            <motion.div key="flash"
              initial={{ opacity: 0.15 }} animate={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 bg-white pointer-events-none" style={{ zIndex: 200 }} />
          )}
        </AnimatePresence>

        {/* Screenshot fly animation */}
        <AnimatePresence>
          {screenshots.map(s => (
            <motion.div key={s.id}
              initial={{
                position: 'fixed', zIndex: 150,
                left: s.startLeft, top: s.startTop,
                width: s.w, height: s.h,
                opacity: 1, scale: 1, rotate: 0, borderRadius: 0,
                boxShadow: '0 0 60px rgba(95, 217, 255, 0.4)',
                border: '2px solid #5FD9FF',
              }}
              animate={{
                left: s.endLeft, top: s.endTop,
                width: 48, height: 48,
                opacity: 0, scale: 0.1, rotate: 180, borderRadius: 16,
                boxShadow: '0 0 0px rgba(255,255,255,0)',
              }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              style={{
                backgroundColor: '#111',
                backgroundImage: `url(${s.imgData})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="pointer-events-none overflow-hidden"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
