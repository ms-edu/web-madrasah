/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Save, Info, ArrowUp, ArrowDown, Trash, Plus, FileCode, Copy, CheckCircle, ShieldAlert, Globe, Share2, Eye, ExternalLink, Settings, Sparkles } from 'lucide-react';
import MockDb from '../database/mockDb';
import { SchoolSettings, SeoSettings } from '../types';

interface CmsSettingsSectionProps {
  activeTab: string;
  settings: SchoolSettings;
  seoSettings: SeoSettings;
  sqlSchemaCode: string;
  onRefreshData: () => void;
}

export default function CmsSettingsSection({
  activeTab,
  settings,
  seoSettings,
  sqlSchemaCode,
  onRefreshData
}: CmsSettingsSectionProps) {
  
  // Local active states
  const [formSettings, setFormSettings] = useState<SchoolSettings>({ ...settings });
  const [formSeo, setFormSeo] = useState<SeoSettings>({ ...seoSettings });
  const [copiedSql, setCopiedSql] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Quick show alert
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSaveSettings = (updated: SchoolSettings) => {
    MockDb.saveSettings(updated);
    setFormSettings({ ...updated });
    // Write log
    MockDb.addLog("SAVE_CONFIG", `Merubah parameter master identitas portal pada seksi tab ${activeTab}`);
    onRefreshData();
    triggerNotification("✅ Konfigurasi Pengaturan Master berhasil disimpan!");
  };

  const handleSaveSeo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    MockDb.saveSeoSettings(formSeo);
    MockDb.addLog("SAVE_SEO", "Pembaruan metadata SEO publik madrasah");
    onRefreshData();
    triggerNotification("✅ Pengaturan SEO & Kamus Robot Google berhasil dimutakhirkan!");
  };

  // Slideshow ordering logic
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...(formSettings.banner_slides || [])];
    if (direction === 'up' && index > 0) {
      const temp = slides[index];
      slides[index] = slides[index - 1];
      slides[index - 1] = temp;
    } else if (direction === 'down' && index < slides.length - 1) {
      const temp = slides[index];
      slides[index] = slides[index + 1];
      slides[index + 1] = temp;
    }
    const updated = { ...formSettings, banner_slides: slides };
    handleSaveSettings(updated);
  };

  const deleteSlide = (index: number) => {
    if (confirm("Hapus slide banner ini dari slider carousel depan?")) {
      const slides = (formSettings.banner_slides || []).filter((_, idx) => idx !== index);
      const updated = { ...formSettings, banner_slides: slides };
      handleSaveSettings(updated);
    }
  };

  const addSlide = () => {
    const newSlide = {
      id: "slide_" + Math.random().toString(36).substring(2, 9),
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
      title: "Sarana Pembelajaran Berbasis Digital Madrasah Unggulan",
      subtitle: "Kombinasi teknologi mutakhir melahirkan santri berdaya saing global",
      tag: "Fasilitas Belajar Unggulan"
    };
    const updated = { ...formSettings, banner_slides: [...(formSettings.banner_slides || []), newSlide] };
    handleSaveSettings(updated);
  };

  const updateSlideField = (index: number, field: string, value: string) => {
    const slides = [...(formSettings.banner_slides || [])];
    slides[index] = { ...slides[index], [field]: value };
    setFormSettings({ ...formSettings, banner_slides: slides });
  };

  return (
    <div className="space-y-6 text-left font-sans text-sm animate-fade-in" id="cms_settings_section">
      
      {notification && (
        <div className="fixed bottom-6 right-6 z-55 bg-[#00251e] border border-emerald-500 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 shadow-[0_4px_20px_rgba(0,183,121,0.25)]">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ======================= IDENTITAS & SLOGAN ======================= */}
      {activeTab === 'sets_identitas' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Identitas, NPSN & Slogan</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi nama lembaga pemerintah, nomor statistik, dan motto utama.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-990 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nama Madrasah / Lembaga</label>
              <input type="text" value={formSettings.school_name} onChange={(e) => setFormSettings({ ...formSettings, school_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nomor Pokok Sekolah Nasional (NPSN)</label>
              <input type="text" value={formSettings.npsn || '60721234'} onChange={(e) => setFormSettings({ ...formSettings, npsn: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Slogan Utama / Banner Slogan</label>
              <input type="text" value={formSettings.slogan} onChange={(e) => setFormSettings({ ...formSettings, slogan: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nilai Akreditasi Madrasah (grade)</label>
              <input type="text" value={formSettings.accreditation_score || 'A (Sangat Unggul)'} onChange={(e) => setFormSettings({ ...formSettings, accreditation_score: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Email Kontak Resmi</label>
              <input type="email" value={formSettings.contact_email} onChange={(e) => setFormSettings({ ...formSettings, contact_email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Telepon Kantor</label>
              <input type="text" value={formSettings.contact_phone} onChange={(e) => setFormSettings({ ...formSettings, contact_phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Alamat Domisili Fisik</label>
              <input type="text" value={formSettings.contact_address} onChange={(e) => setFormSettings({ ...formSettings, contact_address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
        </form>
      )}

      {/* ======================= LINK PORTAL EKSTERNAL (PPDB & LMS) ======================= */}
      {activeTab === 'sets_topbar' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Tautan Portal Eksternal (PPDB & LMS)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Atur alamat website terpisah untuk pendaftaran siswa baru dan e-learning madrasah.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Tautan Web Portal PPDB Online Eksternal</label>
              <input type="url" value={formSettings.portal_ppdb_url || ''} onChange={(e) => setFormSettings({ ...formSettings, portal_ppdb_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs font-mono" placeholder="Contoh: https://ppdb.minsingkawang.sch.id" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Tautan Web Portal LMS / E-Learning Eksternal</label>
              <input type="url" value={formSettings.portal_lms_url || ''} onChange={(e) => setFormSettings({ ...formSettings, portal_lms_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs font-mono" placeholder="Contoh: https://lms.minsingkawang.sch.id" />
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg text-xs leading-relaxed">
            📢 <strong>Informasi Integrasi:</strong> Fitur PPDB lokal pada website profil ini dinonaktifkan sepenuhnya. Tombol-tombol pendaftaran pada halaman publik madrasah akan dialihkan secara langsung ke tautan portal luar di atas demi memberikan performa dan skalabilitas sistem yang maksimal.
          </div>
        </form>
      )}

      {/* ======================= IMAGE HERO SLIDER CAROUSEL ======================= */}
      {activeTab === 'sets_hero_slider' && (
        <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Banners Carousel Hero Slideshow</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Atur urutan penayangan gambar, ganti cover, tambah atau hapus jajaran banner depan.</p>
            </div>
            <button onClick={addSlide} className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-910 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah Banner Slide</button>
          </div>

          <div className="space-y-4.5">
            {(formSettings.banner_slides || []).map((slide, index) => (
              <div key={slide.id || index} className="p-4 bg-slate-50 border rounded-xl flex flex-col lg:flex-row items-stretch gap-4 text-xs">
                <div className="w-full lg:w-44 shrink-0 bg-slate-200 rounded-lg overflow-hidden border">
                  <img src={slide.image} className="w-full h-full object-cover min-h-[90px]" alt="" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">Judul Slide Banner</span>
                      <input type="text" value={slide.title} onChange={(e) => updateSlideField(index, 'title', e.target.value)} className="w-full px-2 py-1 bg-white border rounded mt-0.5" />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase">Keterangan Sub-informasi</span>
                      <input type="text" value={slide.subtitle} onChange={(e) => updateSlideField(index, 'subtitle', e.target.value)} className="w-full px-2 py-1 bg-white border rounded mt-0.5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase">Thumbnail Banner Cover URL</span>
                    <input type="text" value={slide.image} onChange={(e) => updateSlideField(index, 'image', e.target.value)} className="w-full px-2.5 py-1 bg-white border rounded mt-0.5 font-mono text-[10px]" />
                  </div>
                </div>
                <div className="lg:w-28 shrink-0 flex lg:flex-col items-center justify-center gap-1.5 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-3">
                  <button onClick={() => moveSlide(index, 'up')} className="p-1 px-2.5 bg-white border rounded hover:bg-slate-100 flex items-center gap-1 cursor-pointer"><ArrowUp className="w-3 h-3 text-slate-600" /> Up</button>
                  <button onClick={() => moveSlide(index, 'down')} className="p-1 px-2.5 bg-white border rounded hover:bg-slate-100 flex items-center gap-1 cursor-pointer"><ArrowDown className="w-3 h-3 text-slate-600" /> Down</button>
                  <button onClick={() => deleteSlide(index)} className="p-1 px-2 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 flex items-center gap-1 cursor-pointer text-rose-700 leading-3 shadow-2xs"><Trash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t flex justify-end">
            <button onClick={() => handleSaveSettings(formSettings)} className="px-5 py-2.5 bg-emerald-800 text-white font-extrabold text-xs rounded-lg cursor-pointer">TERAPKAN SUSUNAN SLIDER &times;</button>
          </div>
        </div>
      )}

      {/* ======================= SAMBUTAN & SEJARAH ======================= */}
      {activeTab === 'sets_sejarah' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Sambutan Kepala Madrasah & Sejarah</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi teks selamat datang, nama kepala sekolah, NIP, and cerita berdirinya sekolah.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-990 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nama Kepala Madrasah (Kasek)</label>
              <input type="text" value={formSettings.headmaster || 'H. Kamarudin, S.Ag'} onChange={(e) => setFormSettings({ ...formSettings, headmaster: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">NIP Kepala Madrasah</label>
              <input type="text" value={formSettings.headmaster_nip || '197410222005011002'} onChange={(e) => setFormSettings({ ...formSettings, headmaster_nip: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Foto Kepala Madrasah URL</label>
            <input type="text" value={formSettings.headmaster_avatar || ''} onChange={(e) => setFormSettings({ ...formSettings, headmaster_avatar: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono" />
          </div>
          <div>
            <label className="block text-[#006e5d] font-bold uppercase text-[10px] mb-1">☕ Teks Pidato Sambutan Hangat Kepala Sekolah</label>
            <textarea rows={5} value={formSettings.headmaster_speech || ''} onChange={(e) => setFormSettings({ ...formSettings, headmaster_speech: e.target.value })} className="w-full px-3 py-2 border rounded-lg leading-relaxed text-xs" />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">📜 Sejarah Lengkap Berdirinya MIN Singkawang</label>
            <textarea rows={6} value={formSettings.history || ''} onChange={(e) => setFormSettings({ ...formSettings, history: e.target.value })} className="w-full px-3 py-2 border rounded-lg leading-relaxed text-xs" />
          </div>
        </form>
      )}

      {/* ======================= VISI, MISI & TUJUAN ======================= */}
      {activeTab === 'sets_visi_misi' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Visi, Misi & Tujuan Madrasah</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Format misi and tujuan madrasah (Simpan satu butir per baris baru).</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 hover:bg-emerald-990 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Pernyataan Visi Sekolah</label>
            <input type="text" value={formSettings.vision} onChange={(e) => setFormSettings({ ...formSettings, vision: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Misi Sekolah (Satu butir per baris baru)</label>
            <textarea rows={5} value={(formSettings.mission || []).join('\n')} onChange={(e) => setFormSettings({ ...formSettings, mission: e.target.value.split('\n').filter(Boolean) })} className="w-full px-3 py-2 border rounded-lg font-sans leading-relaxed text-xs" placeholder="Mewujudkan lulusan fashih..." />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Tujuan Madrasah (Satu butir per baris baru)</label>
            <textarea rows={5} value={(formSettings.objectives || []).join('\n')} onChange={(e) => setFormSettings({ ...formSettings, objectives: e.target.value.split('\n').filter(Boolean) })} className="w-full px-3 py-2 border rounded-lg font-sans leading-relaxed text-xs" placeholder="Meningkatkan kemandirian belajar..." />
          </div>
        </form>
      )}

      {/* ======================= FOOTER & MAP LOCATION ======================= */}
      {activeTab === 'sets_footer' && (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(formSettings); }} className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase">Footer, Sosial Media & Maps</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Konfigurasi alamat e-maps, tautan sosial media resmi madrasah.</p>
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Simpan</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Facebook Link URL</label>
              <input type="text" value={formSettings.social_facebook || ''} onChange={(e) => setFormSettings({ ...formSettings, social_facebook: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Instagram Link URL</label>
              <input type="text" value={formSettings.social_instagram || ''} onChange={(e) => setFormSettings({ ...formSettings, social_instagram: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
            </div>
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">YouTube Link URL</label>
              <input type="text" value={formSettings.social_youtube || ''} onChange={(e) => setFormSettings({ ...formSettings, social_youtube: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Source Code Google Maps Embed Iframe (src saja)</label>
            <input type="text" value={formSettings.google_maps_embed || ''} onChange={(e) => setFormSettings({ ...formSettings, google_maps_embed: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-xs" />
          </div>
        </form>
      )}

      {/* ======================= GLOBAL SEO MASTER EDITOR ======================= */}
      {activeTab === 'sets_seo' && (
        <div className="space-y-6" id="seo_meta_editor_workspace">
          
          {/* Header Dashboard Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 -translate-y-6 translate-x-6 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-emerald-500/25 text-emerald-300 font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">Layanan Optimasi Mesin Pencari</span>
                <h3 className="text-lg md:text-xl font-black tracking-tight mt-1.5 uppercase flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span>SEO Meta Tag Editor & Robot Kamus</span>
                </h3>
                <p className="text-slate-300 text-xs max-w-xl">
                  Konfigurasikan judul representatif, deskripsi komprehensif, kata kunci pencarian, serta metadata OpenGraph media sosial guna mendominasi peringkat indeks rilis madrasah secara organik.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveSeo}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border-0 uppercase tracking-wider"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Terapkan Modifikasi</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: CRITICAL CONFIGURATION INPUT FORM (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Google Standard Metadata */}
              <div className="bg-white border text-left border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">G</span>
                  <div>
                    <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider">Kamus Standar Google (Google SERP Metadata)</h4>
                    <p className="text-[10px] text-slate-400">Parameter utama yang digunakan bot Google untuk merayapi judul & rincian di halaman pencari.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-slate-500 font-bold uppercase text-[9.5px]">Judul Halaman Google (Meta Title)</label>
                      <span className={`text-[9.5px] font-mono font-bold ${
                        formSeo.title.length < 30 || formSeo.title.length > 60 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {formSeo.title.length} / 60 Karakter
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={formSeo.title} 
                      onChange={(e) => setFormSeo({ ...formSeo, title: e.target.value })} 
                      className="w-full text-xs font-semibold px-3 py-2.5 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                      placeholder="Masukkan judul pencarian standard Google..." 
                    />
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            formSeo.title.length < 30 ? 'bg-amber-400 w-[40%]' : formSeo.title.length > 60 ? 'bg-rose-500 w-full' : 'bg-emerald-500 w-[90%]'
                          }`}
                        />
                      </div>
                      <span className="text-[8px] text-slate-400 font-medium">Recomended: 30-60 karakter</span>
                    </div>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Kata Kunci Indeks (Meta Keywords - Dipisah Koma)</label>
                    <input 
                      type="text" 
                      value={formSeo.keywords} 
                      onChange={(e) => setFormSeo({ ...formSeo, keywords: e.target.value })} 
                      className="w-full text-xs font-mono px-3 py-2.5 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                      placeholder="Contoh: MIN Singkawang, Madrasah Singkawang, PPDB..." 
                    />
                    <p className="text-[9px] text-zinc-400 italic mt-1 leading-snug">
                      Keyword mempermudah pencarian sub-seksi seperti PPDB, berita, and jajaran profil GTK.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-slate-500 font-bold uppercase text-[9.5px]">Deskripsi Singkat Global (Meta Description)</label>
                      <span className={`text-[9.5px] font-mono font-bold ${
                        formSeo.description.length < 120 || formSeo.description.length > 160 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {formSeo.description.length} / 160 Karakter
                      </span>
                    </div>
                    <textarea 
                      rows={3} 
                      value={formSeo.description} 
                      onChange={(e) => setFormSeo({ ...formSeo, description: e.target.value })} 
                      className="w-full text-xs font-medium px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors leading-relaxed"
                      placeholder="Masukkan rangkuman penjelas singkat portal..." 
                    />
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            formSeo.description.length < 120 ? 'bg-amber-400 w-[50%]' : formSeo.description.length > 160 ? 'bg-rose-500 w-full' : 'bg-emerald-500 w-[95%]'
                          }`}
                        />
                      </div>
                      <span className="text-[8px] text-slate-400 font-medium">Recomended: 120-160 karakter untuk snippets</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: OpenGraph Protocols (Social Sharing Media) */}
              <div className="bg-white border text-left border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Share2 className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider">Protokol OpenGraph (Facebook, Whatsapp & Slack Meta)</h4>
                    <p className="text-[10px] text-slate-400">Atur tampilan publikasi tautan ketika dibagikan ke group WA, status Facebook, atau medium jejaring sosial lainnya.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* OG Title & OG Type in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Judul Khusus Sosial (og:title)</label>
                      <input 
                        type="text" 
                        value={formSeo.og_title || ''} 
                        onChange={(e) => setFormSeo({ ...formSeo, og_title: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                        placeholder="Contoh: Portal Madrasah Ibtidaiyah Negeri Singkawang"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Tipe Konten Og (og:type)</label>
                      <select 
                        value={formSeo.og_type || 'website'} 
                        onChange={(e) => setFormSeo({ ...formSeo, og_type: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="website">Website / Portal Beranda</option>
                        <option value="article">Article / Berita Redaksional</option>
                        <option value="profile">Profile / Tokoh Kelembagaan</option>
                        <option value="place">Place / Titik Koordinat</option>
                      </select>
                    </div>
                  </div>

                  {/* OG Image */}
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Banner Gambar Tampilan (og:image URL)</label>
                    <input 
                      type="text" 
                      value={formSeo.og_image} 
                      onChange={(e) => setFormSeo({ ...formSeo, og_image: e.target.value })} 
                      className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                      placeholder="Masukkan url gambar ilustrasi..." 
                    />
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-center gap-3.5 mt-2">
                      <div className="w-14 h-10 rounded bg-slate-200 overflow-hidden border shrink-0">
                        <img src={formSeo.og_image} className="w-full h-full object-cover" alt="Fallback SEO preview" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans leading-snug">
                        <strong>Rekomendasi Gambar:</strong> Gunakan format PNG/JPG rasio mendatar 1200x630 piksel (1.91:1) agar rilis visual tidak terpotong saat dirender di timeline facebook.
                      </span>
                    </div>
                  </div>

                  {/* OG Description & OG Locale in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Bahasa Target (og:locale)</label>
                      <input 
                        type="text" 
                        value={formSeo.og_locale || 'id_ID'} 
                        onChange={(e) => setFormSeo({ ...formSeo, og_locale: e.target.value })}
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                        placeholder="Contoh: id_ID atau en_US"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Canonical Absolute URL</label>
                      <input 
                        type="text" 
                        value={formSeo.canonical_url || 'https://minsingkawang.sch.id'} 
                        onChange={(e) => setFormSeo({ ...formSeo, canonical_url: e.target.value })} 
                        className="w-full text-xs font-mono px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* OG Description Textarea */}
                  <div>
                    <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Rincian Deskripsi Sosial (og:description)</label>
                    <textarea 
                      rows={2} 
                      value={formSeo.og_description || ''} 
                      onChange={(e) => setFormSeo({ ...formSeo, og_description: e.target.value })}
                      className="w-full text-xs font-medium px-3 py-2 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors leading-relaxed"
                      placeholder="Masukkan ringkasan khusus sharing sosial group..."
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Robots & Search Engine Crawler Control */}
              <div className="bg-white border text-left border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b pb-3.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">R</span>
                  <div>
                    <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider">Direktif Perayap Google (Robots Index rules)</h4>
                    <p className="text-[10px] text-slate-400">Atur instruksi pengarsipan halaman untuk bot perayap Search Engine.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold uppercase text-[9.5px] mb-1">Aturan Perayapan Robot (Robots.txt Directives)</label>
                  <input 
                    type="text" 
                    value={formSeo.robots || 'index, follow'} 
                    onChange={(e) => setFormSeo({ ...formSeo, robots: e.target.value })} 
                    className="w-full text-xs font-mono px-3 py-2.5 border rounded-xl bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-colors"
                  />
                  <span className="text-[8.5px] text-slate-400 leading-snug block mt-1">
                    Aturan standar <strong>"index, follow"</strong> memberikan lampu hijau bagi seluruh mesin pencari (Yahoo, Bing, Google) untuk mendata berita-berita terbitan.
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC PREVIEW SHEETS (5 columns) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
              
              {/* Dynamic Mock 1: Google Desktop Search Preview snippet */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-3xs text-left">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-4">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pratinjau Hasil Pencarian Google</span>
                  </span>
                  <span className="text-[8.5px] bg-blue-105 text-blue-600 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded font-black font-mono">LIVE PREVIEW</span>
                </div>

                <div className="font-sans space-y-1.5 p-3.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-full flex items-center gap-1">
                    <span>https://minsingkawang.sch.id</span>
                    <span className="text-[8px] text-slate-400">› portal</span>
                  </div>
                  
                  {/* Google title links standard styling */}
                  <h4 className="text-[14px] md:text-[15px] font-sans font-medium text-blue-800 dark:text-blue-400 hover:underline leading-tight line-clamp-2 cursor-pointer">
                    {formSeo.title || "MIN Singkawang - Madrasah Ibtidaiyah Negeri Singkawang Resmi"}
                  </h4>
                  
                  {/* Google snippet text */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-full font-normal font-sans line-clamp-3">
                    {formSeo.description || "Selamat datang di Website Resmi MIN Singkawang. Pusat profil madrasah, pendaftaran PPDB online, pelayanan administrasi digital, berita kegiatan siswa."}
                  </p>
                </div>

                <div className="mt-3 bg-blue-50/40 text-blue-800 text-[10px] p-2.5 rounded-lg border border-blue-100/50 leading-relaxed font-sans flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-650 shrink-0 mt-0.5" />
                  <span>
                    Judul pencarian Anda {formSeo.title.length < 30 ? "terlalu pendek" : formSeo.title.length > 60 ? "terlalu panjang, akan terpotong oleh titik-titik oleh penjelas robot Google." : "bekerja sempurna dengan dimensi lebar panel deskripsi desktop."}
                  </span>
                </div>
              </div>

              {/* Dynamic Mock 2: OpenGraph / Facebook Sharing Card preview */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-3xs text-left">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-4">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-pink-600" />
                    <span>Pratinjau og:tag Media Sosial</span>
                  </span>
                  <span className="text-[8.5px] bg-pink-105 text-pink-600 dark:bg-pink-950 dark:text-pink-400 px-2 py-0.5 rounded font-black font-mono">OG PROTOCOL</span>
                </div>

                {/* Social Card mockup block code */}
                <div className="bg-white dark:bg-slate-955 rounded-xl overflow-hidden border border-slate-205 dark:border-slate-900 shadow-xs max-w-sm mx-auto">
                  
                  {/* Image cover workspace with dynamic title tag */}
                  <div className="aspect-[1.91/1] bg-slate-200 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={formSeo.og_image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200"} 
                      className="w-full h-full object-cover" 
                      alt="OpenGraph card preview" 
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[7px] text-white font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                      1200 x 630 (1.91:1)
                    </div>
                  </div>

                  {/* Metadata labels info */}
                  <div className="p-3 bg-slate-50 border-t border-slate-105 space-y-1">
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">
                      {formSeo.canonical_url ? formSeo.canonical_url.replace('https://', '') : "minsingkawang.sch.id"}
                    </span>
                    <h5 className="text-[12px] font-black leading-tight text-slate-800 line-clamp-1">
                      {formSeo.og_title || formSeo.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                      {formSeo.og_description || formSeo.description}
                    </p>
                  </div>
                </div>

                {/* Quick Diagnostics and validation list info */}
                <div className="mt-4 p-3 bg-slate-100 rounded-xl space-y-1.5 text-[9.5px] font-sans">
                  <div className="flex items-center justify-between text-slate-600 h-4.5">
                    <span>og:type validasi</span>
                    <strong className="text-emerald-700 font-bold uppercase">{formSeo.og_type || 'website'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 h-4.5 border-t pt-1">
                    <span>og:locale pemetaan</span>
                    <strong className="text-slate-600 font-mono">{formSeo.og_locale || 'id_ID'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 h-4.5 border-t pt-1">
                    <span>Canonical SSL link</span>
                    <strong className="text-emerald-700 truncate max-w-[150px]" title={formSeo.canonical_url}>YA (HTTPS)</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Sitemap generator workspace */}
          <div className="bg-white border rounded-xl p-5 shadow-xs text-left space-y-4">
            <h4 className="text-slate-800 font-black text-sm uppercase border-b pb-2 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-600" />
              <span>XML Sitemap & PWA Pre-cache Diagnostic</span>
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Tekan tombol di bawah untuk men-simulasi generator peta situs XML standard Google Search Console. Dokumen ini diindeks otomatis oleh service worker PWA untuk merayapi seluruh rilis berita utama.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-[10.5px] max-h-32 overflow-y-auto whitespace-pre">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://minsingkawang.sch.id/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://minsingkawang.sch.id/profil</loc>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://minsingkawang.sch.id/berita</loc>
    <changefreq>hourly</changefreq>
  </url>
</urlset>`}
            </div>
            <button 
              onClick={() => triggerNotification("📂 XML Google Sitemap berhasil dirilis & didaftarkan pada Search Console!")}
              className="px-4 py-2 border border-emerald-500 font-bold text-xs text-emerald-800 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
            >
              Re-generate Sitemap & Sync Robots
            </button>
          </div>
        </div>
      )}

      {/* ======================= STRUKTUR SUPABASE SCHEMA SQL ======================= */}
      {activeTab === 'sets_db' && (
        <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-2.5">
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Skema Basis Data SQL (Supabase PostgreSQL DDL)</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Struktur tabel relasional database jika PWA berpindah ke cloud hosting.</p>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(sqlSchemaCode);
                setCopiedSql(true);
                setTimeout(() => setCopiedSql(false), 2000);
                triggerNotification("📋 Kode DDL SQL berhasil dikopi ke clipboard!");
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-205 border text-slate-700 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? "Tersalin!" : "Kopi SQL"}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl text-slate-300 font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed border border-slate-900 border-t-4 border-t-emerald-500 shadow-inner">
            <pre>{sqlSchemaCode}</pre>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs leading-relaxed text-slate-600">
            <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-emerald-800 uppercase text-[10.5px]">Peringatan Keamanan Database</p>
              <p className="mt-0.5">Kode DDL di atas mencakup pembuatan trigger UUID, audit logging liaison, dan indexing otomatis B-Tree untuk menjamin kecepatan kueri berita bermega-mega byte secara stabil di Cloud PostgreSQL.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
