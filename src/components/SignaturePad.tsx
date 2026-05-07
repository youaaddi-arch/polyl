'use client';
import { useEffect, useRef, useState } from 'react';
import { Eraser, Download, Pen } from 'lucide-react';
import { Button } from './ui/Button';

export function SignaturePad({ onChange }: { onChange?: (dataUrl: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr; c.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = '#0b1437';
  }, []);

  function pos(e: React.PointerEvent) {
    const rect = ref.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function down(e: React.PointerEvent) {
    const c = ref.current!; const ctx = c.getContext('2d')!;
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    setDrawing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (!drawing) return;
    const ctx = ref.current!.getContext('2d')!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
    if (!hasInk) setHasInk(true);
  }
  function up() {
    setDrawing(false);
    if (hasInk && onChange) onChange(ref.current!.toDataURL('image/png'));
  }
  function clear() {
    const c = ref.current!; const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
    onChange?.(null);
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
      <div className="px-4 py-2.5 border-b border-ink-100 flex items-center justify-between bg-ink-50/40">
        <div className="flex items-center gap-2 text-xs text-ink-600"><Pen className="size-3.5" /> Tracez votre signature</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={clear} disabled={!hasInk}><Eraser className="size-3.5" /> Effacer</Button>
          <Button size="sm" variant="outline" disabled={!hasInk}><Download className="size-3.5" /> Exporter</Button>
        </div>
      </div>
      <canvas
        ref={ref}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="block w-full h-48 bg-[linear-gradient(transparent_95%,#e6ebf3_95%)] bg-[length:100%_24px] cursor-crosshair touch-none"
      />
      <div className="px-4 py-2 text-[11px] text-ink-400 border-t border-ink-100 bg-ink-50/40">
        En signant, vous acceptez le certificat numerique et l\'horodatage Sygna (eIDAS).
      </div>
    </div>
  );
}
