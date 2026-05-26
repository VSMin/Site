import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { COMPANY, SERVICES } from "../lib/data";

// ── SEO ────────────────────────────────────────────────────────────────────────
interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({ title, description, keywords, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | KONNEKTEAM — Уральск`;

    const setMeta = (name: string, content: string, prop?: boolean) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", "index, follow");
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", canonical || "https://konnekteam.kz", true);
    setMeta("og:image", ogImage || "https://konnekteam.kz/logo.png", true);
    setMeta("og:locale", "ru_RU", true);
    setMeta("og:site_name", "KONNEKTEAM", true);

    // Canonical
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical || "https://konnekteam.kz";
  }, [title, description, keywords, canonical, ogImage]);
  return null;
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    // Set initial state
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on nav
  useEffect(() => { setOpen(false); }, [location]);

  const links = [
    { href: "/", label: "Главная" },
    { href: "/services", label: "Услуги" },
    { href: "/about", label: "О компании" },
    { href: "/blog", label: "Блог" },
    { href: "/contacts", label: "Контакты" },
    { href: "/vacancy", label: "Вакансия" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: "70px",
      background: scrolled ? "rgba(8,8,8,0.97)" : "rgba(8,8,8,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.03)",
      transition: "all 0.4s ease",
      display: "flex", alignItems: "center",
      padding: "0 clamp(20px, 5vw, 60px)",
    }}>
      <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo.png" alt="KONNEKTEAM" className="logo-glitch"
            style={{ height: "34px", objectFit: "contain" }} />
        </Link>

        {/* Desktop */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="hidden-mobile">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              style={{
                fontFamily: "Montserrat, sans-serif", fontSize: "13px", fontWeight: 600,
                letterSpacing: "0.5px", textDecoration: "none", textTransform: "uppercase",
                color: isActive(l.href) ? "white" : "var(--text-secondary)",
                borderBottom: isActive(l.href) ? "2px solid var(--accent)" : "2px solid transparent",
                paddingBottom: "2px", transition: "all 0.3s",
              }}
              onMouseEnter={(e) => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={(e) => { if (!isActive(l.href)) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >{l.label}</Link>
          ))}
          <a href={`tel:${COMPANY.phoneRaw}`} className="btn-glow" style={{ padding: "10px 22px", fontSize: "13px" }}>
            {COMPANY.phone}
          </a>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "8px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "absolute", top: "70px", left: 0, right: 0,
          background: "rgba(8,8,8,0.99)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "24px clamp(20px,5vw,60px)",
          display: "flex", flexDirection: "column", gap: "20px",
        }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              style={{
                fontFamily: "Montserrat, sans-serif", fontSize: "15px", fontWeight: 600,
                color: isActive(l.href) ? "var(--accent)" : "white", textDecoration: "none",
              }}
            >{l.label}</Link>
          ))}
          <a href={`tel:${COMPANY.phoneRaw}`} className="btn-glow" style={{ textAlign: "center" }}>
            {COMPANY.phone}
          </a>
        </div>
      )}
    </nav>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
export function Footer() {
  const serviceLinks = [
    ["internet", "Интернет для бизнеса"],
    ["ipvpn", "Корпоративные сети IPVPN"],
    ["lks", "Проектирование и СКС"],
    ["vols", "Волоконно-оптические линии"],
    ["cctv", "Видеонаблюдение"],
    ["security", "Информационная безопасность"],
  ];

  return (
    <footer style={{ background: "#060606", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px clamp(20px,5vw,60px) 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "48px" }}>

          <div style={{ gridColumn: "span 1" }}>
            <img src="/logo.png" alt="KONNEKTEAM" style={{ height: "30px", marginBottom: "16px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.75, maxWidth: "280px" }}>
              {COMPANY.tagline}. Телекоммуникации и цифровая инфраструктура под ключ с {COMPANY.foundedYear} года.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer"
                style={{
                  width: "36px", height: "36px", border: "1px solid var(--border)", borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                </svg>
              </a>
              <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
                style={{
                  width: "36px", height: "36px", border: "1px solid var(--border)", borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#25D366"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "20px" }}>Услуги</div>
            {serviceLinks.map(([slug, label]) => (
              <div key={slug} style={{ marginBottom: "10px" }}>
                <Link href={`/services/${slug}`}
                  style={{ color: "var(--text-muted)", fontSize: "14px", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "white"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                >{label}</Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "20px" }}>Навигация</div>
            {[["/" , "Главная"], ["/services", "Все услуги"], ["/about", "О компании"], ["/blog", "Блог"], ["/contacts", "Контакты"], ["/vacancy", "Вакансия"]].map(([href, label]) => (
              <div key={href} style={{ marginBottom: "10px" }}>
                <Link href={href}
                  style={{ color: "var(--text-muted)", fontSize: "14px", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "white"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                >{label}</Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "20px" }}>Контакты</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a href={`tel:${COMPANY.phoneRaw}`} style={{ color: "var(--text-muted)", fontSize: "14px", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "white"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
              >{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`} style={{ color: "var(--text-muted)", fontSize: "14px", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "white"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
              >{COMPANY.email}</a>
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>{COMPANY.address}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>{COMPANY.workingHours}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>© {new Date().getFullYear()} {COMPANY.fullName}. Все права защищены.</span>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>БИН: {COMPANY.bin} · {COMPANY.region}</span>
        </div>
      </div>
    </footer>
  );
}

// ── WhatsApp float ─────────────────────────────────────────────────────────────
export function WhatsAppFloat() {
  return (
    <a href={COMPANY.whatsapp} target="_blank" rel="noopener noreferrer"
      className="whatsapp-float" title="Написать в WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// ── Scroll to top on navigation (not on browser back/forward) ──────────────────
function ScrollToTop() {
  const [location] = useLocation();

  // useLayoutEffect fires synchronously before paint — no flash
  useLayoutEffect(() => {
    if (window.history.state?.scrollRestored) {
      // back/forward: restore saved position
      const saved = window.history.state?.scrollY ?? 0;
      window.scrollTo(0, saved);
      // clear the flag
      window.history.replaceState(
        { ...window.history.state, scrollRestored: false },
        ""
      );
    } else {
      // forward navigation: scroll to top immediately
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Save scroll position on every click (before wouter changes location)
  useEffect(() => {
    const saveScroll = () => {
      window.history.replaceState(
        { ...window.history.state, scrollY: window.scrollY },
        ""
      );
    };
    window.addEventListener("click", saveScroll, { capture: true });
    return () => window.removeEventListener("click", saveScroll, { capture: true });
  }, []);

  // Mark popstate so we know it's back/forward
  useEffect(() => {
    const onPop = () => {
      window.history.replaceState(
        { ...window.history.state, scrollRestored: true },
        ""
      );
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return null;
}

// ── Page wrapper ───────────────────────────────────────────────────────────────
export function PageLayout({ children }: { children: React.ReactNode }) {
  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    const els = document.querySelectorAll(".reveal, .reveal-left");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

// ── Contact form (reused across pages) ────────────────────────────────────────
export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", company: "", service: defaultService, message: "" });
  const [sent, setSent] = useState(false);
  // SERVICES imported at top of file

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `🚀 *Заявка с сайта KONNEKTEAM*\n\n` +
      `👤 Имя: ${form.name}\n📱 Телефон: ${form.phone}\n` +
      `🏢 Компания: ${form.company || "—"}\n🔧 Услуга: ${form.service || "—"}\n💬 ${form.message || "—"}`
    );
    window.open(`${COMPANY.whatsapp}?text=${text}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {[
        { k: "name", label: "Имя *", placeholder: "Иван Иванов", type: "text", req: true },
        { k: "phone", label: "Телефон *", placeholder: "+7 700 000 00 00", type: "tel", req: true },
        { k: "company", label: "Компания", placeholder: 'ТОО "Ваша компания"', type: "text", req: false },
      ].map((f) => (
        <div key={f.k}>
          <label style={{ display: "block", fontFamily: "Montserrat", fontWeight: 600, fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{f.label}</label>
          <input type={f.type} required={f.req} placeholder={f.placeholder}
            value={(form as any)[f.k]}
            onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
            style={{ width: "100%", padding: "13px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", color: "white", fontSize: "15px", outline: "none", fontFamily: "Inter", transition: "border-color 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>
      ))}
      <div>
        <label style={{ display: "block", fontFamily: "Montserrat", fontWeight: 600, fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Услуга</label>
        <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
          style={{ width: "100%", padding: "13px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", color: form.service ? "white" : "var(--text-muted)", fontSize: "15px", outline: "none", fontFamily: "Inter" }}>
          <option value="">Выберите услугу...</option>
          {SERVICES.map((s: any) => <option key={s.slug} value={s.title}>{s.title}</option>)}
        </select>
      </div>
      <div>
        <label style={{ display: "block", fontFamily: "Montserrat", fontWeight: 600, fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Сообщение</label>
        <textarea rows={4} placeholder="Опишите вашу задачу..."
          value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          style={{ width: "100%", padding: "13px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", color: "white", fontSize: "15px", outline: "none", resize: "vertical", fontFamily: "Inter", transition: "border-color 0.3s" }}
          onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border)"}
        />
      </div>
      <button type="submit" className="btn-glow" style={{ width: "100%", marginTop: "4px" }}>
        {sent ? "✓ Открываем WhatsApp..." : "Отправить через WhatsApp"}
      </button>
      <p style={{ color: "var(--text-muted)", fontSize: "11px", textAlign: "center" }}>Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
    </form>
  );
}
