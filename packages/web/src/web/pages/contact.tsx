import { SEO, PageLayout, ContactForm } from "../components/layout";
import { COMPANY } from "../lib/data";

export default function ContactPage() {
  return (
    <PageLayout>
      <SEO
        title="Контакты"
        description="Свяжитесь с KONNEKTEAM — IT-компания в Уральске. Телефон, WhatsApp, email. Адрес офиса на карте. Выезд специалиста за 2–4 часа."
        keywords="контакты KONNEKTEAM, IT компания Уральск телефон, адрес KONNEKTEAM"
        canonical="https://konnekteam.kz/contacts"
      />

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, background: "#0A0A0A", textAlign: "center" }}>
        <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Связаться</div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 20 }}>Контакты</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          Ответим в течение 15 минут. Выезд специалиста по Уральску — за 2–4 часа.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section style={{ padding: "0 24px 80px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }}>

          {/* Info */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                {
                  icon: "📞",
                  label: "Телефон",
                  value: COMPANY.phone,
                  href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
                },
                {
                  icon: "💬",
                  label: "WhatsApp",
                  value: COMPANY.phone,
                  href: `https://wa.me/77000981981?text=Здравствуйте%2C%20хочу%20узнать%20подробнее`,
                },
                {
                  icon: "📧",
                  label: "Email",
                  value: COMPANY.email,
                  href: `mailto:${COMPANY.email}`,
                },
                {
                  icon: "📍",
                  label: "Адрес",
                  value: COMPANY.address,
                  href: undefined,
                },
                {
                  icon: "🕐",
                  label: "Режим работы",
                  value: COMPANY.workingHours,
                  href: undefined,
                },
              ].map(c => (
                <div key={c.label} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href} style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>{c.value}</a>
                    ) : (
                      <span style={{ color: "#fff", fontWeight: 500 }}>{c.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
              {COMPANY.instagram && (
                <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 500 }}>
                    Instagram
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 28 }}>Оставить заявку</h2>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ padding: "0 24px 100px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 20 }}>Мы на карте</h2>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", height: 420 }}>
            <iframe
              title="KONNEKTEAM на карте"
              src="https://www.openstreetmap.org/export/embed.html?bbox=51.1800%2C51.2100%2C51.4200%2C51.3200&layer=mapnik&marker=51.2638%2C51.3676"
              width="100%"
              height="420"
              style={{ border: "none", display: "block", filter: "invert(0.9) hue-rotate(180deg) brightness(0.85) contrast(1.1)" }}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div style={{ marginTop: 12, fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", textAlign: "right" }}>
            © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.35)" }}>OpenStreetMap</a> contributors
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
