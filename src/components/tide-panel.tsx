import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { RefreshCw, ArrowUpRight, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { publicTidesOptions } from '@/lib/tides.query';
import { tideStations, tideSourceUrl, type TideStationId } from '@/lib/tide-data';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
const height = (value: number | null) => value === null ? 'Sem dado' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm`;

export function TidePanel({ compact = false }: { compact?: boolean }) {
  const { data, refetch, isFetching } = useSuspenseQuery(publicTidesOptions);
  const [stationId, setStationId] = useState<TideStationId>('florianopolis');
  const [view, setView] = useState<'observed' | 'predicted'>('observed');
  const station = tideStations.find(s => s.id === stationId) ?? tideStations[0];
  const result = data.stations.find(s => s.id === stationId);
  const readings = result?.readings ?? [];
  const latest = readings.filter(r => r.observed !== null).at(-1);
  const stale = latest ? Date.parse(data.checkedAt) - Date.parse(latest.timestamp) > 2 * 60 * 60 * 1000 : true;
  const rows = view === 'observed'
    ? readings.filter(r => r.observed !== null).slice(-16).reverse()
    : readings.filter(r => r.predicted !== null && r.timestamp >= data.checkedAt && r.timestamp.endsWith(':00:00.000Z')).slice(0, 24);
  return <section className={compact ? 'tide-section' : 'space-y-5'} aria-label="Marés com dados da EPAGRI/CIRAM">
    <div className="tide-header"><h2><Waves size={16} className="inline text-primary"/> Marés · {station.name}</h2><Button variant="outline" size="icon" onClick={() => void refetch()} disabled={isFetching} aria-label="Atualizar dados das marés" title="Atualizar dados das marés"><RefreshCw size={16}/></Button></div>
    {!compact && <label className="field">Local da estação<select value={stationId} onChange={event => { const found = tideStations.find(s => s.id === event.target.value); if (found) setStationId(found.id); }}><option value="florianopolis">Florianópolis · estação 2951</option><option value="imbituba">Imbituba · estação 2963 (outra cidade)</option></select></label>}
    <p className="text-sm text-muted-foreground leading-7">{station.note}</p>
    {result?.error ? <p role="status" className="text-sm">{result.error}</p> : <>
      <div className="border-y border-border py-4"><p className="text-sm">Última medição publicada · {station.name}</p><strong className="text-3xl font-semibold">{height(latest?.observed ?? null)}</strong><p className="text-sm text-muted-foreground mt-2">{latest ? dateFormat.format(new Date(latest.timestamp)) : 'Sem medição disponível'} · horário de Brasília</p>{stale && <p role="status" className="text-sm mt-2">A medição está atrasada ou indisponível. Não representa a situação de agora.</p>}</div>
      {!compact && <><div className="flex flex-wrap gap-2" aria-label="Tipo de dados"><Button variant={view === 'observed' ? 'default' : 'outline'} aria-pressed={view === 'observed'} onClick={() => setView('observed')}>Medições</Button><Button variant={view === 'predicted' ? 'default' : 'outline'} aria-pressed={view === 'predicted'} onClick={() => setView('predicted')}>Previsão da EPAGRI</Button></div><p className="text-sm text-muted-foreground">{view === 'observed' ? 'Últimas medições publicadas, da mais recente para a mais antiga.' : 'Valores previstos pela EPAGRI/CIRAM para as próximas horas. Não são medições nem horários de maré alta.'}</p><table className="tide-table"><caption className="text-left text-sm pb-3">{station.name} · estação {station.code} · horário de Brasília</caption><thead><tr><th scope="col">DATA E HORA</th><th scope="col">{view === 'observed' ? 'NÍVEL MEDIDO' : 'NÍVEL PREVISTO'}</th></tr></thead><tbody>{rows.map(row => <tr key={row.timestamp}><td>{row.label}</td><td>{height(view === 'observed' ? row.observed : row.predicted)}</td></tr>)}</tbody></table>{!rows.length && <p role="status">Sem valores disponíveis neste período.</p>}</>}
    </>}
    <p className="text-sm text-muted-foreground leading-7 mt-3">Fonte: <a className="text-primary underline" href={tideSourceUrl} target="_blank" rel="noreferrer">EPAGRI/CIRAM</a> · consulta em {dateFormat.format(new Date(data.checkedAt))}. Os níveis usam a referência da própria estação; não indicam profundidade de água na rua. Maré alta não confirma alagamento.</p>
    {compact && <Button variant="link" asChild><Link to="/mares">Ver locais, medições e previsão <ArrowUpRight/></Link></Button>}
  </section>;
}