import { useState } from "react";
import { SEO, PageLayout } from "../components/layout";

const QUESTIONS = [
  {
    id: "q1",
    label: "Кейс 1. Клиент отказывает «Нам ничего не нужно»",
    question:
      "Вы звоните директору производственной компании с предложением подключить корпоративный интернет с резервированием. Он говорит: «У нас уже всё есть, не тратьте моё время». Как вы продолжите разговор? Опишите ваши слова и логику.",
  },
  {
    id: "q2",
    label: "Кейс 2. Конкурент дешевле",
    question:
      "На финальных переговорах клиент говорит: «Ваши конкуренты предлагают то же самое на 20% дешевле. Почему я должен платить больше?» Что вы ответите и как обоснуете цену?",
  },
  {
    id: "q3",
    label: "Кейс 3. Затяжное согласование",
    question:
      "Сделка тянется 3 месяца: клиент говорит «подумаем», переносит встречи, не отвечает на письма. Счёт на 2 млн тенге. Как вы ускорите закрытие? Опишите конкретные шаги.",
  },
  {
    id: "q4",
    label: "Кейс 4. Несколько лиц, принимающих решение",
    question:
      "В компании клиента решение принимают: IT-директор (против смены провайдера), финансовый директор (хочет снизить затраты) и генеральный (нейтрален). Как выстроите работу с каждым из них?",
  },
  {
    id: "q5",
    label: "Кейс 5. Жалоба во время переговоров",
    question:
      "В середине презентации клиент говорит: «Я слышал, у вас были проблемы с интернетом у компании X — они неделю сидели без связи». Это правда. Как реагируете?",
  },
  {
    id: "q6",
    label: "Кейс 6. Бюджет не утверждён",
    question:
      "Клиент заинтересован, готов подписать, но говорит: «Бюджет на IT заморожен до следующего квартала». До конца месяца вам нужно закрыть план. Что делаете?",
  },
  {
    id: "q7",
    label: "Кейс 7. Тендер с подводными камнями",
    question:
      "Вы участвуете в тендере, но по условиям явно видно, что ТЗ написано под конкурента: требования очень специфичны. Участвуете или нет? Если да — как действуете?",
  },
  {
    id: "q8",
    label: "Кейс 8. Клиент хочет «попробовать»",
    question:
      "Крупный клиент говорит: «Давайте начнём с одного офиса, посмотрим — и тогда подключим все 5». Для вас выгодно сразу подключить всё. Как убедите его не дробить сделку?",
  },
  {
    id: "q9",
    label: "Кейс 9. Потерянный клиент",
    question:
      "Год назад клиент ушёл к конкуренту из-за технической проблемы. Сейчас у конкурента снова сбои. Вы звоните клиенту. Как начинаете разговор и что предлагаете?",
  },
  {
    id: "q10",
    label: "Кейс 10. Ваш реальный опыт",
    question:
      "Опишите самую сложную сделку в вашей практике: что было сложно, как вы её закрыли или почему не закрыли. Что вы из этого вынесли?",
  },
];

type Step = "info" | "questionnaire" | "success";

const SECRET_RESUME_URL = "hh.kz/konnekteam!";

function validateHHUrl(url: string): boolean {
  if (url.trim() === SECRET_RESUME_URL) return true;
  try {
    const u = new URL(url);
    return (
      (u.hostname === "hh.kz" || u.hostname === "www.hh.kz") &&
      u.pathname.includes("resume")
    );
  } catch {
    return false;
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\+]/g, "");
}

function validatePhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^(7|8)\d{10}$/.test(normalized);
}

