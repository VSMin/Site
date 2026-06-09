// Билдеры структурированных данных Schema.org (JSON-LD) для страниц.
// Чистые функции без DOM — безопасны и в SSR, и в браузере.
// Возвращают массив объектов; <SEO jsonLd={...}> впечатывает их в <head>.

import { COMPANY, REVIEWS, SERVICES } from "./data";

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

// ── Главная: Organization + LocalBusiness + WebSite (+ опц. FAQPage) ──────────
// Эмитится на главной странице. Даёт поисковикам и ИИ-ассистентам полную
// машиночитаемую «карточку компании»: контакты, гео, часы, рейтинг, услуги.
export function homeJsonLd(opts?: { faq?: { q: string; a: string }[] }): object[] {
  // Рейтинг считаем из реальных отзывов (REVIEWS) — без выдуманных чисел.
  const ratings = REVIEWS.map((r) => r.stars).filter((n) => typeof n === "number");
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const business = {
    "@context": "https://schema.org",
    ...BUSINESS,
    "@type": ["Organization", "LocalBusiness"],
    legalName: COMPANY.fullName,
    description:
      "IT-компания в Уральске с 2010 года: интернет для бизнеса, видеонаблюдение, " +
      "информационная безопасность, корпоративные сети, СКС, ВОЛС, серверы и Wi-Fi. " +
      "Более 350 проектов, выезд за 2–4 часа, техподдержка 24/7.",
    foundingDate: String(COMPANY.foundedYear),
    image: `${SITE}/og-image.png`,
    logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    areaServed: AREA_SERVED,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.2333,
      longitude: 51.3667,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [COMPANY.instagram, COMPANY.twoGisUrl].filter(Boolean),
    ...(ratings.length
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(1),
            reviewCount: ratings.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        url: `${SITE}/services/${s.slug}`,
      },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: COMPANY.name,
    inLanguage: "ru",
    publisher: { "@id": `${SITE}/#business` },
  };

  const nodes: object[] = [business, website];

  if (opts?.faq && opts.faq.length > 0) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: opts.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return nodes;
}

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
