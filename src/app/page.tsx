"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, MessageCircle, CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const content = {
  fr: {
    nav: { login: "Se connecter", cta: "Commencer gratuitement" },
    hero: {
      headline: "Gérez vos élèves.\nSuivez vos paiements.\nSans effort.",
      sub: "La plateforme pensée pour les professeurs particuliers au Maroc.",
      cta: "Commencer gratuitement",
      login: "Se connecter →",
      trust: ["Gratuit pour toujours", "Aucune carte requise", "Conçu pour le Maroc"],
    },
    features: {
      eyebrow: "Fonctionnalités",
      title: "Tout ce dont vous avez besoin.",
      items: [
        { title: "Gestion des élèves", desc: "Ajoutez et organisez vos élèves par groupe, niveau et matière. Tout est centralisé et accessible en un clic." },
        { title: "Rappels WhatsApp", desc: "Envoyez des rappels de paiement personnalisés sur WhatsApp. Le bon message, au bon parent, au bon moment." },
        { title: "Suivi des paiements", desc: "Visualisez qui a payé et qui ne l'a pas encore fait. Relancez les impayés en un seul clic." },
      ]
    },
    pricing: {
      eyebrow: "Tarifs",
      title: "Simple et transparent.",
      free: {
        badge: "Gratuit", price: "0 MAD / mois",
        features: ["Jusqu'à 20 élèves", "Gestion des groupes", "Rappels WhatsApp", "Tableau de bord"],
        cta: "Commencer gratuitement"
      },
      pro: {
        badge: "Pro", price: "Bientôt disponible",
        features: ["Élèves illimités", "Rapports & statistiques", "Plusieurs matières", "Support prioritaire"],
        cta: "Bientôt disponible",
        popular: "POPULAIRE"
      }
    },
    footer: { copy: "© 2026 Academic Atelier — Soutien Scolaire", tagline: "Fait avec ❤️ pour les professeurs marocains", login: "Se connecter" }
  },
  ar: {
    nav: { login: "تسجيل الدخول", cta: "ابدأ مجاناً" },
    hero: {
      headline: "أدِر طلابك.\nتابع مدفوعاتك.\nدون عناء.",
      sub: "المنصة المصممة خصيصاً للأساتذة المستقلين في المغرب.",
      cta: "ابدأ مجاناً",
      login: "← تسجيل الدخول",
      trust: ["مجاني للأبد", "لا بطاقة مطلوبة", "صُنع للمغرب"],
    },
    features: {
      eyebrow: "المميزات",
      title: "كل ما تحتاجه.",
      items: [
        { title: "إدارة الطلاب", desc: "أضف وسيِّر طلابك حسب المجموعة والمستوى والمادة. كل شيء مركزي وبنقرة واحدة." },
        { title: "تذكيرات واتساب", desc: "أرسل تذكيرات مدفوعات مخصصة عبر واتساب. الرسالة الصحيحة، للولي الصحيح، في الوقت المناسب." },
        { title: "متابعة المدفوعات", desc: "اعرف بلمحة من دفع ومن لم يدفع بعد. تابع المتأخرين بنقرة واحدة." },
      ]
    },
    pricing: {
      eyebrow: "الأسعار",
      title: "بسيط وشفاف.",
      free: {
        badge: "مجاني", price: "0 درهم / شهر",
        features: ["حتى 20 طالب", "إدارة المجموعات", "تذكيرات واتساب", "لوحة التحكم"],
        cta: "ابدأ مجاناً"
      },
      pro: {
        badge: "برو", price: "قريباً",
        features: ["طلاب غير محدودين", "تقارير وإحصائيات", "مواد متعددة", "دعم أولوي"],
        cta: "قريباً",
        popular: "شائع"
      }
    },
    footer: { copy: "© 2026 Academic Atelier — Soutien Scolaire", tagline: "صُنع بـ ❤️ للأساتذة المغاربة", login: "تسجيل الدخول" }
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const t = content[lang];

  return (
    <div 
      className={cn(
        "min-h-screen bg-[#080f1e] text-[#f1f5f9] flex flex-col selection:bg-[#4ade80]/20",
        lang === "ar" ? "font-['system-ui']" : "font-manrope"
      )}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-[#080f1e]/85 backdrop-blur-md border-b border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-widest text-white uppercase leading-tight">
              Soutien Scolaire
            </h1>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">
              Academic Atelier
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/[0.06] rounded-full px-1 py-1 text-xs" dir="ltr">
              <button 
                onClick={() => setLang("fr")}
                className={cn("px-2 py-0.5 rounded-full transition-colors", lang === "fr" ? "text-white font-bold bg-white/[0.06]" : "text-slate-500 hover:text-white")}
              >
                FR
              </button>
              <span className="text-slate-600 mx-1">|</span>
              <button 
                onClick={() => setLang("ar")}
                className={cn("px-2 py-0.5 rounded-full transition-colors", lang === "ar" ? "text-white font-bold bg-white/[0.06]" : "text-slate-500 hover:text-white")}
              >
                AR
              </button>
            </div>
            <Link 
              href="/login" 
              className="hidden md:inline-flex text-slate-300 text-sm hover:text-white transition font-medium ml-2"
            >
              {t.nav.login}
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center bg-white text-[#080f1e] font-semibold text-sm px-4 py-2 rounded-full hover:bg-slate-100 transition"
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 py-20">
          {/* Left Column (Text) */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-start w-full">
            <div className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-medium px-3 py-1 rounded-full border border-[#4ade80]/20 mb-8 inline-block w-fit">
              ✦ {lang === "fr" ? "Pour les professeurs particuliers" : "للأساتذة المستقلين"}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight whitespace-pre-line">
              {t.hero.headline}
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-md leading-relaxed">
              {t.hero.sub}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center bg-[#4ade80] text-[#080f1e] font-bold px-6 py-3 rounded-full text-base hover:bg-[#4ade80]/80 transition"
              >
                {t.hero.cta}
              </Link>
              <Link href="/login" className="text-slate-400 text-sm hover:text-white transition font-medium">
                {t.hero.login}
              </Link>
            </div>
            <div className="mt-8 flex gap-5 flex-wrap justify-center lg:justify-start">
              {t.hero.trust.map((item, i) => (
                <div key={i} className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <span className="text-[#4ade80]">✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="hidden lg:flex flex-1 w-full relative justify-end">
            <div dir="ltr" className="bg-[#0f1a2e] rounded-2xl p-6 border border-white/[0.07] w-full max-w-[460px] transform rotate-2 hover:rotate-0 transition-transform duration-700 shadow-[0_0_60px_rgba(30,58,95,0.5)]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/[0.06]">
                <p className="text-xs text-slate-400 font-medium">Étudiants · <span className="text-white">25 actifs</span></p>
              </div>

              <div className="space-y-4">
                {/* Row 1 */}
                <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                  <div className="h-10 w-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold shrink-0">YA</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">Youssef Alaoui</p>
                    <p className="text-slate-500 text-[10px] truncate">0612345678</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit">Physique-Chimie</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Payé</span>
                      <span className="text-white text-xs font-bold">200 <span className="opacity-50 text-[10px]">MAD</span></span>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                  <div className="h-10 w-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold shrink-0">SB</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">Sara Benali</p>
                    <p className="text-slate-500 text-[10px] truncate">0698765432</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit">Mathématiques</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Impayé</span>
                      <span className="text-white text-xs font-bold">250 <span className="opacity-50 text-[10px]">MAD</span></span>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                  <div className="h-10 w-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold shrink-0">AT</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">Amine Tazi</p>
                    <p className="text-slate-500 text-[10px] truncate">0655443322</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit">SVT</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#4ade80]/10 text-[#4ade80] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Payé</span>
                      <span className="text-white text-xs font-bold">300 <span className="opacity-50 text-[10px]">MAD</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section className="py-24 bg-[#080f1e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-slate-500 mb-3 font-semibold">
                {t.features.eyebrow}
              </p>
              <h3 className="text-3xl font-bold text-white">
                {t.features.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
              {t.features.items.map((item, i) => {
                const Icon = i === 0 ? Users : i === 1 ? MessageCircle : CreditCard;
                return (
                  <div key={i} className="bg-[#0f1a2e] border border-white/[0.07] rounded-2xl p-8 hover:border-white/[0.15] transition-colors">
                    <div className="bg-[#4ade80]/10 rounded-xl p-2 w-fit mb-5">
                      <Icon className="w-7 h-7 text-[#4ade80]" />
                    </div>
                    <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mt-2">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 4. PRICING SECTION */}
        <section className="py-24 bg-[#080f1e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-slate-500 mb-3 font-semibold">
                {t.pricing.eyebrow}
              </p>
              <h3 className="text-3xl font-bold text-white">
                {t.pricing.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-start">
              {/* FREE */}
              <div className="bg-[#0f1a2e] border border-white/[0.07] rounded-2xl p-8 flex flex-col">
                <span className="bg-white/[0.06] text-slate-300 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                  {t.pricing.free.badge}
                </span>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{t.pricing.free.price.split(' ')[0]}</span>
                  <span className="text-slate-500 text-sm font-medium">{t.pricing.free.price.substring(t.pricing.free.price.indexOf(' ')+1)}</span>
                </div>
                <div className="border-t border-white/[0.06] my-6" />
                <ul className="space-y-4 flex-1">
                  {t.pricing.free.features.map((f, i) => (
                    <li key={i} className="flex gap-3 items-center text-slate-300 text-sm font-medium">
                      <Check className="w-4 h-4 text-[#4ade80] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="w-full border border-white/[0.15] text-white rounded-full py-3 text-sm font-semibold hover:bg-white/[0.06] transition mt-8 inline-flex justify-center text-center">
                  {t.pricing.free.cta}
                </Link>
              </div>

              {/* PRO */}
              <div className="bg-[#1e3a5f] border border-[#60a5fa]/20 rounded-2xl p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#4ade80] text-[#080f1e] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider" dir={lang === "ar" ? "rtl" : "ltr"}>
                  {t.pricing.pro.popular}
                </div>
                <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs font-bold px-3 py-1 rounded-full border border-[#4ade80]/20 w-fit">
                  {t.pricing.pro.badge}
                </span>
                <div className="mt-6">
                  <span className="text-2xl font-bold text-white">{t.pricing.pro.price}</span>
                </div>
                <div className="border-t border-white/[0.06] my-6" />
                <ul className="space-y-4 flex-1">
                  {t.pricing.pro.features.map((f, i) => (
                    <li key={i} className="flex gap-3 items-center text-slate-300 text-sm font-medium">
                      <Check className="w-4 h-4 text-[#4ade80] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button disabled className="w-full bg-white/[0.1] text-slate-400 rounded-full py-3 text-sm font-semibold cursor-not-allowed mt-8">
                  {t.pricing.pro.cta}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-[#080f1e] border-t border-white/[0.06] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <p className="text-slate-600 text-xs text-center md:text-start">{t.footer.copy}</p>
          <p className="text-slate-500 text-xs text-center">{t.footer.tagline}</p>
          <div className="text-center md:text-end">
            <Link href="/login" className="text-slate-500 text-xs hover:text-white transition font-medium">
              {t.footer.login}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
