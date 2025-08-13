# DEVELOPMENT.md

Quick-start guide for **BaliBlissed**.

---

## 1. Prerequisites

Node.js ≥ 14  
[https://nodejs.org](https://nodejs.org)

---

## 2. One-Time Setup

```bash
git clone https://github.com/your-org/BaliBlissed.git
cd BaliBlissed
npm install
```

---

## 3. Commands

| Task  | Command         | Purpose                           |
| ----- | --------------- | --------------------------------- |
| dev   | `npm run dev`   | Build + BrowserSync + live reload |
| build | `npm run build` | Production build (`dist/`)        |
| clean | `npm run clean` | Delete `dist/`                    |
| watch | `npm run watch` | WATCH-ONLY (no build)             |

---

## 4. Local Dev

```bash
npm run dev
```

```text
or
```

```bash
gulp dev
```

Serves at (<http://localhost:3000>)
Auto-reload on every save.

---

## 5. Asset Flow

| Source          | Destination | What Happens                          |
| --------------- | ----------- | ------------------------------------- |
| `src/**/*.html` | `dist/`     | minified; links rewritten to `.min.*` |
| `src/**/*.css`  | `dist/`     | minified → `.min.css`                 |
| `src/**/*.js`   | `dist/`     | minified → `.min.js`                  |
| everything else | `dist/`     | byte-for-byte copy                    |

---

## 6. Tips

Keep original paths (style.css, main.js) in src/; build rewrites them.
Dot-files (.htaccess) are copied automatically.

---

## 7. Troubleshooting

| Problem                   | Fix                                                      |
| ------------------------- | -------------------------------------------------------- |
| `gulp: command not found` | `npm install -g gulp-cli` or use `npx gulp …`            |
| Images bigger after copy  | The copy task is binary-safe; clear browser cache first. |
| `.htaccess` not copied    | Ensure file exists in `src/`; task uses `dot: true`.     |

## 8. Project Strucure

BaliBlissed/
├── .git/
├── AGENT.md
├── DEPLOYMENT.md
├── DEVELOPMENT.md
├── gulpfile.js
├── MAINTENANCE.md
├── package-lock.json
├── package.json
├── dist/ # (empty directory, for project build)
├── src/
│ ├── .htaccess
│ ├── 404.html
│ ├── css/
│ │ └── style.css
│ ├── destinations/
│ │ └── activities/
│ │ ├── Ayung*River_Rafting_In_Bali_With_Activities_And_Sightseeing_Tour/
│ │ ├── Bali_Atv_Ride_In_Ubud/
│ │ ├── ... (many more destination folders)
│ ├── icons/
│ │ ├── Favicons*(Arrow)/
│ │ ├── Favicons*(Facebook)/
│ │ ├── Favicons*(Instagram)/
│ │ ├── Favicons*(WhatsApp)/
│ │ └── Favicons*(logo)/
│ ├── images/
│ │ ├── destinations/
│ │ ├── hero/
│ │ └── testimonials/
│ ├── includes/
│ │ ├── footer.html
│ │ └── header.html
│ ├── index.html
│ ├── js/
│ │ ├── destinationImages.json
│ │ ├── main.js
│ │ └── mapUrls.json
│ ├── pages/
│ │ ├── about.html
│ │ ├── faq.html
│ │ ├── privacy-policy.html
│ │ └── terms-of-service.html
│ ├── robots.txt
│ ├── services/
│ │ └── private_car_charter/
│ │ └── index.html
│ └── sitemap.xml
└── ... (node_modules and other config folders)
