"use client";

import { useId } from "react";

export const MANDALA_PALETTES = {
  peacock: ["#186f73", "#bb8a35", "#a64e76", "#2c9190", "#76619a", "#bf7049"],
  lotus: ["#a64e76", "#78619e", "#1d8586", "#bd893c", "#c36576", "#426d91"],
  marigold: ["#ba8535", "#c07048", "#1c7977", "#a95872", "#d09c40", "#607e69"],
} as const;
export type MandalaPaletteName = keyof typeof MANDALA_PALETTES;
export type MandalaDesign = "paisley" | "lotus" | "rosette";

const NIGHT_PALETTES = {
  peacock: ["#80ccc1", "#e8c27f", "#d799bc", "#84c4cd", "#b4a2d5", "#dfa286"],
  lotus: ["#dfa1ba", "#b5a2dc", "#7bd0c8", "#ecd097", "#df9fb0", "#9bbcdc"],
  marigold: ["#ecd091", "#e6ab8d", "#90d6c5", "#dca0b8", "#f2d9a4", "#b4ceb0"],
} as const;

/** Reusable vector artwork. Geometry stays still in React; CSS paints and turns
 * nested rings. Unique IDs keep all repeated ornaments independent. */
export function MandalaArt({
  palette = "peacock",
  design = "paisley",
  dark = false,
}: {
  palette?: MandalaPaletteName;
  design?: MandalaDesign;
  dark?: boolean;
}) {
  const uid = `mandala-${useId().replace(/:/g, "")}`;
  const colors = dark ? NIGHT_PALETTES[palette] : MANDALA_PALETTES[palette];
  const leaf = `${uid}-leaf`;
  const lotus = `${uid}-lotus`;
  const heart = `${uid}-heart`;
  const petals = design === "rosette" ? 12 : 16;
  const outerPath = design === "paisley"
    ? "M0 0 C-36-19-36-48-25-64 C-18-77-7-81 0-101 C6-80 33-77 30-48 C28-22 14-8 0 0Z"
    : "M0 0 C-30-17-38-50-19-74 C-10-87-4-91 0-101 C4-91 10-87 19-74 C38-50 30-17 0 0Z";

  function ring(id: string, count: number, radius: number, offset: number, coloured: boolean) {
    return Array.from({ length: count }, (_, i) => (
      <use
        key={i}
        href={`#${id}`}
        transform={`rotate(${(i * 360) / count + offset} 240 240) translate(240 ${240 - radius})`}
        style={{ color: coloured ? colors[i % colors.length] : "var(--mandala-ink)" }}
      />
    ));
  }

  return (
    <svg
      className="mandala-svg"
      viewBox="0 0 480 480"
      width="480"
      height="480"
      aria-hidden="true"
      focusable="false"
      data-mandala-art={design}
    >
      <defs>
        <g id={leaf} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
          <path className="mandala-petal-fill" d={outerPath} />
          <path fill="none" d="M0-10 C-24-27-25-55-13-69 C-7-77-2-79 0-86 C6-70 22-65 20-46 C18-28 8-18 0-10Z" />
          <path fill="none" strokeWidth="1.2" d="M0-22 C-13-38-14-54-4-66 C9-59 14-44 0-22ZM0-22 Q-2-45-4-66" />
          <path fill="none" strokeWidth="1.05" d="M-10-18 Q-26-38-21-56M10-17 Q27-35 24-55" strokeDasharray="1 4.5" />
          <circle cx="0" cy="-46" r="3.3" fill="currentColor" stroke="none" />
          <path fill="none" strokeWidth="1.1" d="M-6-71 Q-9-83 0-93 Q7-83 5-76" />
          <circle cx="-16" cy="-61" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="13" cy="-64" r="1.4" fill="currentColor" stroke="none" />
        </g>
        <g id={lotus} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path className="mandala-petal-fill" d="M0 0 C-26-14-28-36 0-67 C28-36 26-14 0 0Z" />
          <path fill="none" strokeWidth="1.25" d="M0-9 C-15-22-14-35 0-53 C14-35 15-22 0-9ZM0-10V-51" />
          <path fill="none" strokeWidth="1.15" d="M0-22 L-7-31M0-31L8-40" />
          <circle cx="0" cy="-59" r="1.5" fill="currentColor" stroke="none" />
        </g>
        <g id={heart} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path className="mandala-petal-fill" d="M0 0 Q-22-17 0-41 Q22-17 0 0Z" />
          <path fill="none" strokeWidth="1.2" d="M0-7 Q-10-19 0-31 Q10-19 0-7Z" />
          <circle cx="0" cy="-19" r="2" fill="currentColor" stroke="none" />
        </g>
      </defs>

      <g className="mandala-ring mandala-ring--outer" data-spin="outer">
        <g className="mandala-orbit mandala-orbit--outer">
          <g className="mandala-linework">{ring(leaf, petals, 129, 0, false)}</g>
          <g className="mandala-colour" data-paint-layer>{ring(leaf, petals, 129, 0, true)}</g>
          <circle cx="240" cy="240" r="126" className="mandala-outline" strokeWidth="1.5" />
          <circle cx="240" cy="240" r="119" className="mandala-outline" strokeWidth="3.5" strokeDasharray="0.5 5" strokeLinecap="round" />
        </g>
      </g>

      <g className="mandala-ring mandala-ring--inner" data-spin="inner">
        <g className="mandala-orbit mandala-orbit--inner">
          <g className="mandala-linework">{ring(lotus, 12, 56, 15, false)}</g>
          <g className="mandala-colour" data-paint-layer>{ring(lotus, 12, 56, 15, true)}</g>
          <circle cx="240" cy="240" r="53" className="mandala-outline" strokeWidth="1.5" />
          <circle cx="240" cy="240" r="49" className="mandala-outline" strokeWidth="1" />
        </g>
      </g>

      <g className="mandala-linework">{ring(heart, 8, 8, 22.5, false)}</g>
      <g className="mandala-colour" data-paint-layer>{ring(heart, 8, 8, 22.5, true)}</g>
      <circle cx="240" cy="240" r="10" fill="none" stroke={colors[1]} strokeWidth="2" />
      <circle cx="240" cy="240" r="4" fill={colors[0]} />
      <g className="mandala-beads" fill={colors[1]}>
        {Array.from({ length: 32 }, (_, i) => {
          const a = (i * Math.PI * 2) / 32;
          return <circle key={i} cx={240 + Math.cos(a) * 235} cy={240 + Math.sin(a) * 235} r={i % 2 ? 1.4 : 2.1} />;
        })}
      </g>
    </svg>
  );
}
