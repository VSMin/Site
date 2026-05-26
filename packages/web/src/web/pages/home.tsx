import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { SERVICES, REVIEWS, COMPANY } from "../lib/data";

// ── Particle Network Canvas ────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let mouseX = -9999, mouseY = -9999;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NUM = 60;
    const CONNECT_DIST = 140;
    const MAX_CONNECTIONS = 4;
    const CURSOR_CONNECT_DIST = 180;
    const ATTRACT_RADIUS = 160;
    const MAX_SPEED = 0.3;
    const OVERLOAD_THRESHOLD = 35; // сколько частиц должно быть близко к курсору для взрыва
    const OVERLOAD_RADIUS = 80;    // радиус "перегрузки"

    let lastFrameTime = 0;
    let hidden = false;
    // Состояние взрыва
    let exploding = false;
    let explodeFlash = 0;    // яркость вспышки 0..1
    let explodeCooldown = 0; // кулдаун чтобы не триггерить повторно сразу
    const onVisibility = () => { hidden = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      angle: number;
      angleSpeed: number;
    }

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const particles: Particle[] = Array.from({ length: NUM }, () => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.15, 0.15),
      r: rand(1.2, 2.8),
      alpha: rand(0.35, 0.75),
      angle: rand(0, Math.PI * 2),
      angleSpeed: rand(-0.008, 0.008),
    }));

    // Функция взрыва — частицы разлетаются от точки курсора
    const triggerExplosion = () => {
      exploding = true;
      explodeFlash = 1.0;
      explodeCooldown = 180; // ~3 секунды при 60fps
      for (const p of particles) {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const power = rand(4, 9);
        p.vx = (dx / dist) * power + rand(-1, 1);
        p.vy = (dy / dist) * power + rand(-1, 1);
        // Сбиваем угол блуждания чтобы разлетелись хаотично
        p.angle = rand(0, Math.PI * 2);
      }
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const src = "touches" in e ? e.touches[0] : e;
      mouseX = src.clientX - rect.left;
      mouseY = src.clientY - rect.top;
    };
    const onLeave = () => { mouseX = -9999; mouseY = -9999; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    // Also track on the parent section so hero text doesn't block events
    const section = canvas.parentElement;
    if (section) {
      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);
    }

    const draw = (now: number) => {
      // Пауза когда вкладка скрыта
      if (hidden) { animId = requestAnimationFrame(draw); return; }

      // Throttle: не больше 60fps, пропускаем если кадр занял > 50ms
      const delta = now - lastFrameTime;
      if (delta < 16) { animId = requestAnimationFrame(draw); return; }
      lastFrameTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Кулдаун после взрыва
      if (explodeCooldown > 0) explodeCooldown--;

      // Детект перегрузки: считаем частицы близко к курсору
      if (!exploding && explodeCooldown === 0 && mouseX !== -9999) {
        let near = 0;
        for (const p of particles) {
          const dx = p.x - mouseX, dy = p.y - mouseY;
          if (dx * dx + dy * dy < OVERLOAD_RADIUS * OVERLOAD_RADIUS) near++;
        }
        if (near >= OVERLOAD_THRESHOLD) triggerExplosion();
      }

      // Затухание вспышки
      if (explodeFlash > 0) {
        explodeFlash = Math.max(0, explodeFlash - 0.04);
        // Рисуем вспышку — радиальный градиент от точки курсора
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
        grd.addColorStop(0, `rgba(227,30,36,${explodeFlash * 0.7})`);
        grd.addColorStop(0.4, `rgba(227,30,36,${explodeFlash * 0.15})`);
        grd.addColorStop(1, "rgba(227,30,36,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (explodeFlash === 0) exploding = false;
      }

      const currentMaxSpeed = exploding ? 12 : MAX_SPEED;

      for (const p of particles) {
        // 1. Wander: slowly rotate desired direction
        p.angle += p.angleSpeed + rand(-0.003, 0.003);

        // 2. Gentle wander force (не во время взрыва)
        if (!exploding) {
          p.vx += Math.cos(p.angle) * 0.012;
          p.vy += Math.sin(p.angle) * 0.012;
        }

        // 3. Cursor attraction (только если нет взрыва и кулдаун прошёл)
        if (!exploding && explodeCooldown === 0) {
          const cdx = mouseX - p.x, cdy = mouseY - p.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < ATTRACT_RADIUS && cdist > 0) {
            const force = ((ATTRACT_RADIUS - cdist) / ATTRACT_RADIUS) * 0.18;
            p.vx += (cdx / cdist) * force;
            p.vy += (cdy / cdist) * force;
          }
        }

        // 4. Speed cap + damping
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > currentMaxSpeed) {
          p.vx = (p.vx / spd) * currentMaxSpeed;
          p.vy = (p.vy / spd) * currentMaxSpeed;
        }
        if (!exploding && spd < 0.08) {
          p.vx += Math.cos(p.angle) * 0.05;
          p.vy += Math.sin(p.angle) * 0.05;
        }
        // После взрыва — сильнее тормозим чтобы плавно успокоились
        p.vx *= exploding ? 0.97 : 0.992;
        p.vy *= exploding ? 0.97 : 0.992;

        p.x += p.vx;
        p.y += p.vy;

        // 5. Soft wrap (appear on other side)
        const margin = 20;
        if (p.x < -margin) p.x = canvas.width + margin;
        else if (p.x > canvas.width + margin) p.x = -margin;
        if (p.y < -margin) p.y = canvas.height + margin;
        else if (p.y > canvas.height + margin) p.y = -margin;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227,30,36,${p.alpha})`;
        ctx.fill();
      }

      // Connections between particles — ограничиваем MAX_CONNECTIONS на частицу
      const connCount = new Int8Array(particles.length); // счётчик соединений
      for (let i = 0; i < particles.length; i++) {
        if (connCount[i] >= MAX_CONNECTIONS) continue;
        for (let j = i + 1; j < particles.length; j++) {
          if (connCount[i] >= MAX_CONNECTIONS) break;
          if (connCount[j] >= MAX_CONNECTIONS) continue;
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy; // избегаем sqrt до проверки порога
          if (dist2 < CONNECT_DIST * CONNECT_DIST) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(227,30,36,${t * t * 0.35})`;
            ctx.lineWidth = t * 1.2;
            ctx.stroke();
            connCount[i]++;
            connCount[j]++;
          }
        }
      }

      // Cursor connections
      if (mouseX !== -9999) {
        for (const p of particles) {
          const dx = mouseX - p.x, dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_CONNECT_DIST) {
            const t = 1 - dist / CURSOR_CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(227,30,36,${t * 0.75})`;
            ctx.lineWidth = t * 1.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(227,30,36,0.9)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      if (section) {
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        display: "block", pointerEvents: "none",
      }}
    />
  );
}

// ── FAQ Data ───────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Работаете ли вы для малого бизнеса?", a: "Да, мы работаем с бизнесом любого масштаба — от ИП до крупных корпораций. Решения адаптируем под бюджет и задачи." },
  { q: "Как быстро выезжает специалист?", a: "В большинстве случаев — в течение 2–4 часов по Уральску. Для экстренных ситуаций доступен выезд в день обращения." },
  { q: "Даёте ли гарантию на работы?", a: "Да. На все выполненные работы предоставляем гарантию от 6 до 24 месяцев в зависимости от вида услуги." },
  { q: "Можно ли заключить договор на обслуживание?", a: "Конечно. Мы предлагаем ежемесячное и годовое IT-сопровождение с фиксированной стоимостью и приоритетным реагированием." },
  { q: "Работаете с оборудованием любых производителей?", a: "Да — MikroTik, Hikvision, Gigabyte, Cisco, HP, Dell, Lenovo, Dahua и другие. Наши специалисты сертифицированы по основным вендорам." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={ref} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 0" }}>
      <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "1.05rem", color: "#fff", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {q}
        <span style={{ color: "var(--accent)", fontSize: "1.4rem", lineHeight: 1 }}>+</span>
      </summary>
      <p style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{a}</p>
    </details>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <PageLayout>
      <SEO
        title="IT-услуги в Уральске"
        description="KONNEKTEAM — профессиональные IT-услуги в Уральске: интернет, сети, видеонаблюдение, информационная безопасность, СКУД, автоматизация и многое другое. Выезд за 2 часа."
        keywords="IT услуги Уральск, интернет, компьютерная помощь Уральск, видеонаблюдение Уральск, настройка сети Уральск"
        canonical="https://konnekteam.kz/"
      />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#0A0A0A" }}>
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
            { num: "10+", label: "лет на рынке" },
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
                    <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{s.icon}</div>
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
              { icon: "⚡", title: "Быстрый выезд", desc: "Специалист приедет в течение 2–4 часов по Уральску" },
              { icon: "🛡️", title: "Гарантия качества", desc: "На все работы — гарантия от 6 до 24 месяцев" },
              { icon: "🔧", title: "Полный цикл", desc: "Проектирование, монтаж, настройка и дальнейшее сопровождение" },
              { icon: "💼", title: "Опыт 10+ лет", desc: "Реализовали более 350 проектов разного масштаба" },
              { icon: "📞", title: "Техподдержка 24/7", desc: "Всегда на связи — звонок, WhatsApp или электронная почта" },
              { icon: "📋", title: "Договор и отчёты", desc: "Официальный договор, акты выполненных работ, гарантии" },
            ].map(w => (
              <div key={w.title} className="card">
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{w.icon}</div>
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
              📞 {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
