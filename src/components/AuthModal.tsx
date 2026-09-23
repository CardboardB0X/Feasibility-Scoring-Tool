import React, { useState } from 'react';
import { AVAILABLE_ROLES, AuthSession, UserRole } from '../types/auth';
import { registerUser, loginUser } from '../utils/auth';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: AuthSession) => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'LOGIN'
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Lead Developer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'SIGNUP') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }

        const res = await registerUser(name, email, password, role);
        if (!res.success || !res.user) {
          setError(res.error || 'Registration failed.');
          setIsSubmitting(false);
          return;
        }

        // Get session
        const session: AuthSession = {
          token: `token-${Date.now()}`,
          user: {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            avatarColor: res.user.avatarColor
          },
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        onAuthSuccess(session);
        onClose();
      } else {
        const res = await loginUser(email, password);
        if (!res.success || !res.session) {
          setError(res.error || 'Login failed.');
          setIsSubmitting(false);
          return;
        }

        onAuthSuccess(res.session);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-md rounded-[28px] bg-white shadow-2xl border border-black/[0.08] overflow-hidden apple-spring">
        {/* macOS Window Chrome Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-black/[0.06] bg-[#fbfbfd]/90 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:opacity-80 transition-opacity cursor-pointer"
            />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0071e3]" />
            <span>Account Security</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Apple Segmented Toggle */}
          <div className="flex rounded-2xl bg-black/[0.05] p-1 text-xs font-bold mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setError(null);
              }}
              className={clsx(
                "flex-1 py-2 rounded-xl transition-all cursor-pointer",
                mode === 'LOGIN'
                  ? "bg-white text-[#1d1d1f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('SIGNUP');
                setError(null);
              }}
              className={clsx(
                "flex-1 py-2 rounded-xl transition-all cursor-pointer",
                mode === 'SIGNUP'
                  ? "bg-white text-[#1d1d1f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Create Account
            </button>
          </div>

          <div className="mb-5 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d1d1f] tracking-tight">
              {mode === 'SIGNUP' ? 'Create Research Account' : 'Welcome Back'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {mode === 'SIGNUP'
                ? 'Join evaluation rooms and save your research scores.'
                : 'Sign in to access your saved evaluation rooms.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  Full Name / Display Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Maria Santos"
                    autoComplete="name"
                    className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] px-3.5 py-3 pl-10 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. researcher@university.edu"
                  autoComplete="email"
                  className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] px-3.5 py-3 pl-10 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  Research Role / Specialization
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all cursor-pointer"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={mode === 'SIGNUP' ? 'Min 6 characters' : 'Enter password'}
                  autoComplete={mode === 'SIGNUP' ? 'new-password' : 'current-password'}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] px-3.5 py-3 pl-10 pr-10 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] px-3.5 py-3 pl-10 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-[#0071e3] py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : mode === 'SIGNUP' ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Continue without signing in (Guest mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
