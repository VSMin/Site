# konnekteam.kz

Сайт ТОО «KONNEKTEAM» (Уральск): React + Vite, статическая сборка с пререндером. Хостинг: Vercel.

## Структура
```
packages/web/
  index.html            HTML-шаблон (блок <!--seo--> заменяется пререндером)
  prerender.ts          Пререндер всех маршрутов + sitemap.xml
  vercel.json           Настройки Vercel
  public/               Статика: картинки, robots.txt, llms.txt
  src/web/
    app.tsx             Маршруты
    pages/              Страницы
    components/         Компоненты (layout.tsx — шапка, подвал, SEO, форма заявки)
    lib/data.ts         Контент: услуги, статьи блога, команда, контакты
    lib/jsonld.ts       Разметка Schema.org
```

## Сборка
```sh
cd packages/web
bun install
bun run build     # → dist/
```

## Публикация
Изменения попадают в `main` только через Pull Request. После слияния Vercel публикует сайт автоматически.

## Формы
- Заявка (`ContactForm` в `layout.tsx`) → EspoCRM Lead Capture (ключ только на запись).
- Анкета вакансии (`pages/vacancy.tsx`) → Web3Forms → почта.

Обе формы защищены скрытым полем-ловушкой и проверкой времени заполнения.
