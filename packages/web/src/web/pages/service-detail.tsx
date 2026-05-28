import { useRoute, Link } from "wouter";
import { SEO, PageLayout, ContactForm } from "../components/layout";
import { SERVICES } from "../lib/data";

export default function ServiceDetailPage() {
  const [, params] = useRoute("/services/:slug");
  const slug = params?.slug;
  const service = SERVICES.find(s => s.slug === slug);

  if (!service) {
    return (
      <PageLayout>
        <SEO title="Услуга не найдена" description="Данная услуга не найдена." />
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <h1>404 — Услуга не найдена</h1>
          <Link href="/services"><a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>← Все услуги</a></Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title={service.title}
        description={service.metaDescription || service.shortDesc}
        keywords={`${service.title} Уральск, ${service.category} Уральск`}
        canonical={`https://konnekteam.kz/services/${service.slug}`}
      />

      {/* Breadcrumb */}
      <section style={{ paddingTop: 120, paddingBottom: 0, paddingLeft: 24, paddingRight: 24, background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", flexWrap: "wrap" }}>
            <Link href="/"><a style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Главная</a></Link>
            <span>/</span>
            <Link href="/services"><a style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Услуги</a></Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>{service.title}</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section style={{ padding: "48px 24px 80px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(227,30,36,0.1)", border: "1px solid rgba(227,30,36,0.2)", borderRadius: 4, padding: "4px 12px", fontSize: "0.8rem", color: "var(--accent)", marginBottom: 20 }}>
              {service.category}
            </div>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>{service.icon}</div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, marginBottom: 20 }}>{service.title}</h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 640 }}>{service.fullDesc}</p>
            <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/contacts">
                <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Заказать услугу</a>
              </Link>
              <Link href="/services">
                <a style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: "0.95rem" }}>
                  ← Все услуги
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden-mobile" style={{ minWidth: 220 }}>
            <div className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Быстрый звонок</div>
              <a href="tel:+77000981981" style={{ display: "block", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", textDecoration: "none", marginBottom: 12 }}>+7 700 098 1981</a>
              <a href="https://wa.me/77000981981?text=Интересует%20услуга%3A%20" style={{ display: "block", background: "#25D366", color: "#fff", padding: "10px 20px", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section style={{ padding: "80px 24px", background: "#111" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 40, textAlign: "center" }}>Что входит в услугу</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {service.benefits.map((b: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(227,30,36,0.15)", border: "1px solid rgba(227,30,36,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Speedtest block — only for internet service */}
      {service.slug === "internet" && (
        <section style={{ padding: "80px 24px", background: "#0A0A0A" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>Проверьте скорость подключения</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
              Тест подключается напрямую к нашему серверу — вы видите реальную скорость именно вашего соединения с нашей сетью.
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: 32 }}>
              Актуально для клиентов KONNEKTEAM, подключённых к нашей сети.
            </p>
            <a
              href="https://speedtest.konnekteam.kz/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-block", fontSize: "1rem" }}
            >
              Запустить тест скорости →
            </a>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section style={{ padding: "80px 24px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>Оставить заявку</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Ответим в течение 15 минут</p>
          </div>
          <ContactForm defaultService={service.title} />
        </div>
      </section>

      {/* Related */}
      <section style={{ padding: "60px 24px 100px", background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 28 }}>Другие услуги</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {SERVICES.filter(s => s.slug !== slug).slice(0, 4).map(s => (
              <Link href={`/services/${s.slug}`} key={s.slug}>
                <a style={{ textDecoration: "none" }}>
                  <div className="card" style={{ transition: "border-color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(227,30,36,0.4)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{s.icon}</div>
                    <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>{s.title}</div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
