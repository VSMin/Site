// Билдеры структурированных данных Schema.org (JSON-LD) для страниц.
// Чистые функции без DOM — безопасны и в SSR, и в браузере.
// Возвращают массив объектов; <SEO jsonLd={...}> впечатывает их в <head>.

import { COMPANY } from "./data";

const SITE = "https://konnekteam.kz";

// Узел организации — переиспользуется как provider/publisher.
const BUSINESS = {
  "@type": "LocalBusiness",
  "@id": `${SITE}/#business`,
  name: COMPANY.name,
  url: SITE,
  telephone: "+77000981981",
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. А. Тайманова 162/2",
    addressLocality: COMPANY.city,
    addressRegion: COMPANY.region,
    addressCountry: "KZ",
  },
};

const AREA_SERVED = [
  { "@type": "City", name: "Уральск" },
  { "@type": "AdministrativeArea", name: "Западно-Казахстанская область" },
];

// ── Русская дата ("16 декабря 2025") → ISO ("2025-12-16") ─────────────────────
const MONTHS: Record<string, string> = {
  января: "01", февраля: "02", марта: "03", апреля: "04",
  мая: "05", июня: "06", июля: "07", августа: "08",
  сентября: "09", октября: "10", ноября: "11", декабря: "12",
};

function toISODate(ru: string): string | undefined {
  const m = ru.trim().match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4})$/i);
  if (!m) return undefined;
  const month = MONTHS[m[2].toLowerCase()];
  if (!month) return undefined;
  return `${m[3]}-${month}-${m[1].padStart(2, "0")}`;
}

// ── Страница услуги: Service + BreadcrumbList + FAQPage ───────────────────────
interface ServiceLike {
  slug: string;
  title: string;
  shortDesc: string;
  category: string;
  faq?: { q: string; a: string }[];
}

export function serviceJsonLd(service: ServiceLike): object[] {
  const url = `${SITE}/services/${service.slug}`;

  const nodes: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.shortDesc,
      serviceType: service.category,
      provider: BUSINESS,
      areaServed: AREA_SERVED,
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Услуги", item: `${SITE}/services` },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ],
    },
  ];

  if (service.faq && service.faq.length > 0) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return nodes;
}

// ── Статья блога: BlogPosting + BreadcrumbList ───────────────────────────────
interface PostLike {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string | unknown;
}

export function articleJsonLd(post: PostLike): object[] {
  const url = `${SITE}/blog/${post.slug}`;
  const iso = toISODate(post.date);
  const image =
    typeof post.image === "string" ? SITE + post.image : `${SITE}/og-image.png`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image,
      ...(iso ? { datePublished: iso, dateModified: iso } : {}),
      author: { "@type": "Organization", name: COMPANY.name, url: SITE },
      publisher: {
        "@type": "Organization",
        name: COMPANY.name,
        logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
}
