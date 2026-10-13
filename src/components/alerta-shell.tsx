import { Link, useRouterState } from '@tanstack/react-router';
import { Waves, Map, Navigation, BookOpen, FlaskConical, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AccessibilityBar } from '@/components/accessibility-bar';
import logo from '@/assets/alerta-logo.asset.json';

const nav = [
  { to: '/', label: 'Painel', icon: Map },
  { to: '/mares', label: 'Marés', icon: Waves },
  { to: '/trajeto', label: 'Meu trajeto', icon: Navigation },
  { to: '/fontes', label: 'Fontes', icon: BookOpen },
] as const;

export function AlertaShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  return <div className="app-shell">
    <AccessibilityBar/>
    <header className="app-header">
      <Link to="/" className="brand" aria-label="Alerta Marés — início"><img className="brand-logo" src={logo.url} alt="Alerta Marés"/><span className="brand-place">Sul da Ilha<br/>Florianópolis</span></Link>
      <nav id="menu" tabIndex={-1} className="main-nav" aria-label="Navegação principal">{nav.map(({ to, label, icon: Icon }) => <Button key={to} variant="nav" data-active={pathname === to} asChild><Link to={to}><Icon/><span>{label}</span></Link></Button>)}</nav>
      <Link to="/fontes" className="demo-label"><FlaskConical size={14}/><span>Projeto acadêmico · confira a fonte</span></Link>
    </header>
    {children}
    <footer id="rodape" tabIndex={-1} className="app-footer"><span>ALERTA MARÉS <span className="footer-divider">/</span> Administração Pública · ESAG/UDESC</span><span>Mapa e riscos são exemplos. Não substitui a Defesa Civil.</span><a href="https://www.defesacivil.sc.gov.br/" target="_blank" rel="noreferrer">Defesa Civil <ArrowUpRight size={13}/></a></footer>
  </div>;
}