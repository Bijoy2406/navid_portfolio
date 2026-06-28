# Graph Report - tyrone-brooks-portfolio (1)  (2026-06-28)

## Corpus Check
- 32 files · ~176,489 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 217 edges · 23 communities (16 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2acc6c2a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `PortfolioClient` - 12 edges
3. `SiteContent` - 11 edges
4. `MEMANTO Memory Skill` - 10 edges
5. `scripts` - 6 edges
6. `resolveImage()` - 5 edges
7. `Patterns` - 5 edges
8. `MEMANTO - Your Active Memory Companion` - 5 edges
9. `Navid's Portfolio` - 5 edges
10. `MagicBentoGrid()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PortfolioClient()` --calls--> `resolveImage()`  [EXTRACTED]
  app/portfolio/PortfolioClient.tsx → lib/resolve-image.ts
- `BentoCard()` --calls--> `resolveImage()`  [EXTRACTED]
  components/MagicBento.tsx → lib/resolve-image.ts
- `PortfolioClient` ----> `SiteContent`  [EXTRACTED]
  app/portfolio/PortfolioClient.tsx → lib/content.ts
- `RootLayout` ----> `nextConfig`  [INFERRED]
  app/layout.tsx → next.config.ts
- `PortfolioClient` ----> `BlurReveal`  [EXTRACTED]
  app/portfolio/PortfolioClient.tsx → components/BlurReveal.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **blur_reveal_animation_system** — components/BlurReveal.tsx:BlurReveal, app/portfolio/PortfolioClient.tsx:BlurRevealName, motion [INFERRED]
- **bento_grid_interaction_system** — components/MagicBento.tsx:MagicBentoGrid, components/MagicBento.tsx:BentoCard, components/MagicBento.tsx:ParticleCard, components/MagicBento.tsx:GlobalSpotlight, components/MagicBento.tsx:HoverCursor, gsap [INFERRED]
- **responsive_portfolio_layout** — app/portfolio/PortfolioClient.tsx:PortfolioClient, components/MagicBento.tsx:MagicBentoGrid, BREAKPOINTS.md:responsive_strategy [INFERRED]
- **content_loading_pipeline** — app/page.tsx:Page, lib/content.ts:loadContent, lib/content.ts:loadYaml, lib/content.ts:SiteContent [INFERRED]
- **hero_section_animation** — app/portfolio/PortfolioClient.tsx:PortfolioClient, app/portfolio/PortfolioClient.tsx:BlurRevealName, app/portfolio/PortfolioClient.tsx:RotatingText, app/portfolio/PortfolioClient.tsx:DownloadCVButton, app/portfolio/PortfolioClient.tsx:AuroraGlow [INFERRED]
- **scroll_state_management** — app/portfolio/PortfolioClient.tsx:PortfolioClient, app/portfolio/PortfolioClient.tsx:getActiveSection [INFERRED]
- **loading_screen_cinema_aesthetic** — components/LoadingScreen.tsx:CinemaLoadingScreen, components/LoadingScreen.tsx:NetworkDecoration [INFERRED]
- **header_navigation_system** — app/portfolio/PortfolioClient.tsx:PortfolioClient, components/PulsingDot.tsx:PulsingDot [INFERRED]

## Communities (23 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (10): BentoCard(), BentoCardProps, BentoProject, MagicBentoGrid(), MagicBentoGridProps, ParticleCardProps, SpotlightProps, useMobile() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (21): RootLayout, Page, AuroraGlow, BlurRevealName, DownloadCVButton, LanguagesSection, PortfolioClient, RotatingText (+13 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (19): Page(), Achievements, Certificate, Education, EducationEntry, Experience, Hero, Job (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (18): dependencies, agentation, autoprefixer, class-variance-authority, clsx, @google/genai, gsap, @gsap/react (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (14): devDependencies, eslint, eslint-config-next, firebase-tools, shadcn, tailwindcss, @tailwindcss/postcss, @tailwindcss/typography (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, clean, dev, lint, start (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (3): LoadingScreenProps, RINGS, WORDS

### Community 8 - "Community 8"
Cohesion: 0.60
Nodes (3): CursorFollow(), CursorFollowProps, useCursorPosition()

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (5): BlurReveal(), BlurRevealProps, resolveImage(), PortfolioClient(), ROTATING_ROLES

### Community 20 - "Community 20"
Cohesion: 0.13
Nodes (14): After Important Work, Choosing Between recall and answer, Command Reference, Confidence Levels, MEMANTO Memory Skill, Memory Types: Decision Matrix, Patterns, Pitfalls to Avoid (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): Command Reference, graphify, MEMANTO - Your Active Memory Companion, Memory Operations — Use the Right One, NON-NEGOTIABLE RULES, When to Call `remember` (Examples — Run Immediately)

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (5): Customising content, Getting started, Navid's Portfolio, Project structure, Stack

## Knowledge Gaps
- **111 isolated node(s):** `extends`, `albertSans`, `metadata`, `ROTATING_ROLES`, `BlurRevealProps` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SiteContent` connect `Community 3` to `Community 1`, `Community 19`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `PortfolioClient` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 4` to `Community 6`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `extends`, `albertSans`, `metadata` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1286549707602339 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._