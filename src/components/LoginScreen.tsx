import React, { useState } from "react";
import { Lock, Mail, LogIn, AlertTriangle, CloudOff, Loader2, ShieldCheck, UserCheck, KeyRound, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import MakerHoldingLogo from "./MakerHoldingLogo";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  configMissing: boolean;
  error?: string | null;
}

const PRESET_ACCOUNTS = [
  {
    name: "Wendy Colpas",
    email: "logisticawpc@gmail.com",
    pass: "WpcLog!2026",
    role: "Directora Administrativa (ADMIN)",
    tag: "Administradora Principal",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    name: "Rafael Olarte",
    email: "rafael.olarte@holdingmaker.com",
    pass: "Maker2026!",
    role: "Gerente General (ADMIN)",
    tag: "Gerencia",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    name: "Carlos Mario Ortiz",
    email: "carlos.auxiliar@holdingmaker.com",
    pass: "Auxiliar2026!",
    role: "Auxiliar Contable",
    tag: "Operativo",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

export default function LoginScreen({ onLogin, configMissing, error }: LoginScreenProps) {
  const [email, setEmail] = useState("logisticawpc@gmail.com");
  const [password, setPassword] = useState("WpcLog!2026");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showCloudInfo, setShowCloudInfo] = useState(false);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    if (!loginEmail || !loginPass) {
      setLocalError("Por favor ingrese su correo y contraseña.");
      return;
    }
    setLoading(true);
    setLocalError(null);
    try {
      await onLogin(loginEmail, loginPass);
    } catch (err: any) {
      const msg = err?.message || "";
      if (/failed to fetch|networkerror|load failed/i.test(msg)) {
        setLocalError(
          "El servidor de Supabase no respondió. Iniciando en modo local para no detener tu trabajo..."
        );
        // Intentar fallback inmediato
        try {
          await onLogin(loginEmail, loginPass);
        } catch (innerErr: any) {
          setLocalError(innerErr?.message || "No se pudo iniciar sesión.");
        }
      } else {
        setLocalError(msg || "No se pudo iniciar sesión. Verifique sus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickLogin = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    executeLogin(presetEmail, presetPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md min-[1920px]:max-w-lg min-[2560px]:max-w-xl flex flex-col gap-4">
        {/* Brand Header */}
        <div className="flex justify-center mb-2">
          <MakerHoldingLogo variant="horizontal" size="md" lightText={true} />
        </div>

        {/* Main Card */}
        <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5 border border-slate-100">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" /> Acceso Seguro al Holding
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                configMissing 
                  ? "bg-amber-50 text-amber-800 border-amber-200" 
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
                {configMissing ? "Modo Local Seguro" : "Nube Activa"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              CONTROL GENERAL HOLDING WPC · Matriz empresarial y contable
            </p>
          </div>

          {/* Quick 1-Click Access Pill Selector */}
          <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-indigo-600" /> Acceso Rápido por Rol
              </span>
              <span className="text-[9px] text-indigo-600 font-semibold">1 Clic para entrar</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.pass)}
                  disabled={loading}
                  className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition-all group disabled:opacity-60 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">{acc.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{acc.email}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>
                    {acc.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Correo Electrónico
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="logisticawpc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-300 bg-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Contraseña
              </label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-300 bg-transparent"
                />
              </div>
            </div>

            {(localError || error) && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="leading-snug">{localError || error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión en el Holding</span>
                </>
              )}
            </button>
          </form>

          {/* Cloud Info Accordion */}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowCloudInfo(!showCloudInfo)}
              className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-700 py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {configMissing
                  ? "Modo Autónomo: Almacenamiento seguro en navegador"
                  : "Sincronización multi-dispositivo activa"}
              </span>
              {showCloudInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCloudInfo && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex flex-col gap-2 animate-fadeIn">
                {configMissing ? (
                  <>
                    <p className="font-semibold text-slate-800">
                      ℹ Tus datos se guardan automáticamente en este navegador.
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Si deseas sincronizar la plataforma con múltiples computadores o móviles en tiempo real, puedes agregar las claves en los Secrets del proyecto:
                    </p>
                    <pre className="bg-white p-2 rounded border border-slate-200 text-[10px] font-mono text-slate-700">
                      SUPABASE_URL=https://tu-proyecto.supabase.co
                      {"\n"}SUPABASE_ANON_KEY=tu-anon-key
                    </pre>
                  </>
                ) : (
                  <p className="text-[10px] text-emerald-700">
                    ✓ La base de datos en la nube está conectada. Los cambios realizados se sincronizarán con los usuarios del holding en tiempo real.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-500">
          Matriz Holding Maker &copy; 2026 · WPC Autopartes · Fundación She Maker · Raez · Helenamar
        </div>
      </div>
    </div>
  );
}
