import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { SERVICES } from "../lib/data";

export default function ServicesPage() {
  return (
    <PageLayout>
      <SEO
        title="IT-услуги для бизнеса в Уральске"
        description="Полный спектр IT-услуг в Уральске: интернет для бизнеса, видеонаблюдение, информационная безопасность, ВОЛС, СКС, IPVPN. KONNEKTEAM — с 2010 года."
        keywords="IT услуги Уральск, интернет для бизнеса Уральск, видеонаблюдение Уральск, информационная безопасность Уральск, ВОЛС Уральск, СКС монтаж Уральск"
        canonical="https://konnekteam.kz/services"
      />

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, background: "#0A0A0A", textAlign: "center" }}>
        <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Что мы делаем</div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 20 }}>Наши услуги</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Полный цикл IT-сопровождения — от проектирования до сервисного обслуживания. Работаем с малым бизнесом, корпорациями и государственными структурами.
        </p>
      </section>

      {/* Services Grid */}
      <section style={{ padding: "60px 24px 100px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {SERVICES.map(s => (
            <Link href={`/services/${s.slug}`} key={s.slug}>
              <a style={{ textDecoration: "none" }}>
                <div
                  className="card"
                  style={{ height: "100%", transition: "transform 0.2s, border-color 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(227,30,36,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "none";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ fontSize: "2.4rem" }}>{s.icon}</div>
                    <div style={{ background: "rgba(227,30,36,0.1)", border: "1px solid rgba(227,30,36,0.2)", borderRadius: 4, padding: "3px 10px", fontSize: "0.75rem", color: "var(--accent)", whiteSpace: "nowrap" }}>
                      {s.category}
                    </div>
                  </div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 10, color: "#fff" }}>{s.title}</h2>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 20 }}>{s.shortDesc}</p>
                  <div style={{ marginTop: "auto", color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>Подробнее →</div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "#111", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 16 }}>Не нашли нужную услугу?</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.7 }}>Свяжитесь с нами — мы найдём решение под ваши задачи.</p>
          <Link href="/contacts">
            <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Связаться с нами</a>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
