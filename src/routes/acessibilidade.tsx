import { createFileRoute } from '@tanstack/react-router';
import { Accessibility } from 'lucide-react';
import { AlertaShell } from '@/components/alerta-shell';
import { pageHead } from '@/lib/scenarios';

export const Route = createFileRoute('/acessibilidade')({
  head: () => pageHead('Acessibilidade', 'Como usar o Alerta Marés com teclado, letras maiores e alto contraste, seguindo o modelo eMAG do Governo Federal.'),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return <AlertaShell><main id="conteudo" tabIndex={-1} className="content-page appear">
    <div className="eyebrow"><Accessibility size={13}/> ACESSIBILIDADE</div>
    <h1>Acessibilidade</h1>
    <p className="intro">O Alerta Marés segue as orientações do eMAG, o modelo de acessibilidade do Governo Federal, para que todas as pessoas consigam usar a plataforma.</p>
    <h2 className="mt-8">Atalhos do teclado</h2>
    <ul className="a11y-list">
      <li><strong>Alt + 1</strong>: ir para o conteúdo da página</li>
      <li><strong>Alt + 2</strong>: ir para o menu</li>
      <li><strong>Alt + 3</strong>: ir para o rodapé</li>
      <li><strong>Alt + 4</strong>: abrir esta página</li>
    </ul>
    <p className="text-sm text-muted-foreground">No Firefox, use Alt + Shift + número. No Mac, use Control + Option + número.</p>
    <h2 className="mt-8">Para pessoas cegas ou com baixa visão</h2>
    <ul className="a11y-list">
      <li>O botão <strong>Ouvir a página</strong> lê em voz alta o conteúdo da página. Clique de novo para parar.</li>
      <li>A plataforma funciona com leitores de tela, como NVDA, JAWS, VoiceOver e TalkBack.</li>
      <li>Todas as imagens têm descrição em texto, e a situação da maré é anunciada quando muda.</li>
      <li>É possível usar tudo só com o teclado.</li>
    </ul>
    <h2 className="mt-8">Para pessoas surdas ou com deficiência auditiva</h2>
    <ul className="a11y-list">
      <li>O ícone azul de mãos, no canto da tela, abre o <strong>VLibras</strong>, ferramenta do Governo Federal que traduz o texto para Libras.</li>
      <li>Clique no ícone e depois em qualquer texto para ver a tradução.</li>
      <li>Nenhum aviso depende de som: todas as informações aparecem escritas.</li>
    </ul>
    <h2 className="mt-8">Letras e cores</h2>
    <ul className="a11y-list">
      <li><strong>A+</strong> deixa as letras maiores, <strong>A−</strong> deixa menores e <strong>A</strong> volta ao normal.</li>
      <li><strong>Alto contraste</strong> mostra a página com fundo preto e letras claras.</li>
      <li>Sua escolha fica guardada neste aparelho.</li>
    </ul>
    <h2 className="mt-8">Outros cuidados</h2>
    <ul className="a11y-list">
      <li>Todos os botões funcionam com a tecla Tab e Enter.</li>
      <li>As cores de alerta sempre vêm acompanhadas de texto.</li>
      <li>Usamos palavras simples, sem termos técnicos.</li>
    </ul>
  </main></AlertaShell>;
}
