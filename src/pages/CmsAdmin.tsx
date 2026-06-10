/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import CmsOverview from '../components/CmsOverview';
import CmsNewsSection from '../components/CmsNewsSection';
import CmsFacultySection from '../components/CmsFacultySection';
import CmsAcademicSection from '../components/CmsAcademicSection';
import CmsSettingsSection from '../components/CmsSettingsSection';
import CmsWebsiteBuilderSection from '../components/CmsWebsiteBuilderSection';
import CmsMediaLibrarySection from '../components/CmsMediaLibrarySection';
import CmsPushNotificationsSection from '../components/CmsPushNotificationsSection';
import MockDb from '../database/mockDb';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, Lock, Mail, ShieldAlert, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, 
  Home, Server, Users, RefreshCw, Cpu, CheckCircle, AlertTriangle, Info, X
} from 'lucide-react';
import { CmsNotification, generateRandomMockPPDBApplicant } from '../lib/notifications';

import { SchoolSettings, SeoSettings, Post, Event, Announcement, Teacher, Facility, DownloadItem, AuditLog } from '../types';

interface CmsAdminProps {
  settings: SchoolSettings;
  seoSettings: SeoSettings;
  posts: Post[];
  events: Event[];
  announcements: Announcement[];
  teachers: Teacher[];
  facilities: Facility[];
  downloads: DownloadItem[];
  auditLogs: AuditLog[];
  onSaveSettings: (settings: SchoolSettings) => void;
  onSaveSeo: (seo: SeoSettings) => void;
  onSavePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onSaveTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  sqlSchemaCode: string;
  onRefreshData?: () => void;
  onNavigate?: (path: string) => void;
}

