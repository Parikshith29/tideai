export default function Garbage({ style = {}, type = 'bottle' }) {
  if (type === 'bottle') return (
    <div style={style}>
      <svg width="26" height="44" viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="0" width="10" height="7" rx="2" fill="#1d4ed8" stroke="#111" strokeWidth="2"/>
        <rect x="10" y="6" width="8" height="8" fill="#3b82f6" stroke="#111" strokeWidth="1.5"/>
        <path d="M5,14 Q3,20 4,36 Q6,44 14,44 Q22,44 24,36 Q25,20 23,14 Z" fill="#93c5fd" stroke="#111" strokeWidth="2"/>
        <path d="M8,20 Q8,36 14,38 Q20,36 20,20 Z" fill="#3b82f6" opacity="0.4"/>
        <rect x="7" y="22" width="14" height="10" rx="1" fill="white" stroke="#111" strokeWidth="1" opacity="0.8"/>
        <line x1="8" y1="16" x2="9" y2="38" stroke="white" strokeWidth="2" opacity="0.4"/>
      </svg>
    </div>
  );

  if (type === 'net') return (
    <div style={style}>
      <svg width="46" height="34" viewBox="0 0 48 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M2,4 Q24,0 46,4 Q44,18 48,34 Q24,32 0,34 Q4,18 2,4 Z" fill="#fef3c7" stroke="#111" strokeWidth="2" opacity="0.85"/>
        <line x1="2" y1="13" x2="46" y2="13" stroke="#d97706" strokeWidth="1.5" opacity="0.7"/>
        <line x1="2" y1="22" x2="46" y2="22" stroke="#d97706" strokeWidth="1.5" opacity="0.7"/>
        <line x1="12" y1="4" x2="12" y2="34" stroke="#d97706" strokeWidth="1.5" opacity="0.7"/>
        <line x1="24" y1="2" x2="24" y2="34" stroke="#d97706" strokeWidth="1.5" opacity="0.7"/>
        <line x1="36" y1="4" x2="36" y2="34" stroke="#d97706" strokeWidth="1.5" opacity="0.7"/>
        <path d="M6,8 Q20,16 40,8 Q30,24 8,28 Q20,20 42,28" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="13" r="2" fill="#92400e" stroke="#111" strokeWidth="1"/>
        <circle cx="24" cy="22" r="2" fill="#92400e" stroke="#111" strokeWidth="1"/>
        <circle cx="36" cy="13" r="2" fill="#92400e" stroke="#111" strokeWidth="1"/>
      </svg>
    </div>
  );

  if (type === 'barrel') return (
    <div style={style}>
      <svg width="34" height="42" viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg">
        <path d="M6,8 Q2,22 6,36 Q18,42 30,36 Q34,22 30,8 Q18,2 6,8 Z" fill="#713f12" stroke="#111" strokeWidth="2.5"/>
        <ellipse cx="18" cy="8"  rx="12" ry="4" fill="none" stroke="#111" strokeWidth="2.5"/>
        <ellipse cx="18" cy="36" rx="12" ry="4" fill="none" stroke="#111" strokeWidth="2.5"/>
        <ellipse cx="18" cy="22" rx="14" ry="4" fill="none" stroke="#111" strokeWidth="2"/>
        <path d="M18,14 L22,28 L14,28 Z" fill="#fbbf24" stroke="#111" strokeWidth="1.5"/>
        <line x1="18" y1="18" x2="18" y2="23" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="26" r="1.2" fill="#111"/>
        <path d="M26,30 Q28,34 26,38" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="26" cy="39" r="2" fill="#84cc16" opacity="0.8"/>
      </svg>
    </div>
  );

  if (type === 'bag') return (
    <div style={style}>
      <svg width="36" height="42" viewBox="0 0 38 44" xmlns="http://www.w3.org/2000/svg">
        <path d="M8,10 Q2,18 4,36 Q6,42 19,42 Q32,42 34,36 Q36,18 30,10 Z" fill="#e5e7eb" stroke="#111" strokeWidth="2.5"/>
        <path d="M14,10 Q19,5 24,10 L22,12 Q19,8 16,12 Z" fill="#9ca3af" stroke="#111" strokeWidth="1.5"/>
        <line x1="16" y1="2" x2="14" y2="10" stroke="#6b7280" strokeWidth="2"/>
        <line x1="22" y1="2" x2="24" y2="10" stroke="#6b7280" strokeWidth="2"/>
        <ellipse cx="14" cy="24" rx="5" ry="5" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1"/>
        <ellipse cx="24" cy="22" rx="5" ry="5" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1"/>
        <ellipse cx="19" cy="32" rx="6" ry="5" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1"/>
      </svg>
    </div>
  );

  if (type === 'trash') return (
    <div style={style}>
      <svg width="68" height="68" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow / water blend */}
        <ellipse cx="100" cy="130" rx="55" ry="18" fill="rgba(0,0,0,0.15)" />
        <g>
          {/* Plastic bag */}
          <path d="M60 90 Q70 60 100 70 Q130 60 140 90 Q130 110 100 115 Q70 110 60 90 Z"
                fill="#d9d9d9" opacity="0.8"/>
          {/* Bottle */}
          <g transform="rotate(-20 110 95)">
            <rect x="100" y="70" width="20" height="50" rx="6" fill="#4fc3f7"/>
            <rect x="105" y="60" width="10" height="15" rx="3" fill="#81d4fa"/>
          </g>
          {/* Can */}
          <g transform="rotate(15 70 110)">
            <rect x="60" y="90" width="18" height="30" rx="4" fill="#b0bec5"/>
            <ellipse cx="69" cy="90" rx="9" ry="4" fill="#cfd8dc"/>
          </g>
          {/* Plastic debris pieces */}
          <circle cx="85" cy="120" r="6" fill="#ffcc80"/>
          <circle cx="120" cy="115" r="5" fill="#a5d6a7"/>
          <circle cx="95" cy="130" r="4" fill="#f48fb1"/>
          {/* Fishing net lines */}
          <path d="M70 100 L130 120 M80 80 L120 140 M60 110 L140 100"
                stroke="#9e9e9e" stroke-width="1.5" opacity="0.6"/>
        </g>
      </svg>
    </div>
  );

  return null;
}
