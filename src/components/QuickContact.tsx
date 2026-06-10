/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Phone, 
  Send, 
  Mail, 
  Clock, 
  X, 
  HelpCircle, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
  Building,
  UserCheck
} from 'lucide-react';
import MockDb from '../database/mockDb';
import { SchoolSettings } from '../types';

interface QuickContactProps {
  settings?: SchoolSettings;
}

export default function QuickContact({ settings: propSettings }: QuickContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedQuickQuestion, setSelectedQuickQuestion] = useState<string | null>(null);
  
  // Quick Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab ] = useState<'chat' | 'inquiry'>('chat');

  const settings = propSettings || MockDb.getSettings();

  // Show a greeting tooltip after 5 seconds on load to engage readers
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Format WhatsApp Link with custom pre-filled message
  const getWhatsAppLink = (customText?: string) => {
    // Elegant default text
    const defaultText = "Assalamu'alaikum Humas MIN Singkawang, saya ingin menanyakan informasi mengenai madrasah.";
    const text = encodeURIComponent(customText || defaultText);
    // Humas/PPDB Mobile help desk number (Indonesian regional standard)
    const phone = "6282250606072"; 
    return `https://wa.me/${phone}?text=${text}`;
  };

  // Pre-configured quick helpers for parents/guardians
  const interactiveQuestions = [
    {
      id: "ppdb",
      label: "Pendaftaran PPDB 2026/2027",
      text: "Assalamu'alaikum Humas MIN Singkawang, saya ingin berkonsultasi mengenai pendaftaran PPDB tahun ajaran baru 2026/2027."
    },
    {
      id: "syarat",
      label: "Syarat & Berkas Masuk",
      text: "Assalamu'alaikum Humas MIN Singkawang, apa saja dokumen persyaratan yang harus dipersiapkan untuk registrasi calon siswa baru?"
    },
    {
      id: "lms",
      label: "E-Learning & Aplikasi Madrasah",
      text: "Assalamu'alaikum Humas MIN Singkawang, saya wali murid ingin berkonsultasi tentang kendala akses akun portal E-Learning madrasah."
    },
    {
      id: "lokasi",
      label: "Waktu & Lokasi Belajar",
      text: "Assalamu'alaikum Humas MIN Singkawang, jika ingin berkunjung langsung ke madrasah, jam layanan operasional apa saja dan bagaimana lokasi rute terbaik?"
    }
  ];

  const handleQuickQuestionClick = (item: typeof interactiveQuestions[0]) => {
    setSelectedQuickQuestion(item.id);
    // Dynamic analytics logging
    MockDb.addLog(
      "QUICK_CHAT_TOPIC", 
      `Mengakses percakapan WhatsApp topik: ${item.label}`
    );
    
    // Redirect cleanly
    setTimeout(() => {
      window.open(getWhatsAppLink(item.text), '_blank', 'noopener,noreferrer');
      setSelectedQuickQuestion(null);
    }, 300);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim() || !inquiryMsg.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Register inquiry inside local MockDb logs so operators can audit them in standard CSV / Audit Panel
      MockDb.addLog(
        `Pertanyaan Cepat Hubungi Kami: ${inquiryName}`,
        `No WhatsApp: ${inquiryPhone} - Isi: "${inquiryMsg}"`
      );
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset after success
      setTimeout(() => {
        setInquiryName('');
        setInquiryPhone('');
        setInquiryMsg('');
        setSubmitSuccess(false);
        setActiveTab('chat');
      }, 3000);
    }, 1200);
  };

  return (
    <React.Fragment>
      {/* 2. Floating Clickable Trigger Action Button */}
      <div className="fixed bottom-24 right-6 z-45 flex flex-col items-end gap-2 text-left" id="quick_contact_fab_container">
        {/* Dynamic Tooltip Greeting Box */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 mb-1 max-w-[210px] relative text-xs font-sans leading-relaxed pointer-events-auto"
              style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.065))' }}
            >
              <button 
                type="button"
                onClick={() => setShowTooltip(false)}
                className="absolute top-1 right-1 p-0.5 rounded text-slate-400 hover:text-slate-600 focus:outline-hidden"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest text-[9.5px]">
                <Sparkles className="w-3 h-3 text-emerald-500 animate-spin-slow" />
                <span>Butuh Bantuan?</span>
              </div>
              <p className="mt-1 font-medium text-[11px] text-slate-500 dark:text-slate-400">
                Hubungi Humas kami via WhatsApp / Telegram klik disini!
              </p>
              {/* Tooltip speech bubble tail */}
              <div className="absolute right-5 -bottom-1.5 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-r border-b border-slate-100 dark:border-slate-800/80 rotate-45 transform" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The FAB Pulsing Button itself */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
          }}
          className={`relative p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 hover:scale-108 active:scale-95 border border-emerald-500/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer ${
            isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
          title="Hubungi Humas & Layanan Informasi Cepat"
          aria-label="Buka portal kontak cepat"
          id="quick_contact_fab"
        >
          {/* Pulsing decoration aura rings */}
          <span className="absolute inset-0 rounded-full bg-emerald-505/30 border border-emerald-500 animate-ping opacity-60 scale-105 pointer-events-none" />
          <MessageCircle className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {/* 3. The Modal overlay and interactive Card sheets */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6" id="quick_contact_modal_overlay">
            {/* Dark glass backdrop layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
            />

            {/* Modal Body card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-905 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden text-left z-10"
              id="quick_contact_modal_card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact_modal_title"
            >
              {/* Header banner area resembling custom madrasah theme colors */}
              <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 w-28 h-28 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-0 outline-hidden focus:ring-1 focus:ring-white/20"
                  aria-label="Tutup jendela kontak"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-[8px] uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-0.5 rounded-md max-w-max">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span>Madrasah Help Desk</span>
                  </span>
                  <h3 id="contact_modal_title" className="text-sm md:text-base font-black tracking-tight mt-1.5">
                    Layanan Informasi Hubungi Kami
                  </h3>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Ajukan pertanyaan Anda seputar PPDB, kurikulum, atau administrasi langsung ke jajaran Humas kami.
                  </p>
                </div>
              </div>

              {/* Navigation Tab links inside modal */}
              <div className="flex border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/35">
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'chat'
                      ? 'border-emerald-600 text-emerald-850 dark:text-emerald-400 bg-white dark:bg-slate-905 font-extrabold'
                      : 'border-transparent text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Saluran Pintas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiry')}
                  className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'inquiry'
                      ? 'border-emerald-600 text-emerald-850 dark:text-emerald-400 bg-white dark:bg-slate-905 font-extrabold'
                      : 'border-transparent text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kirim Pesan</span>
                </button>
              </div>

              {/* Dynamic Content Frame depending on active tags */}
              <div className="p-5 max-h-[420px] overflow-y-auto scrollbar-thin">
                
                {activeTab === 'chat' ? (
                  <div className="space-y-5">
                    
                    {/* Primary Channel Grid Links */}
                    <div className="grid grid-cols-1 gap-3">
                      
                      {/* WhatsApp Channel box */}
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3.5 rounded-xl border border-emerald-100/40 dark:border-emerald-900/35 bg-emerald-50/10 dark:bg-emerald-950/5 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/15 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                          <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">WhatsApp Humas Utama</span>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black font-mono">RESPONS CEPAT</span>
                          </div>
                          <p className="text-[10.5px] text-slate-450 mt-0.5">Diskusikan pendaftaran siswa and kegiatan akademik secara real-time.</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                      </a>

                      {/* Telegram Official Channel box */}
                      <a
                        href="https://t.me/minsingkawang_official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3.5 rounded-xl border border-blue-105/40 dark:border-blue-900/35 bg-blue-50/10 dark:bg-blue-950/5 hover:bg-blue-50/20 dark:hover:bg-blue-950/15 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Send className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">Telegram Channel & Bot</span>
                            <span className="text-[8px] bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 px-1.5 py-0.5 rounded font-black font-mono">INFORMASI</span>
                          </div>
                          <p className="text-[10.5px] text-slate-450 mt-0.5">Dapatkan siaran pengumuman resmi and rilis agenda madrasah otomatis.</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      </a>

                      {/* Direct Phone landline channel */}
                      <a
                        href={`tel:${settings.contact_phone.replace(/[^0-9]/g, '')}`}
                        className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-105 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/10 hover:bg-slate-100/40 dark:hover:bg-slate-850/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 group-hover:animate-shake" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">Telepon Madrasah</span>
                            <span className="text-[8.5px] text-slate-400 font-mono">{settings.contact_phone}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-450 mt-0.5">Telepon langsung kantor utama madrasah untuk keperluan urusan resmi.</p>
                        </div>
                        <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                      </a>
                    </div>

                    {/* Quick Question selection Area */}
                    <div className="space-y-2.5">
                      <span className="block text-[9.5px] font-extrabold text-slate-450 uppercase tracking-widest">
                        Pilih Topik Pertanyaan (WhatsApp)
                      </span>
                      <div className="flex flex-col gap-2">
                        {interactiveQuestions.map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => handleQuickQuestionClick(q)}
                            disabled={selectedQuickQuestion !== null}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] font-semibold border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              selectedQuickQuestion === q.id
                                ? 'bg-emerald-650 border-emerald-605 text-white'
                                : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:border-emerald-600 dark:hover:border-emerald-500/40 hover:bg-slate-50/50 dark:hover:bg-slate-850/20'
                            }`}
                          >
                            <span className="truncate">{q.label}</span>
                            {selectedQuickQuestion === q.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                            ) : (
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Operational Hour details */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/35 border border-slate-100 dark:border-slate-800/30 rounded-xl flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-emerald-800 dark:text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed space-y-0.5 text-left">
                        <span className="font-extrabold text-[#005a4c] block uppercase tracking-wider text-[9px]">Jam Kerja Humas Madrasah</span>
                        <span>Senin - Kamis : 07:00 - 14:00 WIB</span>
                        <span className="block">Jumat : 07:00 - 11:00 WIB | Sabtu : 07:00 - 12:30 WIB</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {submitSuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                          <Check className="w-6 h-6 stroke-[3]" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Pesan Anda Berhasil Terkirim!</h4>
                        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                          Terima kasih atas minat Anda. Pertanyaan telah dipetakan ke dalam log aspirasi madrasah terpusat. Operator Humas kami akan menindaklanjuti segera.
                        </p>
                      </motion.div>
                    ) : (
                      <React.Fragment>
                        <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-105 dark:border-amber-950 px-3.5 py-2.5 rounded-xl text-[10.5px] leading-relaxed text-amber-800 dark:text-amber-400">
                          Jangan ragu menyampaikan aspirasi, pengaduan, kritik konstruktif, atau pertanyaan PPDB secara offline lewat formulir terintegrasi ini.
                        </div>

                        {/* Name Input */}
                        <div>
                          <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">Nama Lengkap Anda</label>
                          <input
                            type="text"
                            required
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            className="w-full text-xs px-3.5 py-2.5 border rounded-xl bg-slate-50/40 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                          />
                        </div>

                        {/* WhatsApp / Phone Input */}
                        <div>
                          <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">No. WhatsApp / HP</label>
                          <input
                            type="tel"
                            required
                            value={inquiryPhone}
                            onChange={(e) => setInquiryPhone(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            className="w-full text-xs px-3.5 py-2.5 border rounded-xl bg-slate-50/40 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                          />
                        </div>

                        {/* Message Input */}
                        <div>
                          <label className="block text-slate-500 font-bold uppercase text-[9px] mb-1">Pesan / Pokok Pertanyaan</label>
                          <textarea
                            required
                            rows={3}
                            value={inquiryMsg}
                            onChange={(e) => setInquiryMsg(e.target.value)}
                            placeholder="Tulis rincian pertanyaan Anda dengan detail..."
                            className="w-full text-xs px-3.5 py-2 border rounded-xl bg-slate-50/40 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 leading-relaxed"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:bg-slate-350 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md border-0"
                        >
                          {isSubmitting ? (
                            <React.Fragment>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Sedang Mengirim...</span>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Send className="w-3.5 h-3.5" />
                              <span>Ajukan Pertanyaan</span>
                            </React.Fragment>
                          )}
                        </button>
                      </React.Fragment>
                    )}
                  </form>
                )}

              </div>

              {/* Modal Card Footer */}
              <div className="px-5 py-3 sm:py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/40 flex justify-between items-center text-[9px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>NPSN: {settings.npsn}</span>
                </span>
                <span className="font-mono text-emerald-850 dark:text-emerald-400 font-bold">MIN SINGKAWANG</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
