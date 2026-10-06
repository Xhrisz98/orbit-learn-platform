import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck } from 'lucide-react';


export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="mt-16 pt-8 border-t border-[#E8E4DF] text-xs text-[#52697C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D8B8B]">OrbitLearn</span>
            <span>• Plataforma integral de gestión y aprendizaje familiar</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('landing')}
              className="hover:text-[#1A2332] cursor-pointer"
            >
              Página Principal
            </button>
            <button
              onClick={() => setCurrentView('compliance')}
              className="hover:text-[#1A2332] cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D8B8B]" />
              <span>FERPA & COPPA</span>
            </button>
            <span>&copy; 2026 OrbitLearn. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
