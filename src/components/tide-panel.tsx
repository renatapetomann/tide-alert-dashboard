import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { RefreshCw, ArrowUpRight, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { publicTidesOptions } from '@/lib/tides.query';
import { tideStations, tideSourceUrl, tideSummary, tideLevel, type TideStationId, type TideLevel, type TideTrend } from '@/lib/tide-data';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
const height = (value: number | null) => value === null ? 'Sem dado' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} cm`;
const levelText: Record<TideLevel, string> = { alta: 'Maré alta', moderada: 'Maré moderada', baixa: 'Maré baixa' };
const trendText: Record<TideTrend, string> = { subindo: 'A água está subindo.', descendo: 'A água está descendo.', estavel: 'A água está quase parada.' };

export function TidePanel({ compact = false }: { compact?: boolean }) {
  const { data, refetch, isFetching } = useSuspenseQuery(publicTidesOptions);
  const [stationId, setStationId] = useState<TideStationId>('florianopolis');
  const [view, setView] = useState<'observed' | 'predicted'>('observed');
  const station = tideStations.find(s => s.id === stationId) ?? tideStations[0];
  const result = data.stations.find(s => s.id === stationId);
  const readings = result?.readings ?? [];
  const measured = tideSummary(readings, 'observed');
  const forecast = tideSummary(readings, 'predicted', data.checkedAt);
  const status = measured.value !== null ? measured : forecast;
  const fromEstimate = measured.value === null;
  const tableRange = view === 'observed' ? measured.range : forecast.range;
  const stale = status.timestamp ? Date.parse(data.checkedAt) - Date.parse(status.timestamp) > 2 * 60 * 60 * 1000 : true;
  const rows = view === 'observed'
    ? readings.filter(r => r.observed !== null).slice(-16).reverse()
    : readings.filter(r => r.predicted !== null && r.timestamp >= data.checkedAt && r.timestamp.endsWith(':00:00.000Z')).slice(0, 24);
  const ratio = status.range && status.value !== null
    ? Math.min(100, Math.max(0, ((status.value - status.range.min) / (status.range.max - status.range.min)) * 100))
    : null;
  return <section className={compact ? 'tide-section' : 'space-y-5'} aria-label="Marés com dados da EPAGRI/CIRAM">
    <div className="tide-header"><h2><Waves size={16} className="inline text-primary"/> Marés · {station.name}</h2><Button variant="outline" size="icon" onClick={() => void refetch()} disabled={isFetching} aria-label="Atualizar dados das marés" title="Atualizar dados das marés"><RefreshCw size={16}/></Button></div>
    {!compact && <label className="field">Local da estação<select value={stationId} onChange={event => { const found = tideStations.find(s => s.id === event.target.value); if (found) setStationId(found.id); }}><option value="florianopolis">Florianópolis · estação 2951</option><option value="imbituba">Imbituba · estação 2963 (outra cidade)</option></select></label>}
    <p className="text-sm text-muted-foreground leading-7">{station.note}</p>
    {result?.error ? <p role="status" className="text-sm">{result.error}</p> : <>
      <div className="tide-now" data-level={status.level ?? 'unknown'}>
        <p className="status-label">{fromEstimate ? 'Estimativa agora' : 'Agora'} · {station.name}</p>
        <strong className="tide-now-title">{status.level ? levelText[status.level] : 'Não é possível dizer agora'}</strong>
        <p className="tide-now-message">{status.message}</p>
        <p className="tide-now-meta">{height(status.value)}{status.label ? ` · ${status.label}, horário de Brasília` : ''}</p>
        {status.trend && <p className="tide-now-meta">{trendText[status.trend]}</p>}
        {ratio !== null && <div className="tide-scale" aria-hidden="true"><span className="tide-scale-track"><i style={{ left: `${ratio.toFixed(1)}%` }}/></span><span className="tide-scale-labels"><span>Mais baixo</span><span>Mais alto</span></span></div>}
        {stale && <p role="status" className="tide-now-meta">A medição está atrasada ou indisponível. Não representa a situação de agora.</p>}
      </div>
      {!compact && <><div className="flex flex-wrap gap-2" aria-label="Tipo de dados"><Button variant={view === 'observed' ? 'default' : 'outline'} aria-pressed={view === 'observed'} onClick={() => setView('observed')}>Medições</Button><Button variant={view === 'predicted' ? 'default' : 'outline'} aria-pressed={view === 'predicted'} onClick={() => setView('predicted')}>Previsão da EPAGRI</Button></div><p className="text-sm text-muted-foreground">{view === 'observed' ? 'Últimas medições publicadas, da mais recente para a mais antiga.' : 'Valores previstos pela EPAGRI/CIRAM para as próximas horas. A situação foi calculada a partir desses valores e não é medição.'}</p><table className="tide-table"><caption className="text-left text-sm pb-3">{station.name} · estação {station.code} · horário de Brasília</caption><thead><tr><th scope="col">DATA E HORA</th><th scope="col">{view === 'observed' ? 'NÍVEL MEDIDO' : 'NÍVEL PREVISTO'}</th><th scope="col">SITUAÇÃO</th></tr></thead><tbody>{rows.map(row => { const value = view === 'observed' ? row.observed : row.predicted; const level = tideLevel(value, tableRange); return <tr key={row.timestamp}><td>{row.label}</td><td>{height(value)}</td><td>{level ? levelText[level] : 'Sem referência'}</td></tr>; })}</tbody></table>{!rows.length && <p role="status">Sem valores disponíveis neste período.</p>}</>}
    </>}
    <p className="text-sm text-muted-foreground leading-7 mt-3">Fonte: <a className="text-primary underline" href={tideSourceUrl} target="_blank" rel="noreferrer">EPAGRI/CIRAM</a> · consulta em {dateFormat.format(new Date(data.checkedAt))}. Alta, moderada e baixa comparam a altura de agora com a variação desta estação nas últimas horas. Os níveis não indicam profundidade de água na rua. Maré alta não confirma alagamento.</p>
    {compact && <Button variant="link" asChild><Link to="/mares">Ver locais, medições e previsão <ArrowUpRight/></Link></Button>}
  </section>;
}
