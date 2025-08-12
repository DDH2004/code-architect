# Code Architect (MVP)

Interactive 3D visualization of a GitHub repository’s source files. Each file becomes a "building" whose height reflects lines of code and color reflects a simple complexity heuristic. Lines between buildings approximate import relationships.

## Features
- Fetch & analyze public GitHub repos (optionally authenticated for higher rate limits)
- Supports basic text languages: js, jsx, ts, tsx, py, java, go, rs, c, cpp, md, json
- Heuristic metrics: LOC, naive complexity (branching keyword count)
- Import edge extraction (ESM, CommonJS, basic Python)
- 3D scene (Three.js via @react-three/fiber + OrbitControls)
- Click a building to inspect details + snippet

## Tech Stack
- React + Vite
- three / @react-three/fiber / @react-three/drei
- Axios (GitHub REST + raw content)
- Plain heuristic parsing (no heavy AST)

## Quick Start
```bash
git clone <this-repo-url>
cd code-architect
npm install
npm run dev
```

## Usage
1. Enter a GitHub repository URL (e.g. https://github.com/facebook/react).
2. (Optional) Paste a Personal Access Token (classic, repo scope not required for public repos) to avoid low unauthenticated rate limits.
3. Click Analyze.
4. Orbit / zoom (mouse drag + wheel).
5. Click a building to view metrics and a code snippet.
6. Reset to clear state.

## GitHub API Rate Limits
- Unauthenticated: 60 requests/hour (shared per IP).
- Authenticated: 5000 requests/hour.
If analysis stalls or errors, supply a token.

## Folder Structure
```
src/
  api/
    github.js
  analysis/
    analyze.js
  components/
    Building.jsx
    LinkLine.jsx
    ThreeScene.jsx
  App.jsx
  main.jsx
  styles.css
```

## Analysis Details
- LOC: Non-empty line count.
- Complexity: Count of branching / logical tokens (if, for, while, case, switch, catch, else if, elif, &&, ||) + 1; capped at 100.
- Imports: Regex-based; may miss dynamic/advanced patterns; minimal Python support.
- Edge Resolution: Heuristic substring matching; may yield false positives/negatives.

## Limitations (MVP)
- All client-side; no caching.
- Regex parsing (not AST).
- First 200 eligible files only.
- Naive import resolution (no tsconfig paths, package exports, index resolution).
- No security/license analysis.

## Potential Improvements
- AST parsing (Babel / SWC / tree-sitter).
- Commit history & churn overlays.
- Search, filtering, legends, directory grouping.
- Directory clustering / force-directed layout.
- Caching + persistence backend.
- TypeScript & tests.
- WebGL perf (instancing, LOD).

## Scripts
```bash
npm run dev
npm run build
npm run preview
```

## Security / Privacy
- Tokens only used for direct GitHub API calls in-browser.
- No server storage.

## License

## Disclaimer
Prototype; metrics are heuristic and not definitive quality indicators.

---
PRs welcome. Enjoy exploring codebases in 3D with Code Architect.
