import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

const sizes = [1, 1.15, 1.3, 1.5];

export function AccessibilityBar() {
  const [size, setSize] = useState(0);
  const [contrast, setContrast] = useState(false);
  useEffect(() => {
    setSize(Math.min(sizes.length - 1, Math.max(0, Number(localStorage.getItem('am-font') ?? 0) || 0)));
    setContrast(localStorage.getItem('am-contrast') === '1');
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom', String(sizes[size]));
    document.documentElement.dataset['contrast'] = contrast ? 'high' : 'normal';
    localStorage.setItem('am-font', String(size));
    localStorage.setItem('am-contrast', contrast ? '1' : '0');
  }, [size, contrast]);
  return <div className="a11y-bar" role="region" aria-label="Barra de acessibilidade">
    <ul className="a11y-shortcuts">
      <li><a href="#conteudo" accessKey="1">Ir para o conteúdo <span>1</span></a></li>
      <li><a href="#menu" accessKey="2">Ir para o menu <span>2</span></a></li>
      <li><a href="#rodape" accessKey="3">Ir para o rodapé <span>3</span></a></li>
    </ul>
    <ul className="a11y-tools">
      <li><Link to="/acessibilidade" accessKey="4">Acessibilidade</Link></li>
      <li><button type="button" onClick={() => setSize(s => Math.min(sizes.length - 1, s + 1))} aria-label="Aumentar o tamanho das letras">A+</button></li>
      <li><button type="button" onClick={() => setSize(0)} aria-label="Voltar ao tamanho normal das letras">A</button></li>
      <li><button type="button" onClick={() => setSize(s => Math.max(0, s - 1))} aria-label="Diminuir o tamanho das letras">A−</button></li>
      <li><button type="button" onClick={() => setContrast(c => !c)} aria-pressed={contrast}>Alto contraste</button></li>
    </ul>
  </div>;
}
