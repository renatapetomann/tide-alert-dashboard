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
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    // VLibras: official federal widget that translates page text into Libras (sign language), as eMAG recommends.
    if (document.getElementById('vlibras-script')) return;
    const script = document.createElement('script');
    script.id = 'vlibras-script';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => { const w = window as unknown as { VLibras?: { Widget: new (url: string) => unknown } }; if (w.VLibras) new w.VLibras.Widget('https://vlibras.gov.br/app'); };
    document.body.appendChild(script);
  }, []);
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const text = document.getElementById('conteudo')?.innerText ?? '';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };
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
      <li><button type="button" onClick={toggleSpeech} aria-pressed={speaking}>{speaking ? 'Parar leitura' : 'Ouvir a página'}</button></li>
      <li><button type="button" onClick={() => setContrast(c => !c)} aria-pressed={contrast}>Alto contraste</button></li>
    </ul>
    <div {...{ vw: '' }} className="enabled"><div {...{ 'vw-access-button': '' }} className="active"/><div {...{ 'vw-plugin-wrapper': '' }}><div className="vw-plugin-top-wrapper"/></div></div>
  </div>;
}
