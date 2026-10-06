import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { MapPin, ArrowUpRight, Waves, Navigation, ArrowRight, Info, Wind, Map, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertaShell } from '@/components/alerta-shell';
import { neighborhoods, levels, pageHead } from '@/lib/scenarios';
import coastalChart from '@/assets/coastal-chart.jpg';

export const Route = createFileRoute('/')({ head: () => pageHead('Painel do Sul da Ilha', 'Consulte cenários de marés e alertas por bairro no Sul da Ilha de Florianópolis. Demonstração acadêmica.'), component: Index });

function Index() {
  const [selected, setSelected] = useState(0);
  const region = neighborhoods[selected] ?? neighborhoods[0];
  if (!region) return null;
  return <AlertaShell><main className="dashboard appear">
    <div className="page-top"><div><div className="eyebrow"><MapPin size={12}/> FLORIANÓPOLIS · SANTA CATARINA</div><h1>Painel do Sul da Ilha</h1></div><div className="page-meta">CENÁRIO DEMONSTRATIVO<br/><span className="inline-flex items-center gap-1"><Clock size={10}/> Referência simulada · 18:42</span></div></div>
    <div className="monitor-grid">
      <aside className="region-list" aria-label="Selecionar bairro"><div className="eyebrow">BAIRROS · NÍVEL NO CENÁRIO</div>{neighborhoods.map((item, i) => <Button key={item.name} variant="neighborhood" className="region-item" data-active={selected === i} data-level={item.level} onClick={() => setSelected(i)} aria-pressed={selected === i}><span className="status-dot"/><span className="region-text"><strong>{item.name}</strong><small>{levels[item.level].label}</small></span>{selected === i && <ArrowRight size={12}/>}</Button>)}<div className="region-bottom"><strong>6 bairros</strong> no recorte inicial<br/>Sul da Ilha de Florianópolis<br/><br/>Níveis e ocorrências<br/>apenas para demonstração.</div></aside>
      <div className="center-column">
        <section className="map-section"><div className="section-heading"><h2><Map size={15}/> Mapa territorial</h2><span className="eyebrow">{region.name}</span></div>
          <div className="map-body"><div className="map-art"><img src={coastalChart} alt="Ilustração cartográfica esquemática de uma costa, sem precisão geográfica" width={1024} height={640}/><span className="map-north">↑ N</span><span className="map-marker"><MapPin size={20}/></span><span className="map-caption">ILUSTRAÇÃO · NÃO É MAPA DE NAVEGAÇÃO</span></div>
            <div className="alert-list"><article className="alert-item" data-level={region.level}><span className="status-label"><span className="status-dot"/>{levels[region.level].label}</span><h3>{region.stretch}</h3><p>{region.note}</p><small className="alert-source">CENÁRIO ACADÊMICO · NÃO OFICIAL</small></article><article className="alert-item" data-level="attention"><span className="status-label"><span className="status-dot"/>Atenção</span><h3>{region.secondary}</h3><p>Consulte as condições locais antes de sair. A maré, isoladamente, não confirma alagamento.</p><small className="alert-source">ORIENTAÇÃO PREVENTIVA · CENÁRIO</small></article></div>
          </div><div className="legend" aria-label="Legenda dos níveis">{Object.entries(levels).map(([key, value]) => <span key={key} data-level={key}><i className="status-dot"/>{value.label}</span>)}</div></section>
        <section className="tide-section"><div className="tide-header"><h2>Próximas marés</h2><Button variant="link" size="sm" asChild><Link to="/mares">Ver tábua <ArrowUpRight/></Link></Button></div><div className="tide-bars" aria-label="Curva ilustrativa de variação da maré">{Array.from({ length: 8 }, (_, i) => <span key={i}/>)}</div><div className="tide-times"><span><strong>06:12 · 1,9 m</strong>PREAMAR</span><span><strong>12:28 · 0,4 m</strong>BAIXA-MAR</span><span><strong>18:42 · 1,6 m</strong>PREAMAR</span></div><p className="note"><Info size={12}/>Valores ilustrativos. Altura da maré não é confirmação de alagamento.</p></section>
      </div>
      <aside className="right-column"><div className="eyebrow">CONDIÇÕES · CENÁRIO</div><article className="now-item"><div className="now-title"><Waves size={17} className="text-primary"/> Maré alta</div><div className="now-height">1,6 <small>m</small></div><p><span className="inline-flex items-center gap-1"><Wind size={11}/> Vento sul · 12 nós</span><br/>Referência simulada · 18:42</p><span className="status-label" data-level={region.level}><span className="status-dot"/>{levels[region.level].label}</span></article>
        <article className="journey-item"><h2><Navigation size={15} className="text-primary"/> Meu trajeto</h2><div className="journey-line"><Circle size={10} className="text-primary"/>{region.name}</div><div className="journey-connector"/><div className="journey-line"><MapPin size={12} className="text-primary"/>Pântano do Sul</div><p>Consulte os bairros do percurso e os trechos sinalizados no cenário.</p><Button className="w-full" asChild><Link to="/trajeto">Consultar trajeto <ArrowRight/></Link></Button></article>
        <div className="source-mini"><div className="eyebrow mb-2">FONTES PREVISTAS</div>GeoPortal · EPAGRI/CIRAM<br/>Marinha · Radar SC · Defesa Civil<br/><Link to="/fontes">Fontes e transparência <ArrowUpRight size={12}/></Link></div>
      </aside>
    </div>
  </main></AlertaShell>;
}
