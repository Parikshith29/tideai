export default function Fish({ style = {}, size = 1.0, flipped = false }) {
  return (
    <div className="absolute animate-float" style={style}>
      <svg
        width={64 * size}
        height={40 * size}
        viewBox="0 0 64 40"
        style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="28" cy="20" rx="22" ry="13" fill="#f97316" stroke="#111" strokeWidth="2.5"/>
        {/* Tail */}
        <polygon points="6,20 0,8 0,32" fill="#ea580c" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
        {/* Belly highlight */}
        <ellipse cx="30" cy="24" rx="12" ry="5" fill="#fed7aa" opacity="0.5"/>
        {/* Top fin */}
        <polygon points="22,7 30,3 38,7" fill="#c2410c" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
        {/* Eye */}
        <circle cx="42" cy="17" r="4" fill="white" stroke="#111" strokeWidth="2"/>
        <circle cx="43" cy="17" r="2" fill="#111"/>
        <circle cx="44" cy="15.5" r="0.8" fill="white"/>
        {/* Mouth */}
        <path d="M50,20 Q52,22 50,23" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Stripes */}
        <line x1="26" y1="9" x2="26" y2="31" stroke="#c2410c" strokeWidth="1.5" opacity="0.5"/>
        <line x1="33" y1="8" x2="33" y2="31" stroke="#c2410c" strokeWidth="1.5" opacity="0.5"/>
      </svg>
    </div>
  );
}
