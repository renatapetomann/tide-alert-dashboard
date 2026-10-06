import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, Info, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertaShell } from '@/components/alerta-shell';
import { neighborhoods, levels, pageHead } from '@/lib/scenarios';
export const Route = createFileRoute('/trajeto')({ head: () => pageHead('Meu trajeto', 'Consulte os cenários dos bairros de origem e destino. O protótipo não calcula rotas seguras nem interdições reais.'), component: JourneyPage });
function JourneyPage() {
  const [origin, setOrigin] = useState('Campeche');
  const [destination, setDestination] = useState('Pântano do Sul');
  const [result, setResult] = useState<{ origin: string; destination: string } | null>(null);
  const selected = neighborhoods.filter(n => n.name === result?.origin || n.name === result?.destination);
  const mapsUrl = result ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(result.origin + ', Florianópolis, SC')}&destination=${encodeURIComponent(result.destination + ', Florianópolis, SC')}&travelmode=driving` : '';
  return <AlertaShell><main className="content-page appear"><div className="eyebrow"><Navigation size={13}/> MOBILIDADE · SUL DA ILHA</div><h1>Meu trajeto</h1><p className="intro">Consulte a sinalização ilustrativa dos bairros de origem e destino. A comparação não analisa vias intermediárias nem indica uma rota livre de alagamentos.</p><form onSubmit={e => { e.preventDefault(); setResult({ origin, destination }); }}><div className="form-grid"><label className="field">Origem<select value={origin} onChange={e => { setOrigin(e.target.value); setResult(null); }}>{neighborhoods.map(n => <option key={n.name}>{n.name}</option>)}</select></label><label className="field">Destino<select value={destination} onChange={e => { setDestination(e.target.value); setResult(null); }}>{neighborhoods.map(n => <option key={n.name}>{n.name}</option>)}</select></label></div><Button type="submit"><Navigation/>Consultar cenário</Button></form>
    {result && <section className="route-result" aria-live="polite"><h2>{result.origin} → {result.destination}</h2>{selected.map(n => <article className="result-item" key={n.name}><MapPin size={19} className="text-primary"/><div><h3>{n.stretch}</h3><span className="status-label" data-level={n.level}><i className="status-dot"/>{levels[n.level].label} · cenário ilustrativo</span><p>{n.note}</p></div></article>)}<p className="note"><Info size={13}/>O serviço externo não recebe os alertas deste protótipo. Uma rota sugerida por ele não é garantia de segurança. Consulte informações oficiais antes de sair.</p><Button variant="outline" className="mt-5" asChild><a href={mapsUrl} target="_blank" rel="noreferrer">Abrir no Google Maps <ArrowUpRight/></a></Button></section>}
    <p className="note"><Info size={13}/>Nenhuma localização pessoal ou histórico de deslocamento é coletado. Esta consulta usa apenas os bairros selecionados.</p></main></AlertaShell>;
}