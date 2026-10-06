export type Level = 'normal' | 'attention' | 'moderate' | 'critical';
export const levels: Record<Level, { label: string; meaning: string }> = {
  normal: { label: 'Normal', meaning: 'Sem sinalização neste cenário. Não representa garantia de segurança.' },
  attention: { label: 'Atenção', meaning: 'Condições que justificam acompanhamento antes do deslocamento.' },
  moderate: { label: 'Risco moderado', meaning: 'Cruzamento de condições ambientais e vulnerabilidade histórica. Consulte o trecho antes de sair.' },
  critical: { label: 'Risco avançado', meaning: 'No cenário, uma ocorrência ou interdição exige evitar o trecho. Em uso real, é necessária confirmação.' },
};
export const neighborhoods: { name: string; level: Level; stretch: string; count: number; note: string; secondary: string }[] = [
  { name: 'Campeche', level: 'moderate', stretch: 'Costa do Campeche', count: 3, note: 'Maré elevada e vento sul no cenário. Acompanhe os trechos historicamente vulneráveis.', secondary: 'Acesso à praia' },
  { name: 'Pântano do Sul', level: 'critical', stretch: 'Acesso ao Pântano do Sul', count: 5, note: 'Interdição simulada em um trecho baixo. Evite a área sinalizada e consulte orientações oficiais.', secondary: 'Entorno da orla' },
  { name: 'Armação', level: 'attention', stretch: 'Orla da Armação', count: 2, note: 'Condições de maré elevada no cenário. Acompanhe a situação antes de se deslocar.', secondary: 'Acesso ao Matadeiro' },
  { name: 'Rio Tavares', level: 'normal', stretch: 'SC-405 · Rio Tavares', count: 0, note: 'Sem sinalização no cenário atual. Trechos com histórico de alagamento continuam exigindo acompanhamento.', secondary: 'Acesso ao Campeche' },
  { name: 'Ribeirão da Ilha', level: 'normal', stretch: 'Orla do Ribeirão', count: 1, note: 'Sem sinalização neste cenário. Consulte as condições locais antes de iniciar o trajeto.', secondary: 'Rodovia Baldicero Filomeno' },
  { name: 'Costa de Dentro', level: 'attention', stretch: 'Acesso à Costa de Dentro', count: 2, note: 'Acompanhe os acessos em áreas baixas durante a janela de preamar do cenário.', secondary: 'Trecho próximo à orla' },
];
export const tides = [
  { time: '00:05', height: '0,5', type: 'Baixa-mar' },
  { time: '06:12', height: '1,9', type: 'Preamar' },
  { time: '12:28', height: '0,4', type: 'Baixa-mar' },
  { time: '18:42', height: '1,6', type: 'Preamar' },
];
export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} — Alerta Marés` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — Alerta Marés` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}