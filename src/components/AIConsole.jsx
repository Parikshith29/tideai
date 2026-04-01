import { motion, AnimatePresence } from 'framer-motion';

const LOG_COLORS = {
  scan: '#3b82f6',
  detect: '#FF7549',
  dispatch: '#22c55e',
  cleaning: '#3b82f6',
  complete: '#22c55e',
  separator: '#94a3b8',
};

export default function AIConsole({ isOpen, logs }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, y: -10 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="overflow-hidden"
          style={{
            background: '#ffffff',
            border: '2px solid #111',
            minWidth: 320,
            boxShadow: '4px 4px 0 #111',
          }}
        >
          {/* Terminal chrome */}
          <div className="flex items-center gap-2 px-3 py-2"
            style={{ borderBottom: '2px solid #111', background: '#f8fafc' }}>
            <div className="w-2.5 h-2.5 bg-[#FF7549] border border-[#111]" />
            <div className="w-2.5 h-2.5 bg-[#B9FF68] border border-[#111]" />
            <div className="w-2.5 h-2.5 bg-[#5FD9FF] border border-[#111]" />
            <span className="font-sans font-bold uppercase tracking-widest text-xs text-[#f8fafc] ml-2">tide.ai — console</span>
          </div>

          {/* Log lines */}
          <div className="px-3 py-2 space-y-0.5" style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 12, textTransform: 'uppercase' }}>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                style={{ color: LOG_COLORS[log.type] || '#111' }}
              >
                <span style={{ color: '#94a3b8' }}>{String(i).padStart(2, '0')} &gt; </span>
                {log.text}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            <motion.span
              className="inline-block w-2 h-3"
              style={{ background: '#111', marginLeft: 4 }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
