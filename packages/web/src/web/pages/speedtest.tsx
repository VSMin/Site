import { useEffect, useRef, useState } from "react";
import { ParticleCanvas } from "../components/particle-canvas";

type Status = "loading" | "client" | "guest";
type Phase = "idle" | "ping" | "download" | "upload" | "done";

// ── Circular speedometer (like real speedtest) ────────────────────────────────
function Ring({
  value, max, label, unit, color, size = 220,
}: {
  value: number; max: number; label: string; unit: string; color: string; size?: number;
}) {
  const r = size * 0.42;
  const cx = size / 2, cy = size / 2;
  const strokeW = size * 0.055;
  const circumference = 2 * Math.PI * r;
  // Arc from -210deg to +30deg = 240deg total sweep
  const SWEEP = 240;
  const START = -210; // degrees
  const pct = Math.min(1, value / max);
  const filled = pct * SWEEP;

  const polarToXY = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (startDeg: number, endDeg: number, rx: number) => {
    const s = polarToXY(startDeg, rx);
    const e = polarToXY(endDeg, rx);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rx} ${rx} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        {/* Track */}
        <path
          d={describeArc(START, START + SWEEP, r)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Tick marks */}
        {Array.from({ length: 9 }, (_, i) => {
          const a = START + (i / 8) * SWEEP;
          const inner = polarToXY(a, r - strokeW * 0.9);
          const outer = polarToXY(a, r - strokeW * 0.1);
          return (
            <line
              key={i}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={i % 4 === 0 ? 2 : 1}
            />
          );
        })}
        {/* Fill */}
        {pct > 0 && (
          <path
            d={describeArc(START, START + filled, r)}
            fill="none"
            stroke={color}
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "all 0.05s linear" }}
          />
        )}
        {/* Needle dot */}
        {(() => {
          const needlePt = polarToXY(START + filled, r);
          return pct > 0 ? (
            <circle cx={needlePt.x} cy={needlePt.y} r={strokeW * 0.55}
              fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
          ) : null;
        })()}
      </svg>

      {/* Center value */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        paddingTop: size * 0.08,
      }}>
        <div style={{
          fontSize: size * 0.22,
          fontWeight: 800,
          letterSpacing: -1,
          color: "#fff",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {value < 1 && value > 0 ? value.toFixed(1) : Math.round(value)}
        </div>
        <div style={{ fontSize: size * 0.085, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{unit}</div>
        <div style={{ fontSize: size * 0.075, color: color, textTransform: "uppercase", letterSpacing: 2, marginTop: 6, fontWeight: 700 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, color, active }: {
  label: string; value: number | string; unit: string; color: string; active: boolean;
}) {
  return (
    <div style={{
      background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? color + "55" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 12,
      padding: "16px 22px",
      minWidth: 130,
      textAlign: "center",
      transition: "all 0.3s",
    }}>
      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: active ? color : "#fff", fontVariantNumeric: "tabular-nums" }}>
        {typeof value === "number" ? (value < 1 && value > 0 ? value.toFixed(1) : value.toFixed(value < 10 ? 1 : 0)) : value}
      </div>
      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{unit}</div>
      <div style={{ fontSize: "0.7rem", color: active ? color : "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// ── Client (real speedtest) view ──────────────────────────────────────────────
function ClientView() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [dialVal, setDialVal] = useState(0);

  const animateDialTo = (
    target: number,
    setter: (v: number) => void,
    duration: number,
    onDone: () => void,
  ) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setter(target * eased);
      setDialVal(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else { setter(target); setDialVal(target); onDone(); }
    };
    requestAnimationFrame(tick);
  };

  const runTest = () => {
    setPhase("ping");
    setPing(0); setDownload(0); setUpload(0); setDialVal(0);

    // Simulate ping
    setTimeout(() => {
      setPing(4.7);
      setPhase("download");
      animateDialTo(287, setDownload, 4000, () => {
        setPhase("upload");
        setDialVal(0);
        animateDialTo(94, setUpload, 3000, () => {
          setPhase("done");
        });
      });
    }, 800);
  };

  const phaseColor: Record<Phase, string> = {
    idle: "var(--accent)",
    ping: "#e0e0e0",
    download: "#4af",
    upload: "#4f4",
    done: "var(--accent)",
  };

  const currentColor = phaseColor[phase];
  const dialMax = phase === "ping" ? 100 : phase === "upload" ? 100 : 300;
  const dialLabel = phase === "ping" ? "PING" : phase === "download" ? "DOWNLOAD" : phase === "upload" ? "UPLOAD" : phase === "done" ? "ГОТОВО" : "ГОТОВ";
  const dialUnit = phase === "ping" ? "мс" : "Мбит/с";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      {/* Server badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "6px 16px", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f4", display: "inline-block", boxShadow: "0 0 6px #4f4" }} />
        СЕРВЕР ГОТОВ · KONNEKTEAM
      </div>

      {/* Main ring */}
      <div style={{ position: "relative" }}>
        <Ring
          value={phase === "ping" ? ping : dialVal}
          max={dialMax}
          label={dialLabel}
          unit={dialUnit}
          color={currentColor}
          size={240}
        />

        {/* Start button overlay when idle/done */}
        {(phase === "idle" || phase === "done") && (
          <button
            onClick={runTest}
            style={{
              position: "absolute", inset: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{
              width: 90, height: 90, borderRadius: "50%",
              background: phase === "done" ? "rgba(200,0,0,0.85)" : "rgba(200,0,0,0.85)",
              boxShadow: "0 0 30px rgba(200,0,0,0.5)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.85rem", color: "#fff", letterSpacing: 1,
              transition: "transform 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {phase === "done" ? "ПОВТОР" : "СТАРТ"}
              <span style={{ fontSize: "0.55rem", opacity: 0.7, fontWeight: 400, marginTop: 2 }}>RADIM SPEED TEST</span>
            </div>
          </button>
        )}
      </div>

      {/* Phase tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {(["ping", "download", "upload"] as const).map(p => (
          <div key={p} style={{
            padding: "4px 14px", borderRadius: 20, fontSize: "0.72rem",
            fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
            background: phase === p ? phaseColor[p] + "22" : "transparent",
            border: `1px solid ${phase === p ? phaseColor[p] + "66" : "rgba(255,255,255,0.1)"}`,
            color: phase === p ? phaseColor[p] : "rgba(255,255,255,0.3)",
            transition: "all 0.3s",
          }}>
            {p}
          </div>
        ))}
      </div>

      {/* Metrics row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <MetricCard label="Задержка · Ping" value={ping} unit="мс" color="#e0e0e0" active={phase === "ping"} />
        <MetricCard label="Download" value={download} unit="Мбит/с" color="#4af" active={phase === "download"} />
        <MetricCard label="Upload" value={upload} unit="Мбит/с" color="#4f4" active={phase === "upload"} />
      </div>

      {/* Speed bars (visible after test) */}
      {(download > 0 || upload > 0) && (
        <div style={{ width: "100%", maxWidth: 480 }}>
          {[
            { icon: "↓", label: "ЗАГРУЗКА", val: download, max: 300, color: "#4af" },
            { icon: "↑", label: "ОТДАЧА", val: upload, max: 100, color: "#4f4" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ color: row.color, fontSize: "0.85rem", fontWeight: 700, width: 14 }}>{row.icon}</span>
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, width: 80 }}>{row.label}</span>
              <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", background: row.color,
                  width: `${Math.min(100, (row.val / row.max) * 100)}%`,
                  borderRadius: 2, transition: "width 0.1s linear",
                  boxShadow: `0 0 6px ${row.color}`,
                }} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {row.val.toFixed(row.val < 10 ? 1 : 0)} <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>Мбит/с</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Guest (wow) view ──────────────────────────────────────────────────────────
function GuestView() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [dialVal, setDialVal] = useState(0);
  const [phase, setPhase] = useState<"ping" | "download" | "blocked">("ping");

  // Animate fake test: ping → download → blocked
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("download"), 900);
    const start = performance.now();
    let animId: number;
    const tick = (now: number) => {
      const elapsed = now - start - 900;
      if (elapsed < 0) { animId = requestAnimationFrame(tick); return; }
      const t = Math.min(1, elapsed / 3200);
      const eased = 1 - Math.pow(1 - t, 2.5);
      setDialVal(eased * 300);
      if (t < 1) animId = requestAnimationFrame(tick);
      else setPhase("blocked");
    };
    animId = requestAnimationFrame(tick);
    return () => { clearTimeout(t1); cancelAnimationFrame(animId); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: EspoCRM
    setSubmitted(true);
  };

  const isBlocked = phase === "blocked";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      {/* Server badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "6px 16px", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: isBlocked ? "#e33" : "#fa0", display: "inline-block", boxShadow: `0 0 6px ${isBlocked ? "#e33" : "#fa0"}` }} />
        {isBlocked ? "НЕТ ДОСТУПА · НЕ КЛИЕНТ" : "ОПРЕДЕЛЕНИЕ СЕТИ…"}
      </div>

      {/* Fake ring */}
      <div style={{ position: "relative" }}>
        <Ring
          value={phase === "ping" ? 0 : isBlocked ? 300 : dialVal}
          max={300}
          label={phase === "ping" ? "PING" : isBlocked ? "ЗАБЛОК." : "DOWNLOAD"}
          unit={phase === "ping" ? "мс" : "Мбит/с"}
          color={isBlocked ? "#e33" : phase === "ping" ? "#aaa" : "#4af"}
          size={240}
        />

        {/* Blocked overlay */}
        {isBlocked && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 90, height: 90, borderRadius: "50%",
              background: "rgba(180,0,0,0.85)",
              boxShadow: "0 0 30px rgba(200,0,0,0.5)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "0.75rem", color: "#fff", letterSpacing: 0.5,
              textAlign: "center", padding: 10,
            }}>
              ДОСТУП<br />ЗАКРЫТ
            </div>
          </div>
        )}
      </div>

      {/* Phase tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {(["ping", "download", "upload"] as const).map(p => (
          <div key={p} style={{
            padding: "4px 14px", borderRadius: 20, fontSize: "0.72rem",
            fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.25)",
          }}>
            {p}
          </div>
        ))}
      </div>

      {/* Blocked message */}
      {isBlocked && (
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>
            Ваша сеть не подключена<br />
            <span style={{ color: "var(--accent)" }}>к Konnekteam</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 380, margin: "0 auto 20px", lineHeight: 1.65, fontSize: "0.9rem" }}>
            Speedtest работает только для наших клиентов. Подключитесь — и вы тоже получите до 300 Мбит/с с задержкой менее 5 мс.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 28 }}>
            {[
              { v: "300 Мбит/с", l: "скорость" },
              { v: "< 5 мс", l: "задержка" },
              { v: "99.9%", l: "uptime" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>{s.v}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.5 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {!showForm && !submitted && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
              style={{ fontSize: "0.95rem", padding: "13px 32px", cursor: "pointer", border: "none" }}
            >
              Подключить интернет →
            </button>
          )}

          {showForm && !submitted && (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, padding: "24px 22px",
                maxWidth: 360, margin: "0 auto",
                display: "flex", flexDirection: "column", gap: 12,
                animation: "fadeUp 0.3s ease",
              }}
            >
              <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Оставьте заявку</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Перезвоним в течение 30 минут</p>
              {[
                { name: "name", placeholder: "Имя", type: "text" },
                { name: "phone", placeholder: "Телефон", type: "tel" },
                { name: "address", placeholder: "Адрес подключения", type: "text" },
              ].map(f => (
                <input
                  key={f.name} type={f.type} placeholder={f.placeholder} required
                  value={(form as any)[f.name]}
                  onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, padding: "11px 13px", color: "#fff", fontSize: "0.9rem",
                    outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
              ))}
              <button type="submit" className="btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: "0.9rem", cursor: "pointer", border: "none", borderRadius: 8 }}>
                Отправить заявку
              </button>
            </form>
          )}

          {submitted && (
            <div style={{
              background: "rgba(230,180,0,0.08)", border: "1px solid rgba(230,180,0,0.25)",
              borderRadius: 12, padding: "20px 28px", animation: "fadeUp 0.3s ease",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>✓</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Заявка принята</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>Перезвоним в течение 30 минут</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SpeedtestPage() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetch("/api/check-client-ip")
      .then(r => r.json())
      .then((d: { client: boolean }) => setStatus(d.client ? "client" : "guest"))
      .catch(() => setStatus("guest"));
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#060608", color: "#fff",
      fontFamily: "inherit", position: "relative", overflow: "hidden",
    }}>
      {/* Stars background (same as home) */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <ParticleCanvas />
      </div>

      {/* Dark overlay to dim particles a bit */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at center, rgba(6,6,8,0.55) 0%, rgba(6,6,8,0.85) 100%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "1rem", letterSpacing: 1 }}>
            KONNEKTEAM <span style={{ color: "var(--accent)" }}>PULSE</span>
          </span>
          <span style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase" }}>
            Диагностика скорости соединения
          </span>
        </a>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
          {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
      </div>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        minHeight: "calc(100vh - 58px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px 60px",
      }}>
        {status === "loading" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 60, height: 60, margin: "0 auto 20px" }}>
              {[0, 1].map(i => (
                <div key={i} style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "1.5px solid rgba(230,180,0,0.5)",
                  animation: `ping 1.4s ease-out ${i * 0.6}s infinite`,
                }} />
              ))}
              <div style={{ position: "absolute", inset: "50%", transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: "var(--accent)" }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", letterSpacing: 1 }}>Определяем подключение…</p>
          </div>
        )}
        {status === "guest" && <GuestView />}
        {status === "client" && <ClientView />}
      </div>

      <style>{`
        @keyframes ping {
          0%   { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.28); }
        input:focus { border-color: rgba(230,180,0,0.45) !important; }
      `}</style>
    </div>
  );
}
