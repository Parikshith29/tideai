export default function Turtle({ style = {} }) {
  return (
    <div className="absolute animate-float-slow" style={style}>
      <svg width="48" height="38" viewBox="0 0 72 58" xmlns="http://www.w3.org/2000/svg">
        {/* Main shell */}
        <ellipse cx="36" cy="30" rx="24" ry="18" fill="#16a34a" stroke="#111" strokeWidth="2.5"/>
        {/* Shell dome highlight */}
        <ellipse cx="36" cy="26" rx="14" ry="10" fill="#22c55e" opacity="0.7"/>
        {/* Shell pattern */}
        <ellipse cx="36" cy="28" rx="8" ry="6" fill="none" stroke="#15803d" strokeWidth="1.5" opacity="0.8"/>
        <line x1="36" y1="12" x2="36" y2="48" stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
        <line x1="14" y1="28" x2="58" y2="28" stroke="#15803d" strokeWidth="1.5" opacity="0.5"/>
        <line x1="20" y1="14" x2="52" y2="42" stroke="#15803d" strokeWidth="1" opacity="0.3"/>
        <line x1="52" y1="14" x2="20" y2="42" stroke="#15803d" strokeWidth="1" opacity="0.3"/>

        {/* Head */}
        <ellipse cx="56" cy="26" rx="9" ry="7" fill="#4ade80" stroke="#111" strokeWidth="2"/>
        {/* Neck */}
        <rect x="47" y="22" width="10" height="12" fill="#4ade80" stroke="none"/>
        {/* Eye */}
        <circle cx="60" cy="23" r="3" fill="white" stroke="#111" strokeWidth="1.5"/>
        <circle cx="61" cy="23" r="1.5" fill="#111"/>
        <circle cx="61.5" cy="22" r="0.5" fill="white"/>
        {/* Nostrils */}
        <circle cx="65" cy="26" r="1" fill="#15803d"/>
        <circle cx="65" cy="28" r="1" fill="#15803d"/>

        {/* Front flippers */}
        <ellipse cx="18" cy="16" rx="10" ry="5" fill="#4ade80" stroke="#111" strokeWidth="2" transform="rotate(-30 18 16)"/>
        <ellipse cx="18" cy="44" rx="10" ry="5" fill="#4ade80" stroke="#111" strokeWidth="2" transform="rotate(30 18 44)"/>
        {/* Rear flippers */}
        <ellipse cx="52" cy="12" rx="7" ry="4" fill="#4ade80" stroke="#111" strokeWidth="2" transform="rotate(-45 52 12)"/>
        <ellipse cx="52" cy="48" rx="7" ry="4" fill="#4ade80" stroke="#111" strokeWidth="2" transform="rotate(45 52 48)"/>
        {/* Tail */}
        <ellipse cx="13" cy="30" rx="6" ry="3" fill="#4ade80" stroke="#111" strokeWidth="2"/>
      </svg>
    </div>
  );
}
