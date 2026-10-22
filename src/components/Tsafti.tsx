/* Tsafti, le fennec du Sahel : mascotte de Tsafta AI.
   Personnage original dessiné en SVG (grandes oreilles, pelage sable, regard malicieux). */

export default function Tsafti({ taille = 120, humeur = "content", className = "" }: { taille?: number; humeur?: "content" | "bravo"; className?: string }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 200 200" className={className} role="img" aria-label="Tsafti, le fennec de Tsafta">
      <defs>
        <radialGradient id="ts-tete" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFC47A" />
          <stop offset="60%" stopColor="#F59A3C" />
          <stop offset="100%" stopColor="#D9711F" />
        </radialGradient>
        <linearGradient id="ts-oreille" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9852E" />
          <stop offset="100%" stopColor="#F7A649" />
        </linearGradient>
        <linearGradient id="ts-interieur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD9C2" />
          <stop offset="100%" stopColor="#FFB79A" />
        </linearGradient>
        <radialGradient id="ts-oeil" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#5A3A22" />
          <stop offset="100%" stopColor="#1A0E06" />
        </radialGradient>
        <radialGradient id="ts-corps" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFB866" />
          <stop offset="100%" stopColor="#E07A24" />
        </radialGradient>
      </defs>

      {/* Ombre au sol */}
      <ellipse cx="100" cy="190" rx="46" ry="6" fill="#000" opacity="0.25" />

      {/* Corps */}
      <path d="M62 196 C60 160 72 140 100 140 C128 140 140 160 138 196 Z" fill="url(#ts-corps)" />
      <path d="M82 196 C82 170 88 156 100 156 C112 156 118 170 118 196 Z" fill="#FFF3E2" />

      {/* Oreilles */}
      <path d="M58 92 L30 10 C48 14 78 40 90 70 Z" fill="url(#ts-oreille)" />
      <path d="M62 84 L42 26 C56 32 74 52 82 72 Z" fill="url(#ts-interieur)" />
      <path d="M142 92 L170 10 C152 14 122 40 110 70 Z" fill="url(#ts-oreille)" />
      <path d="M138 84 L158 26 C144 32 126 52 118 72 Z" fill="url(#ts-interieur)" />

      {/* Tête */}
      <path d="M100 58 C140 58 162 84 160 112 C158 140 132 156 100 156 C68 156 42 140 40 112 C38 84 60 58 100 58 Z" fill="url(#ts-tete)" />
      {/* Masque clair */}
      <path d="M100 102 C120 102 140 112 144 126 C136 146 118 154 100 154 C82 154 64 146 56 126 C60 112 80 102 100 102 Z" fill="#FFF3E2" />
      {/* Joues */}
      <ellipse cx="62" cy="126" rx="9" ry="6" fill="#FF8F6B" opacity="0.45" />
      <ellipse cx="138" cy="126" rx="9" ry="6" fill="#FF8F6B" opacity="0.45" />

      {/* Yeux */}
      {humeur === "bravo" ? (
        <>
          <path d="M66 104 Q78 92 90 104" stroke="#2A170A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M110 104 Q122 92 134 104" stroke="#2A170A" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="78" cy="102" rx="14" ry="16" fill="url(#ts-oeil)" />
          <ellipse cx="122" cy="102" rx="14" ry="16" fill="url(#ts-oeil)" />
          <circle cx="83" cy="95" r="5" fill="#fff" />
          <circle cx="127" cy="95" r="5" fill="#fff" />
          <circle cx="74" cy="108" r="2.2" fill="#fff" opacity="0.8" />
          <circle cx="118" cy="108" r="2.2" fill="#fff" opacity="0.8" />
        </>
      )}

      {/* Museau */}
      <path d="M92 124 C92 119 108 119 108 124 C108 129 102 132 100 132 C98 132 92 129 92 124 Z" fill="#2A170A" />
      <ellipse cx="97" cy="122" rx="2.5" ry="1.5" fill="#fff" opacity="0.6" />
      <path d="M100 132 L100 137 M100 137 Q94 143 88 139 M100 137 Q106 143 112 139" stroke="#2A170A" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {humeur === "bravo" && <path d="M92 140 Q100 150 108 140 Z" fill="#E2554A" />}

      {/* Petit sac de recyclage (pattes) */}
      <rect x="84" y="164" width="32" height="26" rx="8" fill="#45E0A0" />
      <path d="M93 177 l5 5 l9 -10" stroke="#0B3B2A" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="82" cy="172" r="7" fill="#F59A3C" />
      <circle cx="118" cy="172" r="7" fill="#F59A3C" />
    </svg>
  );
}
