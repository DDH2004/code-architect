export function analyzeFiles(files) {
  if (!Array.isArray(files)) return [];
  return files
    .filter(f => f && typeof f.path === 'string')
    .map(f => {
      const raw = f.content;
      const src = typeof raw === 'string'
        ? raw
        : raw == null
          ? ''
          : (() => { try { return JSON.stringify(raw, null, 2); } catch { return String(raw); } })();
      const lines = src.split('\n');
      const loc = lines.filter(l => l.trim().length > 0).length;
      const complexity = estimateComplexity(src);
      const imports = extractImports(src, f.path);
      return { path: f.path, loc, complexity, imports, content: src };
    });
}

function estimateComplexity(src) {
  if (!src) return 0;
  const keys = ['if(', 'if ', 'for(', 'for ', 'while(', 'case ', 'switch(', 'catch(', 'else if', 'elif ', '&&', '||'];
  let count = 1;
  keys.forEach(k => { count += src.split(k).length - 1; });
  return Math.min(100, count);
}

function extractImports(src, path) {
  const imports = new Set();
  const jsImport = /import\s+(?:.+?)from\s+["'](.+?)["']/g;
  const requireRe = /require\(["'](.+?)["']\)/g;
  const pyImport = /from\s+([\w\.]+)\s+import|import\s+([\w\.]+)/g;
  let m;
  while ((m = jsImport.exec(src)) !== null) imports.add(normalize(m[1], path));
  while ((m = requireRe.exec(src)) !== null) imports.add(normalize(m[1], path));
  while ((m = pyImport.exec(src)) !== null) {
    const candidate = (m[1] || m[2]) || '';
    imports.add(normalize(candidate, path));
  }
  return Array.from(imports).filter(Boolean);
}

function normalize(raw, path) {
  if (!raw) return '';
  if (raw.startsWith('.') || raw.includes('/')) {
    const base = path.split('/').slice(0, -1).join('/');
    return (base ? base + '/' : '') + raw.replace(/\.\//g, '').replace(/\.(js|jsx|py|ts|tsx)$/, '');
  }
  return '';
}