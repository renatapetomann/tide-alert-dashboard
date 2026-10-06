import { Link, useRouterState } from '@tanstack/react-router';
import { Waves, Map, Navigation, BookOpen, FlaskConical, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const nav = [
  { to: '/', label: 'Painel', icon: Map },
  { to: '/mares', label: 'Marés', icon: Waves },
  { to: '/trajeto', label: 'Meu trajeto', icon: Navigation },
  { to: '/fontes', label: 'Fontes', icon: BookOpen },
] as const;

export function AlertaShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  return <div className="app-shell">
    <header className="app-header">
      <Link to="/" className="brand" aria-label="Alerta Marés — início"><span className="brand-icon"><Waves size={24}/></span><span><strong>ALERTA <span>MARÉS</span></strong><small>SUL DA ILHA · FLORIANÓPOLIS</small></span></Link>
      <nav className="main-nav" aria-label="Navegação principal">{nav.map(({ to, label, icon: Icon }) => <Button key={to} variant="nav" data-active={pathname === to} asChild><Link to={to}><Icon/><span>{label}</span></Link></Button>)}</nav>
      <Link to="/fontes" className="demo-label"><FlaskConical size={14}/><span>Demonstração acadêmica</span></Link>
    </header>
    {children}
    <footer className="app-footer"><span>ALERTA MARÉS <span className="footer-divider">/</span> Administração Pública · ESGA</span><span>Dados ilustrativos. Não substitui orientações da Defesa Civil.</span><a href="https://www.defesacivil.sc.gov.br/" target="_blank" rel="noreferrer">Defesa Civil <ArrowUpRight size={13}/></a></footer>
  </div>;
}