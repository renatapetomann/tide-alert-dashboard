import { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { neighborhoods } from '@/lib/scenarios';

export function CitizenReport({ neighborhood }: { neighborhood: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  return <section className="citizen-section" aria-labelledby="citizen-title">
    <div className="section-heading"><h2 id="citizen-title"><MessageSquare size={18}/> Participação dos cidadãos</h2><Button variant="outline" onClick={() => { setOpen(!open); setReference(''); }} aria-expanded={open}>{open ? 'Fechar' : 'Informar um problema'}</Button></div>
    <p className="note">Os relatos não são alertas oficiais. Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros).</p>
    {open && (reference ? <div role="status" className="report-success"><CheckCircle/><div><h3>Relato recebido</h3><p>Guardamos sua informação. Ela aguarda análise e ainda não aparece no mapa.</p><p>Comprovante: {reference}</p><Button variant="outline" onClick={() => setReference('')}>Enviar outro relato</Button></div></div> : <form className="report-form" onSubmit={async event => {
      event.preventDefault();
      const fields = new FormData(event.currentTarget);
      setBusy(true); setError('');
      try {
        const id = crypto.randomUUID();
        const { error: failure } = await supabase.from('citizen_reports').insert({ id, neighborhood: String(fields.get('neighborhood')), kind: String(fields.get('kind')) });
        if (failure) throw failure;
        setReference(id);
      } catch { setError('Não conseguimos enviar. Aguarde um minuto e tente novamente.'); }
      finally { setBusy(false); }
    }}><div className="form-grid"><label className="field">Em qual bairro?<select name="neighborhood" defaultValue={neighborhood}>{neighborhoods.map(item => <option key={item.name}>{item.name}</option>)}</select></label><label className="field">O que você viu?<select name="kind"><option>Água na rua</option><option>Via bloqueada</option><option>Bueiro obstruído</option></select></label></div><p>Não pedimos seu nome, telefone ou localização exata. O relato informa apenas o bairro e o tipo de problema.</p><label className="consent"><input type="checkbox" required/> Vi esse problema e entendo que meu relato precisa ser analisado.</label>{error && <p role="alert" className="text-destructive">{error}</p>}<Button type="submit" disabled={busy}><Send/>{busy ? 'Enviando…' : 'Enviar relato'}</Button></form>)}
  </section>;
}