export default function CmsAdmin({
  settings,
  seoSettings,
  posts,
  events,
  announcements,
  teachers,
  facilities,
  downloads,
  auditLogs,
  onSaveSettings,
  onSaveSeo,
  onSavePost,
  onDeletePost,
  onSaveTeacher,
  onDeleteTeacher,
  sqlSchemaCode,
  onRefreshData = () => {},
  onNavigate = () => {}
}: CmsAdminProps) {
  
  // Helper to extract initial active tab from hash, e.g. #/admin/berita -> 'berita'
  const getTabFromHash = (): string => {
    const hash = window.location.hash;
    // Format is #/admin/tabName or #admin/tabName
    if (hash.startsWith('#/admin/') || hash.startsWith('#admin/')) {
      const parts = hash.split('/');
      return parts[parts.length - 1] || 'ikhtisar';
    }
    return 'ikhtisar';
  };

  // Tab Routing state
  const [activeTab, setActiveTabState] = useState<string>(() => {
    return getTabFromHash();
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = `/admin/${tab}`;
  };

  // Keep state in sync if hash changes externally
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getTabFromHash();
      if (newTab !== activeTab) {
        setActiveTabState(newTab);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  // Sync hash on component mount if hash doesn't have a tab
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#/admin/') && !hash.startsWith('#admin/')) {
      window.location.hash = `/admin/${activeTab}`;
    }
  }, []);

  // Global Notification history lists
  const [notifications, setNotifications] = useState<CmsNotification[]>([
    {
      id: 'notif-init-1',
      message: '👋 Selamat datang di CMS Admin Portal. Jaringan enkripsi SSL Kemenag RI aktif.',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      unread: false,
      category: 'security'
    },
    {
      id: 'notif-init-2',
      message: '📊 Basis data pendaftaran PPDB online dan arsip rilis media berhasil dimuat.',
      type: 'info',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      unread: true,
      category: 'database'
    }
  ]);

  // Translucent dynamic toast overlay popups
  const [activeToasts, setActiveToasts] = useState<CmsNotification[]>([]);

  // Catch custom dispatched notification messages globally
  useEffect(() => {
    const handleGlobalNotification = (e: any) => {
      if (!e || !e.detail) return;
      const { message, type, category = 'general' } = e.detail;

      const newNotif: CmsNotification = {
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        message,
        type,
        timestamp: new Date().toISOString(),
        unread: true,
        category
      };

      // Put at top of notifications log
      setNotifications(prev => [newNotif, ...prev]);

      // Filter and append to visible toast arrays
      setActiveToasts(prev => [...prev, newNotif]);

      // Remove the specific overlay toast after 6 seconds gracefully
      setTimeout(() => {
        setActiveToasts(prev => prev.filter(t => t.id !== newNotif.id));
      }, 6000);

      // Force refreshing the dataset views in real-time
      onRefreshData();
    };

    window.addEventListener('cms-global-notification', handleGlobalNotification as EventListener);
    return () => {
      window.removeEventListener('cms-global-notification', handleGlobalNotification as EventListener);
    };
  }, [onRefreshData]);

  // Simulated live admissions scheduler (simulation candidate arrives in the background)
  useEffect(() => {
    // Generate one mock PPDB candidate after 20 seconds, and then every 75 seconds
    const ppdbInitialTimer = setTimeout(() => {
      generateRandomMockPPDBApplicant();
    }, 20000);

    const ppdbIntervalTimer = setInterval(() => {
      generateRandomMockPPDBApplicant();
    }, 75000);

    return () => {
      clearTimeout(ppdbInitialTimer);
      clearInterval(ppdbIntervalTimer);
    };
  }, []);

  // Handlers for managing notifications list
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleTriggerManualPPDBAdmissions = () => {
    generateRandomMockPPDBApplicant();
  };
  
  // Simulated Authentication & Session state
  const [currentUser, setCurrentUser] = useState<any>(() => MockDb.getLoggedInUser());
  const [sessionRole, setSessionRole] = useState<string>(() => {
    const user = MockDb.getLoggedInUser();
    return user ? user.role : 'Super Admin';
  });

  // Login Form input fields
  const [email, setEmail] = useState<string>('admin@minsingkawang.sch.id');
  const [password, setPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Authenticating animation state
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authTokenMsg, setAuthTokenMsg] = useState<string>('');

  // Callback to return safely
  const handleNavigateHome = () => {
    onNavigate('home');
  };

  // Direct login submit handler
  const handleLoginSubmit = async (e?: React.FormEvent, customMail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoginError(null);

    const checkMail = customMail !== undefined ? customMail : email;
    const checkPass = customPass !== undefined ? customPass : password;

    if (!checkMail || !checkPass) {
      setLoginError("Harap masukkan email dan kata sandi log masuk Anda.");
      return;
    }

    setIsAuthenticating(true);
    setAuthTokenMsg("Menghubungi konsol Kemenag RI terpadu...");
    await new Promise(r => setTimeout(r, 600));

    setAuthTokenMsg("Memverifikasi token tanda tangan digital...");
    await new Promise(r => setTimeout(r, 600));

    setAuthTokenMsg("Mengunduh wewenang hak akses level madrasah...");
    await new Promise(r => setTimeout(r, 600));

    const authenticatedUser = await MockDb.authenticate(checkMail, checkPass);
    if (authenticatedUser) {
      setAuthTokenMsg("Otentikasi Berhasil! Mempersiapkan modul...");
      await new Promise(r => setTimeout(r, 450));
      
      setCurrentUser(authenticatedUser);
      setSessionRole(authenticatedUser.role);
      setIsAuthenticating(false);
      onRefreshData();
    } else {
      setIsAuthenticating(false);
      setLoginError("Email login atau Kata Sandi salah. Harap periksa kembali kredensial Anda.");
    }
  };

  // Instant prefill login cards action
  const handleQuickLogin = (quickMail: string, quickPass: string) => {
    setEmail(quickMail);
    setPassword(quickPass);
    handleLoginSubmit(undefined, quickMail, quickPass);
  };

  // Handle manual role changing dropdown on sidebar
  const handleRoleChangeFromSidebar = async (role: string) => {
    setSessionRole(role);
    let mailAddress = "admin@minsingkawang.sch.id";
    if (role === 'Operator') mailAddress = "operator@minsingkawang.sch.id";
    if (role === 'Kepala Madrasah') mailAddress = "kepala@minsingkawang.sch.id";
    if (role === 'Editor') mailAddress = "editor@minsingkawang.sch.id";

    const user = await MockDb.login(mailAddress, role);
    setCurrentUser(user);
    onRefreshData();
  };

  // Clear Session and logout completely back to credentials screen
  const handleCmsLogout = async () => {
    await MockDb.logout();
    setCurrentUser(null);
    setSessionRole('Super Admin');
    setEmail('');
    setPassword('');
    setLoginError(null);
    onRefreshData();
  };

  // Render Login Gate overlay in case of no authentic profile
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 flex font-sans antialiased text-zinc-800 select-none overflow-y-auto" id="cms_login_gateway_view">
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white md:bg-zinc-50/60 relative">
          
          {/* Subtle grid patterns for modern look */}
          <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 p-4">
            
            {/* Left Side: Traditional Brand Greet & Connection status */}
            <div className="hidden md:flex md:col-span-5 flex-col justify-center space-y-6 text-left pr-4">
              <div className="inline-flex items-center gap-1.5 bg-zinc-100 border border-zinc-200/80 text-zinc-900 py-1 px-2.5 rounded-md text-[10px] font-black tracking-widest uppercase font-mono w-fit">
                <Server className="w-3.5 h-3.5 text-zinc-650" />
                <span>SECURE PORTAL CONNECTION</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-2.5xl font-extrabold text-zinc-905 leading-none uppercase tracking-tight">
                  MIN Singkawang <br />
                  <span className="text-emerald-800 text-xl font-bold tracking-normal">CMS Control Desk</span>
                </h1>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                  Sistem manajemen konten terpadu berbasis cloud madrasah ibtidaiyah negeri singkawang. Gunakan kredensial resmi Anda untuk memperoleh otorisasi rilis data ke web publik secara aman.
                </p>
              </div>

              {/* Server Stats Indicators */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-3 bg-white border border-zinc-200/80 p-3.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <Cpu className="w-4 h-4 text-emerald-800 shrink-0" />
                  <div>
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest leading-none">Status Sinkronisasi</div>
                    <div className="text-xs text-zinc-700 font-bold mt-1">Drizzle ORM & Supabase Database</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white border border-zinc-200/80 p-3.5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <Users className="w-4 h-4 text-emerald-800 shrink-0" />
                  <div>
                    <div className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest leading-none">Otoritas Sesi</div>
                    <div className="text-xs text-zinc-700 font-bold mt-1">Role Based Access Control (RBAC)</div>
                  </div>
                </div>
              </div>

              {/* Back to main web */}
              <button 
                onClick={handleNavigateHome}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-800 text-[10px] font-black uppercase tracking-wider transition-all pt-2 hover:translate-x-[-1px] cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>

            {/* Right Side: Secure Interactive Login Desk & Presets */}
            <div className="md:col-span-7 flex flex-col space-y-5">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-md md:shadow-lg space-y-6 text-left" id="cms_login_form_card">
                
                {/* School & Kemenag Branding header */}
                <div className="flex items-center gap-3.5 border-b border-zinc-100 pb-5">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png" 
                    alt="Logo Kementerian Agama" 
                    className="w-9 h-9 object-contain shrink-0" 
                  />
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 leading-tight uppercase tracking-tight">Kementerian Agama RI</h3>
                    <p className="text-zinc-400 text-[10px] font-extrabold tracking-widest mt-1 uppercase font-mono">MIN SINGKAWANG • PORTAL ADMIN</p>
                  </div>
                </div>

                {/* Simulated Console loading block */}
                {isAuthenticating ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-fade-in" id="simulated_auth_loader_console">
                    <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-zinc-800 text-xs font-mono tracking-wide text-center bg-zinc-50 border border-zinc-200/80 px-4 py-3.5 rounded-xl min-w-[280px]">
                      <div className="text-emerald-800 font-black animate-pulse uppercase tracking-wider text-[10px]">Memverifikasi Otoritas...</div>
                      <div className="mt-1.5 text-zinc-500 font-medium text-[10.5px] font-sans break-all">{authTokenMsg}</div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-shake" id="login_error_alert">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{loginError}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 block font-sans">
                        Alamat Email Resmi
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="operator@minsingkawang.sch.id"
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-9 pr-4 text-xs text-zinc-850 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 font-sans transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-450 block font-sans">
                        Kata Sandi Otoritas
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-9 pr-9 text-xs text-zinc-850 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 font-mono transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-extrabold uppercase tracking-wider font-sans">
                        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                        <span>SSL ENCRYPTED SECURE</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-950 text-white transition-all font-sans font-black text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-transparent"
                        id="login_submit_btn"
                      >
                        <span>Verifikasi Sandi</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Grid of Default Accounts Requested by User */}
              <div className="space-y-3.5 text-left bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Akun Simulasi Pengujian</span>
                  </span>
                  <span className="text-[8.5px] bg-zinc-105 border border-zinc-200 px-2 py-0.5 rounded font-black font-mono text-zinc-600">RBAC READY</span>
                </div>

                <p className="text-[11px] text-zinc-450 leading-normal font-sans">
                  Pilih salah satu aktor resmi madrasah di bawah untuk mensimulasikan otorisasi masuk ke panel kontrol konten secara instan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {/* Default Account 1: Super Admin */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("admin@minsingkawang.sch.id", "admin123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/40 hover:bg-emerald-50/10 hover:border-emerald-700/40 transition-all cursor-pointer select-none group focus:outline-none disabled:opacity-40"
                    id="quick_login_admin"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-zinc-800 transition-colors leading-none uppercase tracking-wider text-[10px]">Super Admin</span>
                      <span className="text-[8px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 leading-none">ROOT</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1.5 font-medium truncate w-full font-mono">{`admin@minsingkawang.sch.id`}</div>
                    <div className="text-[9.5px] text-zinc-400 mt-1 font-mono leading-none">Sandi: <strong className="font-bold text-zinc-700">admin123</strong></div>
                    <div className="text-[9px] text-emerald-800 mt-2 font-black flex items-center gap-1 uppercase tracking-widest">
                      <span>Akses Penuh Portal</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                  {/* Default Account 2: Operator (Admin) */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("operator@minsingkawang.sch.id", "operator123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/40 hover:bg-emerald-50/10 hover:border-emerald-700/40 transition-all cursor-pointer select-none group focus:outline-none disabled:opacity-40"
                    id="quick_login_operator"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-zinc-800 transition-colors leading-none uppercase tracking-wider text-[10px]">Operator Madrasah</span>
                      <span className="text-[8px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 leading-none">STAFF</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1.5 font-medium truncate w-full font-mono">{`operator@minsingkawang.sch.id`}</div>
                    <div className="text-[9.5px] text-zinc-400 mt-1 font-mono leading-none">Sandi: <strong className="font-bold text-zinc-700">operator123</strong></div>
                    <div className="text-[9px] text-emerald-800 mt-2 font-black flex items-center gap-1 uppercase tracking-widest">
                      <span>Kelola Kurikulum & Berita</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                  {/* Default Account 3: Kepala Madrasah */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("kepala@minsingkawang.sch.id", "kepala123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/40 hover:bg-emerald-50/10 hover:border-emerald-700/40 transition-all cursor-pointer select-none group focus:outline-none disabled:opacity-40"
                    id="quick_login_kepala"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-zinc-800 transition-colors leading-none uppercase tracking-wider text-[10px]">Kepala Madrasah</span>
                      <span className="text-[8px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 leading-none">LEAD</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1.5 font-medium truncate w-full font-mono">{`kepala@minsingkawang.sch.id`}</div>
                    <div className="text-[9.5px] text-zinc-400 mt-1 font-mono leading-none">Sandi: <strong className="font-bold text-zinc-700">kepala123</strong></div>
                    <div className="text-[9px] text-zinc-650 mt-2 font-black flex items-center gap-1 uppercase tracking-widest">
                      <span>Persetujuan Rilis Publik</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                  {/* Default Account 4: Editor Redaksional */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("editor@minsingkawang.sch.id", "editor123")}
                    disabled={isAuthenticating}
                    className="flex flex-col text-left p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/40 hover:bg-emerald-50/10 hover:border-emerald-700/40 transition-all cursor-pointer select-none group focus:outline-none disabled:opacity-40"
                    id="quick_login_editor"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-zinc-800 transition-colors leading-none uppercase tracking-wider text-[10px]">Editor Redaksi</span>
                      <span className="text-[8px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 leading-none">WRITE</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1.5 font-medium truncate w-full font-mono">{`editor@minsingkawang.sch.id`}</div>
                    <div className="text-[9.5px] text-zinc-400 mt-1 font-mono leading-none">Sandi: <strong className="font-bold text-zinc-700">editor123</strong></div>
                    <div className="text-[9px] text-zinc-650 mt-2 font-black flex items-center gap-1 uppercase tracking-widest">
                      <span>Penulis Jurnal Berita</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
                    </div>
                  </button>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans tracking-tight overflow-hidden" id="admin_pwa_system_layout">
      {/* 1. Left Drawer Collapsible Sidebar with branch line connectors */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sessionRole={sessionRole} 
        setSessionRole={handleRoleChangeFromSidebar} 
        onNavigate={onNavigate} 
        onLogout={handleCmsLogout}
      />

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" id="admin_main_content_canvas">
        
        {/* Top welcome status bar */}
        <AdminHeader 
          activeTab={activeTab} 
          sessionRole={sessionRole} 
          onNavigateHome={handleNavigateHome} 
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onClearAll={handleClearAllNotifications}
          onSimulatePPDB={handleTriggerManualPPDBAdmissions}
        />

        {/* Dynamic Global Toast Overlay Component Stack */}
        <div 
          className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-81 max-w-[calc(100vw-3rem)] pointer-events-none" 
          id="cms_global_portal_toast_con"
        >
          <AnimatePresence>
            {activeToasts.map((toast) => {
              let bgBorder = 'bg-blue-600 border-blue-400 text-white';
              let Icon = Info;
              if (toast.type === 'success') {
                bgBorder = 'bg-[#01352e] border-[#00e3a5] text-white';
                Icon = CheckCircle;
              } else if (toast.type === 'warning') {
                bgBorder = 'bg-amber-600 border-amber-400 text-white';
                Icon = AlertTriangle;
              } else if (toast.type === 'error') {
                bgBorder = 'bg-rose-700 border-rose-500 text-white';
                Icon = ShieldAlert;
              }

              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 55, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 pointer-events-auto relative overflow-hidden shrink-0 ${bgBorder}`}
                >
                  <div className="p-1.5 flex items-center justify-center rounded-lg bg-white/10 text-white shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 text-xs pr-4 space-y-1">
                    <span className="font-mono text-[8px] font-black uppercase tracking-wider text-white/70 block">
                      📢 BULETIN {toast.category}
                    </span>
                    <p className="font-semibold leading-relaxed">
                      {toast.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
                    }}
                    className="absolute top-2 right-2 text-white/60 hover:text-white cursor-pointer active:scale-90 p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Inner canvas content with custom tab renderer */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50" id="admin_content_viewport">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Sec 1: DASHBOARD STATS */}
            {activeTab === 'ikhtisar' && (
              <CmsOverview 
                posts={posts} 
                facilities={facilities} 
                downloads={downloads} 
                teachers={teachers} 
                auditLogs={auditLogs} 
                setActiveTab={setActiveTab} 
                userRole={sessionRole}
                onRefreshData={onRefreshData}
              />
            )}

            {/* Sec 2: DATABASE AUDIT PROGRESS LOGS */}
            {activeTab === 'audit_logs' && (
              <CmsOverview 
                posts={posts} 
                facilities={facilities} 
                downloads={downloads} 
                teachers={teachers} 
                auditLogs={auditLogs} 
                setActiveTab={setActiveTab} 
                userRole={sessionRole}
                onRefreshData={onRefreshData}
              />
            )}

            {/* Sec 2B: REAL-TIME PUSH NOTIFICATIONS CENTER */}
            {activeTab === 'push_notifications' && (
              <CmsPushNotificationsSection />
            )}

            {/* Sec 3: NEWS PUBLISHING CONTROLLER */}
            {activeTab === 'berita' && (
              <CmsNewsSection 
                posts={posts} 
                onSavePost={onSavePost} 
                onDeletePost={onDeletePost} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 4: MISC CAROUSEL ANNOUNCEMENTS */}
            {activeTab === 'pengumuman' && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 5: EVENTS & ACTIVITIES CALENDAR */}
            {activeTab === 'events' && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 6: GALLERY PHOTOS / VIDEOS */}
            {activeTab === 'galeri' && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 6b: MEDIA LIBRARY MODULE */}
            {activeTab === 'media_library' && (
              <CmsMediaLibrarySection 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 7: HUMAN RESOURCES & FACILITIES SECTION (GTK, Program, Facility, Testimonials) */}
            {['gtk', 'program', 'facilities', 'testimonials'].includes(activeTab) && (
              <CmsFacultySection 
                activeTab={activeTab} 
                teachers={teachers} 
                facilities={facilities} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 8: STUDENT REGISTRATION, PPDB & FILE CENTER DOWNLOADS */}
            {['ppdb', 'downloads', 'akademik_kalender', 'akademik_ekstrakurikuler'].includes(activeTab) && (
              <CmsAcademicSection 
                activeTab={activeTab} 
                downloads={downloads} 
                onRefreshData={onRefreshData} 
              />
            )}

            {/* Sec 9: WEBSITE BUILDER FOR FULLY CMS DRIVEN CONFIGURATION */}
            {activeTab.startsWith('builder_') && (
              <CmsWebsiteBuilderSection 
                sessionRole={sessionRole}
                onRefreshData={onRefreshData}
              />
            )}

            {/* Sec 10: MASTER CONFIGURATION FIELDS FOR BRAND AND IDENTITY */}
            {activeTab.startsWith('sets_') && (
              <CmsSettingsSection 
                activeTab={activeTab} 
                settings={settings} 
                seoSettings={seoSettings} 
                sqlSchemaCode={sqlSchemaCode} 
                onRefreshData={onRefreshData} 
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
