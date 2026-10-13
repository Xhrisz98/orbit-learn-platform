import React, { useState } from 'react';
import { authService } from '../../services/authService';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onSwitchToCandidate: () => void;
}

export const AdminAuthView: React.FC<Props> = ({ onSuccess, onSwitchToCandidate }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { user, error } = await authService.signIn(email, password);
        if (error) {
          setErrorMessage(error === 'Invalid login credentials' ? 'Credenciales incorrectas. Verifica tu correo y contraseña.' : error);
          return;
        }
        if (user) {
          onSuccess();
        }
      } else {
        const { user, error, requiresEmailConfirmation } = await authService.signUp(email, password, fullName);
        if (error) {
          setErrorMessage(error);
          return;
        }
        if (requiresEmailConfirmation) {
          setInfoMessage('Cuenta creada exitosamente. Se ha enviado un enlace de confirmación a tu correo para activar el acceso.');
          return;
        }
        if (user) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error inesperado al conectar con Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = () => {
    // Quick admin access for evaluation / review
    const mockUser = {
      id: 'admin-quick-access',
      email: 'recruiter@skillproof.com',
      name: 'Reclutador Enterprise',
      role: 'recruiter',
    };
    localStorage.setItem('skillproof_admin_session', JSON.stringify(mockUser));
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2368f5] to-[#2bc5d9] text-white shadow-md mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-[#10243e] tracking-tight">
          SkillProof Enterprise
        </h1>
        <p className="text-xs text-[#60738a] mt-1">
          Panel Exclusivo de Reclutamiento y Evaluación Técnica
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-white text-[#10243e] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-white text-[#10243e] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nombre y Apellido
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Mendoza"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Correo Electrónico Corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="reclutador@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5]"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2368f5] hover:bg-[#144cc0] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Conectando...' : mode === 'signin' ? 'Entrar al Panel de Reclutador' : 'Registrar Cuenta'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Bypass Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            ⚡ Acceso Rápido de Prueba (Demo Admin)
          </button>
        </div>

        {/* Link to Candidate Portal */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onSwitchToCandidate}
            className="text-xs text-[#2368f5] hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>¿Eres candidato o postulante? Ir a tu Evaluación</span>
          </button>
        </div>
      </div>
    </div>
  );
};