export default function VacancyPage() {
  const [step, setStep] = useState<Step>("info");
  const [current, setCurrent] = useState(0);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [info, setInfo] = useState({ name: "", phone: "", resume: "" });
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, ""]))
  );

  const accent = "var(--accent, #00C8FF)";

  // --- Step 1 validation ---
  function validateInfo() {
    const e: Record<string, string> = {};
    if (!info.name.trim() || info.name.trim().split(" ").length < 2)
      e.name = "Введите полное ФИО (минимум два слова)";
    if (!validatePhone(info.phone))
      e.phone = "Введите корректный казахстанский номер";
    if (!validateHHUrl(info.resume))
      e.resume = "Ссылка должна быть на резюме hh.kz (например: https://hh.kz/resume/...)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleInfoNext() {
    if (validateInfo()) setStep("questionnaire");
  }

  // --- Answer change ---
  function handleAnswer(id: string, val: string) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }

  // --- Navigation ---
  function handleNext() {
    if (answers[QUESTIONS[current].id].trim().length < 20) {
      setErrors({ [QUESTIONS[current].id]: "Пожалуйста, дайте развёрнутый ответ (минимум 20 символов)" });
      return;
    }
    setErrors({});
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrev() {
    setErrors({});
    if (current > 0) setCurrent((c) => c - 1);
    else setStep("info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- Submit ---
  async function handleSubmit() {
    const last = answers[QUESTIONS[current].id];
    if (last.trim().length < 20) {
      setErrors({ [QUESTIONS[current].id]: "Пожалуйста, дайте развёрнутый ответ (минимум 20 символов)" });
      return;
    }
    setErrors({});
    setSending(true);

    const body =
      `ФИО: ${info.name}\nТелефон: ${normalizePhone(info.phone)}\nРезюме: ${info.resume}\n\n` +
      QUESTIONS.map((q, i) => `${i + 1}. ${q.label}\nВопрос: ${q.question}\nОтвет: ${answers[q.id]}`).join("\n\n---\n\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "c8e1f0a3-5b2d-4e7f-a9c1-2d3e4f5a6b7c", // placeholder — replace with real key
          subject: `Анкета кандидата — Менеджер B2B: ${info.name}`,
          from_name: info.name,
          replyto: "noreply@konnekteam.kz",
          to: "sales@konnekteam.kz",
          message: body,
        }),
      });
      if (res.ok) {
        setStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("Ошибка отправки. Попробуйте ещё раз.");
      }
    } catch {
      alert("Нет соединения. Проверьте интернет и попробуйте снова.");
    } finally {
      setSending(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  const errorStyle: React.CSSProperties = {
    color: "#ff6b6b",
    fontSize: "0.82rem",
    marginTop: 6,
  };

  const progress = step === "info" ? 0 : ((current + 1) / QUESTIONS.length) * 100;

  return (
    <PageLayout>
      <SEO
        title="Вакансия — Менеджер по продажам B2B"
        description="Открытая вакансия в KONNEKTEAM: менеджер по продажам B2B. Пройдите анкету — ответьте на 10 кейсов из реальной практики продаж."
        keywords="вакансия менеджер продаж B2B Уральск, KONNEKTEAM работа, IT продажи Казахстан"
        canonical="https://konnekteam.kz/vacancy"
      />

      {/* Hero */}
      <section
        style={{
          paddingTop: 140,
          paddingBottom: 60,
          paddingLeft: 24,
          paddingRight: 24,
          background: "#0A0A0A",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: accent,
            fontSize: "0.85rem",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Карьера в KONNEKTEAM
        </div>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          Менеджер по продажам B2B
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            maxWidth: 560,
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Уральск · Офис / выезды · Полная занятость
        </p>

        {/* Job info pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 0,
          }}
        >
          {["Оклад + %", "KPI-бонусы", "Корпоративная связь", "Обучение продуктам"].map((t) => (
            <span
              key={t}
              style={{
                background: "rgba(0,200,255,0.08)",
                border: "1px solid rgba(0,200,255,0.2)",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: "0.85rem",
                color: accent,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section
        style={{ padding: "0 24px 100px", background: "#0A0A0A" }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Progress bar */}
          {step !== "success" && (
            <div style={{ marginBottom: 40 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 8,
                }}
              >
                <span>
                  {step === "info"
                    ? "Шаг 1 из 2 — Ваши данные"
                    : `Шаг 2 из 2 — Кейс ${current + 1} из ${QUESTIONS.length}`}
                </span>
                <span>{step === "info" ? "0%" : `${Math.round(progress)}%`}</span>
              </div>
              <div
                style={{
                  height: 4,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: step === "info" ? "2%" : `${progress}%`,
                    background: accent,
                    borderRadius: 2,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* ===== STEP 1: Personal Info ===== */}
          {step === "info" && (
            <div>
              <h2
                style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}
              >
                Ваши контактные данные
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                Перед прохождением анкеты заполните данные о себе. Ссылка на
                резюме нужна для первичной проверки опыта.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    ФИО *
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: errors.name
                        ? "#ff6b6b"
                        : "rgba(255,255,255,0.15)",
                    }}
                    placeholder="Иванов Иван Иванович"
                    value={info.name}
                    onChange={(e) =>
                      setInfo((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  {errors.name && <div style={errorStyle}>{errors.name}</div>}
                </div>

                {/* Phone */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Телефон *
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone
                        ? "#ff6b6b"
                        : "rgba(255,255,255,0.15)",
                    }}
                    placeholder="+7 700 000 00 00"
                    value={info.phone}
                    onChange={(e) =>
                      setInfo((p) => ({ ...p, phone: e.target.value }))
                    }
                    type="tel"
                  />
                  {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                </div>

                {/* Resume */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Ссылка на резюме на hh.kz *
                  </label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: errors.resume
                        ? "#ff6b6b"
                        : "rgba(255,255,255,0.15)",
                    }}
                    placeholder="https://hh.kz/resume/xxxxxxxxxxxxxxxx"
                    value={info.resume}
                    onChange={(e) =>
                      setInfo((p) => ({ ...p, resume: e.target.value }))
                    }
                    type="url"
                  />
                  {errors.resume && (
                    <div style={errorStyle}>{errors.resume}</div>
                  )}
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Убедитесь, что резюме открыто по ссылке без авторизации
                  </div>
                </div>

                <button
                  onClick={handleInfoNext}
                  style={{
                    marginTop: 12,
                    padding: "16px 32px",
                    background: accent,
                    color: "#000",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                >
                  Далее — Пройти анкету →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Questions ===== */}
          {step === "questionnaire" && (
            <div>
              <div
                style={{
                  background: "rgba(0,200,255,0.05)",
                  border: "1px solid rgba(0,200,255,0.15)",
                  borderRadius: 14,
                  padding: "28px 28px 32px",
                }}
              >
                <div
                  style={{
                    color: accent,
                    fontSize: "0.8rem",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 16,
                    fontWeight: 600,
                  }}
                >
                  {QUESTIONS[current].label}
                </div>
                <p
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 28,
                  }}
                >
                  {QUESTIONS[current].question}
                </p>

                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: 180,
                    resize: "vertical",
                    borderColor: errors[QUESTIONS[current].id]
                      ? "#ff6b6b"
                      : "rgba(255,255,255,0.15)",
                  }}
                  placeholder="Опишите ваши действия, слова и логику подробно..."
                  value={answers[QUESTIONS[current].id]}
                  onChange={(e) =>
                    handleAnswer(QUESTIONS[current].id, e.target.value)
                  }
                />
                {errors[QUESTIONS[current].id] && (
                  <div style={errorStyle}>
                    {errors[QUESTIONS[current].id]}
                  </div>
                )}
                <div
                  style={{
                    marginTop: 6,
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {answers[QUESTIONS[current].id].length} символов
                </div>
              </div>

              {/* Navigation */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 24,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={handlePrev}
                  style={{
                    padding: "14px 24px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                >
                  ← Назад
                </button>

                {current < QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: "14px 32px",
                      background: accent,
                      color: "#000",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    Следующий кейс →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    style={{
                      padding: "14px 32px",
                      background: sending ? "rgba(0,200,255,0.4)" : accent,
                      color: "#000",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: "1rem",
                      cursor: sending ? "not-allowed" : "pointer",
                    }}
                  >
                    {sending ? "Отправка..." : "Отправить анкету ✓"}
                  </button>
                )}
              </div>

              {/* Dots */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  justifyContent: "center",
                  marginTop: 24,
                  flexWrap: "wrap",
                }}
              >
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background:
                        i < current
                          ? accent
                          : i === current
                          ? "#fff"
                          : "rgba(255,255,255,0.2)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ===== SUCCESS ===== */}
          {step === "success" && (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 24 }}>✅</div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                Анкета отправлена!
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.7,
                  maxWidth: 480,
                  margin: "0 auto 32px",
                }}
              >
                Мы получили ваши ответы и свяжемся с вами по номеру{" "}
                <strong style={{ color: "#fff" }}>{info.phone}</strong> в
                течение 3 рабочих дней. Удачи, {info.name.split(" ")[0]}!
              </p>
              <a
                href="/"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  background: accent,
                  color: "#000",
                  borderRadius: 10,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "1rem",
                }}
              >
                На главную
              </a>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
