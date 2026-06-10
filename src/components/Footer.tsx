/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolSettings } from '../types';
import { 
  Mail, Phone, MapPin, Globe, Facebook, Instagram, Youtube, Award, ShieldAlert,
  Lock, Unlock, Check, Copy, Settings, Sparkles, ExternalLink 
} from 'lucide-react';
import SocialFeedFooter from './SocialFeedFooter';
import MockDb from '../database/mockDb';

interface FooterProps {
  settings: SchoolSettings;
  onNavigate: (path: string) => void;
  onSaveSettings?: (newSettings: any) => void;
}

export default function Footer({ settings, onNavigate, onSaveSettings }: FooterProps) {
  const [editFacebook, setEditFacebook] = useState(settings.social_facebook || '');
  const [editInstagram, setEditInstagram] = useState(settings.social_instagram || '');
  const [editYoutube, setEditYoutube] = useState(settings.social_youtube || '');
  
  const [passcode, setPasscode] = useState('');
  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state values if settings change externally
  useEffect(() => {
    setEditFacebook(settings.social_facebook || '');
    setEditInstagram(settings.social_instagram || '');
    setEditYoutube(settings.social_youtube || '');
  }, [settings.social_facebook, settings.social_instagram, settings.social_youtube]);

  const activeRole = MockDb.getActiveUserRole();
  const isAuthorized = activeRole === 'Super Admin' || activeRole === 'Kepala Madrasah' || activeRole === 'Operator' || isPasscodeUnlocked;

  const handleCopyLink = (url: string, id: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveSocials = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      social_facebook: editFacebook,
      social_instagram: editInstagram,
      social_youtube: editYoutube
    };
    if (onSaveSettings) {
      onSaveSettings(updated);
    } else {
      MockDb.saveSettings(updated);
    }
    MockDb.addLog(
      "SAVE_CONFIG", 
      `Pembaruan tautan media sosial via Panel Hub Sosial di Kaki Halaman (Footer)`
    );
    setSuccessMsg('Tautan media sosial berhasil disimpan dan terintegrasi di seluruh website!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 4500);
  };

  const handleUnlockWithPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'operator123' || passcode === 'kepala123') {
      setIsPasscodeUnlocked(true);
      setAuthError('');
      setSuccessMsg('Status administrator terverifikasi! Silakan perbarui tautan sosial.');
      setTimeout(() => setSuccessMsg(''), 4500);
    } else {
      setAuthError('Kode sandi salah! Gunakan: admin123 (Simulasi)');
    }
  };

  const sitemapSections = [
    {
      title: "Profil Madrasah",
      items: [
        { label: "Sambutan Kepala", path: "profil_sambutan", desc: "Amanah Kepala Madrasah" },
        { label: "Profil & Sejarah", path: "profil_singkat", desc: "Latar sejarah dan pendirian" },
        { label: "Visi, Misi & Tujuan", path: "profil_visi_misi", desc: "Target & fokus pendidikan" },
        { label: "Struktur Organisasi", path: "profil_organisasi", desc: "Susunan pengurus & komite" },
        { label: "Pendidik & GTK", path: "profil_gtk", desc: "Database guru & kependidikan" },
      ]
    },
    {
      title: "Akademik & Projek",
      items: [
        { label: "Kurikulum Merdeka", path: "akademik_kurikulum", desc: "Sistem pengajaran modern" },
        { label: "Kalender Pendidikan", path: "akademik_kalender", desc: "Agenda & jadwal belajar harian" },
        { label: "Projek P5RA Islami", path: "akademik_p5ra", desc: "Karakter rahmatan lil alamin" },
        { label: "Ekstrakurikuler", path: "akademik_ekstra", desc: "Wadah minat & bakat siswa" },
        { label: "Perpustakaan Digital", path: "akademik_perpus", desc: "E-buku & materi bacaan siswa" },
      ]
    },
    {
      title: "Kesiswaan & Sarana",
      items: [
        { label: "Aktivitas Harian", path: "kesiswaan_kegiatan", desc: "Pembiasaan ibadah & karakter" },
        { label: "Prestasi Unggul", path: "profil_prestasi", desc: "Capaian emas di ragam ajang" },
        { label: "Organisasi OSIM", path: "kesiswaan_organisasi", desc: "Kader kepemimpinan mandiri" },
        { label: "Sarana & Prasarana", path: "profil_sarana", desc: "Fasilitas & kelas interaktif" },
        { label: "Akreditasi BAN-SM", path: "profil_akreditasi", desc: "Status & sertifikat resmi" },
      ]
    },
    {
      title: "Informasi & Layanan",
      items: [
        { label: "Kabar Berita Terbaru", path: "berita", desc: "Pengumuman dan info prestasi" },
        { label: "Galeri Foto Kegiatan", path: "galeri", desc: "Dokumentasi aktivitas siswa" },
        { label: "Pusat Unduhan PDF", path: "download", desc: "Formulir, SK & berkas penting" },
        { label: "Hubungi Kontak Kami", path: "profil_kontak", desc: "Akses peta lokasi & layanan" },
        { label: "Program Unggulan", path: "profil_unggulan", desc: "Riset, tahfidz & kelas digital" },
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans tracking-tight border-t-4 border-emerald-700 pt-16 pb-8" id="school_footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Dynamic Social Media Feed Teaser Widget */}
        <SocialFeedFooter />

        {/* ======================= BRAND NEW SOCIAL MEDIA INTEGRATION BLOCK ======================= */}
        <div className="w-full bg-slate-950/25 border border-slate-800/40 rounded-2xl p-6 mb-12 text-left" id="social-integration-hub">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[9px] bg-emerald-900/30 border border-emerald-800/50 text-emerald-400 font-extrabold uppercase px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse text-emerald-400" />
                INTEGRASI SALURAN RESMI
              </span>
              <h3 className="text-white text-base font-extrabold uppercase mt-1.5 flex items-center gap-2">
                Hub Komunikasi Media Sosial Madrasah
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Pusat tautan media sosial eksternal yang diatur secara sentral untuk menyebarkan dinamika kependidikan dan program unggulan MIN Singkawang.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md flex items-center gap-1 ${
                isAuthorized 
                  ? "bg-emerald-950 border border-emerald-800/80 text-emerald-400 animate-pulse" 
                  : "bg-slate-900 border border-slate-800 text-slate-505"
              }`}>
                {isAuthorized ? <Unlock className="w-3.5 h-3.5 text-emerald-405" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Peran: {isAuthorized ? (activeRole !== 'Publik' ? activeRole : 'Otorisasi Cepat') : 'Hak Publik'}</span>
              </span>
            </div>
          </div>

          {/* Success / Alert Message inside section */}
          {successMsg && (
            <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left/Main Side: Official accounts presentation deck (Spans 7 columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Facebook card */}
                <div className="bg-slate-900/80 border-l-4 border-l-[#1877F2] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">PORTAL FB</span>
                      <Facebook className="w-5 h-5 text-[#1877F2]" />
                    </div>
                    <h4 className="text-white text-xs font-black mt-2">Facebook Official</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 truncate select-all font-mono">
                      {settings.social_facebook || "Belum dihubungkan"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/50">
                    <button
                      onClick={() => handleCopyLink(settings.social_facebook || '', 'fb')}
                      disabled={!settings.social_facebook}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-30"
                      title="Salin alamat tautan"
                    >
                      {copiedId === 'fb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'fb' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                    {settings.social_facebook ? (
                      <a 
                        href={settings.social_facebook} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-[#1877F2] hover:text-[#5094f7] font-bold flex items-center gap-0.5 underline transition-colors"
                      >
                        Kunjungi <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-600 italic">Kosong</span>
                    )}
                  </div>
                </div>

                {/* Instagram card */}
                <div className="bg-slate-900/80 border-l-4 border-l-[#E1306C] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">GALERI IG</span>
                      <Instagram className="w-5 h-5 text-[#E1306C]" />
                    </div>
                    <h4 className="text-white text-xs font-black mt-2">Instagram Media</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 truncate select-all font-mono">
                      {settings.social_instagram || "Belum dihubungkan"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/50">
                    <button
                      onClick={() => handleCopyLink(settings.social_instagram || '', 'ig')}
                      disabled={!settings.social_instagram}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-30"
                      title="Salin alamat tautan"
                    >
                      {copiedId === 'ig' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'ig' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                    {settings.social_instagram ? (
                      <a 
                        href={settings.social_instagram} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-[#E1306C] hover:text-[#f3528b] font-bold flex items-center gap-0.5 underline transition-colors"
                      >
                        Kunjungi <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-600 italic">Kosong</span>
                    )}
                  </div>
                </div>

                {/* YouTube card */}
                <div className="bg-slate-900/80 border-l-4 border-l-[#FF0000] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">YT DIGITAL</span>
                      <Youtube className="w-5 h-5 text-[#FF0000]" />
                    </div>
                    <h4 className="text-white text-xs font-black mt-2">YouTube Channel</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 truncate select-all font-mono">
                      {settings.social_youtube || "Belum dihubungkan"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/50">
                    <button
                      onClick={() => handleCopyLink(settings.social_youtube || '', 'yt')}
                      disabled={!settings.social_youtube}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-30"
                      title="Salin alamat tautan"
                    >
                      {copiedId === 'yt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'yt' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                    {settings.social_youtube ? (
                      <a 
                        href={settings.social_youtube} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-[#FF0000] hover:text-[#ff4d4d] font-bold flex items-center gap-0.5 underline transition-colors"
                      >
                        Kunjungi <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-600 italic">Kosong</span>
                    )}
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-950/45 rounded-xl border border-slate-800/40 text-xs text-slate-400 leading-relaxed">
                📢 <strong>Fungsi Integrasi Eksternal:</strong> Tautan-tautan resmi di atas tersambung langsung dengan logo-logo sosial di header, rilis berita, serta widget feed. Tim Humas diwajibkan untuk mematangkan alamat tautan agar tidak mengarah ke domain tidak dikenal demi keamanan siswa.
              </div>
            </div>

            {/* Right Side: Administrative Social Link Management panel (Spans 5 columns) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5" id="social-admin-hub-workspace">
              {isAuthorized ? (
                /* Authenticated Edit Form Workspace */
                <form onSubmit={handleSaveSocials} className="space-y-3.5">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Settings className="w-4 h-4 text-emerald-500 animate-spin" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase">Ubah Tautan Resmi Madrasah</h4>
                      <p className="text-[10px] text-emerald-400 font-medium">Sesi Terotorisasi Aktif</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      Facebook URL Link
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                      </span>
                      <input 
                        type="url" 
                        value={editFacebook}
                        onChange={(e) => setEditFacebook(e.target.value)}
                        placeholder="https://facebook.com/minsingkawangofficial"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white font-mono placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      Instagram URL Link
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                        <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                      </span>
                      <input 
                        type="url" 
                        value={editInstagram}
                        onChange={(e) => setEditInstagram(e.target.value)}
                        placeholder="https://instagram.com/minsingkawangofficial"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white font-mono placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      YouTube Channel Link
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                        <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                      </span>
                      <input 
                        type="url" 
                        value={editYoutube}
                        onChange={(e) => setEditYoutube(e.target.value)}
                        placeholder="https://youtube.com/c/minsingkawangofficial"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white font-mono placeholder-slate-700 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-grow bg-emerald-855 hover:bg-emerald-800 text-white font-black text-[10px] uppercase tracking-wider py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Simpan & Sinkronisasikan
                    </button>
                    {isPasscodeUnlocked && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsPasscodeUnlocked(false);
                          setPasscode('');
                        }}
                        className="px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold text-[10px] uppercase rounded-lg cursor-pointer"
                        title="Kunci Panel"
                      >
                        Kunci
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Locked Authenticating Panel */
                <form onSubmit={handleUnlockWithPasscode} className="h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-black uppercase text-white tracking-wider">Konsol Input Administrator</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Formulir konfigurasi ini diproteksi. Masuk sebagai pengurus atau gunakan sandi otorisasi instan di bawah untuk memperbarui tautan sosial:
                    </p>
                  </div>

                  {authError && (
                    <div className="p-2.5 bg-rose-950/30 border border-rose-900 rounded-lg text-rose-455 text-[10px] font-bold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-1 text-left">
                    <label className="text-[10.5px] font-bold text-slate-400 block uppercase tracking-wider font-sans">
                      Sandi Otoritas Ringkas
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Ketik sandi simulasi..."
                        className="flex-grow bg-slate-950/85 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white font-mono placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 hover:scale-[1.01] active:opacity-95 text-white transition-all font-black text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer"
                      >
                        Buka
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 font-sans italic">
                      💡 Tip pengujian: ketik sandi <strong className="font-bold underline text-slate-355">admin123</strong> untuk simulasi unlocking seketika.
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-800/65 flex justify-between items-center text-[10px] text-slate-450">
                    <span className="flex items-center gap-1 font-mono">
                      <Globe className="w-3 h-3 text-emerald-500" /> Web TLS Encrypted
                    </span>
                    <button 
                      type="button"
                      onClick={() => onNavigate('cms')}
                      className="font-bold text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Login Kontrol Desk →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Top Header Module: Branding & Direct Contact info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Main Institution Info (Spans 6 columns) */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Kementerian_Agama_new_logo.png" 
                alt="Logo Kemenag" 
                className="w-11 h-11 object-contain shrink-0"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div>
                <h3 className="text-white text-base font-extrabold uppercase tracking-wide leading-tight">
                  MIN Singkawang
                </h3>
                <p className="text-[10px] text-emerald-400 font-bold tracking-wide">
                  Madrasah Ibtidaiyah Negeri Singkawang
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Penyelenggara pendidikan dasar umum berciri khas Islam rujukan dengan status Negeri di bawah binaan Kementerian Agama RI yang unggul, kompetitif, ramah anak, dan berwawasan lingkungan hidup.
            </p>
            
            {/* Accreditation Badge */}
            <div className="mt-2 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3 max-w-sm">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block">STATUS AKREDITASI</span>
                <h4 className="text-xs font-black text-white tracking-wide">TERAKREDITASI A (UNGGUL)</h4>
                <p className="text-[9px] text-slate-400 leading-tight mt-0.5">{settings.accreditation_number}</p>
                <p className="text-[9px] text-emerald-400 font-bold mt-0.5">Penilaian BAN-SM: {settings.accreditation_score}</p>
              </div>
            </div>
          </div>

          {/* Quick Contact & Map Access (Spans 6 columns) */}
          <div className="lg:col-span-6 flex flex-col gap-4 text-left">
            <h4 className="text-white text-xs font-black tracking-wider uppercase border-b border-slate-850 pb-2">
              LOKASI & RESPONS CEPAT
            </h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.contact_address}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                <div className="flex gap-2.5 items-center">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Hotline: {settings.contact_phone}</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>E-mail: {settings.contact_email}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Sitemap Tree Map (Spans full width, 4 column grid for high SEO and Internal crawl) */}
        <div className="py-12 border-b border-slate-805/60 grid grid-cols-2 md:grid-cols-4 gap-8">
          {sitemapSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4 text-left">
              <h4 className="text-white text-xs font-black tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.items.map((node, nodeIdx) => (
                  <li key={nodeIdx} className="group/node">
                    <button
                      type="button"
                      onClick={() => onNavigate(node.path)}
                      className="w-full text-left bg-transparent border-0 p-0 text-slate-400 hover:text-emerald-450 dark:hover:text-amber-400 cursor-pointer transition-colors duration-150 flex flex-col focus:outline-hidden"
                      title={`Kunjungi halaman ${node.label}`}
                    >
                      <span className="text-[12px] font-bold group-hover/node:translate-x-1 transition-transform duration-150 inline-flex items-center gap-1">
                        {node.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        {node.desc}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Embedded Maps Row & Small Footer Credits */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-4 flex flex-col md:flex-row gap-6 justify-between items-center text-xs text-slate-500">
        <div className="text-center md:text-left">
          <button 
            type="button"
            onClick={() => onNavigate('cms')} 
            className="text-center md:text-left bg-transparent border-0 hover:text-[#fbbf24] text-slate-500 cursor-pointer transition-colors focus:outline-hidden p-0 font-sans text-xs"
            title="Sistem Manajemen Madrasah"
          >
            © {new Date().getFullYear()} MIN Singkawang. Hak Cipta Dilindungi Undang-Undang.
          </button>
          <p className="text-[10px] mt-0.5">Sistem Portal Terpadu Madrasah Digital Modern</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] justify-center md:justify-end">
          <span className="text-emerald-500 font-semibold">ISO 9001:2015 Certified</span>
          <span>•</span>
          <span className="text-slate-400">Portal Resmi Terpadu</span>
        </div>
      </div>
    </footer>
  );
}
