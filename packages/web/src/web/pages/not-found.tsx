import { Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";

export default function NotFoundPage() {
  return (
    <PageLayout>
      <SEO title="Страница не найдена" description="Запрашиваемая страница не существует." />
      <section style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: "6rem", fontWeight: 900, color: "var(--accent)", lineHeight: 1, marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 16 }}>Страница не найдена</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.7, marginBottom: 36 }}>
          Возможно, ссылка устарела или страница была перемещена.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/">
            <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>На главную</a>
          </Link>
          <Link href="/contacts">
            <a style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              Связаться с нами
            </a>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
