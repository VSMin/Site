import { useEffect, useRef, useState } from "react";

type Status = "loading" | "client" | "guest";

// ── Animated network grid background ─────────────────────────────────────────
function NetworkGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      pulse: number; pulseSpeed: number;
    }
    const NODES = 55;
    const nodes: Node[] = Array.from({ length: NODES }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    const MAX_DIST = 160;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // move
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(230,180,0,${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        const r = 2.5 + Math.sin(n.pulse) * 1.2;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        glow.addColorStop(0, "rgba(230,180,0,0.6)");
        glow.addColorStop(1, "rgba(230,180,0,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(230,180,0,0.9)";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.45 }}
    />
  );
}

// ── Pulsing ring loader ───────────────────────────────────────────────────────
function PulseRing() {
  return (
    <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 32px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "2px solid rgba(230,180,0,0.6)",
          animation: `ping 1.6s ease-out ${i * 0.5}s infinite`,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: "50%", transform: "translate(-50%,-50%)",
        width: 20, height: 20, borderRadius: "50%",
        background: "var(--accent)",
        boxShadow: "0 0 20px var(--accent)",
      }} />
    </div>
  );
}

// ── Speedometer SVG ───────────────────────────────────────────────────────────
function Speedometer({ value }: { value: number }) {
  // value 0–100 maps to arc from -135deg to +135deg
  const angle = -135 + (value / 100) * 270;
  const rad = (a: number) => (a * Math.PI) / 180;
  const cx = 100, cy = 100, r = 70;
  const needleX = cx + r * 0.85 * Math.cos(rad(angle));
  const needleY = cy + r * 0.85 * Math.sin(rad(angle));

  const arcPath = (start: number, end: number) => {
    const s = rad(start), e = rad(end);
    return `M ${cx + r * Math.cos(s)} ${cy + r * Math.sin(s)} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${cx + r * Math.cos(e)} ${cy + r * Math.sin(e)}`;
  };

  return (
    <svg width="200" height="130" viewBox="0 0 200 130">
      {/* track */}
      <path d={arcPath(-135, 135)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
      {/* fill */}
      <path d={arcPath(-135, angle)} fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px var(--accent))" }} />
      {/* needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY}
        stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="white" />
      {/* ticks */}
      {[0, 25, 50, 75, 100].map(v => {
        const a = rad(-135 + (v / 100) * 270);
        return (
          <line key={v}
            x1={cx + (r - 12) * Math.cos(a)} y1={cy + (r - 12) * Math.sin(a)}
            x2={cx + (r - 4) * Math.cos(a)} y2={cy + (r - 4) * Math.sin(a)}
            stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

// ── Guest block ───────────────────────────────────────────────────────────────
function GuestView() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [needle, setNeedle] = useState(0);
  const [fakeSpeed, setFakeSpeed] = useState(0);

  // animate speedometer to ~85 to tease "you could have this"
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 1.2;
      if (v >= 87) { clearInterval(id); return; }
      setNeedle(v);
      setFakeSpeed(Math.round(v * 10.5));
    }, 18);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to EspoCRM
    setSubmitted(true);
  };

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>

      {/* eyebrow */}
      <div style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: 3, textTransform: "uppercase", marginBottom: 24, opacity: 0.9 }}>
        Speedtest · Konnekteam
      </div>

      {/* speedometer */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Speedometer value={needle} />
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", fontSize: "2rem", fontWeight: 800, letterSpacing: -1, color: "#fff", whiteSpace: "nowrap" }}>
          {fakeSpeed} <span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.5 }}>Мбит/с</span>
        </div>
      </div>

      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginBottom: 40 }}>
        Такую скорость получают клиенты Konnekteam
      </p>

      {/* headline */}
      <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, maxWidth: 520 }}>
        Ваша сеть пока<br />
        <span style={{ color: "var(--accent)" }}>не подключена к нам</span>
      </h1>

      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 420, marginBottom: 36 }}>
        Speedtest работает только внутри нашей сети. Хотите знать, насколько быстрым может быть ваш интернет?
      </p>

      {/* stats row */}
      <div style={{ display: "flex", gap: 32, marginBottom: 44, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { v: "до 1 Гбит/с", l: "скорость" },
          { v: "< 5 мс", l: "задержка" },
          { v: "99.9%", l: "uptime" },
        ].map(s => (
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{s.v}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1.5 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ fontSize: "1rem", padding: "14px 36px", cursor: "pointer", border: "none" }}
        >
          Подключить интернет →
        </button>
      )}

      {/* form */}
      {showForm && !submitted && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "32px 28px",
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            backdropFilter: "blur(12px)",
            animation: "fadeUp 0.35s ease",
          }}
        >
          <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: 700 }}>Оставьте заявку</h3>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>Свяжемся в течение 30 минут</p>

          {[
            { name: "name", placeholder: "Имя", type: "text" },
            { name: "phone", placeholder: "Телефон", type: "tel" },
            { name: "address", placeholder: "Адрес подключения", type: "text" },
          ].map(f => (
            <input
              key={f.name}
              type={f.type}
              placeholder={f.placeholder}
              required
              value={(form as any)[f.name]}
              onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          ))}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "13px", fontSize: "0.95rem", cursor: "pointer", border: "none", borderRadius: 8 }}
          >
            Отправить заявку
          </button>
        </form>
      )}

      {submitted && (
        <div style={{
          background: "rgba(230,180,0,0.1)",
          border: "1px solid rgba(230,180,0,0.3)",
          borderRadius: 16, padding: "28px 36px",
          animation: "fadeUp 0.35s ease",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>✓</div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 6 }}>Заявка принята</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Перезвоним в течение 30 минут</div>
        </div>
      )}
    </div>
  );
}

// ── Client block ──────────────────────────────────────────────────────────────
function ClientView() {
  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>
        Speedtest · Konnekteam
      </div>
      <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: 16 }}>
        Проверьте скорость подключения
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 420, marginBottom: 36, lineHeight: 1.7 }}>
        Тест подключается напрямую к нашему серверу — вы видите реальную скорость именно вашего соединения.
      </p>
      <a
        href="https://speedtest.konnekteam.kz/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ textDecoration: "none", display: "inline-block", fontSize: "1rem", padding: "14px 36px" }}
      >
        Запустить тест скорости →
      </a>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SpeedtestPage() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetch("/api/check-client-ip")
      .then(r => r.json())
      .then((d: { client: boolean }) => setStatus(d.client ? "client" : "guest"))
      .catch(() => setStatus("guest"));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#fff", fontFamily: "inherit", position: "relative", overflow: "hidden" }}>
      <NetworkGrid />

      {/* vignette */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at center, transparent 30%, #0A0A0A 100%)", pointerEvents: "none" }} />

      {status === "loading" && (
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <PulseRing />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Определяем подключение…</p>
        </div>
      )}

      {status === "guest" && <GuestView />}
      {status === "client" && <ClientView />}

      <style>{`
        @keyframes ping {
          0% { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(230,180,0,0.5) !important; }
      `}</style>
    </div>
  );
}
