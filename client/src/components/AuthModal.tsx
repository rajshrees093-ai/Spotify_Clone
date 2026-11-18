import React, { useState } from 'react';
import { X, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService, isSupabaseConfigured } from '../services/supabase';
import { useLibraryStore } from '../stores/useLibraryStore';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setUser, isDbConnected } = useLibraryStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await authService.signUp(email, password, username);
        if (result.user) {
          setUser({
            id: result.user.id,
            email: result.user.email || email,
            username: username || email.split('@')[0],
            fullName: username || email.split('@')[0],
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          });
          setSuccessMsg('Account created successfully!');
          setTimeout(() => onClose(), 600);
        }
      } else {
        const result = await authService.signIn(email, password);
        if (result.user) {
          setUser({
            id: result.user.id,
            email: result.user.email || email,
            username: result.user.user_metadata?.username || email.split('@')[0],
            fullName: result.user.user_metadata?.full_name || email.split('@')[0],
            avatarUrl:
              result.user.user_metadata?.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          });
          setSuccessMsg('Logged in successfully!');
          setTimeout(() => onClose(), 600);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({
      id: 'usr-demo-1',
      email: 'alex@syren.audio',
      username: 'Alex Parker',
      fullName: 'Alex Parker',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });
    setSuccessMsg('Logged in with Demo Account!');
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-spotify-dark w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-8 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-spotify-subtext hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-3">
            <BrandLogo size="lg" showText={false} />
          </div>
          <h2
            className="text-2xl font-black text-white tracking-wider"
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" }}
          >
            {isSignUp ? 'JOIN SYRĒN' : 'ENTER SYRĒN'}
          </h2>
          <p className="text-xs text-spotify-subtext mt-1">
            {isSupabaseConfigured
              ? 'Connected to Supabase PostgreSQL & Auth'
              : isDbConnected
              ? 'Connected to Sample SQLite Database'
              : 'Demo mode active • Full local profile simulation'}
          </p>
        </div>

        {/* 1-Click Demo Login Button */}
        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full mb-5 py-2.5 px-4 rounded-full border border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles size={16} className="group-hover:animate-spin" />
          <span>Instant 1-Click Demo Login</span>
        </button>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-spotify-dark px-3 text-xs text-spotify-subtext uppercase">or</span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1.5">
            <CheckCircle2 size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">What should we call you?</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a profile name"
                className="w-full bg-[#242424] focus:bg-[#2e2e2e] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-white transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-[#242424] focus:bg-[#2e2e2e] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                minLength={6}
                className="w-full bg-[#242424] focus:bg-[#2e2e2e] text-white text-sm rounded-lg px-3.5 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-subtext hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-spotify-green hover:bg-spotify-green-light text-black font-extrabold text-sm py-3 rounded-full hover:scale-105 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Sign up' : 'Log In'}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="mt-6 text-center text-xs text-spotify-subtext border-t border-white/5 pt-4">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg('');
                }}
                className="text-white underline font-semibold hover:text-spotify-green"
              >
                Log in here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg('');
                }}
                className="text-white underline font-semibold hover:text-spotify-green"
              >
                Sign up for SYRĒN
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
