import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { COMPANY } from "../lib/data";

const TEAM = [
  { name: "Владимир Мин", role: "Директор", desc: "25+ лет в IT-индустрии, специализация — сетевая инфраструктура и проектное управление." },
  { name: "Андрей Артемьев", role: "Ведущий сетевой инженер", desc: "Сертифицированный Mikrotik MTCRE. Проектировал сети для 60+ коммерческих объектов." },
  { name: "Максим Кузнецов", role: "Менеджер по работе с корпоративными клиентами", desc: "Сопровождение клиентов от первичной заявки до закрытия проекта. Опыт более 10 лет." },
  { name: "Александр Тимошук", role: "Инженер по видеонаблюдению", desc: "Монтаж и настройка CCTV систем — Hikvision, Dahua. 50+ реализованных объектов." },
];

const TIMELINE = [
  { year: "2010", title: "Основание", desc: "Компания основана в Уральске. Первые проекты — продажа и заправка картриджей для малого бизнеса." },
  { year: "2014", title: "Расширение", desc: "Добавлено направление по продаже компьютерной техники. Первый крупный корпоративный контракт" },  
  { year: "2018", title: "Расширение", desc: "Добавлено направление видеонаблюдения." },
  { year: "2020", title: "Сертификация", desc: "Получены сертификаты Hikvision, Dahua. Расширение команды специалистов." },
  { year: "2023", title: "Интернет", desc: "Получена лицензия на предоставление услуг связи. Выход на проекты по услугам связи для государственных компаний. " },
  { year: "2026", title: "Сегодня", desc: "350+ проектов, 24/7 поддержка, полный спектр IT-услуг для бизнеса любого масштаба. Сертификация ISO 9001" },
];

const VALUES = [
  { icon: "🎯", title: "Результат", desc: "Мы берём на себя ответственность и доводим каждый проект до результата — в срок и в рамках бюджета." },
  { icon: "🔍", title: "Прозрачность", desc: "Договор, техническое задание, акты работ — никаких скрытых платежей и устных договорённостей." },
  { icon: "📈", title: "Развитие", desc: "Постоянно обучаемся, проходим сертификацию, следим за новыми технологиями и внедряем лучшее." },
  { icon: "🤝", title: "Партнёрство", desc: "Относимся к задачам клиента как к своим — предлагаем оптимальные решения, а не самые дорогие." },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <SEO
        title="О компании"
        description="KONNEKTEAM — IT-компания в Уральске с 2010 года. 350+ реализованных проектов, команда сертифицированных специалистов, гарантия качества."
        keywords="о компании KONNEKTEAM, IT компания Уральск, интернет в Уральске, история компании, команда специалистов"
        canonical="https://konnekteam.kz/about"
      />

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>О нас</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 24 }}>IT-компания, которой доверяют</h1>
            <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 20 }}>
              {COMPANY.name} — профессиональная IT-компания в Уральске, основанная в 2014 году. Мы специализируемся на комплексных IT-решениях для бизнеса: от проектирования сетей до круглосуточной технической поддержки.
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
              За 10 лет работы реализовали более 350 проектов для компаний разного масштаба — от небольших магазинов до крупных производственных предприятий и государственных структур.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { num: "10+", label: "лет опыта" },
              { num: "350+", label: "проектов" },
              { num: "24/7", label: "поддержка" },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--accent)" }}>{s.num}</div>
                <div style={{ marginTop: 6, fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>История</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800 }}>Как мы росли</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 1, background: "rgba(227,30,36,0.25)" }} className="hidden-mobile" />
            {TIMELINE.map((t, i) => (
              <div key={t.year} style={{ display: "flex", gap: 32, marginBottom: 40, alignItems: "flex-start" }}>
                <div style={{ minWidth: 60, textAlign: "right", paddingTop: 4 }}>
                  <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: "1.1rem" }}>{t.year}</span>
                </div>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 6, position: "relative", zIndex: 1 }} className="hidden-mobile" />
                <div className="card" style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 8, color: "#fff" }}>{t.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "100px 24px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Принципы</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800 }}>Наши ценности</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {VALUES.map(v => (
              <div key={v.title} className="card">
                <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, color: "#fff" }}>{v.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Люди</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800 }}>Команда</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {TEAM.map(m => (
              <div key={m.name} className="card" style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(227,30,36,0.15)", border: "2px solid rgba(227,30,36,0.3)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  👤
                </div>
                <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>{m.name}</h3>
                <div style={{ color: "var(--accent)", fontSize: "0.85rem", marginBottom: 12 }}>{m.role}</div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "#0A0A0A", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 16 }}>Давайте работать вместе</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.7 }}>Расскажите о вашем проекте — подберём оптимальное решение.</p>
          <Link href="/contacts">
            <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Связаться с нами</a>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
