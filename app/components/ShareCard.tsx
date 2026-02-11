"use client";

type PortalId = "comprendre" | "aimer" | "prevoir" | "recevoir";

const PORTAL_LABELS: Record<PortalId, string> = {
  comprendre: "COMPRENDRE",
  aimer: "AIMER",
  prevoir: "PRÉVOIR",
  recevoir: "RECEVOIR",
};

function wrapAndTruncate(text: string, maxLines: number, maxPerLine = 36): string[] {
  const trimmed = (text || "Une seule priorité. Un seul pas.").trim();
  const rawLines = trimmed.split(/\n/).filter(Boolean);
  const lines: string[] = [];
  for (const line of rawLines) {
    if (lines.length >= maxLines) break;
    const words = line.split(/\s+/);
    let current = "";
    for (const w of words) {
      const next = current ? `${current} ${w}` : w;
      if (next.length <= maxPerLine) {
        current = next;
      } else {
        if (current) lines.push(current);
        current = w.length > maxPerLine ? w.slice(0, maxPerLine) : w;
      }
    }
    if (current) lines.push(current);
  }
  return lines.slice(0, maxLines);
}

type ShareCardProps = {
  text: string;
  portalId: PortalId;
  vibe?: string;
};

export default function ShareCard({ text, portalId, vibe = "" }: ShareCardProps) {
  const lines = wrapAndTruncate(text, 6);
  const tag = PORTAL_LABELS[portalId] ?? portalId.toUpperCase();
  const lineHeight = 56;
  const startY = 675 - ((lines.length - 1) * lineHeight) / 2;

  return (
    <svg
      width="1080"
      height="1350"
      viewBox="0 0 1080 1350"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <defs>
        <linearGradient
          id="share-bg"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1350" fill="url(#share-bg)" />
      <text
        x="540"
        y="80"
        textAnchor="middle"
        fill="rgba(226,232,240,0.5)"
        fontSize="28"
        fontFamily="system-ui, sans-serif"
      >
        FutureVoyance.io
      </text>
      <text
        x="540"
        y="200"
        textAnchor="middle"
        fill="rgba(196,181,253,0.9)"
        fontSize="22"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="0.2em"
      >
        {tag}
        {vibe ? ` · ${vibe}` : ""}
      </text>
      <text
        x="540"
        y={startY}
        textAnchor="middle"
        fill="rgba(226,232,240,0.95)"
        fontSize="42"
        fontFamily="system-ui, sans-serif"
        fontWeight="500"
      >
        {lines.map((line, i) => (
          <tspan key={i} x="540" dy={i === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
      <text
        x="540"
        y="1280"
        textAnchor="middle"
        fill="rgba(148,163,184,0.6)"
        fontSize="24"
        fontFamily="system-ui, sans-serif"
      >
        oracle vivant
      </text>
    </svg>
  );
}

export async function exportSvgToPng(
  svgElement: SVGSVGElement,
  fileName: string
): Promise<void> {
  const width = 1080;
  const height = 1350;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2d context not available");
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 1);
  });
  if (!blob) throw new Error("Failed to export PNG");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
