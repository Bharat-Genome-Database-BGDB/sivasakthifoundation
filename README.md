# Sivasakthi Science Foundation — Master Website Template
> Base Identifier: `bgdb-website-template`

## 🎯 Project Overview
This repository functions as the high-fidelity, centralized boilerplate designed under the **"More Work Now, Less Maintenance Later"** methodology. It serves as a uniform framework to deploy and scale independent public and gated web domains sharing a single unified data ecosystem:

1. **Sivasakthi Science Foundation (SSF):** Fully public domain presence focusing on strategic scientific narrative, publications, and internship fellowships.
2. **Bharat Genome Database (BGDB):** Subscriptions-gated vertical implementing secure query systems and genome browser interfaces.
3. **AarogyaSakthi:** Subscriptions-gated partner portal managing industry-specific translational multi-omics pilots.

---

## 🧱 Key Architectural Pillars

### 1. Shift-Left Quality Gate (Vitest + JSDOM)
Following the Product Owner in Test (POT) core principles, testing is integrated directly into the system's readiness workflow. 
* Local builds and automated remote pipelines utilize **Vitest** inside a simulated browser environment.
* Global mock setups isolate backend configurations (`supabase-mocks.jsx`), allowing feature parsing and component checking without live network overhead.

### 2. Multi-Tenant Shared Database Configuration
* Powered by a unified cloud client layer leveraging `@supabase/supabase-js`.
* Pre-wired with Row-Level Security (RLS) hooks and Role-Based Access Control (RBAC) checkpoints (`user`, `member`, `leader`, `admin`, `superadmin`).
* Domain customization is achieved post-cloning by toggling localized authorization visibility blocks rather than introducing confusing conditional framework logic.

### 3. Absolute Path Aliasing
To prevent broken reference errors and eliminate directory fragmentation, standard absolute shortcuts are explicitly synchronized between the Vite testing engine (`vite.config.js`) and the Next.js routing processor (`jsconfig.json`):
* `@/*` ➜ `src/*`
* `@components` ➜ `src/components`
* `@layout` ➜ `src/components/Layout`
* `@styles` ➜ `src/styles`
* `@db` ➜ `src/services`
* `@unit` ➜ `src/unitHelper`

### 4. Centralized Styling Over utility-First Bloat
Visual layout consistency is strictly enforced through standard vanilla CSS and centralized custom style declarations (`src/styles/variables.scss`), anchoring deep academic plum (`#2e1065`), dark purple backgrounds (`#1a0530`), lilac accents, and elegant Cormorant Garamond typography.

---

## 📁 Workspace Layout Blueprint

```text
bgdb-website-template/
├── public/                 # Static asset definitions (Logo.png, icons)
├── src/
│   ├── app/                # Next.js App Routing Layer (Server-Side Rendering Hub)
│   │   ├── about/          # Nested content sub-slugs (/about/ourstory, /about/trustees)
│   │   ├── faq/            # Interactive Accordion Page route
│   │   ├── layout.jsx      # Mandatory Next.js layout container shell
│   │   └── page.jsx        # Root Homepage entry view (localhost:3000)
│   ├── components/
│   │   └── Layout/         # Core Persistent UI Layout Wrappers
│   │       ├── Footer.jsx  # Persistent localized footer container
│   │       ├── Header.jsx  # Dynamic dynamic tier dropdown double-header component
│   │       ├── Layout.jsx  # Page structure layout engine wrapper
│   │       └── SEO.jsx     # Next.js Metadata semantic processor
│   ├── services/           # Decoupled backend APIs (@db client initialization instance)
│   ├── styles/             # Global centralized SCSS styles mappings & colors
│   └── unitHelper/         # Shift-Left Testing Gate (setupTests.js, verification files)
├── jsconfig.json           # Next.js Application Route Map shortcuts mapping
├── package.json            # Framework dependencies control
└── vite.config.js          # Vitest execution mapping hub