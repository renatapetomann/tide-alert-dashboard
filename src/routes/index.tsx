import { createFileRoute, Link, ClientOnly } from '@tanstack/react-router';
import { lazy, Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MapPin, ArrowUpRight, Waves, Navigation, ArrowRight, Map, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertaShell } from '@/components/alerta-shell';
import { neighborhoods, levels, pageHead } from '@/lib/scenarios';
import { CitizenReport } from '@/components/citizen-report';
import { TidePanel } from '@/components/tide-panel';
import { publicTidesOptions } from '@/lib/tides.query';
import { tideSummary, tidePhrase } from '@/lib/tide-data';
import { levelFromTide, tideWords } from '@/lib/neighborhood-tide';

const RealMap = lazy(() => import('@/components/real-map'));
const names = neighborhoods.map(n => n.name);

export const Route = createFileRoute('/')({ head: () => pageHead('Painel do Sul da Ilha', 'Maré real da EPAGRI/CIRAM e mapa do Sul da Ilha de Florianópolis. Maré alta não confirma alagamento.'), loader: ({ context }) => context.queryClient.ensureQueryData(publicTidesOptions), errorComponent: () => <AlertaShell><main id="conteudo" className="content-page"><h1>Não conseguimos abrir os dados</h1><a href="/">Tentar novamente</a></main></AlertaShell>, notFoundComponent: () => <p>Página não encontrada</p>, component: Index });

function fmt(ts: string | null) {
  return ts ? new Date(ts).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
}

function Index() {
  const [selected, setSelected] = useState(0);
  const { data } = useSuspenseQuery(publicTidesOptions);
  const station = data.stations.find(s => s.id === 'florianopolis');
  const measured = tideSummary(station?.readings ?? [], 'observed');
  const summary = measured.level ? measured : tideSummary(station?.readings ?? [], 'predicted', data.checkedAt);
  const isForecast = !measured.level && !!summary.level;
  const level = levelFromTide(summary.level);
  const phrase = tidePhrase(summary);
  const region = neighborhoods[selected] ?? neighborhoods[0];
  if (!region) return null;
  const levelLabel = level ? levels[level].label : 'Sem dado de maré';
  return <AlertaShell><main id="conteudo" className="dashboard appear">
    <div className="page-top"><div><div className="eyebrow"><MapPin size={12}/> FLORIANÓPOLIS · SANTA CATARINA</div><h1>Painel do Sul da Ilha</h1></div><div className="page-meta">MARÉ: EPAGRI/CIRAM · ESTAÇÃO FLORIANÓPOLIS<br/><span className="inline-flex items-center gap-1"><Clock size={10}/> {isForecast ? 'Previsão' : 'Medição'} de {fmt(summary.timestamp)}</span></div></div>
    <div className="monitor-grid">
      <aside className="region-list" aria-label="Selecionar bairro"><div className="eyebrow">BAIRROS · SITUAÇÃO DA MARÉ</div>{neighborhoods.map((item, i) => <Button key={item.name} variant="neighborhood" className="region-item" data-active={selected === i} data-level={level ?? undefined} onClick={() => setSelected(i)} aria-pressed={selected === i}><span className="status-dot"/><span className="region-text"><strong>{item.name}</strong><small>{levelLabel}</small></span>{selected === i && <ArrowRight size={12}/>}</Button>)}<div className="region-bottom"><strong>6 bairros</strong> do Sul da Ilha<br/><br/>Há só uma estação de maré em Florianópolis. Por isso, todos os bairros mostram a mesma situação.</div></aside>
      <div className="center-column">
        <section className="map-section"><div className="section-heading"><h2><Map size={15}/> Mapa dos bairros</h2></div>
          <div className="map-body"><div className="map-art"><ClientOnly fallback={<div className="real-map" />}><Suspense fallback={<div className="real-map" />}><RealMap names={names} selected={selected} onSelect={setSelected}/></Suspense></ClientOnly></div>
            <div className="alert-list"><article className="alert-item" data-level={level ?? undefined}><span className="status-label"><span className="status-dot"/>{levelLabel}</span><h3>{region.name} · {summary.level ? tideWords[summary.level] : 'Maré sem dado'}</h3><p>{phrase.plain} {phrase.meaning}</p><small className="alert-source">EPAGRI/CIRAM · ESTAÇÃO FLORIANÓPOLIS · {isForecast ? 'PREVISÃO' : 'MEDIÇÃO'} {fmt(summary.timestamp)}</small></article><article className="alert-item"><span className="status-label">Importante</span><h3>A maré sozinha não mostra alagamento</h3><p>Chuva, vento e o escoamento da água também contam. Este painel não diz se uma rua está alagada ou segura. Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros).</p></article></div>
          </div><div className="legend" aria-label="Legenda">{(['normal', 'attention'] as const).map(key => <span key={key} data-level={key}><i className="status-dot"/>{key === 'attention' ? 'Atenção: maré alta' : 'Normal: maré no meio ou baixa'}</span>)}</div></section>
        <TidePanel compact/>
        <CitizenReport neighborhood={region.name}/>
      </div>
      <aside className="right-column"><div className="eyebrow">MARÉ AGORA · FLORIANÓPOLIS</div><article className="now-item"><div className="now-title"><Waves size={17} className="text-primary"/> {phrase.title}</div><div className="now-height">{summary.value !== null ? Math.round(summary.value) : '—'} <small>cm</small></div><p>{isForecast ? 'Previsão' : 'Medição'} da EPAGRI/CIRAM<br/>{fmt(summary.timestamp)}</p><span className="status-label" data-level={level ?? undefined}><span className="status-dot"/>{levelLabel}</span></article>
        <article className="journey-item"><h2><Navigation size={15} className="text-primary"/> Meu trajeto</h2><div className="journey-line"><Circle size={10} className="text-primary"/>{region.name}</div><div className="journey-connector"/><div className="journey-line"><MapPin size={12} className="text-primary"/>Pântano do Sul</div><p>Abra o caminho no Google Maps. Ele não recebe os dados deste painel.</p><Button className="w-full" asChild><Link to="/trajeto">Consultar trajeto <ArrowRight/></Link></Button></article>
        <div className="source-mini"><div className="eyebrow mb-2">FONTES</div>Maré: EPAGRI/CIRAM<br/>Mapa: OpenStreetMap<br/><Link to="/fontes">Fontes e transparência <ArrowUpRight size={12}/></Link></div>
      </aside>
    </div>
  </main></AlertaShell>;
}
