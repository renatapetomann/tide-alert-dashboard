import { createFileRoute } from '@tanstack/react-router';
import { Waves } from 'lucide-react';
import { AlertaShell } from '@/components/alerta-shell';
import { pageHead } from '@/lib/scenarios';
import { TidePanel } from '@/components/tide-panel';
import { publicTidesOptions } from '@/lib/tides.query';
export const Route = createFileRoute('/mares')({
  head: () => pageHead('Marés por local', 'Consulte medições e previsão da EPAGRI/CIRAM para Florianópolis e Imbituba, com local e data. Maré alta não confirma alagamento.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicTidesOptions),
  errorComponent: () => <AlertaShell><main id="conteudo" className="content-page"><h1>Não conseguimos abrir as marés</h1><a href="/mares">Tentar novamente</a></main></AlertaShell>,
  notFoundComponent: () => <p>Página não encontrada</p>,
  component: TidesPage,
});
function TidesPage() {
  return <AlertaShell><main id="conteudo" className="content-page appear"><div className="eyebrow"><Waves size={13}/> CONSULTA DE MARÉS</div><h1>Marés por local</h1><p className="intro">Medições e previsão publicadas pela EPAGRI/CIRAM. Escolha a estação para consultar os dados daquele local. Não há medições separadas para cada bairro do Sul da Ilha.</p><TidePanel/><details className="disclosure"><summary>Como entender o que está escrito?</summary><p>Maré enchendo: a água está subindo. Maré cheia: a água está no ponto mais alto. Maré vazando: a água está descendo. Maré seca: a água está no ponto mais baixo. Uma rua pode alagar também por chuva, vento ou dificuldade de escoar a água. Maré alta não confirma alagamento. Estes dados não garantem que um caminho esteja seguro.</p></details></main></AlertaShell>;
}
