import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { User, Mail, Lock, Users } from 'lucide-react';
import { auth as authApi } from '../../lib/api';

interface LoginRegisterProps {
  onLogin: (user: { id: number; email: string; name: string; role: string; username: string; avatarUrl: string | null; assignedMuseum: string | null }) => void;
}

export default function LoginRegister({ onLogin }: LoginRegisterProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState('curator');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigateAfterLogin = (role: string) => {
    if (role === 'curator') {
      navigate('/curator');
    } else {
      navigate('/staff');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Login Failed', { description: 'Please fill in all fields' });
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.login(email, password);
      localStorage.setItem('arko_token', result.token);
      toast.success('Login Successful!', { description: `Welcome back, ${result.user.name}` });
      onLogin(result.user);
      navigateAfterLogin(result.user.role);
    } catch (err: any) {
      toast.error('Login Failed', { description: err.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] md:bg-[#f9fafb] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="md:hidden flex flex-col items-center justify-center min-h-[calc(100vh-32px)]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-bold text-[#1f2937] tracking-tight">ARKO</h1>
              <p className="text-[#4A5565] text-xs mt-1">Artifact and Document Preservation</p>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-[0.8px] border-[#E5E7EB] p-6">
              <h2 className="text-lg font-semibold text-[#101828] mb-6">Sign In</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#364153] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com"
                      className="w-full pl-[34px] pr-3 h-[40px] text-sm border-[0.8px] border-[#D1D5DC] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#364153] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                      className="w-full pl-[34px] pr-3 h-[40px] text-sm border-[0.8px] border-[#D1D5DC] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#364153] mb-1">Account Type</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <select value={loginRole} onChange={(e) => { setLoginRole(e.target.value); }}
                      className="w-full pl-[34px] pr-3 h-[40px] text-sm border-[0.8px] border-[#D1D5DC] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors appearance-none bg-white">
                      <option value="curator">Curator</option>
                      <option value="staff">Museum Staff</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" disabled={loading}
                  className="w-full h-[40px] bg-[#1f2937] hover:bg-[#111827] text-white text-sm font-medium rounded-[10px] transition-colors disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </div>
            <p className="text-center text-[#6B7280] text-[11px] mt-6">&copy; 2026 ARKO System</p>
          </div>
        </div>

        <div className="hidden md:flex rounded-[14px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
          <div className="w-[45%] bg-[#1f2937] p-10 flex flex-col justify-between min-h-[580px]">
            <div>
              <div className="mb-6">
                <h1 className="text-[28px] font-bold text-white tracking-tight">ARKO</h1>
                <p className="text-[#9ca3af] text-sm mt-0.5">Artifact and Document Preservation</p>
              </div>
              <div className="w-8 h-[2px] bg-[#2563EB] mb-6" />
              <p className="text-[#d1d5dc] text-sm leading-relaxed">
                Secure portal for curators and museum staff to manage collections, exhibitions, and administrative tasks.
              </p>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.15)' }}>
                  <Users className="w-[18px] h-[18px]" style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#f3f4f6]">Collection Management</h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Catalog and organize museum artifacts and exhibits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <Mail className="w-[18px] h-[18px]" style={{ color: '#a78bfa' }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#f3f4f6]">Exhibition Planning</h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Coordinate upcoming displays and special events</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <User className="w-[18px] h-[18px]" style={{ color: '#34d399' }} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#f3f4f6]">Administrative Tools</h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Manage schedules, visitor data, and operations</p>
                </div>
              </div>
            </div>
            <p className="text-[#6B7280] text-xs">&copy; 2026 ARKO System</p>
          </div>

          <div className="flex-1 bg-white p-10">
            <h2 className="text-xl font-semibold text-[#101828] mb-8">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-[#364153] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6B7280]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com"
                    className="w-full pl-[38px] pr-4 h-[42px] text-sm border-[0.8px] border-[#D1D5DC] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors" required />
                </div>

              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#364153] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6B7280]" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                    className="w-full pl-[38px] pr-4 h-[42px] text-sm border-[0.8px] border-[#D1D5DC] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors" required />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#364153] mb-1.5">Account Type</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6B7280]" />
                  <select value={loginRole} onChange={(e) => { setLoginRole(e.target.value); setLoginMuseum(''); }}
                    className="w-full pl-[38px] pr-4 h-[42px] text-sm border-[0.8px] border-[#D1D5DC] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors appearance-none bg-white">
                    <option value="curator">Curator</option>
                    <option value="staff">Museum Staff</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#2563EB] border-[#D1D5DC] rounded focus:ring-[#2563EB]" />
                  <span className="text-[13px] text-[#4A5565]">Remember me</span>
                </label>
                <button type="button" className="text-[13px] text-[#2563EB] hover:underline font-medium">Forgot password?</button>
              </div>
              <Button type="submit" disabled={loading}
                className="w-full h-[42px] bg-[#1f2937] hover:bg-[#111827] text-white text-sm font-medium rounded-[10px] transition-colors disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
