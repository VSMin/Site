import { useRoute, Link } from "wouter";
import { SEO, PageLayout } from "../components/layout";
import { BLOG_POSTS } from "../lib/data";

function BlogList() {
  return (
    <PageLayout>
      <SEO
        title="Блог"
        description="Полезные статьи об IT-технологиях, советы по настройке сетей, видеонаблюдению и кибербезопасности от специалистов KONNEKTEAM."
        keywords="IT блог Уральск, статьи по IT, советы по безопасности, настройка сети"
        canonical="https://konnekteam.kz/blog"
      />

      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, background: "#0A0A0A", textAlign: "center" }}>
        <div style={{ color: "var(--accent)", fontSize: "0.85rem", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Материалы</div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 20 }}>Блог</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          Полезные статьи, советы и кейсы от наших специалистов.
        </p>
      </section>

      <section style={{ padding: "40px 24px 100px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 28 }}>
          {BLOG_POSTS.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <a style={{ textDecoration: "none" }}>
                <article
                  className="card"
                  style={{ height: "100%", transition: "transform 0.2s, border-color 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(227,30,36,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  {post.image && (
                    <div style={{ height: 180, marginBottom: 20, borderRadius: 6, overflow: "hidden", background: "rgba(227,30,36,0.08)" }}>
                      {typeof post.image === "string" ? (
                        <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "3rem" }}>{post.emoji || "📝"}</div>
                      )}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(227,30,36,0.1)", border: "1px solid rgba(227,30,36,0.2)", borderRadius: 4, padding: "2px 10px", fontSize: "0.75rem", color: "var(--accent)" }}>
                      {post.category}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", display: "flex", alignItems: "center" }}>{post.date}</span>
                  </div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 12, color: "#fff", lineHeight: 1.4 }}>{post.title}</h2>
                  <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontSize: "0.9rem", marginBottom: 20 }}>{post.excerpt}</p>
                  <div style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>Читать статью →</div>
                </article>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}

function BlogPost({ slug }: { slug: string }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <PageLayout>
        <SEO title="Статья не найдена" description="Статья не найдена." />
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <h1>404 — Статья не найдена</h1>
          <Link href="/blog"><a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>← Блог</a></Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.title}, ${post.category}, IT Уральск`}
        canonical={`https://konnekteam.kz/blog/${post.slug}`}
      />

      <section style={{ paddingTop: 120, paddingBottom: 0, paddingLeft: 24, paddingRight: 24, background: "#0A0A0A" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: 40, flexWrap: "wrap" }}>
            <Link href="/"><a style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Главная</a></Link>
            <span>/</span>
            <Link href="/blog"><a style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Блог</a></Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>{post.title}</span>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ background: "rgba(227,30,36,0.1)", border: "1px solid rgba(227,30,36,0.2)", borderRadius: 4, padding: "4px 12px", fontSize: "0.8rem", color: "var(--accent)" }}>
              {post.category}
            </span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{post.date}</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>· {post.readTime} мин чтения</span>

          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, marginBottom: 32, lineHeight: 1.2 }}>{post.title}</h1>
        </div>
      </section>

      <section style={{ padding: "0 24px 100px", background: "#0A0A0A" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/blog">
              <a style={{ textDecoration: "none", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
                ← Все статьи
              </a>
            </Link>
            <Link href="/contacts">
              <a className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Задать вопрос специалисту</a>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default function BlogPage() {
  const [matchPost, params] = useRoute("/blog/:slug");
  if (matchPost && params?.slug) {
    return <BlogPost slug={params.slug} />;
  }
  return <BlogList />;
}
