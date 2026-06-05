// Монохромные линейные иконки услуг (Lucide) в фирменном красном акценте.
// Заменяют эмодзи. Компоненты Lucide — обычные React/SVG, безопасны для SSR/пререндера.

import {
  Globe,
  Network,
  ShieldCheck,
  Cctv,
  Cable,
  Waypoints,
  SearchCheck,
  Server,
  Wifi,
  Router,
  Package,
  Cpu,
  type LucideIcon,
} from "lucide-react";

// Услуга (slug) → иконка.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  internet: Globe,                 // Интернет для бизнеса
  ipvpn: Network,                  // Корпоративные сети IPVPN
  security: ShieldCheck,           // Информационная безопасность
  cctv: Cctv,                      // Видеонаблюдение
  lks: Cable,                      // Проектирование и СКС
  vols: Waypoints,                 // Волоконно-оптические линии (ВОЛС)
  audit: SearchCheck,              // Аудит локальных сетей
  servers: Server,                 // Серверное оборудование
  wifi: Wifi,                      // Wi-Fi сети
  "network-config": Router,        // Настройка сетевого оборудования
  equipment: Package,              // Поставка оборудования
  iot: Cpu,                        // IoT — Интернет вещей
};

// Просто иконка нужного размера в акцентном цвете.
export function ServiceIcon({ slug, size = 26 }: { slug: string; size?: number }) {
  const Icon = SERVICE_ICONS[slug] ?? Globe;
  return <Icon size={size} strokeWidth={1.6} style={{ color: "var(--accent)" }} />;
}

// Иконка в фирменной красной плашке (как акцентные бейджи на сайте).
export function ServiceIconBox({
  slug,
  box = 52,
  size = 26,
}: {
  slug: string;
  box?: number;
  size?: number;
}) {
  return (
    <div
      style={{
        width: box,
        height: box,
        borderRadius: 12,
        background: "rgba(227,30,36,0.1)",
        border: "1px solid rgba(227,30,36,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <ServiceIcon slug={slug} size={size} />
    </div>
  );
}
