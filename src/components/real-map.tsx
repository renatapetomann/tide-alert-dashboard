import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { neighborhoodCoords } from '@/lib/neighborhood-tide';

type Props = { names: string[]; selected: number; onSelect: (i: number) => void };

export default function RealMap({ names, selected, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.CircleMarker[]>([]);
  const select = useRef(onSelect);
  select.current = onSelect;

  useEffect(() => {
    if (!box.current) return;
    const m = L.map(box.current, { scrollWheelZoom: false }).setView([-27.715, -48.515], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; colaboradores do OpenStreetMap' }).addTo(m);
    markers.current = names.map((name, i) => {
      const pos = neighborhoodCoords[name] ?? [-27.715, -48.515];
      return L.circleMarker(pos, { radius: 9, weight: 2 }).addTo(m).bindTooltip(name, { permanent: true, direction: 'top', offset: [0, -8] }).on('click', () => select.current(i));
    });
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, [names]);

  useEffect(() => {
    markers.current.forEach((mk, i) => mk.setStyle(i === selected
      ? { color: 'oklch(0.43 0.105 247)', fillColor: 'oklch(0.43 0.105 247)', fillOpacity: 0.9, radius: 12 }
      : { color: 'oklch(0.43 0.105 247)', fillColor: 'oklch(0.985 0.003 230)', fillOpacity: 0.9, radius: 9 }));
    const pos = neighborhoodCoords[names[selected] ?? ''];
    if (pos) map.current?.panTo(pos);
  }, [selected, names]);

  return <div ref={box} className="real-map" role="application" aria-label="Mapa do Sul da Ilha com os bairros. Use a lista de bairros para escolher pelo teclado." />;
}
