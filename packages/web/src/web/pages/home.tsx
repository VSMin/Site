import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { SERVICES, REVIEWS, COMPANY } from "../lib/data";
import { ParticleCanvas, HOME_FAQ as FAQ, FAQItem } from "../components/particle-canvas";
import { ServiceIconBox } from "../components/service-icons";
import { Zap, ShieldCheck, Wrench, Briefcase, PhoneCall, FileCheck } from "lucide-react";
// ── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <PageLayout>
      <SEO
        title="IT-услуги и телекоммуникации в Уральске"
        description="KONNEKTEAM — интернет для бизнеса, видеонаблюдение, информационная безопасность в Уральске. Выезд специалиста за 2–4 часа. Работаем с 2010 года, 350+ проектов."
        keywords="IT услуги Уральск, интернет для бизнеса Уральск, видеонаблюдение Уральск, информационная безопасность Уральск, телекоммуникации Уральск, KONNEKTEAM"
        canonical="https://konnekteam.kz/"
      />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#0A0A0A", userSelect: "none" }}>
        <ParticleCanvas />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "inline-block", background: "rgba(227,30,36,0.15)", border: "1px solid rgba(227,30,36,0.4)", borderRadius: 4, padding: "6px 14px", marginBottom: 24, fontSize: "0.85rem", color: "var(--accent)", letterSpacing: 2, textTransform: "uppercase" }}>
              IT-компания в Уральске
            </div>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
              Надёжные IT-решения<br />
              <span style={{ color: "var(--accent)" }}>для вашего бизнеса</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36, maxWidth: 560 }}>
              Сети, видеонаблюдение, информационная безопасность, СКУД, автоматизация — полный спектр IT-услуг с гарантией качества.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/contacts">
                <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                  Получить консультацию
                </a>
              </Link>
              <Link href="/services">
                <a style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "#fff", fontWeight: 600, transition: "border-color 0.2s" }}>
                  Все услуги →
                </a>
              </Link>
            </div>
          </div>
        </div>
        {/* scroll hint */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: 2, textTransform: "uppercase" }}>Прокрутить</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section style={{ background: "#111", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { num: "15+", label: "лет на рынке" },
            { num: "350+", label: "завершённых проектов" },
            { num: "2–4ч", label: "время выезда" },
            { num: "24/7", label: "техподдержка" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "2.8rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{s.num}</div>
              <div style={{ marginTop: 8, color: "rgba(255,255,255,0.55)", fontSize: "0.95rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "100px 24px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Что мы делаем</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Наши услуги</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {SERVICES.slice(0, 6).map(s => (
              <Link href={`/services/${s.slug}`} key={s.slug}>
                <a style={{ textDecoration: "none" }}>
                  <div className="card" style={{ height: "100%", transition: "transform 0.2s, border-color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(227,30,36,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <div style={{ marginBottom: 16 }}><ServiceIconBox slug={s.slug} box={52} size={26} /></div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10, color: "#fff" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.shortDesc}</p>
                    <div style={{ marginTop: 16, color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>Подробнее →</div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/services">
              <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Все 12 услуг</a>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Наши преимущества</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Почему выбирают нас</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 28 }}>
            {[
              { Icon: Zap, title: "Быстрый выезд", desc: "Специалист приедет в течение 2–4 часов по Уральску" },
              { Icon: ShieldCheck, title: "Гарантия качества", desc: "На все работы — гарантия от 6 до 24 месяцев" },
              { Icon: Wrench, title: "Полный цикл", desc: "Проектирование, монтаж, настройка и дальнейшее сопровождение" },
              { Icon: Briefcase, title: "Опыт с 2010 года", desc: "Реализовали более 350 проектов разного масштаба" },
              { Icon: PhoneCall, title: "Техподдержка 24/7", desc: "Всегда на связи — звонок, WhatsApp или удалённое подключение" },
              { Icon: FileCheck, title: "Договор и отчёты", desc: "Официальный договор, акты выполненных работ, гарантийные талоны" },
            ].map(w => (
              <div key={w.title} className="card">
                <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(227,30,36,0.1)", border: "1px solid rgba(227,30,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <w.Icon size={26} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: "#fff" }}>{w.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "100px 24px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Отзывы</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Что говорят клиенты</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {REVIEWS.map(r => (
              <div key={r.name} className="card">
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: "1.1rem" }}>★</span>
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff" }}>{r.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{r.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800 }}>Частые вопросы</h2>
          </div>
          {FAQ.map(f => <FAQItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "linear-gradient(135deg, #1a0000 0%, #0A0A0A 50%, #1a0000 100%)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, marginBottom: 20 }}>
            Готовы решить ваш IT-вопрос?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 36, lineHeight: 1.7 }}>
            Оставьте заявку или позвоните — специалист ответит в течение 15 минут.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contacts">
              <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Оставить заявку</a>
            </Link>
            <a href={`tel:${COMPANY.phone}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "#fff", fontWeight: 600 }}>
              <PhoneCall size={18} strokeWidth={1.8} /> {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
